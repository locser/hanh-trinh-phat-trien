import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('expert_feedbacks')
export class ExpertFeedbackEntity {
	@ApiProperty({ type: Number })
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@ApiProperty({ description: 'ID form submission được nhận xét' })
	@Index('idx_feedback_submission')
	@Column({ type: 'bigint' })
	form_submission_id: number;

	@ApiProperty({ description: 'ID chuyên viên nhận xét', example: 7 })
	@Index('idx_feedback_expert')
	@Column({ type: 'int', nullable: true })
	expert_id: number | null;

	@ApiProperty({ description: 'Nội dung nhận xét' })
	@Column({ type: 'text' })
	content: string;

	@ApiProperty({ description: 'Hiển thị công khai', example: true })
	@Column({ type: 'boolean', default: true })
	is_public: boolean;

	@CreateDateColumn()
	created_at: Date;
}
