import { Controller, Get } from '@nestjs/common'
import { AttendancesService } from './attendances.service'

@Controller()
export class AttendancesController {
	constructor(private readonly attendancesService: AttendancesService) {}

	@Get()
	getHello(): string {
		return this.attendancesService.getHello()
	}
}
