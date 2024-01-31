import { MeetingsService } from './meetings.service'
import { MockRepositoryType } from '../../../test-utils/unit/mock-repository.type'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '@app/config/database.config'

const createMockRepository = <T = any>(): MockRepositoryType<T> => ({})

describe('MeetingsService', () => {
	let service: MeetingsService
	let meetingRepository: MockRepositoryType

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MeetingsService,
				{
					provide: getRepositoryToken(Meeting),
					useValue: createMockRepository(),
				},
			],
			imports: [ConfigModule.forRoot({}), ConfigModule.forFeature(databaseConfig)],
		}).compile()

		service = module.get<MeetingsService>(MeetingsService)
		meetingRepository = module.get<MockRepositoryType>(getRepositoryToken(Meeting))
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
