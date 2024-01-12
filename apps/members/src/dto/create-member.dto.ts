import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class CreateMemberDto {
	@IsString()
	@IsNotEmpty()
	firstName: string

	@IsString()
	@IsNotEmpty()
	lastName: string

	@Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/, { message: 'Nickname can only contain alphabetic characters.' })
	@IsString()
	nickname: string

	@Matches(/^01\d{8,9}$/, { message: 'Provide a valid Korean mobile phone number.' })
	@IsOptional()
	phone: string
}
