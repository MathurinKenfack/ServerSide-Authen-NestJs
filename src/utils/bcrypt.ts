import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export function encodePassword(rawPassword: string) {
  const SALT = genSaltSync(parseInt(process.env.ROUNDS_PASSWORD));
  return hashSync(rawPassword, SALT);
}

export function comaparePasswords(rawPassword: string, hash: string) {
  return compareSync(rawPassword, hash);
}

export function encodeData(data: string) {
  const SALT = genSaltSync(parseInt(process.env.ROUNDS_DATA));
  return hashSync(data, SALT);
}

export function comapareData(data: string, hash: string) {
  return compareSync(data, hash);
}
