export enum Role {
	ROOT,
	ADMIN,
	CERTIFIED,
	UNCERTIFIED,
}

// Role enum as an array of its values. Consider moving it to /test dir
export const roles = [Role.ROOT, Role.ADMIN, Role.CERTIFIED, Role.UNCERTIFIED]
