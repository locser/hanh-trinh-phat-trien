import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsTimeFormat } from '../decorators/time.decorator';

export class OffsetPaginationDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	@Transform(({ value }) => +value)
	@ApiProperty({
		type: Number,
		example: 1,
		required: false,
	})
	page = 1;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(500)
	@Transform(({ value }) => +value)
	@ApiProperty({
		type: Number,
		example: 20,
		required: false,
	})
	limit = 20;
}

export class PaginationDto {
	private readonly page: number = 1;
	private readonly limit: number = 20;

	constructor(page?: number, limit?: number) {
		this.page = page || 1;
		this.limit = limit || 20;
	}

	getOffset(): number {
		return (this.page - 1) * this.limit;
	}

	getLimit(): number {
		return this.limit;
	}
}

export class OffsetFromToDateDto {
	@IsOptional()
	@IsTimeFormat('DD/MM/YYYY')
	@ApiProperty({ type: String, example: '30/05/2025', required: false })
	from_date: string;

	@IsOptional()
	@ApiProperty({ type: String, example: '30/05/2025', required: false })
	@IsTimeFormat('DD/MM/YYYY')
	to_date: string;
}
