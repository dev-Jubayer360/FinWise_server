import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import config from '../config/env';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  if (statusCode === 500) {
    console.error('500 ERROR CAUGHT BY MIDDLEWARE:', err);
  }

  // Handle Mongoose validation errors or duplicate keys etc.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: config.NODE_ENV === 'production' ? null : err.stack,
  });
};
