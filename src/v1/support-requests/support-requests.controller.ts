import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NumberIdParamDto } from '../../common/dto/id_param.dto';
import { AuthGuard, GetUserFromToken, PRIVILEGE_CODE, Privileges, TokenData } from '../../common/guards/auth.guard';
import { BasePaginationResponse } from '../../common/responses/base-pagination.response';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { QuerySupportRequestsDto } from './dto/query-support-requests.dto';
import { SortSupportRequestsDto } from './dto/sort-support-requests.dto';
import { UpdateSupportRequestDto, UpdateSupportRequestStatusDto } from './dto/update-support-request.dto';
import { SupportRequestResponse, SupportRequestStatsResponse } from './responses/support-request.response';
import { SupportRequestsService } from './support-requests.service';

@ApiTags('Support Requests')
@ApiBearerAuth()
@Controller('support-requests')
export class SupportRequestsController {
	constructor(private readonly supportRequestsService: SupportRequestsService) {}

	@Post('create')
	@ApiOperation({
		summary: 'Gửi yêu cầu hỗ trợ',
		description: 'Tạo yêu cầu hỗ trợ mới từ phụ huynh/học sinh',
	})
	@ApiResponse({
		description: 'Yêu cầu hỗ trợ đã được tạo thành công',
		type: SupportRequestResponse,
	})
	async create(@Body() createSupportRequestDto: CreateSupportRequestDto, @GetUserFromToken() user: TokenData) {
		return await this.supportRequestsService.create(createSupportRequestDto, user);
	}

	@Get('')
	@ApiOperation({
		summary: 'Lấy danh sách yêu cầu hỗ trợ (Admin)',
		description: 'Lấy danh sách tất cả yêu cầu hỗ trợ với phân trang và lọc',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Danh sách yêu cầu hỗ trợ',
		type: SupportRequestResponse,
	})
	async findAll(@Query() query: QuerySupportRequestsDto) {
		const { total, data, limit, studentMaps } = await this.supportRequestsService.findAll(query);

		return new BasePaginationResponse({
			total_record: total,
			list: data.map((item) => new SupportRequestResponse(item, new StudentResponse(studentMaps.get(+item.student_id)))),
			limit: limit,
		});
	}

	@Get('public')
	@ApiOperation({
		summary: 'Xem danh sách yêu cầu hỗ trợ công khai',
		description: 'Lấy danh sách các yêu cầu hỗ trợ đã được duyệt để hiển thị công khai',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Danh sách yêu cầu hỗ trợ công khai',
		type: [SupportRequestResponse],
	})
	async findPublicRequests() {
		return await this.supportRequestsService.findPublicRequests();
	}

	@Get('count-tab')
	@UseGuards(AuthGuard)
	@ApiOperation({
		summary: 'Thống kê yêu cầu hỗ trợ',
		description: 'Lấy thống kê tổng quan về các yêu cầu hỗ trợ',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Thống kê yêu cầu hỗ trợ',
		type: SupportRequestStatsResponse,
	})
	async getStatistics() {
		return await this.supportRequestsService.getStatistics();
	}

	@Get(':id/detail')
	@ApiOperation({
		summary: 'Xem chi tiết yêu cầu hỗ trợ',
		description: 'Lấy thông tin chi tiết của một yêu cầu hỗ trợ',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Chi tiết yêu cầu hỗ trợ',
		type: SupportRequestResponse,
	})
	async findOne(@Param() params: NumberIdParamDto) {
		return this.supportRequestsService.findOne(params.id);
	}

	@Post(':id/update')
	@ApiOperation({
		summary: 'Cập nhật yêu cầu hỗ trợ',
		description: 'Cập nhật thông tin yêu cầu hỗ trợ',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Yêu cầu hỗ trợ đã được cập nhật',
		type: SupportRequestResponse,
	})
	async update(@Param() params: NumberIdParamDto, @Body() updateSupportRequestDto: UpdateSupportRequestDto) {
		return await this.supportRequestsService.update(params.id, updateSupportRequestDto);
	}

	@Post(':id/change-status')
	@Privileges(PRIVILEGE_CODE.COURSE_MANAGEMENT_BASIC, PRIVILEGE_CODE.COURSE_MANAGEMENT_ADVANCED)
	@ApiOperation({
		summary: 'Duyệt/Từ chối yêu cầu hỗ trợ',
		description: 'Cập nhật trạng thái yêu cầu hỗ trợ (Admin)',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Trạng thái yêu cầu đã được cập nhật',
		type: SupportRequestResponse,
	})
	async updateStatus(@Param() params: NumberIdParamDto, @Body() updateStatusDto: UpdateSupportRequestStatusDto, @GetUserFromToken() user: TokenData) {
		const adminId = user.user_id;
		return await this.supportRequestsService.updateStatus(params.id, updateStatusDto, adminId);
	}

	@Post(':id/remove')
	@ApiOperation({
		summary: 'Xóa yêu cầu hỗ trợ',
		description: 'Xóa yêu cầu hỗ trợ (Admin)',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Yêu cầu hỗ trợ đã được xóa',
	})
	async remove(@Param() params: NumberIdParamDto) {
		return this.supportRequestsService.remove(params.id);
	}

	@Post('sort-positions')
	@Privileges(PRIVILEGE_CODE.COURSE_MANAGEMENT_BASIC, PRIVILEGE_CODE.COURSE_MANAGEMENT_ADVANCED)
	@ApiOperation({
		summary: 'Sắp xếp thứ tự ưu tiên yêu cầu hỗ trợ',
		description: 'Cập nhật vị trí ưu tiên của các yêu cầu hỗ trợ (Admin)',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Đã cập nhật thứ tự ưu tiên thành công',
	})
	async sortPositions(@Body() sortDto: SortSupportRequestsDto) {
		return await this.supportRequestsService.sortPositions(sortDto);
	}
}
