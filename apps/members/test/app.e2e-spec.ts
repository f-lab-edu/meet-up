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
			// Adding new rows to members table
			const member1 = new Member()
			member1.firstName = 'John'
			member1.lastName = 'Doe'
			member1.nickname = 'JD'
			member1.phone = '01012345678'
			const member2 = new Member()
			member2.firstName = 'Jane'
			member2.lastName = 'Smith'
			member2.nickname = 'JS'
			member2.phone = '01012345677'
			await memberRepository.save([member1, member2])

			// Query the members table
			const members = await memberRepository.find()
			expect(members.length).toBe(2)

			return request(app.getHttpServer()).get('/').expect(200)
		})
	})
})
