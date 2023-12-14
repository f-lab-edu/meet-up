import { Test, TestingModule } from '@nestjs/testing'
import { MeetingsController } from './meetings.controller'
import { MeetingsService } from './meetings.service'

describe('MeetingsController', () => {
	let meetingsController: MeetingsController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [MeetingsController],
			providers: [MeetingsService],
		}).compile()

		meetingsController = app.get<MeetingsController>(MeetingsController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(meetingsController.getHello()).toBe('Hello World!')
		})
	})
})
