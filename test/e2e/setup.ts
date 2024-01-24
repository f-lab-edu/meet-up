import { GenericContainer, Wait } from 'testcontainers'

export default async () => {
	const dbPort = 5433 // Not to conflict with locally running Docker container
	process.env.DB_PORT = dbPort.toString()

	globalThis.__CONTAINER__ = await new GenericContainer('postgres')
		.withEnvironment({
			POSTGRES_PASSWORD: 'postgres',
		})
		.withUser('postgres')
		.withExposedPorts({
			container: 5432,
			host: +dbPort,
		})
		.withLogConsumer(stream => {
			stream.on('data', line => console.log(line))
			stream.on('err', line => console.error(line))
			stream.on('end', () => console.log('Stream closed'))
		})
		.withHealthCheck({
			test: ['CMD-SHELL', 'pg_isready -U postgres'],
			interval: 1000,
			retries: 10,
		})
		.withWaitStrategy(Wait.forHealthCheck())
		// .withNetworkAliases('database')
		.start()
}
