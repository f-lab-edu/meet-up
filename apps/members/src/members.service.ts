import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Member } from '../../../libs/entity/src/members/member.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MembersService {
	constructor(
		@InjectRepository(Member)
		private readonly memberRepository: Repository<Member>,
	) {}

	getHello(): string {
		return 'Hello World!'
	}
}
