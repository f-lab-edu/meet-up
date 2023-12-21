import { Module } from '@nestjs/common'
import { MembersController } from './members.controller'
import { MembersService } from './members.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from '../../../libs/entities/src/members/member.entity'
import { Meeting } from '../../../libs/entities/src/meetings/meeting.entity'
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
	controllers: [MembersController],
	providers: [MembersService],
})
export class MembersModule {}
