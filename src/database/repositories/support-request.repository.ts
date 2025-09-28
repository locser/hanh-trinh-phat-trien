import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';
import { QuerySupportRequestsDto } from '../../v1/support-requests/dto/query-support-requests.dto';
import { SUPPORT_REQUEST_STATUS, SupportRequestEntity } from '../entities/support-request.entity';

@Injectable()
export class SupportRequestRepository extends Repository<SupportRequestEntity> {
	constructor(dataSource: DataSource, manager?: EntityManager) {
		super(SupportRequestEntity, manager || dataSource.createEntityManager());
	}

	async findAll(queryDto: QuerySupportRequestsDto): Promise<[SupportRequestEntity[], number]> {
		const { status, student_id } = queryDto;
		const query = this.createQueryBuilder('sr').where('sr.deleted_at IS NULL');

		if (status > -1) {
			query.andWhere('sr.status = :status', { status });
		}

		if (student_id > 0) {
			query.andWhere('sr.student_id = :student_id', { student_id });
		}

		return await query
			.take(queryDto.limit)
			.skip((queryDto.page - 1) * queryDto.limit)
			.orderBy('sr.position', 'ASC')
			.addOrderBy('sr.id', 'DESC')
			.getManyAndCount();
	}

	async findPublicRequests(): Promise<SupportRequestEntity[]> {
		return await this.find({
			where: {
				status: In([SUPPORT_REQUEST_STATUS.APPROVED, SUPPORT_REQUEST_STATUS.PENDING]),
				deleted_at: IsNull(),
			},
			order: { position: 'ASC', id: 'DESC' },
		});
	}

	async updateStatus(id: number, status: SUPPORT_REQUEST_STATUS, reason?: string, approvedById?: number) {
		return await this.update(id, {
			status,
			reason: reason,
			approved_by_id: approvedById,
		});
	}

	async getStatistics(): Promise<{
		pending: number;
		approved: number;
		rejected: number;
		completed: number;
	}> {
		const result = await this.createQueryBuilder('sr')
			.select([
				'SUM(CASE WHEN sr.status = :pending THEN 1 ELSE 0 END) as pending',
				'SUM(CASE WHEN sr.status = :approved THEN 1 ELSE 0 END) as approved',
				'SUM(CASE WHEN sr.status = :rejected THEN 1 ELSE 0 END) as rejected',
				'SUM(CASE WHEN sr.status = :completed THEN 1 ELSE 0 END) as completed',
			])
			.setParameters({
				pending: SUPPORT_REQUEST_STATUS.PENDING,
				approved: SUPPORT_REQUEST_STATUS.APPROVED,
				rejected: SUPPORT_REQUEST_STATUS.REJECTED,
				completed: SUPPORT_REQUEST_STATUS.COMPLETED,
			})
			.where('sr.deleted_at IS NULL')
			.getRawOne();

		return {
			pending: parseInt(result.pending) || 0,
			approved: parseInt(result.approved) || 0,
			rejected: parseInt(result.rejected) || 0,
			completed: parseInt(result.completed) || 0,
		};
	}

	async findOneById(id: number): Promise<SupportRequestEntity> {
		const supportRequest = await this.findOne({ where: { id: id, deleted_at: IsNull() } });
		if (!supportRequest) {
			throw new BadRequestException('Yêu cầu hỗ trợ không tồn tại');
		}
		return supportRequest;
	}

	async updatePositions(sortItems: { id: number; position: number }[]): Promise<void> {
		// Validate that all IDs exist and are not deleted
		const ids = sortItems.map((item) => +item.id);
		const existingRequests = await this.find({
			where: { id: In(ids), deleted_at: IsNull() },
		});

		if (existingRequests.length !== ids.length) {
			throw new BadRequestException('Một hoặc nhiều yêu cầu hỗ trợ không tồn tại');
		}

		// Create a map for quick position lookup
		const positionMap = new Map(sortItems.map((item) => [+item.id, item.position]));

		// Update positions on existing entities
		const updatedEntities = existingRequests.map((entity) => {
			entity.position = positionMap.get(+entity.id);
			return entity;
		});

		// Save all entities at once in a transaction
		await this.manager.transaction(async (transactionalEntityManager) => {
			await transactionalEntityManager.save(SupportRequestEntity, updatedEntities);
		});
	}
}
