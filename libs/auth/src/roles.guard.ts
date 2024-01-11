import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@app/entities/members/role.enums'
import { ROLES_KEY } from '@app/auth/roles.decorators'

// todo move this interface somewhere else
interface User {
	roles: Role[]
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
		if (!requiredRoles) {
			return true
		}

		const { user } = context.switchToHttp().getRequest() as { user: User }
		return requiredRoles.some(role => user.roles?.includes(role))
	}
}
