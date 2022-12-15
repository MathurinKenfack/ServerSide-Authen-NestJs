export const AUH_URL =
	process.env.SITE_DOMAIN +
	':' +
	(process.env.NEST_PORT ? process.env.NEST_PORT : '3000');
export const LOGIN_URL = AUH_URL + '/auth/login';
export const LOUGOUT_URL = AUH_URL + '/auth/logout';
export const GOOGLE_URL = AUH_URL + '/auth/google';
export const HOME_URL = AUH_URL + '/welcome';
export const STATUS_URL = AUH_URL + '/auth/status';
export const SEND_RESET_MAIL = AUH_URL + '/auth/forgot_password';
export const FORGOT_PASSWORD_URL = AUH_URL + '/forgot_password';
export const RESET_PASSWORD_URL = AUH_URL + '/auth/user/reset_password';

export const loginAction = {
	actionUrl: LOGIN_URL,
	googleUrl: GOOGLE_URL,
	forgotPasswordUrl: FORGOT_PASSWORD_URL,
	key: process.env.RECAPTCHA_SITE_KEY_TEST,
};

export const logoutAction = {
	url: LOUGOUT_URL,
	redirect: STATUS_URL,
};

export const redirectAction = {
	homeUrl: HOME_URL,
};
