import { MemberDto } from './member.dto'

export class UpdateMemberDto extends MemberDto {
	firstName?: string

	lastName?: string

	nickname?: string

	phone?: string

	// todo create member dto also requires it

	created_at?: never

	updated_at?: never

	deleted_at?: never
}
