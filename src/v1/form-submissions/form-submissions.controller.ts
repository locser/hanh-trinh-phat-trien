import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../common/guards/jwt-auth.guard';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { FormSubmissionsService } from './form-submissions.service';
import { FormSubmissionCreateResponse } from './responses/form-submission.response';

@ApiTags('Form Submissions')
@Controller('form-submissions')
export class FormSubmissionsController {
	constructor(private readonly formSubmissionsService: FormSubmissionsService) {}

	@Post('submit')
	@ApiOperation({
		summary: 'Submit form phát triển bản thân',
		description: 'Gửi form thông tin phát triển bản thân để tạo timeline AI',
	})
	@ApiHeader({
		name: 'X-User-Session',
		description: 'Session identifier để phân biệt người dùng (bắt buộc)',
		required: true,
		example: 'user-12345-browser-fingerprint',
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Form đã được submit thành công, timeline đang được tạo',
		type: FormSubmissionCreateResponse,
	})
	@Public()
	async submitForm(@Body() createFormSubmissionDto: CreateFormSubmissionDto, @Req() req: Request): Promise<FormSubmissionCreateResponse> {
		// Extract IP and user session from middleware
		const clientIp = req['clientIp'] as string;
		const userSession = req['userSession'] as string;
		const userAgent = req['userAgent'] as string;

		console.log(`Client IP: ${clientIp}`);
		console.log(`User Agent: ${userAgent}`);

		return await this.formSubmissionsService.createSubmission(createFormSubmissionDto, clientIp, userSession, userAgent);
	}
}
