import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { transactionRoutes } from '../modules/transaction/transaction.routes';
import { budgetRoutes } from '../modules/budget/budget.routes';
import { goalRoutes } from '../modules/goal/goal.routes';
import { aiRoutes } from '../modules/ai/ai.routes';
import { reportRoutes } from '../modules/report/report.routes';

const router = Router();

const moduleRoutes = [
  { path: '/users', route: userRoutes },
  { path: '/transactions', route: transactionRoutes },
  { path: '/budgets', route: budgetRoutes },
  { path: '/goals', route: goalRoutes },
  { path: '/ai', route: aiRoutes },
  { path: '/dashboard', route: reportRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
