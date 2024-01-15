import { MemberRole } from '@app/entities/members/member.entity'

export class NonSequentialRoleUpdateException extends Error {
	constructor(currentRole: MemberRole, attemptedRole: MemberRole) {
		super(`Cannot update from the current role '${currentRole}' directly to the role '${attemptedRole}' as they are non-adjacent roles.`)
		// This line below is needed to preserve the correct stack trace in the error message.
		// It sets the prototype explicitly.
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
