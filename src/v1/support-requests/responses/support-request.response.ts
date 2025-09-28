import { ApiProperty } from '@nestjs/swagger';
import { formatCreatedAtTime } from '../../../common/responses/base-time.response';
import { SupportRequestEntity } from '../../../database/entities/support-request.entity';
import { StudentResponse } from '../../students/response/student.response';

export class SupportRequestResponse extends SupportRequestEntity {
	@ApiProperty({
		type: StudentResponse,
		description: 'Thông tin học viên',
		example: new StudentResponse(),
	})
	student: StudentResponse;

	constructor(init?: Partial<SupportRequestResponse>, student?: StudentResponse) {
		super(init);
		this.student = student || new StudentResponse();
		this.created_at = formatCreatedAtTime(init.created_at);
		this.updated_at = formatCreatedAtTime(init.updated_at);
	}
}

export class SupportRequestStatsResponse {
	@ApiProperty({
		description: 'Số yêu cầu đang chờ duyệt',
		example: 15,
	})
	pending: number;

	@ApiProperty({
		description: 'Số yêu cầu đã duyệt',
		example: 70,
	})
	approved: number;

	@ApiProperty({
		description: 'Số yêu cầu bị từ chối',
		example: 10,
	})
	rejected: number;

	@ApiProperty({
		description: 'Số yêu cầu đã hoàn thành',
		example: 5,
	})
	completed: number;
}
