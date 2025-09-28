import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { SUPPORT_REQUEST_STATUS } from '../../../database/entities/support-request.entity';

export class UpdateSupportRequestDto {
	@ApiProperty({
		description: 'Tên người liên hệ',
		example: 'Nguyễn Văn Khải',
		required: false,
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	name: string;

	@ApiProperty({
		description: 'Số điện thoại liên hệ',
		example: '0901234567',
		required: false,
	})
	@IsNotEmpty()
	@IsString()
	phone: string;

	@ApiProperty({
		description: 'Mô tả về hoàn cảnh',
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;
}

export class UpdateSupportRequestStatusDto {
	@ApiProperty({
		description: 'Trạng thái mới',
		enum: SUPPORT_REQUEST_STATUS,
	})
	@IsNotEmpty()
	@IsNumber()
	@Type(() => Number)
	@IsEnum([SUPPORT_REQUEST_STATUS.REJECTED, SUPPORT_REQUEST_STATUS.APPROVED, SUPPORT_REQUEST_STATUS.COMPLETED])
	status: SUPPORT_REQUEST_STATUS;

	@ApiProperty({
		description: 'Lý do duyệt',
		required: false,
	})
	@IsOptional()
	@ValidateIf((object, value) => object.status === SUPPORT_REQUEST_STATUS.REJECTED)
	@IsString()
	reason?: string;
}
