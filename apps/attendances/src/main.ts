import { NestFactory } from '@nestjs/core'
import { AttendancesModule } from './attendances.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AttendancesModule)
	const configService = app.get(ConfigService)

	await app.listen(configService.get('PORT'))
}

bootstrap()
