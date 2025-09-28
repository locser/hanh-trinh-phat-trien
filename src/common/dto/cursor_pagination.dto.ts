import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CursorPaginationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
  })
  position: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  @Transform(({ value }) => +value)
  @ApiPropertyOptional({
    type: Number,
    example: 20,
  })
  limit = 20;
}
