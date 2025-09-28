import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Request } from 'express';
import { join } from 'path';
import { firstValueFrom, Observable } from 'rxjs';

export enum PRIVILEGE_CODE {

  SALES_BASIC = "SALES_BASIC", // Quản lý Bán Hàng (cơ bản)
  SALES_ADVANCED = "SALES_ADVANCED", // Quản lý Bán Hàng (nâng cao)

  CRM_BASIC = "CRM_BASIC", // Quản lý CRM (cơ bản)
  CRM_ADVANCED = "CRM_ADVANCED", // Quản lý CRM (nâng cao)

  FINANCE_ACCOUNTING_BASIC = "FINANCE_ACCOUNTING_BASIC", // Quản lý tài chính kế toán(FM) (cơ bản)
  FINANCE_ACCOUNTING_ADVANCED = "FINANCE_ACCOUNTING_ADVANCED", // Quản lý tài chính kế toán(FM) (nâng cao)

  AFFILIATE_MARKETING_BASIC = "AFFILIATE_MARKETING_BASIC", // Quản lý AFF Marketing (cơ bản)
  AFFILIATE_MARKETING_ADVANCED = "AFFILIATE_MARKETING_ADVANCED", // Quản lý AFF Marketing (nâng cao)

  AUTO_MARKETING_BASIC = "AUTO_MARKETING_BASIC", // Quản lý Auto Marketing (cơ bản)
  AUTO_MARKETING_ADVANCED = "AUTO_MARKETING_ADVANCED", // Quản lý Auto Marketing (nâng cao)

  // PRODUCT_SERVICE_BASIC = "PRODUCT_SERVICE_BASIC", // Quản lý SP/Dịch vụ (cơ bản)
  // PRODUCT_SERVICE_ADVANCED = "PRODUCT_SERVICE_ADVANCED", // Quản lý SP/Dịch vụ (nâng cao)

  INVENTORY_MANAGEMENT_BASIC = "INVENTORY_MANAGEMENT_BASIC", // Quản lý tồn kho (cơ bản)
  INVENTORY_MANAGEMENT_ADVANCED = "INVENTORY_MANAGEMENT_ADVANCED", // Quản lý tồn kho (nâng cao)

  HRM_MANAGEMENT = "HRM_MANAGEMENT", // Quản lý Nhân sự

  SUPPLIER_BASIC_MANAGEMENT = "SUPPLIER_BASIC_MANAGEMENT", // Quản lý Nhà cung ứng (cơ bản)

  OPERATION_MANAGEMENT = "OPERATION_MANAGEMENT", // Quản lý điều hành

  GENERAL_REPORT_MANAGEMENT = "GENERAL_REPORT_MANAGEMENT", // Quản lý báo cáo chung

  PARTNER_MANAGEMENT = "PARTNER_MANAGEMENT", // Quản lý đối tác

  GENERAL_SETTINGS = "GENERAL_SETTINGS", // Quản lý cài đặt chung

  COURSE_MANAGEMENT_BASIC = "COURSE_MANAGEMENT_BASIC", // Quản lý khóa học (cơ bản)
  COURSE_MANAGEMENT_ADVANCED = "COURSE_MANAGEMENT_ADVANCED", // Quản lý khóa học (nâng cao)

  // OTHER
  ADMIN = "ADMIN", // FULL
  AFF_CUSTOMER = "AFF_CUSTOMER", // Khách hàng AFF
  API_PUBLIC = "API_PUBLIC", // API Public
}

export enum AUTH_SOURCE_TYPE {
  HITA_DIAMOND_MOBILE = 13061,
  OHQ = 2,
}

interface AuthenticateTokenRequest {
  access_token: string;
}

interface AuthenticateTokenResponse {
  status: number;
  message: string;
  data: TokenData;
}

export interface TokenData {
  identifier_name: string;
  company_id: number;
  branch_ids: number[];
  user_id: number;
  user_name: string;
  phone: string;
  privilege_group_id: number;
  privilege_codes: string[];
  source_type: number;
}

