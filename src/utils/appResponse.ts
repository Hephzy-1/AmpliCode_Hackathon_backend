import { Response } from 'express';

export function AppResponse(
  res: Response,
  statusCode: number,
  data: any = null,
  message: string
) {
  return res.status(statusCode).json({
    status: 'success',
    message: message ?? 'Operation successful',
    data,
  });
}