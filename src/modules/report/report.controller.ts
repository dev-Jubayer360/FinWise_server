import { Request, Response, NextFunction } from 'express';
import { ReportService } from './report.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const data = await ReportService.getDashboardData(sessionUser.id);
    res.status(200).json(new ApiResponse(200, data, 'Dashboard data retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
