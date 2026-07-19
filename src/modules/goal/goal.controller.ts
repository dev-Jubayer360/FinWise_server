import { Request, Response, NextFunction } from 'express';
import { GoalService } from './goal.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const goal = await GoalService.createGoal(sessionUser.id, req.body);
    res.status(201).json(new ApiResponse(201, goal, 'Goal created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const goals = await GoalService.getGoals(sessionUser.id);
    res.status(200).json(new ApiResponse(200, goals, 'Goals retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const goal = await GoalService.updateGoal(req.params.id as string, sessionUser.id, req.body);
    if (!goal) {
      return next(new ApiError(404, 'Goal not found'));
    }
    res.status(200).json(new ApiResponse(200, goal, 'Goal updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const goal = await GoalService.deleteGoal(req.params.id as string, sessionUser.id);
    if (!goal) {
      return next(new ApiError(404, 'Goal not found'));
    }
    res.status(200).json(new ApiResponse(200, null, 'Goal deleted successfully'));
  } catch (error) {
    next(error);
  }
};
