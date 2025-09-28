import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateSupportRequestDto {
	@ApiProperty({
		description: 'Tên người liên hệ (phụ huynh/học sinh)',
		example: 'Nguyễn Văn Khải',
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@ApiProperty({
		description: 'Số điện thoại liên hệ',
		example: '0901234567',
	})
	@IsString()
	@IsNotEmpty()
	phone: string;

	@ApiProperty({
		description: 'Mô tả ngắn gọn về hoàn cảnh',
		example: 'Gia đình khó khăn, cần hỗ trợ học phí.',
	})
	@IsString()
	@IsNotEmpty()
	description: string;

	// @ApiProperty({
	//   description: 'Loại hỗ trợ cần thiết',
	//   enum: SupportRequestType,
	//   example: SupportRequestType.TUITION_FEE,
	//   required: false
	// })
	// @IsOptional()
	// @IsEnum(SupportRequestType)
	// type?: SupportRequestType;

	@ApiProperty({
		description: 'ID học sinh (nếu có)',
		example: 123,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Type(() => Number)
	student_id?: number;

	// @ApiProperty({
	//   description: 'URL avatar/hình ảnh đại diện',
	//   required: false
	// })
	// @IsOptional()
	// @IsString()
	// avatar?: string;
}
