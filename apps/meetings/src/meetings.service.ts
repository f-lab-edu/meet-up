import { Injectable } from '@nestjs/common'

@Injectable()
export class MeetingsService {
	getHello(): string {
		return 'Hello World!'
	}
}
