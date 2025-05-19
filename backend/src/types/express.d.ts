import { Request } from 'express';
import { DecodedToken } from './auth';

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedToken;
  }
}

export {}; 