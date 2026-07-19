import { Request, Response, NextFunction } from 'express';
import { TransactionService } from './transaction.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("CREATE TX REQUEST:", req.body);
    const sessionUser = (req as any).user;
    const transaction = await TransactionService.createTransaction(sessionUser.id, req.body);
    res.status(201).json(new ApiResponse(201, transaction, 'Transaction created successfully'));
  } catch (error) {
    console.error("ERROR IN createTransaction:", error);
    next(error);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const result = await TransactionService.getTransactions(sessionUser.id, req.query);
    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      ...result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const transaction = await TransactionService.getTransactionById(req.params.id as string, sessionUser.id);
    if (!transaction) {
      return next(new ApiError(404, 'Transaction not found'));
    }
    res.status(200).json(new ApiResponse(200, transaction, 'Transaction retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const transaction = await TransactionService.updateTransaction(req.params.id as string, sessionUser.id, req.body);
    if (!transaction) {
      return next(new ApiError(404, 'Transaction not found'));
    }
    res.status(200).json(new ApiResponse(200, transaction, 'Transaction updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const transaction = await TransactionService.deleteTransaction(req.params.id as string, sessionUser.id);
    if (!transaction) {
      return next(new ApiError(404, 'Transaction not found'));
    }
    res.status(200).json(new ApiResponse(200, null, 'Transaction deleted successfully'));
  } catch (error) {
    next(error);
  }
};
