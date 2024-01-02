import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class AbstractEntity {
	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	created_at: Date

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
		nullable: true,
	})
	updated_at: Date

	@DeleteDateColumn({ type: 'timestamp', nullable: true })
	deleted_at: Date | null
}
