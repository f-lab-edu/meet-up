import { Injectable } from '@nestjs/common'

@Injectable()
export class EntityService {
	helloWorld(): string {
		return 'Hello World!'
	}
}
