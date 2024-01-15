import { IsNotEmpty } from 'class-validator'
import { MemberDto } from './member.dto'

export class CreateMemberDto extends MemberDto {
	@IsNotEmpty()
	firstName: string

	@IsNotEmpty()
	lastName: string

	nickname: string

	@IsNotEmpty()
	phone: string
}
