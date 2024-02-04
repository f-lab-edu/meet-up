import { KebabToCamelConversionMiddleware } from '@app/middlewares/kebab-to-camel-conversion.middleware'
import { Request, Response } from 'express'

describe('KebabToCamelConversionMiddleware', () => {
	let middleware: KebabToCamelConversionMiddleware

	beforeEach(() => {
		middleware = new KebabToCamelConversionMiddleware()
	})
	it('should convert kebab-case to camelCase in the query parameters', () => {
		const request = {
			query: {
				'kebab-case': 'value',
			},
		} as unknown as Request

		const nextMock = jest.fn()

		middleware.use(request, {} as Response, nextMock)

		expect(request.query['kebab-case']).toBeUndefined()
		expect(request.query.kebabCase).toEqual('value')
		expect(nextMock).toHaveBeenCalled()
	})
})
