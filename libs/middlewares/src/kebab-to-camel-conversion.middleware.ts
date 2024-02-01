import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class KebabToCamelConversionMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		for (const kebabCaseKey in req.query) {
			const camelCaseKey = this.kebabToCamel(kebabCaseKey)
			req.query[camelCaseKey] = req.query[kebabCaseKey]
			if (camelCaseKey !== kebabCaseKey) {
				delete req.query[kebabCaseKey]
			}
		}
		next()
	}

	private kebabToCamel(str: string): string {
		return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
	}
}
