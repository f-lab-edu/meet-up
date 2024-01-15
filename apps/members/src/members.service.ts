import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { IsNull, Not, Repository } from 'typeorm'
import { CreateMemberDto } from './dto/create-member.dto'
import { ConfigService } from '@nestjs/config'
import { DuplicateMemberException } from '@app/exceptions/duplicate-member.exception'
import { UpdateMemberDto } from './dto/update-member.dto'

@Injectable()
export class MembersService {
	constructor(
		@InjectRepository(Member)
		private readonly memberRepository: Repository<Member>,
		private readonly configService: ConfigService,
	) {}

	getHello(): string {
		return 'Hello World!'
	}

	async findAll(status: 'active' | 'deleted' | 'all' = 'active'): Promise<Member[]> {
		let whereClause = {}

		if (status === 'active') {
			whereClause = { deleted_at: IsNull() }
		} else if (status === 'deleted') {
			whereClause = { deleted_at: Not(IsNull()) }
		}

		const members = await this.memberRepository.find({ where: whereClause })
		if (members.length === 0) {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT)
		}

		return members
	}

	async findOneBy(column: keyof Member, value: any): Promise<Member> {
		return await this.memberRepository.findOneBy({ [column]: value })
	}

	async create(dto: CreateMemberDto): Promise<Member> {
		const member = new Member()
		Object.assign(member, dto)

		try {
			return await this.memberRepository.save(member)
		} catch (error) {
			if (this.configService.get('database') === 'postgres') {
				if (error.code === '23505') {
					throw new DuplicateMemberException()
				} else {
					// todo refactor using logging service
					console.error(`An unexpected error occurred while creating a member using Postgres: ${error.message}`)
				}
			} else {
				console.error(`A database error occurred while creating a member, and the error handling for the current DBMS type is not implemented yet`)
			}
			// todo handle unhandled error
			throw error
		}
	}

	async update(id: string, dto: UpdateMemberDto): Promise<void> {
		await this.memberRepository.update(id, dto)
	}
}
