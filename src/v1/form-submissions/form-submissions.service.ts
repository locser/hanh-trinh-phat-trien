import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { FormSubmissionEntity } from '../../database/entities/form-submission.entity';
import { RateLimiterUtil } from '../../utils/rate-limiter.util';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { FormSubmissionCreateResponse } from './responses/form-submission.response';

@Injectable()
export class FormSubmissionsService {
	constructor(
		@InjectRepository(FormSubmissionEntity)
		private readonly formSubmissionRepository: Repository<FormSubmissionEntity>,
	) {}

	async createSubmission(
		createFormSubmissionDto: CreateFormSubmissionDto,
		clientIp: string,
		userSession: string,
		userAgent: string,
	): Promise<FormSubmissionCreateResponse> {
		// Check rate limiting
		await this.checkRateLimit(clientIp);

		// Extract basic fields for indexing (theo DTO structure mới của bạn)
		const age = createFormSubmissionDto.personal_info.age;
		const occupation = createFormSubmissionDto.personal_info.occupation;
		const educationLevel = createFormSubmissionDto.personal_info.education_level;

		// Get current daily submission count for this IP
		const dailyCount = await this.getDailySubmissionCount(clientIp);

		// Create form submission entity
		const formSubmission = this.formSubmissionRepository.create({
			ip_address: clientIp,
			user_agent: userAgent,
			data: createFormSubmissionDto,
			age: age,
			occupation: occupation,
			education_level: educationLevel,
			ai_processing_status: 'pending',
			daily_submission_count: dailyCount + 1,
		});

		// Save to database
		const savedSubmission = await this.formSubmissionRepository.save(formSubmission);

		// TODO: Trigger AI timeline generation (will be implemented later)
		// await this.triggerTimelineGeneration(savedSubmission.id);

		return new FormSubmissionCreateResponse(savedSubmission);
	}

	private async checkRateLimit(ip: string): Promise<void> {
		const dailyCount = await this.getDailySubmissionCount(ip);
		const maxSubmissionsPerDay = 200; // As per requirements

		if (dailyCount >= maxSubmissionsPerDay) {
			throw new HttpException(RateLimiterUtil.getRateLimitErrorMessage(maxSubmissionsPerDay), HttpStatus.TOO_MANY_REQUESTS);
		}
	}

	private async getDailySubmissionCount(ip: string): Promise<number> {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const count = await this.formSubmissionRepository.count({
			where: {
				ip_address: ip,
				submitted_at: Between(today, tomorrow),
			},
		});

		return count;
	}

	private getTimeUntilMidnight(): number {
		const now = new Date();
		const midnight = new Date();
		midnight.setHours(24, 0, 0, 0);

		return Math.ceil((midnight.getTime() - now.getTime()) / 1000); // seconds until midnight
	}
}
