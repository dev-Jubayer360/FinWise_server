import { Router } from 'express';
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from './goal.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createGoalZodSchema, updateGoalZodSchema } from './goal.validators';

const router = Router();

router.use(protect);

router
  .route('/')
  .post(validateRequest(createGoalZodSchema), createGoal)
  .get(getGoals);

router
  .route('/:id')
  .patch(validateRequest(updateGoalZodSchema), updateGoal)
  .delete(deleteGoal);

export const goalRoutes = router;
