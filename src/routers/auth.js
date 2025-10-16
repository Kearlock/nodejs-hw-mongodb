import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  registerUserCtrl,
  loginUserCtrl,
  refreshSessionCtrl,
  logoutUserCtrl,
  requestPasswordResetCtrl,
  resetPasswordCtrl,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserCtrl),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserCtrl),
);

router.post('/refresh', ctrlWrapper(refreshSessionCtrl));

router.post('/logout', logoutUserCtrl);

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  requestPasswordResetCtrl,
);

router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordCtrl);

export default router;
