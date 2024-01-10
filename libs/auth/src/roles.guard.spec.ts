import { RolesGuard } from '@app/auth/roles.guard'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { Role } from '@app/entities/members/role.enums'

describe('RolesGuard', () => {
	let guard: RolesGuard
	let reflector: Reflector

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [RolesGuard, Reflector],
		}).compile()

		guard = module.get<RolesGuard>(RolesGuard)
		reflector = module.get<Reflector>(Reflector)
	})

	it('should be defined', () => {
		expect(guard).toBeDefined()
	})
	it('should grant access if no roles are required', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined)

		// The context object is cast to unknown before being cast to ExecutionContext. This is a way to bypass the TypeScript compiler's type checks because it is assumed that the developer has ensured that the mock context object is correct.
		const context = {
			switchToHttp: () => ({ getRequest: () => ({ user: { role: Role.ADMIN } }) }),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		} as unknown as ExecutionContext

		expect(guard.canActivate(context)).toBe(true)
	})
	it('should grant access if user has the required role or higher', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(Role.CERTIFIED)

		const context = {
			switchToHttp: () => ({ getRequest: () => ({ user: { role: Role.ADMIN } }) }),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		} as unknown as ExecutionContext

		expect(guard.canActivate(context)).toBe(true)
	})
	it.todo('should deny access if user does not have the required role or higher')
})
