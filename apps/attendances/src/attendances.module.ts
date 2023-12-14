import { Module } from '@nestjs/common'
import { AttendancesController } from './attendances.controller'
import { AttendancesService } from './attendances.service'

@Module({
	imports: [],
	controllers: [AttendancesController],
	providers: [AttendancesService],
})
export class AttendancesModule {
}
