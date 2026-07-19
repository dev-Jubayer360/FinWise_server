import { z } from 'zod';

export const createTransactionZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['income', 'expense']),
    category: z.string().min(1, 'Category is required'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    notes: z.string().optional(),
    transactionDate: z.string().optional().or(z.date().optional()),
  }),
});

export const updateTransactionZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    amount: z.number().positive().optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().optional(),
    paymentMethod: z.string().optional(),
    notes: z.string().optional(),
    transactionDate: z.string().optional().or(z.date().optional()),
  }),
});
