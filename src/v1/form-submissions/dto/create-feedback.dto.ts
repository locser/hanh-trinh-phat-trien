import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
	@ApiProperty({ description: 'Nội dung nhận xét', example: 'Ứng viên phù hợp vị trí frontend junior.' })
	@IsString()
	@IsNotEmpty()
	content: string;
}
