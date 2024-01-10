import { RolesGuard } from '@app/auth/roles.guard'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'

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
})
