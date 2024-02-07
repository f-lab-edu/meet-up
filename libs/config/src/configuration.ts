export default () => ({
	stage: process.env.NODE_ENV,
	port: parseInt(process.env.PORT, 10) || 80,
	database: process.env.DB_TYPE || 'postgres',
	databasePort: process.env.DB_PORT || 5432,
	databaseHost: process.env.DB_HOST || 'localhost',
})
