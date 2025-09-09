import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser,getUserProfile,googleCallback, refreshToken, resetPassword, verifyOtp, forgotPassword, getAllUser, assignRoleUser} from '../controllers/userControllers';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated';

const authRoutes = Router();

authRoutes.post('/signup', registerUser);

// authRoutes.post('/login', passport.authenticate('local', { session: false }), loginUser);

// authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// authRoutes.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

authRoutes.post('/login', passport.authenticate('local', { session: false }), loginUser);

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth/login?error=server_error` }),
  googleCallback // this function should handle generating JWT / redirecting user
);

authRoutes.post('/refresh-token', refreshToken);

authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/verify-otp', verifyOtp);
authRoutes.post('/reset-password', resetPassword);

authRoutes.get('/profile',isAuthenticated, getUserProfile);
authRoutes.get('/users',isAuthenticated, isAdmin, getAllUser);
authRoutes.patch('/users/:userId',isAuthenticated, isAdmin, assignRoleUser);

export default authRoutes;
