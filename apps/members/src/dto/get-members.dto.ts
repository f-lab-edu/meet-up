import { IsDateString, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { MemberDto } from './member.dto'

export type DateFilter = {
	created_after?: Date
	created_before?: Date
}

const toDate = ({ value }) => (value ? new Date(value) : value)

export class GetMembersDto extends MemberDto implements DateFilter {
	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	created_after?: Date

	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	created_before?: Date
}
