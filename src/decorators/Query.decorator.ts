import {
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
} from '@nestjs/common';

export const QueryRequired = createParamDecorator(
	(key: string, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();

		const value = request.query[key];

		if (value) {
			return value;
		}

		throw new BadRequestException(`Missing required query param: '${key}'`);
	},
);
