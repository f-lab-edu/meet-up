import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Attendance } from '../attendances/attendance.entity'

export enum MemberRole {
	ADMIN = 'admin',
	CERTIFIED = 'certified',
	UNCERTIFIED = 'uncertified',
}

@Entity('members')
export class Member {
	@PrimaryGeneratedColumn('uuid')
	id: number

	@Column({
		type: 'enum',
		enum: MemberRole,
		default: MemberRole.UNCERTIFIED,
	})
	role: MemberRole

	@Column()
	firstName: string

	@Column()
	lastName: string

	@Column()
	nickname: string

	@Column()
	phone: string

	@OneToMany(() => Attendance, attendance => attendance.member)
	attendances: Attendance[]
}
