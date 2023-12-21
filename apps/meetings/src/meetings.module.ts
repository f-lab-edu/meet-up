import { Module } from '@nestjs/common'
import { MeetingsController } from './meetings.controller'
import { MeetingsService } from './meetings.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Meeting } from '../../../libs/entities/src/meetings/meeting.entity'
import { Member } from '../../../libs/entities/src/members/member.entity'
import { Attendance } from '../../../libs/entities/src/attendances/attendance.entity'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

@Module({
	imports: [
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
	],
	controllers: [MeetingsController],
	providers: [MeetingsService],
})
export class MeetingsModule {}
