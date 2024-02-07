import { NestFactory } from '@nestjs/core'
import { MeetingsModule } from './meetings.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(MeetingsModule)
	const configService = app.get(ConfigService)

	await app.listen(configService.get('PORT'))
}

bootstrap()
