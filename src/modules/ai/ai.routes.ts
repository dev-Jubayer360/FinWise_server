import { Router } from 'express';
import { analyzeFinancialData, categorizeTransaction, generateAIReport, chatController } from './ai.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/analyze', analyzeFinancialData);
router.post('/categorize', categorizeTransaction);
router.post('/report', generateAIReport);
router.post('/chat', chatController);

export const aiRoutes = router;
