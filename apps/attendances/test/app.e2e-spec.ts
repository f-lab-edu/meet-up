import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AttendancesModule } from '../src/attendances.module'
import { resetDatabase } from '../../../test-utils/e2e/reset-database'
import { Connection } from 'typeorm'

describe('AttendancesController (e2e)', () => {
	let app: INestApplication

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AttendancesModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	afterAll(async () => {
		const connection = app.get<Connection>(Connection)
		await resetDatabase(connection)
	})

	it('/ (GET)', () => {
		return request(app.getHttpServer()).get('/').expect(200)
	})
})
