export const AUH_URL =
  process.env.SITE_DOMAIN +
  ':' +
  (process.env.NEST_PORT ? process.env.NEST_PORT : '3000') +
  '/';
export const LOGIN_URL =
  process.env.SITE_DOMAIN +
  ':' +
  (process.env.NEST_PORT ? process.env.NEST_PORT : '3000') +
  '/auth/login';
export const LOUGOUT_URL =
  process.env.SITE_DOMAIN +
  ':' +
  (process.env.NEST_PORT ? process.env.NEST_PORT : '3000') +
  '/auth/logout';
export const GOOGLE_URL =
  process.env.SITE_DOMAIN +
  ':' +
  (process.env.NEST_PORT ? process.env.NEST_PORT : '3000') +
  '/auth/google';

export const HOME_URL =
  process.env.SITE_DOMAIN + ':' + process.env.NEST_PORT + '/welcome';

export const STATUS_URL =
  process.env.SITE_DOMAIN + ':' + process.env.NEST_PORT + '/auth/status';

export const loginAction = {
  actionUrl: LOGIN_URL,
  googleUrl: GOOGLE_URL,
  key: process.env.RECAPTCHA_SITE_KEY,
};

export const logoutAction = {
  url: LOUGOUT_URL,
  redirect: STATUS_URL,
};

export const redirectAction = {
  homeUrl: HOME_URL,
};
