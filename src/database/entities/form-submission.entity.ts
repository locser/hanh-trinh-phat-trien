import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateFormSubmissionDto } from '../../v1/form-submissions/dto/create-form-submission.dto';

@Entity('form_submissions')
export class FormSubmissionEntity extends BaseEntity {
	@ApiProperty({
		type: Number,
		description: 'ID form submission duy nhất',
		example: 1,
	})
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@ApiProperty({
		type: String,
		description: 'Địa chỉ IP của người submit',
		example: '192.168.1.1',
	})
	@Column({ type: 'varchar', length: 45 })
	ip_address: string;

	@ApiProperty({
		type: String,
		description: 'User agent browser',
		example: 'Mozilla/5.0...',
	})
	@Column({ type: 'text', nullable: true })
	user_agent: string;

	@ApiProperty({
		type: Object,
		description: 'Dữ liệu form đầy đủ dạng JSON',
		example: {
			personal_info: { full_name: 'Nguyễn Văn A', phone: '0123456789', email: 'nguyenvana@email.com' },
			work_fields: ['IT', 'Marketing'],
			work_description: 'Phát triển web application',
			years_of_experience: '3 năm',
			skills: [
				{ skill: 'JavaScript', level: 'Trung bình' },
				{ skill: 'React', level: 'Khá' },
				{ skill: 'Node.js', level: 'Giỏi' },
			],
			unemployment_duration: '6 tháng',
			ai_impact: 'Có',
			ai_impact_description: 'AI đã thay thế một số công việc lập trình cơ bản',
			career_goal: 'Trở thành Senior Full-stack Developer',
			timeline: '2 năm',
			needs: ['Học lập trình', 'Phát triển kỹ năng mềm'],
		},
	})
	@Column({ type: 'json' })
	data: CreateFormSubmissionDto;

	@ApiProperty({
		type: Date,
		description: 'Thời gian submit',
		example: '2024-01-01T10:00:00Z',
	})
	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	submitted_at: Date;

	@ApiProperty({
		type: Number,
		description: 'Tuổi (extracted từ form data)',
		example: 25,
	})
	@Column({ type: 'int', default: 0 })
	age: number;

	@ApiProperty({
		type: String,
		description: 'Nghề nghiệp hiện tại',
		example: 'Software Developer',
	})
	@Column({ type: 'varchar', length: 255, nullable: true })
	occupation: string;

	@ApiProperty({
		type: String,
		description: 'Trình độ học vấn',
		example: 'Đại học',
	})
	@Column({ type: 'varchar', length: 255, nullable: true })
	education_level: string;

	@ApiProperty({
		type: String,
		description: 'Trạng thái xử lý AI',
		enum: ['pending', 'processing', 'completed', 'failed'],
		example: 'pending',
	})
	@Column({
		type: 'enum',
		enum: ['pending', 'processing', 'completed', 'failed'],
		default: 'pending',
	})
	ai_processing_status: string;

	@ApiProperty({
		type: String,
		description: 'Lỗi từ AI API (nếu có)',
		example: null,
	})
	@Column({ type: 'text', nullable: true })
	error_message: string;

	@ApiProperty({
		type: Number,
		description: 'Số lần submit trong ngày của IP này',
		example: 1,
	})
	@Column({ type: 'int', default: 1 })
	daily_submission_count: number;

	constructor(init?: Partial<FormSubmissionEntity>) {
		super();
		this.id = +init?.id || 0;
		this.ip_address = init?.ip_address || '';
		this.user_agent = init?.user_agent || '';
		this.data = init?.data || ({} as CreateFormSubmissionDto);
		this.submitted_at = init?.submitted_at || new Date();
		this.age = +init?.age || 0;
		this.occupation = init?.occupation || '';
		this.education_level = init?.education_level || '';
		this.ai_processing_status = init?.ai_processing_status || 'pending';
		this.error_message = init?.error_message || '';
		this.daily_submission_count = +init?.daily_submission_count || 1;
	}
}
