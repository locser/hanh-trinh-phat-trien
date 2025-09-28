import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class SortItemDto {
	@ApiProperty({
		description: 'ID của yêu cầu hỗ trợ',
		example: 68,
	})
	@IsNotEmpty()
	@IsNumber()
	@Type(() => Number)
	id: number;

	@ApiProperty({
		description: 'Vị trí ưu tiên mới',
		example: 50,
	})
	@IsNotEmpty()
	@IsNumber()
	@Type(() => Number)
	position: number;
}

export class SortSupportRequestsDto {
	@ApiProperty({
		description: 'Danh sách các mục cần sắp xếp',
		type: [SortItemDto],
		example: [
			{ id: 68, position: 50 },
			{ id: 70, position: 51 },
			{ id: 69, position: 52 },
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SortItemDto)
	@ArrayMinSize(1)
	sort_items: SortItemDto[];
}
