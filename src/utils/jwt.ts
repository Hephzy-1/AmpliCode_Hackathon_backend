import jwt from 'jsonwebtoken';
import environment from '../config/env';
import { ErrorResponse } from '../utils/errorResponse';

const JWT_SECRET = environment.JWT_SECRET;
const JWT_EXPIRES_IN = environment.EXPIRY;

if ( !JWT_SECRET || !JWT_EXPIRES_IN) {
  throw new ErrorResponse("JWT Secret or JWT Expiry is not defined", 500);
}

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
}