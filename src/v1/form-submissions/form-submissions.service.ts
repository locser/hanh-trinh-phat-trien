import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';
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
		// Note: New DTO structure doesn't have age, occupation, education_level in personal_info
		// These fields will be set to default values or extracted from other parts if needed
		const age = 0; // Default value since not in new structure
		const occupation = createFormSubmissionDto.work_description || 'N/A'; // Use work description as occupation
		const educationLevel = 'N/A'; // Default value since not in new structure

		// Get current daily submission count for this IP
		const dailyCount = await this.getDailySubmissionCount(clientIp);

		// Generate unique public code
		const publicCode = await this.generateUniquePublicCode();

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
			public_code: publicCode,
		});

		// Save to database
		const savedSubmission = await this.formSubmissionRepository.save(formSubmission);

		// TODO: Trigger AI timeline generation (will be implemented later)
		// await this.triggerTimelineGeneration(savedSubmission.id);

		return new FormSubmissionCreateResponse(savedSubmission);
	}

	async listSubmissions(page = 1, limit = 20): Promise<FormSubmissionEntity[]> {
		const offset = (page - 1) * limit;
		return this.formSubmissionRepository.find({ skip: offset, take: limit, order: { submitted_at: 'DESC' } });
	}

	async listAssignedSubmissions(expertId: number, page = 1, limit = 20): Promise<FormSubmissionEntity[]> {
		const offset = (page - 1) * limit;
		return this.formSubmissionRepository.find({
			where: { assigned_expert_id: expertId },
			skip: offset,
			take: limit,
			order: { submitted_at: 'DESC' },
		});
	}

	async assignSubmission(submissionId: number, expertId: number): Promise<void> {
		await this.formSubmissionRepository.update({ id: submissionId }, { assigned_expert_id: expertId });
	}

	private async generateUniquePublicCode(): Promise<string> {
		const MAX_RETRIES = 5;
		for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
			const code = this.generatePublicCode();
			const exists = await this.formSubmissionRepository.exist({ where: { public_code: code } });
			if (!exists) return code;
		}
		// Fallback with timestamp-based suffix (still uppercase A-Z0-9)
		return this.generatePublicCode();
	}

	private generatePublicCode(): string {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		const bytes = crypto.randomBytes(6);
		let code = '';
		for (let i = 0; i < 6; i++) {
			code += alphabet[bytes[i] % alphabet.length];
		}
		return code;
	}

	async getByPublicCode(code: string): Promise<FormSubmissionEntity | null> {
		const normalized = code.trim().toUpperCase();
		const submission = await this.formSubmissionRepository.findOne({ where: { public_code: normalized } });
		if (!submission) {
			throw new HttpException('Submission not found', HttpStatus.BAD_REQUEST);
		}
		return submission;
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
