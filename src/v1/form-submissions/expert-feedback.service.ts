import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpertFeedbackEntity } from '../../database/entities/expert-feedback.entity';

@Injectable()
export class ExpertFeedbackService {
	constructor(
		@InjectRepository(ExpertFeedbackEntity)
		private readonly expertFeedbackRepo: Repository<ExpertFeedbackEntity>,
	) {}

	async listPublicBySubmissionId(formSubmissionId: number): Promise<ExpertFeedbackEntity[]> {
		return await this.expertFeedbackRepo.find({
			where: { form_submission_id: formSubmissionId, is_public: true },
			order: { created_at: 'ASC' },
		});
	}

	async createFeedback(formSubmissionId: number, expertId: number, content: string): Promise<ExpertFeedbackEntity> {
		const entity = this.expertFeedbackRepo.create({
			form_submission_id: formSubmissionId,
			expert_id: expertId,
			content,
			is_public: true,
		});
		return this.expertFeedbackRepo.save(entity);
	}

	async listAllBySubmissionId(formSubmissionId: number): Promise<ExpertFeedbackEntity[]> {
		return await this.expertFeedbackRepo.find({
			where: { form_submission_id: formSubmissionId },
			order: { created_at: 'ASC' },
		});
	}
}
