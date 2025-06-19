import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/userModel';
import Role from '../models/roleModel';

dotenv.config();

// Check if env variables are defined
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials in .env');
}

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5500/api/auth/google/callback', 
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: 'No email provided by Google' });

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return done(null, existingUser);

        const buyerRole = await Role.findOne({ where: { role: 'buyer' } });

        const [firstName = '', ...rest] = profile.displayName?.split(' ') || [''];
        const lastName = rest.join(' ');

        const newUser = await User.create({
          firstName,
          lastName,
          telephone: '',
          email,
          provider: 'google',
          profilePic: profile.photos?.[0]?.value || '',
          roleId: buyerRole?.id || '',
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Session Handling
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
