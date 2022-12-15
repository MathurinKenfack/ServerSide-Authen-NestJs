import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP_USER');
	use(req: Request, res: Response, next: NextFunction) {
		this.logger.log(
			`Logger HTTP user request: ${req.method}: ${req.originalUrl}  > ${res.statusCode}`,
		);
		next();
	}
}
