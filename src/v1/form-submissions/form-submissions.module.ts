import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormSubmissionEntity } from '../../database/entities/form-submission.entity';
import { TimelineEntity } from '../../database/entities/timeline.entity';
import { IpDetectionMiddleware } from '../../common/middleware/ip-detection.middleware';
import { UserIdentificationMiddleware } from '../../common/middleware/user-identification.middleware';
import { FormSubmissionsController } from './form-submissions.controller';
import { FormSubmissionsService } from './form-submissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormSubmissionEntity, TimelineEntity]),
  ],
  controllers: [FormSubmissionsController],
  providers: [FormSubmissionsService],
  exports: [FormSubmissionsService],
})
export class FormSubmissionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpDetectionMiddleware, UserIdentificationMiddleware)
      .forRoutes(
        { path: 'form-submissions/submit', method: RequestMethod.POST },
      );
  }
}