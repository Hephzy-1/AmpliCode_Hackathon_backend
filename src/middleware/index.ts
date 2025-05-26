import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/errorResponse';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export const authorize = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw next(new ErrorResponse('Authorization header missing or invalid', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new ErrorResponse('Invalid token', 401);
    }

    req.user = decoded;
    next();
  } catch (err) {
    throw next(new ErrorResponse('Unauthorized access', 401));
  }
};