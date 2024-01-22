import { Role } from '@app/entities/members/role.enums'

export class NonSequentialRoleUpdateException extends Error {
	constructor(currentRole: Role, attemptedRole: Role) {
		super(`Cannot update from the current role '${currentRole}' directly to the role '${attemptedRole}' as they are non-adjacent roles.`)
		// This line below is needed to preserve the correct stack trace in the error message.
		// It sets the prototype explicitly.
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
