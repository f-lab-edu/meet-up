import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { randomUUID } from 'crypto'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP', { timestamp: true })

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, originalUrl, ip } = req
		const userAgent = req.get('user-agent') ?? ''
		const traceId = randomUUID()

		res.on('finish', () => {
			const { statusCode } = res
			const contentLength = res.get('content-length')

			this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${traceId}`)
		})

		next()
	}
}
