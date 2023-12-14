import { NestFactory } from '@nestjs/core'
import { MeetingsModule } from './meetings.module'

async function bootstrap() {
	const app = await NestFactory.create(MeetingsModule)
	await app.listen(3000)
}

bootstrap()
