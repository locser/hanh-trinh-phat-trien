import { ApiProperty } from '@nestjs/swagger';
import { FormSubmissionEntity } from '../../../database/entities/form-submission.entity';

export class FormSubmissionResponse {
  @ApiProperty({
    type: Number,
    description: 'ID của form submission',
    example: 123,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Địa chỉ IP người submit',
    example: '192.168.1.1',
  })
  ip_address: string;

  @ApiProperty({
    type: Object,
    description: 'Dữ liệu form đã submit',
    example: {
      personalInfo: { fullName: 'Nguyễn Văn A', age: 25 },
      goals: { shortTerm: 'Học TypeScript' }
    },
  })
  data: any;

  @ApiProperty({
    type: Date,
    description: 'Thời gian submit',
    example: '2024-01-01T10:00:00Z',
  })
  submitted_at: Date;

  @ApiProperty({
    type: Number,
    description: 'Tuổi',
    example: 25,
  })
  age: number;

  @ApiProperty({
    type: String,
    description: 'Nghề nghiệp',
    example: 'Software Developer',
  })
  occupation: string;

  @ApiProperty({
    type: String,
    description: 'Trình độ học vấn',
    example: 'Đại học',
  })
  education_level: string;

  @ApiProperty({
    type: String,
    description: 'Trạng thái xử lý AI',
    example: 'completed',
  })
  ai_processing_status: string;

  @ApiProperty({
    type: String,
    description: 'Thông báo thành công',
    example: 'Form submitted successfully',
  })
  message: string;

  constructor(entity: FormSubmissionEntity, message?: string) {
    this.id = entity.id;
    this.ip_address = entity.ip_address;
    this.data = entity.data;
    this.submitted_at = entity.submitted_at;
    this.age = entity.age;
    this.occupation = entity.occupation;
    this.education_level = entity.education_level;
    this.ai_processing_status = entity.ai_processing_status;
    this.message = message || 'Form submitted successfully';
  }
}

export class FormSubmissionCreateResponse {
  @ApiProperty({
    type: Number,
    description: 'ID của form submission đã tạo',
    example: 123,
  })
  form_submission_id: number;

  @ApiProperty({
    type: String,
    description: 'Thông báo thành công',
    example: 'Form submitted successfully. Timeline generation in progress.',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'Trạng thái xử lý',
    example: 'pending',
  })
  processing_status: string;

  @ApiProperty({
    type: Date,
    description: 'Thời gian submit',
    example: '2024-01-01T10:00:00Z',
  })
  submitted_at: Date;

  constructor(entity: FormSubmissionEntity) {
    this.form_submission_id = entity.id;
    this.message = 'Form submitted successfully. Timeline generation in progress.';
    this.processing_status = entity.ai_processing_status;
    this.submitted_at = entity.submitted_at;
  }
}