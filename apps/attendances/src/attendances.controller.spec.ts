import { Test, TestingModule } from '@nestjs/testing'
import { AttendancesController } from './attendances.controller'
import { AttendancesService } from './attendances.service'

describe('AttendancesController', () => {
	let attendancesController: AttendancesController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AttendancesController],
			providers: [AttendancesService],
		}).compile()

		attendancesController = app.get<AttendancesController>(AttendancesController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(attendancesController.getHello()).toBe('Hello World!')
		})
	})
})
