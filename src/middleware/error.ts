import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, ExtendedError } from '../utils/errorResponse';

function errorHandler(
  err: ExtendedError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let error: ExtendedError = err;

  if (!(err instanceof ErrorResponse)) {
    const message = err.message || 'Internal Server Error';
    error = new ErrorResponse(message, 500);
  }

  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }

  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  console.error(error.message, error.statusCode);

  return res.status(error.statusCode || 500).json({
    success: false,
    error: {
     statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      errors: 'errors' in error ? error.errors : null
    }
  });
}

export default errorHandler;