import { Test, TestingModule } from '@nestjs/testing'
import { MeetingsController } from './meetings.controller'
import { MeetingsService } from './meetings.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({})
describe('MeetingsController', () => {
	let meetingsController: MeetingsController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [MeetingsController],
			providers: [
				MeetingsService,
				{
					provide: getRepositoryToken(Meeting),
					useValue: createMockRepository(),
				},
			],
		}).compile()

		meetingsController = app.get<MeetingsController>(MeetingsController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(meetingsController.getHello()).toBe('Hello World!')
		})
	})
})
