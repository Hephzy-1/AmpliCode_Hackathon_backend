import express from 'express';
import cors from 'cors';
import session from 'express-session';
import environment from './config/env';
import { ErrorResponse } from './utils/errorResponse';
import errorHandler from './middleware/error';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from './middleware/async';
import { AppResponse } from './utils/appResponse';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';

import userRoutes from './deliverymen/users';
import preferencesRoutes from './deliverymen/preferences';

const app = express();

if (!environment.SESSION_SECRET) {
  throw new ErrorResponse('Session secret is required', 500)
}

app.use(cors({
  credentials: true,
  origin: '*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: environment.SESSION_SECRET, resave: false, saveUninitialized: true }));

if (process.env.APP_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
// app.use(xss());
app.use(hpp())

app.get('/', asyncHandler( async (req: express.Request, res: express.Response) => {
  return AppResponse(res, 200, null, 'Welcome to Study Buddy!');
}));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/preferences', preferencesRoutes);

app.all('*', (req, res, next) => {
  const error = new ErrorResponse(`Cannot find ${req.originalUrl} on this server!`, 404);
  next(error);
});

app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

export default app;