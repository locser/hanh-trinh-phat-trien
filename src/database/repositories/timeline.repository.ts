import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TimelineEntity } from '../entities/timeline.entity';

@Injectable()
export class TimelineRepository {
  constructor(
    @InjectRepository(TimelineEntity)
    private readonly repository: Repository<TimelineEntity>,
  ) {}

  async create(data: Partial<TimelineEntity>): Promise<TimelineEntity> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findById(id: number): Promise<TimelineEntity | null> {
    return await this.repository.findOne({ 
      where: { id },
      relations: ['formSubmission']
    });
  }

  async findBySubmissionId(submissionId: number): Promise<TimelineEntity[]> {
    return await this.repository.find({ 
      where: { form_submission_id: submissionId },
      order: { generated_at: 'DESC' }
    });
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.repository.increment({ id }, 'view_count', 1);
  }

  async updatePublicStatus(id: number, isPublic: number): Promise<void> {
    await this.repository.update(id, { is_public: isPublic });
  }

  async findPublicTimelines(limit: number = 10): Promise<TimelineEntity[]> {
    return await this.repository.find({
      where: { is_public: 1 },
      order: { view_count: 'DESC', generated_at: 'DESC' },
      take: limit,
    });
  }
}