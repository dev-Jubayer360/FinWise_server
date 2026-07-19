import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError || error.name === 'ZodError') {
        const errorMessage = (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json(new ApiResponse(400, null, `Validation Error: ${errorMessage}`));
      }
      console.error("VALIDATION ERROR (Not ZodError instance):", error);
      next(error);
    }
  };
};
