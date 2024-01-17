import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { IsNull, Not, Repository } from 'typeorm'
import { CreateMemberDto } from './dto/create-member.dto'
import { ConfigService } from '@nestjs/config'
import { DuplicateMemberException } from '@app/exceptions/duplicate-member.exception'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Role } from '@app/entities/members/role.enums'
import { MemberNotFoundException } from '@app/exceptions/member-not-found.exception'
import { NonSequentialRoleUpdateException } from '@app/exceptions/non-sequential-role-update.exception'

interface DatabaseError extends Error {
	code?: string
}

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
			this.handleMemberExceptions(error)
		}
	}

	async update(id: string, dto: UpdateMemberDto): Promise<void> {
		try {
			await this.memberRepository.update(id, dto)
			return
		} catch (error) {
			this.handleMemberExceptions(error)
		}
	}

	async updateRole(id: string, role: Role): Promise<void> {
		// todo refactor updateRole method to use transaction

		const MAX_ROLE_DIFF = 1

		const member = await this.memberRepository.findOne({ where: { id } })
		if (!member) {
			throw new MemberNotFoundException(id)
		}
		if (Math.abs(member.role - role) > MAX_ROLE_DIFF) {
			throw new NonSequentialRoleUpdateException(member.role, role)
		}

		await this.memberRepository.update(id, { role })
	}

	async delete(id: string): Promise<void> {
		await this.memberRepository.update(id, { deleted_at: new Date() })
	}

	private handleMemberExceptions(error: DatabaseError) {
		if (this.configService.get('database') === 'postgres') {
			if (error.code === '23505') {
				throw new DuplicateMemberException()
			} else {
				console.error(`An unexpected error occurred while updating a member using Postgres: ${error.message}`)
			}
		} else {
			console.error(`A database error occurred while updating a member, and the error handling for the current DBMS type is not implemented yet`)
		}
		throw error
	}
}
