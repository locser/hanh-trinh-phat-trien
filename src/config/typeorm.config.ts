import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'mariadb',
			host: process.env.CONFIG_MYSQL_HOST,
			port: parseInt(process.env.CONFIG_MYSQL_PORT),
			username: process.env.CONFIG_MYSQL_USERNAME,
			password: process.env.CONFIG_MYSQL_PASSWORD,
			database: process.env.CONFIG_MYSQL_DB_NAME,
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
