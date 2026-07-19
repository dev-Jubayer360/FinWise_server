import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from './transaction.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createTransactionZodSchema,
  updateTransactionZodSchema,
} from './transaction.validators';

const router = Router();

router.use(protect); // All routes below are protected

router
  .route('/')
  .post(validateRequest(createTransactionZodSchema), createTransaction)
  .get(getTransactions);

router
  .route('/:id')
  .get(getTransactionById)
  .patch(validateRequest(updateTransactionZodSchema), updateTransaction)
  .delete(deleteTransaction);

export const transactionRoutes = router;
