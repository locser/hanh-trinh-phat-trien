import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService, // Use the service to dynamically provide options
    }),
  ],
  providers: [JwtConfigService],
  exports: [JwtModule],
})
export class JwtConfigModule {}
