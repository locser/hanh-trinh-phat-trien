import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthResponseDto, CreateUserDto, LoginDto } from '../../common/dto/auth.dto';
import { Public, Roles, USER_ROLE } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
		return this.authService.login(loginDto);
	}

	@Public()
	@Post('register')
	async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
		return this.authService.register(createUserDto);
	}

	@Post('experts')
	@Roles(USER_ROLE.ADMIN)
	async createExpert(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
		// Force role to EXPERT regardless of input
		return this.authService.register({ ...dto, role: USER_ROLE.EXPERT });
	}
}
