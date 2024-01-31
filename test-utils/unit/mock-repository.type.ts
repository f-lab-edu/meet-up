import { Repository } from 'typeorm'

export type MockRepositoryType<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
