import { z } from 'zod';

export const updateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
  }),
});
