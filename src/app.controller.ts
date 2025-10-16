import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/guards/jwt-auth.guard';

@ApiTags('PUBLIC')
@Controller()
export class AppController {
	@Public()
	@Get()
	async root() {
		return {
			message: 'API is running',
			version: 'v1',
			endpoints: {
				docs: '/api/docs',
				health: '/api/public/health-check',
				form_submissions: '/api/v1/form-submissions/submit',
				auth: '/api/v1/auth/login, /api/v1/auth/register',
			},
		};
	}

	@Public()
	@Get('public/health-check')
	async healthCheck() {
		return {
			build_number: process.env.CONFIG_BUILD_NUMBER || '',
			build_time: process.env.CONFIG_BUILD_TIME || '',
		};
	}
}
