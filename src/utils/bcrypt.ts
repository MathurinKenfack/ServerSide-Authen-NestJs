import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export function encodePassword(rawPassword: string) {
  const SALT = genSaltSync();
  return hashSync(rawPassword, SALT);
}

export function comaparePasswords(rawPassword: string, hash: string) {
  return compareSync(rawPassword, hash);
}
