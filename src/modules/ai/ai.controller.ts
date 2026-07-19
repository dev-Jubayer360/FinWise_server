import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';
import { ApiResponse } from '../../utils/ApiResponse';

export const analyzeFinancialData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const analysis = await AIService.analyze(sessionUser.id);
    res.status(200).json(new ApiResponse(200, analysis, 'Financial data analyzed successfully'));
  } catch (error) {
    next(error);
  }
};

export const categorizeTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, merchant } = req.body;
    const categorization = await AIService.categorize(title, description, merchant);
    res.status(200).json(new ApiResponse(200, categorization, 'Transaction categorized successfully'));
  } catch (error) {
    next(error);
  }
};

export const generateAIReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const report = await AIService.generateReport(sessionUser.id);
    res.status(201).json(new ApiResponse(201, report, 'AI Report generated successfully'));
  } catch (error) {
    next(error);
  }
};

export const chatController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req as any).user;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json(new ApiResponse(400, null, 'Message is required'));
    }

    const response = await AIService.chatWithAI(sessionUser.id, message);
    res.status(200).json(new ApiResponse(200, response, 'Chat response successful'));
  } catch (error) {
    next(error);
  }
};
