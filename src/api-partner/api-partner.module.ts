import { Module } from '@nestjs/common';
import { HttpRequestModule } from '../common/api-service/http-request.module';

@Module({
  imports: [HttpRequestModule],
  providers: [],
  exports: []
})
export class ApiPartnerModule {}
