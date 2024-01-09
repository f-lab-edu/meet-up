import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AttendancesController } from './attendances.controller'
import { AttendancesService } from './attendances.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Member } from '@app/entities/members/member.entity'
import { Attendance } from '@app/entities/attendances/attendance.entity'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { ConfigModule } from '@nestjs/config'
import configuration from '@app/config/configuration'
import { LoggingMiddleware } from '@app/log/logging.middleware'

@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration], ignoreEnvFile: true }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'database',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'postgres',
			entities: [Meeting, Member, Attendance],
			synchronize: true,
			namingStrategy: new SnakeNamingStrategy(),
		}),
		TypeOrmModule.forFeature([Attendance]),
	],
	controllers: [AttendancesController],
	providers: [AttendancesService],
})
export class AttendancesModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes('/')
	}
}
