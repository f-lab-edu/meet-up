import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Repository } from 'typeorm'
import { PaginationOptions, PaginationResult } from '@app/types/pagination.types'

@Injectable()
export class MeetingsService {
	constructor(
		@InjectRepository(Meeting)
		private readonly meetingsRepository: Repository<Meeting>,
	) {}

	async findAll(paginationOptions: PaginationOptions): Promise<PaginationResult<Meeting>> {
		const { page, limit } = paginationOptions
		const skip = (page - 1) * limit
		const take = limit

		/*
		Use findAndCount for efficient retrieval of paginated data.
		findAndCount retrieves all records matching certain criteria and also counts the total number of records that match the criteria.
		 */
		const [items, total] = await this.meetingsRepository.findAndCount({ skip, take })

		return {
			items,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}
}
