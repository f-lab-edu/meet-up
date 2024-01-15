export class MemberNotFoundException extends Error {
	constructor(id: string) {
		super(`Member with id ${id} not found`)
	}
}
