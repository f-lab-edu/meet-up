import { MeetingsService } from './meetings.service'
import { MockRepositoryType } from '../../../test-utils/unit/mock-repository.type'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Meeting } from '@app/entities/meetings/meeting.entity'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '@app/config/database.config'
import { PaginationOptions } from '@app/types/pagination.types'

const createMockRepository = <T = any>(): MockRepositoryType<T> => ({
	findAndCount: jest.fn(),
})

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
			it('should return meetings with the specified pagination options', async () => {
				// Want
				const paginationOptions: PaginationOptions = {
					page: 2,
					limit: 20,
				}
				const { page, limit } = paginationOptions
				const skip = (page - 1) * limit
				const take = limit
				const want = { skip, take }
				// When
				const meetings = Array.from({ length: 10 }, () => new Meeting())
				meetingRepository.findAndCount.mockResolvedValue(meetings)

				// Got
				await service.findAll(paginationOptions)

				// Assert
				expect(meetingRepository.findAndCount).toHaveBeenCalledWith(want)
			})
		})
		describe('otherwise', () => {
			it('should return an array of meetings', async () => {
				// Want
				const want = Array.from({ length: 10 }, () => new Meeting())

				// When
				meetingRepository.findAndCount.mockResolvedValue([want])
				const defaultPagination: PaginationOptions = {
					page: 1,
					limit: 10,
				}

				// Got
				const { items: got } = await service.findAll(defaultPagination)

				// Assert
				expect(got).toEqual(want)
			})
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
