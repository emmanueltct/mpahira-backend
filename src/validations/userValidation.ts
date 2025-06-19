import { z } from 'zod';
import User from '../models/userModel';

// Async refiners for uniqueness
const isEmailUnique = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  return !user;
};

const isTelephoneUnique = async (telephone: string) => {
  const user = await User.findOne({ where: { telephone } });
  return !user;
};

// Password regex
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerUserSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z
    .string()
    .email('Invalid email')
    .refine(isEmailUnique, { message: 'Email is already in use' }),
  telephone: z
    .string()
    .regex(/^07[2839]\d{7}$/, 'Invalid Rwandan phone number')
    .refine(isTelephoneUnique, { message: 'Phone number is already in use' }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(strongPasswordRegex, {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    'Password must include upper, lower, number'
  ),
});
