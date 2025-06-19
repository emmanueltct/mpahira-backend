import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser,getUserProfile,googleCallback, refreshToken, resetPassword, verifyOtp, forgotPassword} from '../controllers/userControllers';
import { isAuthenticated } from '../middleware/isAuthenticated';

const authRoutes = Router();

authRoutes.post('/signup', registerUser);
authRoutes.post('/login', passport.authenticate('local', { session: false }), loginUser);

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRoutes.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

authRoutes.post('/refresh-token', refreshToken);
authRoutes.get('/profile',isAuthenticated, getUserProfile);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/verify-otp', verifyOtp);
authRoutes.post('/reset-password', resetPassword);

export default authRoutes;
