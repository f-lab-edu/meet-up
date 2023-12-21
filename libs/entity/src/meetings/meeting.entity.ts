import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Length, Max, Min } from 'class-validator'
import { Attendance } from '../attendances/attendance.entity'

@Entity('meetings')
export class Meeting {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column()
	@Length(4, 4, { message: 'Year must be 4-digit string' })
	year: string

	@Column({ type: 'integer' })
	@Min(1, { message: 'Week must be greater than 0' })
	@Max(53, { message: 'Week must be less than or equal to 53' })
	week: number

	@Column({ type: 'date' })
	date: Date

	@Column({ default: false })
	canceled: boolean

	@Column()
	note: string

	@OneToMany(() => Attendance, attendance => attendance.meeting)
	attendances: Attendance[]
}
