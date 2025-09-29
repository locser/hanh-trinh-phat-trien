import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export const AppDataSource = new DataSource({
	type: 'mariadb',
	host: process.env.CONFIG_MYSQL_HOST,
	port: parseInt(process.env.CONFIG_MYSQL_PORT as string),
	username: process.env.CONFIG_MYSQL_USERNAME,
	password: process.env.CONFIG_MYSQL_PASSWORD,
	database: process.env.CONFIG_MYSQL_DB_NAME,
	entities: ['src/database/entities/*.entity.ts'],
	migrations: ['src/database/migrations/*.ts'],
	migrationsTableName: 'migrations',
	synchronize: false,
	logging: true,
	timezone: '+07:00',
	dateStrings: true,
	multipleStatements: true,
});
