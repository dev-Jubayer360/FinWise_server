import { Request, Response, NextFunction } from 'express';
import { User } from './user.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    let user = await User.findOne({ email: sessionUser.email });
    
    if (!user) {
      // Sync better auth user to our db if they don't exist yet (e.g. Google Login)
      user = await User.create({
        name: sessionUser.name,
        email: sessionUser.email,
        image: sessionUser.image,
        provider: sessionUser.emailVerified ? 'google' : 'email',
      });
    }

    res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const user = await User.findOneAndUpdate(
      { email: sessionUser.email },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};
