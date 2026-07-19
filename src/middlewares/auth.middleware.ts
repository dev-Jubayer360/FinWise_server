import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../config/better-auth';
import { ApiError } from '../utils/ApiError';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    
    if (!session || !session.user) {
      return next(new ApiError(401, 'Unauthorized: Please log in'));
    }
    
    (req as any).user = session.user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Unauthorized: Invalid token or session'));
  }
};
