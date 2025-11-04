import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { NumberIdParamDto } from '../../common/dto/id_param.dto';
import { GetUser, Public, Roles, USER_ROLE, UserContext } from '../../common/guards/jwt-auth.guard';
import { AssignSubmissionDto } from './dto/assign-submission.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';
import { ListAssignedQueryDto } from './dto/list-assigned-query.dto';
import { ListSubmissionsQueryDto } from './dto/list-submissions-query.dto';
import { PublicCodeParamDto } from './dto/public-code-param.dto';
import { ExpertFeedbackService } from './expert-feedback.service';
import { FormSubmissionsService } from './form-submissions.service';
import { FormSubmissionCreateResponse } from './responses/form-submission.response';

@ApiTags('Form Submissions')
@Controller('form-submissions')
export class FormSubmissionsController {
	constructor(
		private readonly formSubmissionsService: FormSubmissionsService,
		private readonly expertFeedbacksService: ExpertFeedbackService,
	) {}

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

	@Get('public/:code')
	@ApiOperation({
		summary: 'Xem submission công khai bằng mã 6 ký tự',
		description: 'Trả về dữ liệu submission và danh sách feedback công khai',
	})
	@ApiResponse({ status: HttpStatus.OK, description: 'Tìm thấy submission' })
	@Public()
	async getPublicByCode(@Param() params: PublicCodeParamDto) {
		const submission = await this.formSubmissionsService.getByPublicCode(params.code.toUpperCase());
		return submission;
	}

	@Get()
	@Roles(USER_ROLE.ADMIN)
	@ApiOperation({ summary: 'Admin: Danh sách submission', description: 'Yêu cầu token' })
	async listAll(@Query() query: ListSubmissionsQueryDto) {
		return this.formSubmissionsService.listSubmissions(query.page, query.limit);
	}

	@Patch(':id/assign')
	@Roles(USER_ROLE.ADMIN)
	@ApiOperation({ summary: 'Admin: Gán submission cho chuyên viên' })
	async assign(@Param() params: NumberIdParamDto, @Body() dto: AssignSubmissionDto) {
		await this.formSubmissionsService.assignSubmission(params.id, dto.expertId);
		return { success: true };
	}

	@Get('assigned')
	@Roles(USER_ROLE.EXPERT)
	@ApiOperation({ summary: 'Chuyên viên: Danh sách submission được giao' })
	async listAssigned(@GetUser() user: UserContext, @Query() query: ListAssignedQueryDto) {
		return this.formSubmissionsService.listAssignedSubmissions(user.id, query.page, query.limit);
	}

	@Post(':id/feedback')
	@Roles(USER_ROLE.EXPERT)
	@ApiOperation({ summary: 'Chuyên viên: Thêm nhận xét' })
	async addFeedback(@Param() params: NumberIdParamDto, @Body() dto: CreateFeedbackDto, @GetUser() user: UserContext) {
		const fb = await this.expertFeedbacksService.createFeedback(params.id, user.id, dto.content);
		return fb;
	}

	@Get(':id/feedback')
	@Roles(USER_ROLE.ADMIN, USER_ROLE.EXPERT)
	@ApiOperation({ summary: 'Danh sách nhận xét cho submission' })
	async listFeedback(@Param() params: NumberIdParamDto) {
		return this.expertFeedbacksService.listAllBySubmissionId(params.id);
	}
}
