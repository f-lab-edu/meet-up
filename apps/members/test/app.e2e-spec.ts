import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { MembersModule } from '../src/members.module'
import { Connection, Repository } from 'typeorm'
import { resetDatabase } from '../../../test-utils/e2e/reset-database'
import { Member } from '@app/entities/members/member.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('MembersController (e2e)', () => {
	let app: INestApplication
	let memberRepository: Repository<Member>

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MembersModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()

		memberRepository = moduleFixture.get(getRepositoryToken(Member))
	})

	afterAll(async () => {
		const connection = app.get<Connection>(Connection)
		await resetDatabase(connection)
	})

	describe('GET /', () => {
		it('should return 204 "No Content" when no item is in database', () => {
			return request(app.getHttpServer()).get('/').expect(204)
		})
		it('should return 200 "OK" when item is in database', async () => {
			// Generate and save members to the database
			const members = generateMembers(2)
			await memberRepository.save(members)

			// Send a GET request to the server
			const response = await request(app.getHttpServer()).get('/')

			// Check the HTTP status and the length of the response body
			expect(response.status).toBe(200)
			expect(response.body.length).toBe(2)
		})
	})
})

/**
 * Generates an array of Member objects
 * @param {number} count - The number of Member objects to generate. Must be a positive integer.
 * @returns {Member[]} An array of Member objects.
 * @throws {Error} Will throw an error if count is not a positive number.
 */
function generateMembers(count: number): Member[] {
	if (count <= 0) {
		throw new Error(`Count must be a positive number. Received: ${count}`)
	}

	return Array.from({ length: count }, (_, i) => {
		const member = new Member()
		member.firstName = `First${i}`
		member.lastName = `Last${i}`
		member.nickname = `Nickname${i}`
		member.phone = `010${String(i).padStart(8, '0')}`
		return member
	})
}
