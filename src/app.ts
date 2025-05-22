import express from 'express';
import cors from 'cors';
import session from 'express-session';
import environment from './config/env';
import { ErrorResponse } from './utils/errorResponse';
import errorHandler from './middleware/error';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from './middleware/async';
import { AppResponse } from './utils/appResponse';

const app = express();

if (!environment.SESSION_SECRET) {
  throw new ErrorResponse('Session secret is required', 500)
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: environment.SESSION_SECRET, resave: false, saveUninitialized: true }));

app.get('/', asyncHandler( async (req: express.Request, res: express.Response) => {
  return AppResponse(res, 200, null, 'Welcome to Study Buddy!');
}));

app.all('*', (req, res, next) => {
  const error = new ErrorResponse(`Cannot find ${req.originalUrl} on this server!`, 404);
  next(error);
});

app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

export default app;