import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
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

	async findAll(): Promise<Member[]> {
		return await this.memberRepository.find()
	}
}
