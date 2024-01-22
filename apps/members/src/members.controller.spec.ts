import { Test, TestingModule } from '@nestjs/testing'
import { MembersController } from './members.controller'
import { MembersService } from './members.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { ConfigModule } from '@nestjs/config'
import Configuration from '@app/config/configuration'

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
			imports: [ConfigModule.forRoot({ load: [Configuration] })],
		}).compile()

		membersController = app.get<MembersController>(MembersController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(membersController.getHello()).toBe('Hello World!')
		})
	})
})
