import { Injectable } from '@nestjs/common'

@Injectable()
export class EntitiesService {
	helloWorld(): string {
		return 'Hello World!'
	}
}
