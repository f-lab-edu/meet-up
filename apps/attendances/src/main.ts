import { NestFactory } from '@nestjs/core'
import { AttendancesModule } from './attendances.module'

async function bootstrap() {
	const app = await NestFactory.create(AttendancesModule)
	await app.listen(3000)
}

bootstrap()
