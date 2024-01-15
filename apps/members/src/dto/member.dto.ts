import { IsOptional, IsString, Matches } from 'class-validator'

export abstract class MemberDto {
	@IsString()
	@IsOptional()
	firstName?: string

	@IsString()
	@IsOptional()
	lastName?: string

	@IsString()
	@IsOptional()
	@Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/, { message: 'Nickname can only contain alphabetic characters.' })
	nickname?: string

	@IsString()
	@IsOptional()
	@Matches(/^01\d{8,9}$/, { message: 'Provide a valid Korean mobile phone number.' })
	phone?: string
}
