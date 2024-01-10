import { MembersService } from './members.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { Repository } from 'typeorm'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({})

describe('MembersService', () => {
	let service: MembersService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MembersService,
				{
					provide: getRepositoryToken(Member),
					useValue: createMockRepository(),
				},
			],
		}).compile()

		service = module.get<MembersService>(MembersService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('findAll', () => {
		describe('when there is no record in members table', () => {
			it.todo('should return an empty array')
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
		describe('otherwise', () => {
			it.todo('should not return the deleted members')
			it.todo('should return the array of members')
		})
	})
	describe('findOne', () => {
		describe.each([
			{ column: 'id', value: 'todo' },
			{
				column: 'phone',
				value: '01012345678',
			},
		])('when querying by a value of the specific column', ({ column, value }) => {
			it.todo(`should return the member with ${column} value of ${value}`)
		})
		// Each combination of nickname and lastName among members must be unique.
		describe('when querying by nickname and lastName', () => {
			it.todo('should return the member with the nickname and lastName')
		})
	})
	describe('create', () => {
		describe('when duplicate phone number exists', () => {
			it.todo('should throw an error')
		})
		describe('when duplicate member with the same nickname and lastName combination exists', () => {
			it.todo('should throw an error')
		})
		// todo update these 3 fields to required columns
		describe.each(['firstName', 'lastName', 'phone'])('when %s column is missing', () => {
			it.todo('should throw an error')
		})
		describe('otherwise', () => {
			it.todo('should create a new member')
		})
	})
	describe('update', () => {
		// todo 질문: transaction 을 통해서 find -> 없으면 update 하는게 나은지 아니면 update 에서 검사해주는게 나은지
		describe('when updating phone number which is duplicate', () => {
			it.todo('should throw an error')
		})
		describe('when updating either nickname, lastName, or both, the resulting combination must no create a duplicate', () => {
			it.todo('should throw an error')
		})
		describe.each(['id', 'role', 'attendances'])('when trying to update the column %s', () => {
			it.todo('should throw an error')
		})
		describe('otherwise', () => {
			it.todo('should update the member')
		})
	})
	describe('delete', () => {
		describe('when the member is already deleted', () => {
			it.todo('should throw an error')
		})
		describe('otherwise', () => {
			it.todo('should delete the member')
		})
	})
})
