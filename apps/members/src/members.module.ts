import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MembersController } from './members.controller'
import { MembersService } from './members.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { Meeting } from '@app/entities/meetings/meeting.entity'
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
		ConfigModule.forFeature(databaseConfig),
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
		TypeOrmModule.forFeature([Member]),
	],
	controllers: [MembersController],
	providers: [MembersService],
})
export class MembersModule implements NestModule {
	configure(consumer: MiddlewareConsumer): any {
		consumer.apply(KebabToCamelConversionMiddleware).forRoutes('*')
		consumer.apply(LoggingMiddleware).forRoutes('*')
	}
}
