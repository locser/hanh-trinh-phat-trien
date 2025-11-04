import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpDetectionMiddleware } from '../../common/middleware/ip-detection.middleware';
import { UserIdentificationMiddleware } from '../../common/middleware/user-identification.middleware';
import { ExpertFeedbackEntity } from '../../database/entities/expert-feedback.entity';
import { FormSubmissionEntity } from '../../database/entities/form-submission.entity';
import { TimelineEntity } from '../../database/entities/timeline.entity';
import { ExpertFeedbackService } from './expert-feedback.service';
import { FormSubmissionsController } from './form-submissions.controller';
import { FormSubmissionsService } from './form-submissions.service';

@Module({
	imports: [TypeOrmModule.forFeature([FormSubmissionEntity, TimelineEntity, ExpertFeedbackEntity])],
	controllers: [FormSubmissionsController],
	providers: [FormSubmissionsService, ExpertFeedbackService],
	exports: [FormSubmissionsService, ExpertFeedbackService],
})
export class FormSubmissionsModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(IpDetectionMiddleware, UserIdentificationMiddleware).forRoutes({ path: 'form-submissions/submit', method: RequestMethod.POST });
	}
}
