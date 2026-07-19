import { z } from 'zod';

export const createGoalZodSchema = z.object({
  body: z.object({
    goalName: z.string().min(1, 'Goal name is required'),
    targetAmount: z.number().positive('Target amount must be positive'),
    currentAmount: z.number().nonnegative().optional(),
    deadline: z.string().datetime().or(z.date()),
  }),
});

export const updateGoalZodSchema = z.object({
  body: z.object({
    goalName: z.string().optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().nonnegative().optional(),
    deadline: z.string().datetime().optional().or(z.date().optional()),
  }),
});
