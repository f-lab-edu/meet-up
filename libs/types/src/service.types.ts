/**
 * @file This file contains type definitions used in the service layer.
 */

import { AbstractEntity } from '@app/entities/common/abstract.entity'
import { FindOperator } from 'typeorm'

// These additional filters are explicitly declared as other filters are keys of an entity.
/**
 * DateFilters is a type defining date range constraint parameters for service layer methods.
 */
type DateFilters = {
	createdAfter?: Date
	createdBefore?: Date
}

/**
 * Filters is a type representing a set of generic filters mainly used in service layer methods like `findAll` and its related methods.
 * The type is designed to exclude date-centric keys `created_at`, `updated_at` and `deleted_at` as exact matches for these keys are not practical.
 * By incorporating DateFilters, this model supports range filters on these dates.
 */
export type Filters<T extends AbstractEntity> = {
	[K in keyof Omit<T, 'created_at' | 'updated_at' | 'deleted_at'>]?: T[K]
} & DateFilters

/**
 * WhereCondition is a type that models the set of conditions applied in the `where` clause in service layer methods.
 */
export type WhereCondition<T extends AbstractEntity> = Filters<T> & {
	created_at?: FindOperator<Date>
	updated_at?: FindOperator<Date>
	deleted_at?: FindOperator<Date>
}
