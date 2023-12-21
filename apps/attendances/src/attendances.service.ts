import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Attendance } from '../../../libs/entity/src/attendances/attendance.entity'
import { Repository } from 'typeorm'

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
