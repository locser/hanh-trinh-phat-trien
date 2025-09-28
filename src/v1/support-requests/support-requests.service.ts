import { BadRequestException, Injectable } from '@nestjs/common';
import { In, IsNull } from 'typeorm';
import { TokenData } from '../../common/guards/auth.guard';
import { StudentEntity } from '../../database/entities/student.entity';
import { SUPPORT_REQUEST_STATUS, SupportRequestEntity } from '../../database/entities/support-request.entity';
import { StudentRepository } from '../../database/repositories/student.repository';
import { SupportRequestRepository } from '../../database/repositories/support-request.repository';
import { StudentResponse } from '../students/response/student.response';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { QuerySupportRequestsDto } from './dto/query-support-requests.dto';
import { SortSupportRequestsDto } from './dto/sort-support-requests.dto';
import { UpdateSupportRequestDto, UpdateSupportRequestStatusDto } from './dto/update-support-request.dto';
import { SupportRequestResponse } from './responses/support-request.response';

@Injectable()
export class SupportRequestsService {
	constructor(
		private readonly supportRequestRepository: SupportRequestRepository,
		private readonly studentRepository: StudentRepository,
	) {}

	async create(createDto: CreateSupportRequestDto, user: TokenData) {
		const supportRequest = this.supportRequestRepository.create({
			...createDto,
			status: SUPPORT_REQUEST_STATUS.PENDING,
			student_id: user.user_id,
		});

		// lấy ra vị trí cuối cùng của yêu cầu hỗ trợ, nếu không có thì set vị trí là 1
		const lastPosition = await this.supportRequestRepository.findOne({ where: { deleted_at: IsNull() }, order: { position: 'DESC' } });
		supportRequest.position = lastPosition?.position || 0 + 1;

		await this.supportRequestRepository.save(supportRequest);
	}

	async findAll(queryDto: QuerySupportRequestsDto): Promise<{
		data: SupportRequestEntity[];
		total: number;
		limit: number;
		studentMaps: Map<number, StudentEntity>;
	}> {
		let [list, total] = await this.supportRequestRepository.findAll(queryDto);
		if (list.length === 0 || total === 0) {
			return {
				data: [],
				total,
				limit: queryDto.limit,
				studentMaps: new Map(),
			};
		}

		const students = await this.studentRepository.find({ where: { id: In(list.map((item) => item.student_id)) } });
		const studentMaps = new Map(students.map((s) => [+s.id, s]));

		return {
			data: list,
			total,
			limit: queryDto.limit,
			studentMaps: studentMaps,
		};
	}

	async findPublicRequests(): Promise<SupportRequestEntity[]> {
		return await this.supportRequestRepository.findPublicRequests();
	}

	async findOne(id: number): Promise<SupportRequestEntity> {
		const supportRequest = await this.supportRequestRepository.findOneById(id);
		const student = await this.studentRepository.findOne({ where: { id: supportRequest.student_id } });

		return new SupportRequestResponse(supportRequest, new StudentResponse(student));
	}

	async update(id: number, updateDto: UpdateSupportRequestDto) {
		const existingRequest = await this.supportRequestRepository.findOneById(id);
		if (existingRequest.status !== SUPPORT_REQUEST_STATUS.PENDING) {
			throw new BadRequestException('Yêu cầu hỗ trợ không thể cập nhật');
		}

		existingRequest.description = updateDto.description ?? existingRequest.description;
		existingRequest.phone = updateDto.phone ?? existingRequest.phone;
		existingRequest.name = updateDto.name ?? existingRequest.name;

		return await this.supportRequestRepository.update(id, updateDto);
	}

	async updateStatus(id: number, updateStatusDto: UpdateSupportRequestStatusDto, adminId?: number) {
		const existingRequest = await this.supportRequestRepository.findOneById(id);

		if (existingRequest.status !== SUPPORT_REQUEST_STATUS.PENDING) {
			throw new BadRequestException('Yêu cầu hỗ trợ không thể cập nhật trạng thái');
		}

		return await this.supportRequestRepository.updateStatus(existingRequest.id, updateStatusDto.status, updateStatusDto.reason, adminId);
	}

	async remove(id: number): Promise<void> {
		const existingRequest = await this.supportRequestRepository.findOneById(id);

		if (existingRequest.status !== SUPPORT_REQUEST_STATUS.PENDING) {
			throw new BadRequestException('Yêu cầu hỗ trợ không thể xóa');
		}

		await this.supportRequestRepository.update(id, { deleted_at: new Date().toISOString() });
	}

	async getStatistics(): Promise<{
		pending: number;
		approved: number;
		rejected: number;
		completed: number;
	}> {
		return await this.supportRequestRepository.getStatistics();
	}

	async sortPositions(sortDto: SortSupportRequestsDto): Promise<void> {
		await this.supportRequestRepository.updatePositions(sortDto.sort_items);
	}
}
