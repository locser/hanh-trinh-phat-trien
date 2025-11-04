import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AssignSubmissionDto {
	@ApiProperty({ description: 'ID chuyên viên được giao', example: 12 })
	@IsInt()
	@Min(1)
	@Transform(({ value }) => +value)
	expertId: number;
}
