import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './_common.entity';

export enum SUPPORT_REQUEST_STATUS {
	PENDING = 1, // 'pending',
	APPROVED = 2, // 'approved',
	REJECTED = 3, // 'rejected',
	COMPLETED = 4, // 'completed',
}

export enum SUPPORT_REQUEST_TYPE {
	TUITION_FEE = 1, // 'tuition_fee',
	LEARNING_MATERIALS = 2, // 'learning_materials',
	OTHER = 3, // 'other',
}

@Entity('support_requests')
export class SupportRequestEntity extends CommonEntity {
	@ApiProperty({
		type: Number,
		description: 'ID yêu cầu hỗ trợ duy nhất',
		example: 1,
	})
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: number;

	@ApiProperty({
		type: Number,
		description: 'ID học viên',
		example: 1,
	})
	@Column({ type: 'bigint', nullable: true, default: 0 })
	student_id: number;

	// tên người liên hệ
	@ApiProperty({
		type: String,
		description: 'Tên người liên hệ',
		example: 'Nguyễn Văn A',
	})
	@Column({ type: 'varchar', length: 255, nullable: true, default: '' })
	name: string;
	// số điện thoại liên hệ
	@ApiProperty({
		type: String,
		description: 'Số điện thoại liên hệ',
		example: '0901234567',
	})
	@Column({ type: 'varchar', length: 20, nullable: true, default: '' })
	phone: string;

	@ApiProperty({
		type: String,
		description: 'Mô tả hoàn cảnh',
		example: 'Gia đình khó khăn, cần hỗ trợ học phí.',
	})
	@Column({ type: 'text' })
	description: string;

	@ApiProperty({
		type: Number,
		description: 'Trạng thái yêu cầu',
		example: SUPPORT_REQUEST_STATUS.PENDING,
	})
	@Column({
		type: 'tinyint',
		default: SUPPORT_REQUEST_STATUS.PENDING,
		nullable: false,
	})
	status: SUPPORT_REQUEST_STATUS;

	// @ApiProperty({
	// 	type: Number,
	// 	description: 'Loại hỗ trợ',
	// 	example: SUPPORT_REQUEST_TYPE.OTHER,
	// })
	// @Column({
	// 	type: 'tinyint',
	// 	nullable: false,
	// 	default: SUPPORT_REQUEST_TYPE.OTHER,
	// })
	// type: SUPPORT_REQUEST_TYPE;

	@ApiProperty({
		type: String,
		description: 'Ghi chú từ admin',
		example: 'Ghi chú từ admin',
	})
	@Column({ type: 'text', nullable: true, default: '' })
	reason: string;

	@ApiProperty({
		type: Number,
		description: 'ID admin đã duyệt',
		example: 1,
	})
	@Column({ type: 'bigint', nullable: true, default: 0 })
	approved_by_id: number;

	@ApiProperty({
		type: Number,
		description: 'Vị trí ưu tiên (số thứ tự)',
		example: 1,
		required: false,
	})
	@Column({ type: 'int', nullable: true, default: null })
	position: number;

	@ApiProperty({
		type: String,
		description: 'Thời gian xóa mềm',
		example: null,
		required: false,
	})
	@Column({ type: 'datetime', nullable: true, default: null })
	deleted_at: string;

	constructor(init?: Partial<SupportRequestEntity>) {
		super();
		this.id = +init?.id || 0;
		this.student_id = init?.student_id || 0;
		this.name = init?.name || '';
		this.phone = init?.phone || '';
		this.description = init?.description || '';
		this.status = init?.status || SUPPORT_REQUEST_STATUS.PENDING;
		// this.type = init?.type || SUPPORT_REQUEST_TYPE.OTHER;
		this.reason = init?.reason || '';
		this.approved_by_id = init?.approved_by_id || 0;
		this.position = init?.position || 0;
		this.deleted_at = init?.deleted_at || null;
	}
}
