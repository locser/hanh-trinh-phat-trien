import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
	constructor(private readonly dataSource: DataSource) {}

	async createJwtOptions(): Promise<JwtModuleOptions> {
		const secret = process.env.CONFIG_JWT_SECRET; // Fetch the secret from DB
		return {
			secret,
			signOptions: { expiresIn: '30d' },
		};
	}
}
