import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Attendance } from '@app/entities/attendances/attendance.entity'

@Injectable()
export class AttendancesService {
	constructor(
		@InjectRepository(Attendance)
		private readonly attendanceRepository: Repository<Attendance>,
	) {}

	getHello(): string {
		return 'Hello World!'
	}
}
