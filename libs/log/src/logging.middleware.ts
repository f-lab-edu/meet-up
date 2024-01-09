import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP', { timestamp: true })

	use(req: Request, res: Response, next: NextFunction): void {
		res.on('finish', () => {
			this.logger.log('Hello from Logger')
		})
		next()
	}
}
