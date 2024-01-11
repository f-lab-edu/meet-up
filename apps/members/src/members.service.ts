import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
		const members = await this.memberRepository.find()
		if (members.length === 0) {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT)
		}

		return members
	}

	async findOne(): Promise<Member> {
		const member = await this.memberRepository.findOne({})

		return member
	}
}
