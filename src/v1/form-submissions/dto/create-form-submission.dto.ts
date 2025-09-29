import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

// Personal Info sub-DTO
class PersonalInfoDto {
	@ApiProperty({
		description: 'Họ tên đầy đủ',
		example: 'Nguyễn Văn A',
		required: false,
	})
	@IsOptional()
	@IsString()
	full_name?: string;

	@ApiProperty({
		description: 'Tuổi',
		example: 25,
	})
	@IsNumber()
	age: number;

	@ApiProperty({
		description: 'Nghề nghiệp hiện tại',
		example: 'Software Developer',
	})
	@IsString()
	@IsNotEmpty()
	occupation: string;

	@ApiProperty({
		description: 'Trình độ học vấn',
		example: 'Đại học',
	})
	@IsString()
	@IsNotEmpty()
	education_level: string;

	@ApiProperty({
		description: 'Số năm kinh nghiệm làm việc',
		example: 3,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	work_experience?: number;
}

// Current Situation sub-DTO
class CurrentSituationDto {
	@ApiProperty({
		description: 'Các kỹ năng hiện tại',
		example: ['Giao tiếp', 'Làm việc nhóm', 'Lãnh đạo', 'Quản lý thời gian'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	current_soft_skills: string[];

	// kiến thức hiện tại của bạn Mới bắt đầu -> Chuyên gia (1-10)
	@ApiProperty({
		description: 'Kiến thức hiện tại của bạn Mới bắt đầu -> Chuyên gia (1-10)',
		example: 7,
		minimum: 1,
		maximum: 10,
	})
	@IsNumber()
	@Min(1)
	@Max(10)
	knowledge_level: number;

	// kinh nghiệm thực tế
	@ApiProperty({
		description: 'Mô tả kinh nghiệm thực tế',
		example: 'Kinh nghiệm thực tế: 2 năm phát triển web vị trí backend developer',
	})
	@IsString()
	experience_level: string;
}

// Goals sub-DTO
class GoalsDto {
	@ApiProperty({
		description: 'Các lĩnh vực ưu tiên',
		example: ['technical-skills', 'leadership', 'business'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	priority_areas: string[];

	@ApiProperty({
		description: 'Mục tiêu ngắn hạn (6 tháng)',
		example: 'Học TypeScript và Next.js',
	})
	@IsString()
	@IsNotEmpty()
	short_term_goals: string;

	@ApiProperty({
		description: 'Mục tiêu trung hạn (1-2 năm)',
		example: 'Trở thành Senior Developer',
	})
	@IsString()
	@IsNotEmpty()
	medium_term_goals: string;

	@ApiProperty({
		description: 'Mục tiêu dài hạn (3-5 năm)',
		example: 'Khởi nghiệp công ty tech',
	})
	@IsString()
	@IsNotEmpty()
	long_term_goals: string;

	// thời gian dành ra mỗi ngày (giờ)
	@ApiProperty({
		description: 'Thời gian dành ra mỗi ngày (giờ)',
		example: 10,
		minimum: 1,
		maximum: 40,
	})
	@IsNumber()
	time_available_a_day: number;
}

// Preferences sub-DTO
class PreferencesDto {
	@ApiProperty({
		description: 'Phong cách học tập ưa thích',
		example: 'hands-on',
		enum: ['visual', 'auditory', 'kinesthetic', 'hands-on'],
	})
	@IsString()
	@IsNotEmpty()
	learning_style: string;

	@ApiProperty({
		description: 'Ngân sách có thể chi (VND)',
		example: 5000000,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	budget?: number;

	// Deadline Mong Muốn tháng (số tháng hoặc linh hoạt)
	@ApiProperty({
		description: 'Deadline Mong Muốn tháng (số tháng hoặc linh hoạt)',
		example: 3,
		minimum: 1,
		maximum: 12,
	})
	@IsNumber()
	@Type(() => Number)
	deadline_month: number;
}

// Additional sub-DTO
class AdditionalDto {
	@ApiProperty({
		description: 'Ghi chú thêm',
		example: 'Muốn tập trung vào full-stack development',
		required: false,
	})
	@IsOptional()
	@IsString()
	additional_notes?: string;
}

// Main DTO
export class CreateFormSubmissionDto {
	@ApiProperty({
		description: 'Thông tin cá nhân',
		type: PersonalInfoDto,
	})
	@IsObject()
	@ValidateNested()
	@Type(() => PersonalInfoDto)
	personal_info: PersonalInfoDto;

	@ApiProperty({
		description: 'Tình trạng hiện tại',
		type: CurrentSituationDto,
	})
	@IsObject()
	@ValidateNested()
	@Type(() => CurrentSituationDto)
	current_situation: CurrentSituationDto;

	@ApiProperty({
		description: 'Mục tiêu phát triển',
		type: GoalsDto,
	})
	@IsObject()
	@ValidateNested()
	@Type(() => GoalsDto)
	goals: GoalsDto;

	@ApiProperty({
		description: 'Sở thích học tập',
		type: PreferencesDto,
	})
	@IsObject()
	@ValidateNested()
	@Type(() => PreferencesDto)
	preferences: PreferencesDto;

	@ApiProperty({
		description: 'Thông tin bổ sung',
		type: AdditionalDto,
		required: false,
	})
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => AdditionalDto)
	additional?: AdditionalDto;
}
