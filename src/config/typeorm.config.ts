import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'mariadb',
			host: process.env.CONFIG_MYSQL_HOST_COURSE,
			port: parseInt(process.env.CONFIG_MYSQL_PORT_COURSE),
			username: process.env.CONFIG_MYSQL_USERNAME_COURSE,
			password: process.env.CONFIG_MYSQL_PASSWORD_COURSE,
			database: process.env.CONFIG_MYSQL_DB_NAME_COURSE,
			entities: [__dirname + '/../**/*.entity{.ts,.js}'],
			timezone: '+07:00',
			dateStrings: true,
			multipleStatements: true,
			// logging: process.env.CONFIG_ENV_MODE?.length > 0 ? false : true,
			synchronize: false,
			extra: {
				connectTimeout: +(process.env.CONFIG_MYSQL_CONNECTION_TIMEOUT_COURSE ?? 30000),
				min: +(process.env.CONFIG_MYSQL_CONNECTION_POOL_MIN_IDLE_COURSE ?? 2), // xử lý bao nhiêu session
				connectionLimit: +(process.env.CONFIG_MYSQL_CONNECTION_POOL_MAX_SIZE_COURSE ?? 10), // giới hạn tối đa
				idleTimeoutMillis: +(process.env.CONFIG_MYSQL_CONNECTION_POOL_IDLE_TIMEOUT_COURSE ?? 600000),
				waitForConnections: true, // Chờ nếu pool đã đạt giới hạn
			},
		};
	}
}
