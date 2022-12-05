export const LOGIN_URL =
  'http://localhost:' +
  (process.env.NEST_PORT ? process.env.NEST_PORT : '3000') +
  '/auth/login';
export const LOUGOUT_URL =
  'http://localhost:' +
  (process.env.NEST_PORT ? process.env.NEST_PORT : '3000') +
  '/auth/logout';
export const GOOGLE_URL =
  'http://localhost:' +
  (process.env.NEST_PORT ? process.env.NEST_PORT : '3000') +
  '/auth/google';

export const loginAction = {
  actionUrl: LOGIN_URL,
  googleUrl: GOOGLE_URL,
};

export const logoutAction = {
  url: LOUGOUT_URL,
};
