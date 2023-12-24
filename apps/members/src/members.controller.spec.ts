import { Test, TestingModule } from '@nestjs/testing'
import { MembersController } from './members.controller'
import { MembersService } from './members.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({})
describe('MembersController', () => {
	let membersController: MembersController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [MembersController],
			providers: [
				MembersService,
				{
					provide: getRepositoryToken(Member),
					useValue: createMockRepository(),
				},
			],
		}).compile()

		membersController = app.get<MembersController>(MembersController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(membersController.getHello()).toBe('Hello World!')
		})
	})
})
