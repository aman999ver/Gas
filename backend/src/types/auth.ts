import { Request } from 'express';

export interface DecodedToken {
  _id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
} 