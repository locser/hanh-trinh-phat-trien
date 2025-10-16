import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

// Personal Info sub-DTO
class PersonalInfoDto {
	@ApiProperty({
		description: 'Họ tên đầy đủ',
		example: 'Nguyễn Văn A',
	})
	@IsString()
	@IsNotEmpty()
	full_name: string;

	@ApiProperty({
		description: 'Số điện thoại',
		example: '0123456789',
	})
	@IsString()
	@IsNotEmpty()
	phone: string;

	@ApiProperty({
		description: 'Email',
		example: 'nguyenvana@email.com',
	})
	@IsString()
	@IsNotEmpty()
	email: string;
}

// Individual Skill DTO
class SkillDto {
	@ApiProperty({
		description: 'Tên kỹ năng',
		example: 'JavaScript',
	})
	@IsString()
	@IsNotEmpty()
	skill: string;

	@ApiProperty({
		description: 'Trình độ kỹ năng',
		example: 'Trung bình',
	})
	@IsString()
	@IsNotEmpty()
	level: string;
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
		description: 'Lĩnh vực công việc',
		example: ['IT', 'Marketing', 'Sales'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	work_fields: string[];

	@ApiProperty({
		description: 'Mô tả công việc',
		example: 'Phát triển web application sử dụng React và Node.js',
	})
	@IsString()
	@IsNotEmpty()
	work_description: string;

	@ApiProperty({
		description: 'Số năm kinh nghiệm làm việc',
		example: '3 năm',
	})
	@IsString()
	@IsNotEmpty()
	years_of_experience: string;

	@ApiProperty({
		description: 'Kỹ năng hiện có',
		type: [SkillDto],
		example: [
			{ skill: 'JavaScript', level: 'Trung bình' },
			{ skill: 'React', level: 'Khá' },
			{ skill: 'Node.js', level: 'Giỏi' },
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SkillDto)
	skills: SkillDto[];

	@ApiProperty({
		description: 'Thời gian thất nghiệp',
		example: '6 tháng',
	})
	@IsString()
	@IsNotEmpty()
	unemployment_duration: string;

	@ApiProperty({
		description: 'Tác động của AI',
		example: 'Có',
	})
	@IsString()
	@IsNotEmpty()
	ai_impact: string;

	@ApiProperty({
		description: 'Mô tả cụ thể tác động của AI',
		example: 'AI đã thay thế một số công việc lập trình cơ bản',
	})
	@IsString()
	@IsNotEmpty()
	ai_impact_description: string;

	@ApiProperty({
		description: 'Mục tiêu sự nghiệp',
		example: 'Trở thành Senior Full-stack Developer',
	})
	@IsString()
	@IsNotEmpty()
	career_goal: string;

	@ApiProperty({
		description: 'Thời gian mong muốn đạt được mục tiêu',
		example: '2 năm',
	})
	@IsString()
	@IsNotEmpty()
	timeline: string;

	@ApiProperty({
		description: 'Nhu cầu hỗ trợ',
		example: ['Học lập trình', 'Phát triển kỹ năng mềm', 'Tìm việc làm'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	needs: string[];
}
