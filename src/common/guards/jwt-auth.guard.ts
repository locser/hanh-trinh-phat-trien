import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface JwtPayload {
  sub: number; // user id
  username: string;
  role: USER_ROLE;
  company_id?: number;
  branch_ids?: number[];
  iat?: number;
  exp?: number;
}

export interface UserContext {
  id: number;
  username: string;
  role: USER_ROLE;
  company_id?: number;
  branch_ids?: number[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Token không tồn tại');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.CONFIG_JWT_SECRET,
      });

      const user: UserContext = {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
        company_id: payload.company_id,
        branch_ids: payload.branch_ids,
      };

      // Check roles if required
      const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (requiredRoles && !this.hasRequiredRole(user.role, requiredRoles)) {
        throw new UnauthorizedException('Bạn không có quyền truy cập');
      }

      request['user'] = user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token không hợp lệ');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private hasRequiredRole(userRole: USER_ROLE, requiredRoles: USER_ROLE[]): boolean {
    // Admin has access to everything
    if (userRole === USER_ROLE.ADMIN) {
      return true;
    }
    
    return requiredRoles.includes(userRole);
  }
}

// Decorators
import { SetMetadata, createParamDecorator } from '@nestjs/common';

const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const ROLES_KEY = 'roles';
export const Roles = (...roles: USER_ROLE[]) => SetMetadata(ROLES_KEY, roles);

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserContext => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const GetHeaders = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers;
});