import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { MembersModule } from '../src/members.module'
import { Connection } from 'typeorm'
import { resetDatabase } from '../../../test-utils/e2e/reset-database'

describe('MembersController (e2e)', () => {
	let app: INestApplication

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MembersModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	afterAll(async () => {
		const connection = app.get<Connection>(Connection)
		await resetDatabase(connection)
	})

	describe('GET /', () => {
		it('should return 204 "No Content" when no item is in database', () => {
			return request(app.getHttpServer()).get('/').expect(204)
		})
	})
})
