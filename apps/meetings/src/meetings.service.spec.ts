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

	describe('findAll', () => {
		describe('with no records', () => {
			it.todo('should return an empty array')
		})
		describe('when querying by specific column values', () => {
			it.todo('should return meetings matching the queried column values')
		})
		describe('when querying by a date of meetings', () => {
			it.todo('should return meetings after a specific date')
			it.todo('should return meetings before a specific date')
			it.todo('should return meetings between a specific start and end date')
		})
		describe('when querying with pagination', () => {
			it.todo('should return paginated meetings')
		})
		describe('otherwise', () => {
			it.todo('should return an array of meetings')
		})
	})
	describe('findOne', () => {
		describe('when querying by ID', () => {
			it.todo('should return the meeting with the matching ID')
		})
	})
	describe('create', () => {
		describe('when duplicate meeting exists', () => {
			it.todo('should throw an error')
		})
		describe('otherwise', () => {
			it.todo('should create a new meeting')
		})
	})
	describe('updateTopics', () => {
		describe('when invalid topic IDs are provided', () => {
			it.todo('should throw an error')
		})
		describe('when excess topic IDs are provided', () => {
			it.todo('should throw an error')
		})
		describe('when topic IDs are already in use', () => {
			it.todo('should throw an error')
		})
		describe('otherwise', () => {
			it.todo('should update topics')
		})
	})
	describe('updateNote', () => {
		it.todo('should update meeting note')
	})
	describe('cancel', () => {
		describe('when meeting is already cancelled', () => {
			it.todo('should throw an error')
		})
		describe('when canceling past meeting', () => {
			it.todo('should throw an error')
		})
		describe('when invalid meeting ID is provided', () => {
			it.todo('should throw an error')
		})
		describe('otherwise', () => {
			it.todo('should cancel meeting')
		})
	})
	describe('getAttendees', () => {
		describe('when an invalid meeting ID is provided', () => {
			it.todo('should throw an error')
		})
		describe('when there is are no attendees', () => {
			it.todo('should return an empty array')
		})
		describe('otherwise', () => {
			it.todo('should return an array of members')
		})
	})
})
