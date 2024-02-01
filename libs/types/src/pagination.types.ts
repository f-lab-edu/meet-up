import { AbstractEntity } from '@app/entities/common/abstract.entity'

export type PaginationOptions = {
	page: number
	limit: number
}

export type PaginationResult<Entity extends AbstractEntity> = {
	items: Entity[]
	total: number
	page: number
	limit: number
	totalPages: number
}
