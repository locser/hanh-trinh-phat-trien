import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { FormSubmissionEntity } from '../entities/form-submission.entity';

@Injectable()
export class FormSubmissionRepository {
	constructor(
		@InjectRepository(FormSubmissionEntity)
		private readonly repository: Repository<FormSubmissionEntity>,
	) {}

	async create(data: Partial<FormSubmissionEntity>): Promise<FormSubmissionEntity> {
		const entity = this.repository.create(data);
		return await this.repository.save(entity);
	}

	async findById(id: number): Promise<FormSubmissionEntity | null> {
		return await this.repository.findOne({ where: { id } });
	}

	async findByIp(ip: string): Promise<FormSubmissionEntity[]> {
		return await this.repository.find({
			where: { ip_address: ip },
			order: { submitted_at: 'DESC' },
		});
	}

	async getDailySubmissionCount(ip: string): Promise<number> {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		return await this.repository.count({
			where: {
				ip_address: ip,
				submitted_at: Between(today, tomorrow),
			},
		});
	}

	async updateProcessingStatus(id: number, status: string, errorMessage?: string): Promise<void> {
		await this.repository.update(id, {
			ai_processing_status: status,
			error_message: errorMessage,
		});
	}

	async findAll(skip: number = 0, take: number = 20): Promise<[FormSubmissionEntity[], number]> {
		return await this.repository.findAndCount({
			skip,
			take,
			order: { submitted_at: 'DESC' },
		});
	}
}
