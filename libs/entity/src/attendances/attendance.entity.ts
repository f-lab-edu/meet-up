import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('attendances')
export class Attendance {
	@PrimaryGeneratedColumn('uuid')
	id: number
}
