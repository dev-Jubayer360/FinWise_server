import { z } from 'zod';

export const createBudgetZodSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category is required'),
    monthlyLimit: z.number().positive('Monthly limit must be positive'),
    spentAmount: z.number().nonnegative().optional(),
  }),
});

export const updateBudgetZodSchema = z.object({
  body: z.object({
    category: z.string().optional(),
    monthlyLimit: z.number().positive().optional(),
    spentAmount: z.number().nonnegative().optional(),
  }),
});
