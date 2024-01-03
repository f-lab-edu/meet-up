import { Module } from '@nestjs/common'
import { MembersController } from './members.controller'
import { MembersService } from './members.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from '@app/entities/members/member.entity'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Attendance } from '@app/entities/attendances/attendance.entity'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		ConfigModule.forRoot({ ignoreEnvFile: true }),
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
		TypeOrmModule.forFeature([Member]),
	],
	controllers: [MembersController],
	providers: [MembersService],
})
export class MembersModule {}
