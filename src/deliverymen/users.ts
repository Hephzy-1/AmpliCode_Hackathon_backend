import { Router } from 'express';
import { forgotPassword, getAllUsers, login, register, resendOTP, resetPassword, verifyOTP } from '../handlers/user';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.route('/OTP/:id')
  .post(resendOTP)
  .put(verifyOTP);
router.get('/users', getAllUsers);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword)
// router.get('/users/:id', getAllUsers);

export default router;