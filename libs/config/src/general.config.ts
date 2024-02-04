import { registerAs } from '@nestjs/config'

export default registerAs('general', () => ({
	stage: process.env.NODE_ENV,
	port: parseInt(process.env.PORT, 10) || 3000,
}))

// todo Ways to validate environment configuration in a forFeature Config in NestJs
// https://dev.to/rrgt19/ways-to-validate-environment-configuration-in-a-forfeature-config-in-nestjs-2ehp
