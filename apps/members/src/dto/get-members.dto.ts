import { IsDateString, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { MemberDto } from './member.dto'

export type DateFilter = {
	createdAfter?: Date
	createdBefore?: Date
}

const toDate = ({ value }) => (value ? new Date(value) : value)

export class GetMembersDto extends MemberDto implements DateFilter {
	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	createdAfter?: Date

	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	createdBefore?: Date
}
