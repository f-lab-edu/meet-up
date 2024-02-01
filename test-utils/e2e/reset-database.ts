import { Connection } from 'typeorm'

export async function resetDatabase(connection: Connection) {
	const entities = connection.entityMetadatas
	for (const entity of entities) {
		const repository = connection.getRepository(entity.name)
		await repository.query(`TRUNCATE ${entity.tableName} CASCADE;`)
	}
}
