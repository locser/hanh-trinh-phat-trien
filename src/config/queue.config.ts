import { BullModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: {
        host: process.env.CONFIG_REDIS_HOST,
        port: +process.env.CONFIG_REDIS_PORT,
        password: process.env.CONFIG_REDIS_PASSWORD,
        db: +process.env.CONFIG_REDIS_DB,
      },
      defaultJobOptions: {
        attempts: Number.MAX_SAFE_INTEGER,
        backoff: 60000,
        removeOnComplete: true,
        removeOnFail: true,
      },
    };
  }
}
