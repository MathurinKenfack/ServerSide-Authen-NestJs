import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP');
	use(req: Request, res: Response, next: NextFunction) {
		this.logger.log(
			`Logger HTTP request: ${req.method}: ${req.originalUrl}  > ${res.statusCode}`,
		);
		next();
	}
}
