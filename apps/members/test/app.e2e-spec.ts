import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { MembersModule } from '../src/members.module'
import { Connection, Repository } from 'typeorm'
import { resetDatabase } from '../../../test-utils/e2e/reset-database'
import { Member } from '@app/entities/members/member.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { roles } from '@app/entities/members/role.enums'

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

		// This case is written separately from other tests on querying by a specific column.
		// It is because the entire enum has to be tested.
		describe.each(roles)('when querying by role', role => {
			it(`should return the array of members with the role of ${role}`, async () => {
				// Generate 100 members with random roles
				const members = generateMembers(100).map(m => {
					m.role = roles[Math.floor(Math.random() * roles.length)]
					return m
				})

				// Save members to the database
				await memberRepository.save(members)

				// Query the members with the specified role
				const response = await request(app.getHttpServer()).get(`/?role=${role}`)

				// Check the HTTP status and the length of the response body
				expect(response.status).toBe(200)
				expect(response.body.every(m => m.role === role)).toBeTruthy()
			})
		})

		type ColumnValuePair = {
			column: keyof Member
			value: any // Can be any valid value for a member's column
		}

		describe.each<ColumnValuePair>([
			{
				column: 'firstName',
				value: 'First50', // value from generateMembers function
			},
			{
				column: 'lastName',
				value: 'Last50', // value from generateMembers function
			},
			{
				column: 'nickname',
				value: 'Nickname50', // value from generateMembers function
			},
			// Add more filters as needed
		])('when querying by a specific column', ({ column, value }) => {
			it(`should return the array of members with the ${column} of ${value}`, async () => {
				// Send a GET request with the filter to the server
				const response = await request(app.getHttpServer()).get(`/?${column}=${value}`)

				// Check the HTTP status
				expect(response.status).toBe(200)

				// Check if all members in the response have the expected value for the specified column
				expect(response.body.every((m: Member) => m[column] === value)).toBeTruthy()
			})
		})
		it('should return 200 "OK" when item is in database', async () => {
			// Send a GET request to the server
			const response = await request(app.getHttpServer()).get('/')

			// Check the HTTP status and the length of the response body
			expect(response.status).toBe(200)
			expect(response.body.length).not.toBe(0)
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
