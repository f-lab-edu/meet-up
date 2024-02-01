import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Between, FindOperator, LessThan, MoreThan, Repository } from 'typeorm'
import { PaginationOptions, PaginationResult } from '@app/types/pagination.types'
import { Member } from '@app/entities/members/member.entity'
import { DateFilter } from '../../members/src/dto/get-members.dto'

type MeetingsQueryFilters = {
	[K in keyof Omit<Member, 'created_at' | 'deleted_at'>]?: Member[K]
} & DateFilter

type MeetingsWhereCondition = MeetingsQueryFilters & {
	created_at?: FindOperator<Date>
	deleted_at?: FindOperator<Date>
}

@Injectable()
export class MeetingsService {
	constructor(
		@InjectRepository(Meeting)
		private readonly meetingsRepository: Repository<Meeting>,
	) {}

	async findAll(paginationOptions: PaginationOptions, filters?: MeetingsQueryFilters): Promise<PaginationResult<Meeting>> {
		const { page, limit } = paginationOptions
		const skip = (page - 1) * limit
		const take = limit

		const where: MeetingsWhereCondition = { ...filters }
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

	private applyCreatedAtFilters(where: MeetingsWhereCondition) {
		if (where.createdAfter && where.createdBefore) where.created_at = Between(where.createdAfter, where.createdBefore)
		else if (where.createdAfter) where.created_at = MoreThan(where.createdAfter)
		else if (where.createdBefore) where.created_at = LessThan(where.createdBefore)

		delete where.createdAfter
		delete where.createdBefore
	}
}
