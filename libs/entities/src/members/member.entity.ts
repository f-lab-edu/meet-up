import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Attendance } from '../attendances/attendance.entity'
import { AbstractEntity } from '../common/abstract.entity'
import { Role } from '@app/entities/members/role.enums'

@Entity('members')
export class Member extends AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'enum',
		enum: Role,
		default: Role.UNCERTIFIED,
	})
	role: Role

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
