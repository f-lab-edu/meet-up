import { HttpStatus } from '@nestjs/common'
import { CustomErrorException } from '@app/exceptions/custom-error.exception'

/**
 * The DeveloperErrorException is a specific type of error which is thrown when a condition or assumption in the developer's code is found to be incorrect during runtime.
 */
export class DeveloperErrorException extends CustomErrorException {
	constructor(message: string, desiredStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
		super(message, desiredStatus)
	}
}
