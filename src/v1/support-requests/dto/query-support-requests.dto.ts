import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { OffsetPaginationDto } from '../../../common/dto/offset_pagination.dto';
import { SUPPORT_REQUEST_TYPE } from '../../../database/entities/support-request.entity';

export class QuerySupportRequestsDto extends OffsetPaginationDto {
	@ApiProperty({
		description: 'Lọc theo trạng thái yêu cầu',
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	status?: number;

	@ApiProperty({
		description: 'Lọc theo loại hỗ trợ',
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	type?: SUPPORT_REQUEST_TYPE;

	@ApiProperty({
		description: 'Lọc theo ID học viên',
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	student_id?: number;
}
