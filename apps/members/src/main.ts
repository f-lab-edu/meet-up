import { NestFactory } from '@nestjs/core'
import { MembersModule } from './members.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(MembersModule)
	const configService = app.get(ConfigService)

	await app.listen(configService.get('PORT'))
}

bootstrap()
