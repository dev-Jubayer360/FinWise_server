import { Router } from 'express';
import { getMe, updateProfile } from './user.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { updateProfileZodSchema } from './user.validators';

const router = Router();

router.get('/me', protect, getMe);
router.patch('/profile', protect, validateRequest(updateProfileZodSchema), updateProfile);

export const userRoutes = router;
