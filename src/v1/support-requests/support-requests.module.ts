import { Module } from '@nestjs/common';
import { SupportRequestRepository } from '../../database/repositories/support-request.repository';
import { SupportRequestsController } from './support-requests.controller';
import { SupportRequestsService } from './support-requests.service';

@Module({
	imports: [],
	controllers: [SupportRequestsController],
	providers: [SupportRequestsService, SupportRequestRepository],
})
export class SupportRequestsModule {}
