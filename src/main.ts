// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { webcrypto } from 'crypto';
import { json, raw, urlencoded } from 'express';
import * as fs from 'fs';
import * as moment from 'moment-timezone';
import { AppModule } from './app.module';
import { grpcServerOptions } from './grpc/server/grpc-server.options';

export const TIME_ZONE = 'Asia/Ho_Chi_Minh';
process.env.TZ = TIME_ZONE;
moment.tz.setDefault(TIME_ZONE);

const envConfig = dotenv.parse(fs.readFileSync('.env'));
const envs = ['beta', 'staging'];
if (envs.includes(process.env.CONFIG_ENV_MODE)) {
	for (const key in envConfig) {
		const value = envConfig[key];
		console.log(`${key}=${value}`);
	}
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		rawBody: true,
	});

	if (!globalThis.crypto) {
		globalThis.crypto = webcrypto as Crypto;
	}

	// ===== LƯU RAW BODY =====
	// app.use(
	// 	raw({ type: '*/*', limit: '5mb' }), // bắt tất cả content-types
	// 	(req, res, next) => {
	// 		// lưu raw body vào request
	// 		req['rawBody'] = req.body;
	// 		next();
	// 	}
	// );

	// ===== TĂNG BODY LIMIT =====
	// Tăng limit lên 5MB cho JSON requests
	app.use(json({ limit: '5mb' }));

	// // Tăng limit cho URL-encoded requests
	app.use(urlencoded({ limit: '5mb', extended: true }));

	const PREFIX = 'api';
	const SERVICE_NAME = process.env.npm_package_name.toUpperCase();

	app.enableCors({
		origin: '*',
	});
	app.setGlobalPrefix(PREFIX);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			stopAtFirstError: true,
		}),
	);

	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle(`${SERVICE_NAME} Service ${process.env.CONFIG_BUILD_TIME}`)
		.setDescription(`The ${SERVICE_NAME} Service API description`)
		.setVersion(process.env.CONFIG_BUILD_NUMBER)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(PREFIX, app, document, {
		customSiteTitle: `${SERVICE_NAME} Service`,
		customCss: '.swagger-ui .topbar { display: none }',
		swaggerOptions: {
			persistAuthorization: true,
			showRequestDuration: true,
			clientId: 'client_id',
		},
	});

	app.connectMicroservice<MicroserviceOptions>(grpcServerOptions);
	await app.startAllMicroservices();

	await app.listen(process.env.SERVICE_PORT);
	console.log(`Application is running on: ${await app.getUrl()}/${PREFIX}`);
}
bootstrap();
