import { Module } from '@nestjs/common'
import { AttendancesController } from './attendances.controller'
import { AttendancesService } from './attendances.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { Member } from '@app/entities/members/member.entity'
import { Attendance } from '@app/entities/attendances/attendance.entity'
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
		TypeOrmModule.forFeature([Attendance]),
	],
	controllers: [AttendancesController],
	providers: [AttendancesService],
})
export class AttendancesModule {}
