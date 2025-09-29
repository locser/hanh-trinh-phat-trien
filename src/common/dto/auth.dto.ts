import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { USER_ROLE } from '../guards/jwt-auth.guard';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @IsOptional()
  @IsNumber()
  company_id?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  branch_ids?: number[];
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    username: string;
    role: USER_ROLE;
    company_id?: number;
    branch_ids?: number[];
  };
}