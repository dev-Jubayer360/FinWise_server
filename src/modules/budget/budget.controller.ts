import { Request, Response, NextFunction } from 'express';
import { BudgetService } from './budget.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export const createBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const budget = await BudgetService.createBudget(sessionUser.id, req.body);
    res.status(201).json(new ApiResponse(201, budget, 'Budget created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const budgets = await BudgetService.getBudgets(sessionUser.id);
    res.status(200).json(new ApiResponse(200, budgets, 'Budgets retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const budget = await BudgetService.updateBudget(req.params.id as string, sessionUser.id, req.body);
    if (!budget) {
      return next(new ApiError(404, 'Budget not found'));
    }
    res.status(200).json(new ApiResponse(200, budget, 'Budget updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const budget = await BudgetService.deleteBudget(req.params.id as string, sessionUser.id);
    if (!budget) {
      return next(new ApiError(404, 'Budget not found'));
    }
    res.status(200).json(new ApiResponse(200, null, 'Budget deleted successfully'));
  } catch (error) {
    next(error);
  }
};
