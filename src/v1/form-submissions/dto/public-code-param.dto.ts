import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

export class PublicCodeParamDto {
	@ApiProperty({
		description: 'Mã công khai 6 ký tự (A-Z0-9)',
		example: '9F2KQ7',
	})
	@Length(6, 6, { message: 'Code must be exactly 6 characters' })
	@Matches(/^[A-Z0-9]+$/, { message: 'Code must be uppercase alphanumeric (A-Z0-9)' })
	code: string;
}
