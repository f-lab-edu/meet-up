import { IsDateString, IsOptional, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Transform } from 'class-transformer'
import { MemberDto } from './member.dto'
import { DeveloperErrorException } from '@app/exceptions'

export type DateFilter = {
	createdAfter?: Date
	createdBefore?: Date
}

const toDate = ({ value }) => (value ? new Date(value) : value)

@ValidatorConstraint({ name: 'IsBefore', async: false })
class IsBeforeConstraint implements ValidatorConstraintInterface {
	validate(value: any, validationArguments?: ValidationArguments): boolean {
		const [targetKey] = validationArguments.constraints
		if (!(targetKey in validationArguments.object))
			throw new DeveloperErrorException(`Validation failed: ${targetKey} does not exist in the validated class.`)
		const targetValue = validationArguments.object[targetKey]
		return targetValue < value
	}
}

export class GetMembersDto extends MemberDto implements DateFilter {
	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	@Validate(IsBeforeConstraint, ['createdBefore'], { message: 'The "created-after" date must be earlier than "created-before" date' })
	createdAfter?: Date

	@IsOptional()
	@IsDateString()
	@Transform(toDate)
	createdBefore?: Date
}
