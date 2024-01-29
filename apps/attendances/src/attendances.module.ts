import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AttendancesController } from './attendances.controller'
import { AttendancesService } from './attendances.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Member } from '@app/entities/members/member.entity'
import { Attendance } from '@app/entities/attendances/attendance.entity'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config'
import configuration from '@app/config/configuration'
import { LoggingMiddleware } from '@app/log/logging.middleware'
import { KebabToCamelConversionMiddleware } from '@app/middlewares'
import databaseConfig from '@app/config/database.config'

@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration], ignoreEnvFile: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (databaseConfiguration: ConfigType<typeof databaseConfig>) => ({
				type: 'postgres',
				host: databaseConfiguration.host,
				port: databaseConfiguration.port,
				username: 'postgres',
				password: 'postgres',
				database: 'postgres',
				entities: [Meeting, Member, Attendance],
				synchronize: true,
				namingStrategy: new SnakeNamingStrategy(),
			}),
		}),
		TypeOrmModule.forFeature([Attendance]),
	],
	controllers: [AttendancesController],
	providers: [AttendancesService],
})
export class AttendancesModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(KebabToCamelConversionMiddleware).forRoutes('*')
		consumer.apply(LoggingMiddleware).forRoutes('/')
	}
}
