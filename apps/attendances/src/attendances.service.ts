import { Injectable } from '@nestjs/common'

@Injectable()
export class AttendancesService {
	getHello(): string {
		return 'Hello World!'
	}
}
