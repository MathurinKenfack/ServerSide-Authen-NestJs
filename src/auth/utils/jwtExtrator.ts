import { Request } from 'express';

export const cookieExtractor = function (req: Request) {
  console.log('In cookie extractor');
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['authorization'];
  }
  return token;
};