export interface AuthServiceClient {
  authenticateToken(request: AuthenticateTokenRequest): Observable<AuthenticateTokenResponse>;
  authenticateCustomerToken(request: AuthenticateTokenRequest): Observable<AuthenticateTokenResponse>;
  authenticateStudentToken(request: AuthenticateTokenRequest): Observable<AuthenticateTokenResponse>;
}

const retryOptions = {
  max_retries: 3, // Set the maximum number of retries
  initial_backoff_ms: 1000, // Initial backoff time in milliseconds
  max_backoff_ms: 5000, // Maximum backoff time in milliseconds
  backoff_multiplier: 1.5, // Backoff multiplier
  retryable_status_codes: [14], // Status codes to retry
};


@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private client: ClientGrpc;
  private authServiceClient: AuthServiceClient;
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'vn.techres.microservice.grpc.nodejs_ttl_auth',
        protoPath: join(__dirname, './mhs-auth.proto'),
        url: `${process.env.CONFIG_GRPC_NODEJS_TTL_USER_HOST}:${process.env.CONFIG_GRPC_NODEJS_TTL_USER_PORT}`,
        loader: {
          longs: String,
          keepCase: true,
          defaults: true,
        },
        channelOptions: {
          'grpc.default_deadline_ms': 2000,
          'grpc.initial_reconnect_backoff_ms': 2000,
          'grpc.service_config': JSON.stringify({
            methodConfig: [
              {
                name: [],
                timeout: { seconds: 10, nanos: 0 },
                retryPolicy: {
                  maxAttempts: 5,
                  initialBackoff: '0.1s',
                  maxBackoff: '30s',
                  backoffMultiplier: 3,
                  retryableStatusCodes: ['UNAVAILABLE'],
                },
              },
            ],
          }),
          grpcOptions: {
            "grpc.http2.max_frame_size": 1024 * 1024 * 10, // Set the maximum frame size if needed
          },
        },
        keepalive: {
          keepaliveTimeMs: 60000,
          keepaliveTimeoutMs: 20000,
          keepalivePermitWithoutCalls: 1,
          ...(retryOptions && { retry: retryOptions }),
        },
      },
    });
  }

  onModuleInit() {
    this.authServiceClient = this.client.getService<AuthServiceClient>('AuthService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const requiredPrivileges = this.reflector.getAllAndOverride<PRIVILEGE_CODE[]>(PRIVILEGES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const sourceType = request.headers["sourcetype"] ? +request.headers["sourcetype"] : 0;

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new HttpException('Token không tồn tại', HttpStatus.UNAUTHORIZED);

    const { status, message, data } = (sourceType == AUTH_SOURCE_TYPE.HITA_DIAMOND_MOBILE) ?
      await firstValueFrom(this.authServiceClient.authenticateStudentToken({ access_token: token }))
      : await firstValueFrom(this.authServiceClient.authenticateToken({ access_token: token }));

    this.logger.debug("[DEBUG][AUTH][canActivate][handleValidateToken]",
      `req_url: ${request.path}`,
      JSON.stringify({ ...data, privilege_codes: []  }),
      `RawBody: ${JSON.stringify(request.body)}`
    );

    if (status != HttpStatus.OK) throw new HttpException(message, status);

    this.checkPrivileges(requiredPrivileges, data.privilege_codes);

    request['user'] = data;

    return true;
  }



  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private checkPrivileges(requiredPrivileges: PRIVILEGE_CODE[], userPrivileges: string[]) {
    if (!requiredPrivileges) return;
    requiredPrivileges.push(PRIVILEGE_CODE.ADMIN);

    const isPermission = requiredPrivileges.some((requiredPrivilege) => userPrivileges.includes(requiredPrivilege));
    if (!isPermission) throw new HttpException('Bạn không có quyền truy cập', HttpStatus.FORBIDDEN);
  }

}

export const GetHeaders = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return  request.headers;
});

export const GetUserFromToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: TokenData = request['user'];
  return user;
});


const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const PRIVILEGES_KEY = 'privileges';
export const Privileges = (...privileges: PRIVILEGE_CODE[]) => SetMetadata(PRIVILEGES_KEY, privileges);
