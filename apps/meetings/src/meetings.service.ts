import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Between, LessThan, MoreThan, Repository } from 'typeorm'
import { PaginationOptions, PaginationResult } from '@app/types/pagination.types'
import { Filters, WhereCondition } from '@app/types'

@Injectable()
export class MeetingsService {
	constructor(
		@InjectRepository(Meeting)
		private readonly meetingsRepository: Repository<Meeting>,
	) {}

	async findAll(paginationOptions: PaginationOptions, filters?: Filters<Meeting>): Promise<PaginationResult<Meeting>> {
		const { page, limit } = paginationOptions
		const skip = (page - 1) * limit
		const take = limit

		const where: WhereCondition<Meeting> = { ...filters }
		this.applyCreatedAtFilters(where)

		/*
		Use findAndCount for efficient retrieval of paginated data.
		findAndCount retrieves all records matching certain criteria and also counts the total number of records that match the criteria.
		 */
		const [items, total] = await this.meetingsRepository.findAndCount({ skip, take, ...where })

		return {
			items,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	private applyCreatedAtFilters(where: WhereCondition<Meeting>) {
		if (where.createdAfter && where.createdBefore) where.created_at = Between(where.createdAfter, where.createdBefore)
		else if (where.createdAfter) where.created_at = MoreThan(where.createdAfter)
		else if (where.createdBefore) where.created_at = LessThan(where.createdBefore)

		delete where.createdAfter
		delete where.createdBefore
	}
}
