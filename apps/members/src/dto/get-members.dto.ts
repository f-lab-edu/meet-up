import { UpdateMemberDto } from './update-member.dto'
import { IsDateString, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export type DateFilter = {
	created_after?: Date
	created_before?: Date
}

const toDate = ({ value }) => (value ? new Date(value) : value)

export class GetMembersDto extends UpdateMemberDto implements DateFilter {
	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	created_after?: Date

	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	created_before?: Date
}
