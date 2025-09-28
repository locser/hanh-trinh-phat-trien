import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuthGuard } from './common/guards/auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtConfigModule } from './config/jwt/jwt-config.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { V1Module } from './v1/v1.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
		}),
		JwtConfigModule,
		V1Module,

		// BullModule.forRootAsync({
		// 	useClass: BullConfigService,
		// }),
		// RedisModule.forRootAsync({ useClass: RedisConfigService }),
		// RedisClientModule,

		// EventEmitterModule.forRoot(), // cấu hình mặc định
		// ScheduleModule.forRoot(), // cấu hình mặc định

		// GrpcServerModule,
		// GrpcClientModule,
		// QueueModule,

		// KafkaModule,
		// SchedulerModule,

		// EventListenerModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
