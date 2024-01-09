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
})
