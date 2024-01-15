export class UpdateMemberDto {
	@IsString()
	@IsOptional()
	firstName?: string

	@IsString()
	@IsOptional()
	lastName?: string

	@Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ ]*$/, { message: 'Nickname can only contain alphabetic characters.' })
	@IsString()
	@IsOptional()
	nickname?: string

	@Matches(/^01\d{8,9}$/, { message: 'Provide a valid Korean mobile phone number.' })
	@IsOptional()
	phone?: string
}
