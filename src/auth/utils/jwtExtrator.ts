import { Request } from 'express';

export const accessTokenExtractor = function (req: Request) {
	console.log('In access token extractor');
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['api-token'];
	}

	return token;
};

export const refreshTokenExtractor = function (req: Request) {
	console.log('In refresh token extractor');
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['auth-token'];
	}

	return token;
};
