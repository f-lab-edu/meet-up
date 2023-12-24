import { Test, TestingModule } from '@nestjs/testing'
import { AttendancesController } from './attendances.controller'
import { AttendancesService } from './attendances.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Attendance } from '@app/entities/attendances/attendance.entity'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({})
describe('AttendancesController', () => {
	let attendancesController: AttendancesController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AttendancesController],
			providers: [
				AttendancesService,
				{
					provide: getRepositoryToken(Attendance),
					useValue: createMockRepository(),
				},
			],
		}).compile()

		attendancesController = app.get<AttendancesController>(AttendancesController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(attendancesController.getHello()).toBe('Hello World!')
		})
	})
})
