import { Router } from 'express';
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from './budget.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createBudgetZodSchema, updateBudgetZodSchema } from './budget.validators';

const router = Router();

router.use(protect);

router
  .route('/')
  .post(validateRequest(createBudgetZodSchema), createBudget)
  .get(getBudgets);

router
  .route('/:id')
  .patch(validateRequest(updateBudgetZodSchema), updateBudget)
  .delete(deleteBudget);

export const budgetRoutes = router;
