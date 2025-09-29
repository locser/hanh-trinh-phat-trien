import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/guards/jwt-auth.guard';

@ApiTags('PUBLIC')
@Controller('public')
export class AppController {
  @Public()
  @Get('health-check')
  async healthCheck() {
    return {
      build_number: process.env.CONFIG_BUILD_NUMBER || '',
      build_time: process.env.CONFIG_BUILD_TIME || '',
    };
  }
}
