import { MemberDto } from './member.dto'

export class UpdateMemberDto extends MemberDto {
	firstName?: string

	lastName?: string

	nickname?: string

	phone?: string
}
