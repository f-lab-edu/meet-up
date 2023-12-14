import { Controller, Get } from '@nestjs/common'
import { MeetingsService } from './meetings.service'

@Controller()
export class MeetingsController {
	constructor(private readonly meetingsService: MeetingsService) {
	}

	@Get()
	getHello(): string {
		return this.meetingsService.getHello()
	}
}
