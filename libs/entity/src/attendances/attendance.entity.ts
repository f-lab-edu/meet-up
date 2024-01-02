import { Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { Meeting } from '../meetings/meeting.entity'
import { Member } from '../members/member.entity'
import { AbstractEntity } from '../common/abstract.entity'

@Entity('attendances')
export class Attendance extends AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	id: number

	@ManyToOne(() => Meeting, meeting => meeting.attendances)
	meeting: Relation<Meeting>

	@ManyToOne(() => Member, member => member.attendances)
	member: Relation<Member>
}
