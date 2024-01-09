import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction): void {
		console.log('Hello from Logger')
		next()
	}
}
