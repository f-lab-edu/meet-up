import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { Between, FindOperator, IsNull, LessThan, MoreThan, Not, Repository } from 'typeorm'
import { CreateMemberDto } from './dto/create-member.dto'
import { ConfigService } from '@nestjs/config'
import { DuplicateMemberException } from '@app/exceptions/duplicate-member.exception'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Role } from '@app/entities/members/role.enums'
import { MemberNotFoundException } from '@app/exceptions/member-not-found.exception'
import { NonSequentialRoleUpdateException } from '@app/exceptions/non-sequential-role-update.exception'
import { MemberRedundantDeletionException } from '@app/exceptions/member-redundant-deletion.exception'
import { DateFilter } from './dto/get-members.dto'

// This is an interface because it's serving as a contract for a certain shape that an object must adhere to.
// Here, DatabaseError is an Error object that may optionally include a code string.
// Thus, to extend the standard Error object with a new property, an interface is perfectly suited.
interface DatabaseError extends Error {
	code?: string
}

// This is a type because it represents an application of a transformation over the Member type - for every key in Member.
type MembersQueryFilters = {
	[K in keyof Omit<Member, 'created_at' | 'deleted_at'>]?: Member[K]
} & DateFilter

type MembersWhereCondition = MembersQueryFilters & {
	created_at?: FindOperator<Date>
	deleted_at?: FindOperator<Date>
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

	async findAll(status: 'active' | 'deleted' | 'all' = 'active', filter: MembersQueryFilters = {}): Promise<Member[]> {
		const where: MembersWhereCondition = { ...filter }

		// handle deletion state
		if (status === 'active') {
			where.deleted_at = IsNull()
		} else if (status === 'deleted') {
			where.deleted_at = Not(IsNull())
		}

		this.applyCreatedAtFilters(where)

		const members = await this.memberRepository.find({ where })

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
		// todo refactor delete method to use transaction

		const member = await this.memberRepository.findOne({ where: { id } })
		if (member.deleted_at) {
			throw new MemberRedundantDeletionException(id)
		}

		await this.memberRepository.update(id, { deleted_at: new Date(), role: null })
	}

	private applyCreatedAtFilters(where: MembersWhereCondition) {
		if (where.createdAfter && where.createdBefore) where.created_at = Between(where.createdAfter, where.createdBefore)
		else if (where.createdAfter) where.created_at = MoreThan(where.createdAfter)
		else if (where.createdBefore) where.created_at = LessThan(where.createdBefore)

		delete where.createdAfter
		delete where.createdBefore
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
