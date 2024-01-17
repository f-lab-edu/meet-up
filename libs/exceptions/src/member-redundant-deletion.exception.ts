export class MemberRedundantDeletionException extends Error {
	constructor(id: string) {
		super(`Member with id ${id} cannot be deleted because it is already deleted.`)
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
