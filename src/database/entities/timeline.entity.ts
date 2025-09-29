import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('timelines')
export class TimelineEntity extends BaseEntity {
	@ApiProperty({
		type: Number,
		description: 'ID timeline duy nhất',
		example: 1,
	})
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@ApiProperty({
		type: Number,
		description: 'ID form submission tương ứng',
		example: 123,
	})
	@Column({ type: 'bigint' })
	form_submission_id: number;

	@ApiProperty({
		type: String,
		description: 'Tiêu đề timeline',
		example: 'Your Personal Development Journey',
	})
	@Column({ type: 'varchar', length: 255 })
	title: string;

	@ApiProperty({
		type: String,
		description: 'Mô tả timeline',
		example: 'A comprehensive 24-month development plan',
	})
	@Column({ type: 'text', nullable: true })
	description: string;

	@ApiProperty({
		type: Object,
		description: 'Nội dung timeline dạng JSON',
		example: {
			overview: { totalDuration: '24 months' },
			phases: [{ phase: 1, title: 'Foundation Building' }],
		},
	})
	@Column({ type: 'json' })
	content: any;

	@ApiProperty({
		type: Object,
		description: 'Response thô từ AI API',
		example: { choices: [{ message: { content: '...' } }] },
	})
	@Column({ type: 'json', nullable: true })
	ai_response: any;

	@ApiProperty({
		type: Date,
		description: 'Thời gian tạo timeline',
		example: '2024-01-01T10:30:00Z',
	})
	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	generated_at: Date;

	@ApiProperty({
		type: Number,
		description: 'Timeline có công khai không (0=false, 1=true)',
		example: 0,
	})
	@Column({ type: 'tinyint', default: 0 })
	is_public: number;

	@ApiProperty({
		type: Number,
		description: 'Số lần xem timeline',
		example: 5,
	})
	@Column({ type: 'int', default: 0 })
	view_count: number;

	constructor(init?: Partial<TimelineEntity>) {
		super();
		this.id = +init?.id || 0;
		this.form_submission_id = +init?.form_submission_id || 0;
		this.title = init?.title || '';
		this.description = init?.description || '';
		this.content = init?.content || {};
		this.ai_response = init?.ai_response || {};
		this.generated_at = init?.generated_at || new Date();
		this.is_public = +init?.is_public || 0;
		this.view_count = +init?.view_count || 0;
	}
}
