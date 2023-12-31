import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MeetingsService {
	constructor(
		@InjectRepository(Meeting)
		private readonly meetingsRepository: Repository<Meeting>,
	) {}

	getHello(): string {
		return 'Hello World!'
	}
}
