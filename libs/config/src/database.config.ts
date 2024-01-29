import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
	type: process.env.DB_TYPE || 'postgres',
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	host: process.env.DB_HOST || 'localhost',
}))
