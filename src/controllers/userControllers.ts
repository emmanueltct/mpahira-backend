import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import Role from '../models/roleModel';
import { forgotPasswordSchema, registerUserSchema, resetPasswordSchema, verifyOtpSchema } from '../validations/userValidation';
import { UserAttributes } from '../interfaces/userInterface';
import { generateTokens } from '../utils/token';
import { sendOTPEmail } from '../utils/mailer';

// Register user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, telephone, email, password} = req.body;

    // Check if user already exists
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   res.status(409).json({ message: 'User already exists' });
    //   return;
    // }

    // Hash password
    const validatedData = await registerUserSchema.parseAsync(req.body);
    const hashedPassword = await bcrypt.hash(password, 12);
    const buyerRole = await Role.findOne({ where: { role: 'buyer' } });
    // Create user
    const newUser = await User.create({
      ...validatedData,
      password: hashedPassword,
      provider: 'local',
      roleId:buyerRole?.id as string
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        roleId: newUser.roleId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login user (after passport authentication)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as UserAttributes;
    
    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }

    const tokens = generateTokens(user.id);

      await User.update(
      { 
        accessToken: tokens.accessToken, 
        refreshToken: tokens.refreshToken 
      },
      { where: { id: user.id } }
    );
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId
      },
      tokens
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as UserAttributes;
    
    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userWithRole = await User.findByPk(user.id, {
      include: [{ model: Role, as: 'role' }]
    });

    res.status(200).json({ user: userWithRole });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Google OAuth callback handler
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as UserAttributes;
    
    if (!user) {
      res.status(401).json({ message: 'Google authentication failed' });
      return;
    }

    const tokens = generateTokens(user.id);
    
    // Update user with new tokens
    await User.update(
      { 
        accessToken: tokens.accessToken, 
        refreshToken: tokens.refreshToken 
      },
      { where: { id: user.id } }
    );

    res.status(200).json({
      message: 'Google login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId
      },
      tokens
    });
  } catch (error) {
    res.status(500).json({ message: 'Google authentication error', error });
  }
};

// Refresh token handler
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    // Verify the refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { id: string };
    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== token) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    // Generate new tokens
    const newTokens = generateTokens(user.id);
    
    
    // Update user with new tokens
    await User.update(
      { 
        accessToken: newTokens.accessToken, 
        refreshToken: newTokens.refreshToken 
      },
      { where: { id: user.id } }
    );

    res.status(200).json({
      message: 'Tokens refreshed successfully',
      tokens: newTokens
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token expired or invalid',error });
      return;
    }
    res.status(500).json({ message: 'Error refreshing token', error });
  }
};




export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await User.findOne({ where: { email } });
    if (!user){
     res.status(404).json({ msg: 'User not found' });
     return
    } 

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",otpExpires)
    await user.update({ otp, otpExpires });
    await sendOTPEmail(email, otp);

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid input', error: err });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);

    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires as Date)) {
       res.status(400).json({ msg: 'Invalid or expired OTP' });
       return
    }

    res.json({ msg: 'OTP verified' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid input', error: err });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);

    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires as Date )) {
       res.status(400).json({ msg: 'Invalid or expired OTP' });
       return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword, otp:"", otpExpires:undefined });

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid input', error: err });
  }
};
