import { MembersService } from './members.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { IsNull, Not, Repository } from 'typeorm'
import { HttpException, HttpStatus } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { CreateMemberDto } from './dto/create-member.dto'
import { DuplicateMemberException } from '@app/exceptions/duplicate-member.exception'
import { ConfigModule } from '@nestjs/config'
import Configuration from '@app/config/configuration'
import { UpdateMemberDto } from './dto/update-member.dto'
import { MemberNotFoundException } from '@app/exceptions/member-not-found.exception'
import { NonSequentialRoleUpdateException } from '@app/exceptions/non-sequential-role-update.exception'
import { Role } from '@app/entities/members/role.enums'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({
	find: jest.fn(),
	findOneBy: jest.fn(),
	save: jest.fn(),
	update: jest.fn(),
})

describe('MembersService', () => {
	let service: MembersService
	let memberRepository: MockRepository

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MembersService,
				{
					provide: getRepositoryToken(Member),
					useValue: createMockRepository(),
				},
			],
			imports: [ConfigModule.forRoot({ load: [Configuration] })],
		}).compile()

		service = module.get<MembersService>(MembersService)
		memberRepository = module.get<MockRepository>(getRepositoryToken(Member))
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
		// This case is written separately from other tests on querying by a specific column.
		// It is because the entire enum has to be tested.
		describe.each([{ role: 'ROOT' }, { role: 'ADMIN' }, { role: 'CERTIFIED' }, { role: 'UNCERTIFIED' }])('when querying by role', ({ role }) => {
			it.todo(`should return the array of members with the role of ${role}`)
		})
		// Phone column is not included as it contains unique values.
		// todo change phone column to unique.
		describe.each([
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
			it.todo(`should return the array of members with the ${column} of ${value}`)
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
			it.todo('should return the array of members who has participated the last meeting')
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

				const mockConfigService = { get: jest.fn() } as any
				mockConfigService.get.mockReturnValue('postgres')

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

				const mockConfigService = { get: jest.fn() } as any
				mockConfigService.get.mockReturnValue('postgres')

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
				const memberId = randomUUID()
				const currentRole = MemberRole.UNCERTIFIED
				const targetRole = MemberRole.ADMIN

				await expect(service.updateRole(memberId, currentRole, targetRole)).rejects.toThrow(NonSequentialRoleUpdateException)
			})
		})
		describe('when the provided ID does not exist in the database', () => {
			it('should throw a MemberNotFoundException', async () => {
				const memberId = randomUUID()
				const role = MemberRole.CERTIFIED

				await expect(service.updateRole(memberId, role)).rejects.toThrow(MemberNotFoundException)
			})
		})
		describe('otherwise', () => {
			it('should update the role of the member', async () => {
				const memberId = randomUUID()
				const role = MemberRole.CERTIFIED

				await service.updateRole(memberId, role)

				expect(memberRepository.update).toHaveBeenCalledWith(memberId, { role })
			})
		})
	})
	describe('delete', () => {
		describe('when deleting a member, its role must become null')
		describe('when the member is already deleted', () => {
			it.todo('should throw an error')
		})
		describe('otherwise', () => {
			it.todo('should delete the member')
		})
	})
})
