import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumberString, Min } from 'class-validator';

export class NumberIdParamDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => +value)
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;
}

export class StringIdParamDto {
  @IsNumberString({ no_symbols: true })
  @ApiProperty({
    type: String,
    example: '1',
  })
  id: string;
}
