import { MembersService } from './members.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { Between, IsNull, LessThan, MoreThan, Not } from 'typeorm'
import { HttpException, HttpStatus } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { CreateMemberDto } from './dto/create-member.dto'
import { DuplicateMemberException } from '@app/exceptions/duplicate-member.exception'
import { ConfigModule } from '@nestjs/config'
import { UpdateMemberDto } from './dto/update-member.dto'
import { MemberNotFoundException } from '@app/exceptions/member-not-found.exception'
import { NonSequentialRoleUpdateException } from '@app/exceptions/non-sequential-role-update.exception'
import { Role, roles } from '@app/entities/members/role.enums'
import { MemberRedundantDeletionException } from '@app/exceptions/member-redundant-deletion.exception'
import databaseConfig from '@app/config/database.config'
import { MockRepositoryType } from '../../../test-utils/unit/mock-repository.type'

const createMockRepository = <T = any>(): MockRepositoryType<T> => ({
	find: jest.fn(),
	findOne: jest.fn(),
	findOneBy: jest.fn(),
	save: jest.fn(),
	update: jest.fn(),
})

describe('MembersService', () => {
	let service: MembersService
	let memberRepository: MockRepositoryType

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MembersService,
				{
					provide: getRepositoryToken(Member),
					useValue: createMockRepository(),
				},
			],
			imports: [ConfigModule.forRoot({}), ConfigModule.forFeature(databaseConfig)],
		}).compile()

		service = module.get<MembersService>(MembersService)
		memberRepository = module.get<MockRepositoryType>(getRepositoryToken(Member))
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('findAll', () => {
		describe('when there is no record in members table', () => {
			it('should throw HttpException 204', async () => {
				const want = []
				memberRepository.find.mockReturnValue(want)

				try {
					await service.findAll()
				} catch (error) {
					expect(error).toBeInstanceOf(HttpException)
					expect(error.getStatus()).toBe(HttpStatus.NO_CONTENT)
				}
			})
		})
		describe.each(roles)('when querying by roles %s', role => {
			it('should return array of members with that role', async () => {
				// Given
				const expectedMembers = [{ ...new Member(), role }]
				memberRepository.find.mockResolvedValue(expectedMembers)

				// When
				const members = await service.findAll('active', { role })

				// Then
				expect(members).toEqual(expectedMembers)
				expect(memberRepository.find).toHaveBeenCalledWith({
					where: {
						deleted_at: IsNull(),
						role,
					},
				})
			})
		})
		type ColumnValuePair = {
			column: keyof Member
			value: string
		}
		// Phone column is not included as it contains unique values; use findOneBy instead.
		// todo change phone column to unique.
		describe.each<ColumnValuePair>([
			{
				column: 'firstName',
				value: 'Peter',
			},
			{
				column: 'lastName',
				value: 'Parker',
			},
			{
				column: 'nickname',
				value: 'Spider-Man',
			},
		])('when querying by a value of the specific column', ({ column, value }) => {
			it(`should return the array of members with the ${column} of ${value}`, async () => {
				// Given
				const expectedMembers = [{ ...new Member(), [column]: value }]
				memberRepository.find.mockResolvedValue(expectedMembers)

				// When
				const members = await service.findAll('active', { [column]: value })

				// Then
				expect(members).toEqual(expectedMembers)
				expect(memberRepository.find).toHaveBeenCalledWith({
					where: {
						deleted_at: IsNull(),
						[column]: value,
					},
				})
			})
		})
		describe('when querying by creation date', () => {
			// Given
			const date = new Date()
			const expectedMembers = [new Member()]

			beforeEach(() => {
				memberRepository.find.mockResolvedValue(expectedMembers)
			})

			it('should query with MoreThan date condition for members created after a specific date', async () => {
				// When
				const members = await service.findAll('active', { createdAfter: date })

				// Assert
				expect(members).toEqual(expectedMembers)
				expect(memberRepository.find).toHaveBeenCalledWith({
					where: {
						deleted_at: IsNull(),
						created_at: MoreThan(date),
					},
				})
			})
			it('should query with LessThan date condition for members created before a specific date', async () => {
				// When
				const members = await service.findAll('active', { createdBefore: date })

				// Assert
				expect(members).toEqual(expectedMembers)
				expect(memberRepository.find).toHaveBeenCalledWith({
					where: {
						deleted_at: IsNull(),
						created_at: LessThan(date),
					},
				})
			})
			it('should query with Between condition for members created between two specific dates', async () => {
				// Given
				const anotherDate = new Date()

				// When
				const members = await service.findAll('active', { createdAfter: date, createdBefore: anotherDate })

				// Assert
				expect(members).toEqual(expectedMembers)
				expect(memberRepository.find).toHaveBeenCalledWith({
					where: {
						deleted_at: IsNull(),
						created_at: Between(date, anotherDate),
					},
				})
			})
		})
		describe('when querying for members who has no attendance in the current quarter', () => {
			it.todo('should return the array of members who has no attendance in the current quarter')
		})
		describe('when querying for members who has no attendance in the last quarter', () => {
			it.todo('should return the array of members who has no attendance in the last quarter')
		})
		describe('when there is a database error', () => {
			it.todo('should throw an error')
		})
		describe('when sorting members by the length of their attendance records in all time', () => {
			it.todo('should list members with the most attendance records first')
		})
		describe('when sorting members by the length of their attendance records in the current quarter', () => {
			it.todo('should list members with the most attendance records in the current quarter first')
		})
		describe('when sorting members by the length of their attendance records in the last quarter', () => {
			it.todo('should list members with the most attendance records in the last quarter first')
		})
		describe('when querying for members who is participating the upcoming meeting', () => {
			it.todo('should return the array of members who is participating the upcoming meeting')
		})
		describe('when querying for members who has participated the last meeting', () => {
			it.todo('should return the array of members who has participated the lastf meeting')
		})
		describe('when querying for the deleted members', () => {
			it.todo('should return the array of deleted members')
		})
		describe('when handling deleted members', () => {
			let spy: jest.SpyInstance

			beforeEach(() => {
				spy = jest.spyOn(memberRepository, 'find').mockReturnValue(Promise.resolve([new Member()]))
			})

			afterEach(() => {
				spy.mockRestore()
			})

			it('should return only non-deleted members by default', async () => {
				await service.findAll()
				expect(spy).toHaveBeenCalledWith({ where: { deleted_at: IsNull() } })
			})
			it('should return all members, including deleted ones, if parameter `status` is "all"', async () => {
				await service.findAll('all')
				expect(spy).toHaveBeenCalledWith({ where: {} })
			})
			it('should return only deleted members if parameter `status` is "deleted"', async () => {
				await service.findAll('deleted')
				expect(spy).toHaveBeenCalledWith({ where: { deleted_at: Not(IsNull()) } })
			})
		})
		describe('otherwise', () => {
			it.todo('should not return the deleted members')
			it.todo('should return the array of members')
			it('should return the array of members', async () => {
				const expectedMembers = Array.from({ length: Math.round(Math.random() * 10) + 1 }, () => new Member())
				memberRepository.find.mockReturnValue(expectedMembers)

				const members = await service.findAll()
				expect(members).toEqual(expectedMembers)
			})
		})
		describe('when querying with pagination', () => {
			it.todo('should return the array of members with the pagination')
		})
	})
	describe('findAllByPhone', () => {
		it.todo('should return members that match the given phone number prefix')
		it.todo('should throw an exception if no members are found')
		it.todo('should return members sorted by attendance in descending order by default')
	})
	describe('findOneBy', () => {
		describe('when querying by ID', () => {
			it('should return the member with the ID', async () => {
				const want = new Member()
				want.id = randomUUID()
				memberRepository.findOneBy.mockReturnValue(want)

				const got = await service.findOneBy('id', want.id)
				expect(got).toEqual(want)
			})
		})
	})
	describe('create', () => {
		// Todo: In E2E test, add 'nickname and lastName combination' and 'phone' duplicate test.
		describe('when duplicate member exists', () => {
			it('should throw a DuplicateMemberException when using Postgres', async () => {
				const mockMemberDto = new CreateMemberDto()

				// Cast to `any` for the error to simulate a database error that includes a `code` property.
				const duplicateError: any = new Error()

				duplicateError.code = '23505'
				jest.spyOn(memberRepository, 'save').mockRejectedValue(duplicateError)

				// const mockConfigService = { get: jest.fn() } as any
				// mockConfigService.get.mockReturnValue('postgres')

				await expect(service.create(mockMemberDto)).rejects.toThrow(DuplicateMemberException)
			})
		})
		describe('otherwise', () => {
			it('should create a new member', async () => {
				const mockMemberDto = new CreateMemberDto()

				const returnedMember = new Member()

				jest.spyOn(memberRepository, 'save').mockImplementation(() => Promise.resolve(returnedMember))

				const result = await service.create(mockMemberDto)
				expect(result).toEqual(returnedMember)
			})
		})
	})
	describe('update', () => {
		describe.each(['id', 'role', 'attendances'])('when trying to update the column %s', () => {
			it.todo('should throw an error')
		})
		describe('when duplicate member exists', () => {
			it('should throw a DuplicateMemberException when using Postgres', async () => {
				const updateMemberDto = new UpdateMemberDto()

				// Cast to `any` for the error to simulate a database error that includes a `code` property.
				const duplicateError: any = new Error()

				duplicateError.code = '23505'
				jest.spyOn(memberRepository, 'update').mockRejectedValue(duplicateError)

				// const mockConfigService = { get: jest.fn() } as any
				// mockConfigService.get.mockReturnValue('postgres')

				const memberId = randomUUID()

				await expect(service.update(memberId, updateMemberDto)).rejects.toThrow(DuplicateMemberException)
			})
		})
		describe('otherwise', () => {
			it('should update the member', async () => {
				const updateMemberDto = new UpdateMemberDto()

				const memberId = randomUUID()

				await service.update(memberId, updateMemberDto)

				expect(memberRepository.update).toHaveBeenCalledWith(memberId, updateMemberDto)
			})
		})
	})
	describe('updateRole', () => {
		describe('when trying to update to a non-adjacent role', () => {
			it('should throw a NonSequentialRoleUpdateException', async () => {
				const member = new Member()
				member.role = Role.ADMIN

				const targetRole = Role.UNCERTIFIED
				const memberId = randomUUID()

				jest.spyOn(memberRepository, 'findOne').mockResolvedValue(member)

				await expect(service.updateRole(memberId, targetRole)).rejects.toThrow(NonSequentialRoleUpdateException)
			})
		})
		describe('when the provided ID does not exist in the database', () => {
			it('should throw a MemberNotFoundException', async () => {
				const memberId = randomUUID()
				const role = Role.CERTIFIED

				jest.spyOn(memberRepository, 'findOne').mockResolvedValue(undefined)

				await expect(service.updateRole(memberId, role)).rejects.toThrow(MemberNotFoundException)
			})
		})
		describe('otherwise', () => {
			it('should update the role of the member', async () => {
				const member = new Member()
				member.role = Role.CERTIFIED

				const targetRole = Role.ADMIN
				const memberId = randomUUID()

				jest.spyOn(memberRepository, 'findOne').mockReturnValue(member)
				await service.updateRole(memberId, targetRole)

				expect(memberRepository.update).toHaveBeenCalledWith(memberId, { role: targetRole })
			})
		})
	})
	describe('delete', () => {
		describe('when the member is already deleted', () => {
			it('should throw MemberRedundantDeletionException', async () => {
				const member = new Member()
				const memberId = randomUUID()
				member.deleted_at = new Date()
				member.id = memberId

				jest.spyOn(memberRepository, 'findOne').mockReturnValue(member)
				await expect(service.delete(memberId)).rejects.toThrow(MemberRedundantDeletionException)
			})
		})
		describe('otherwise', () => {
			it('should assign the current timestamp to `deleted_at` and set the `role` as null', async () => {
				const member = new Member()
				const memberId = randomUUID()
				member.id = memberId
				member.deleted_at = null

				const mockDate = new Date()
				global.Date = jest.fn(() => mockDate) as any

				jest.spyOn(memberRepository, 'findOne').mockReturnValue(member)
				await service.delete(memberId)
				expect(memberRepository.update).toHaveBeenCalledWith(memberId, { deleted_at: new Date(), role: null })
			})
		})
	})
})
