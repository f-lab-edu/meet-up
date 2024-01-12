export class DuplicateMemberException extends Error {
	constructor() {
		super('A member with the same nickname and last name already exists.')
	}
}
