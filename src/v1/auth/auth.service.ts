import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { USER_ROLE, JwtPayload } from '../../common/guards/jwt-auth.guard';
import { LoginDto, CreateUserDto, AuthResponseDto } from '../../common/dto/auth.dto';
import { UserRepository } from '../../database/repositories/user.repository';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;
    
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      company_id: user.company_id,
      branch_ids: user.branch_ids,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        company_id: user.company_id,
        branch_ids: user.branch_ids,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const { username, password, role, company_id, branch_ids } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userRepository.createUser({
      username,
      password: hashedPassword,
      role,
      company_id,
      branch_ids,
    });

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      company_id: user.company_id,
      branch_ids: user.branch_ids,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        company_id: user.company_id,
        branch_ids: user.branch_ids,
      },
    };
  }

  async validateUser(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}