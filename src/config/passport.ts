import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/userModel';
import Role from '../models/roleModel';

dotenv.config();

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email },
          include: [{ model: Role, as: 'role' }],
        });
        if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

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
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: 'No email provided by Google' });

        let user = await User.findOne({ where: { email } });
        if (user) return done(null, user);

      
        const buyerRole = await Role.findOne({ where: { role: 'Buyer' } });
        if (!buyerRole) return done(null, false, { message: 'Please we are working on it you will be notified if is fixed' });
        

        const [firstName = '', ...rest] = profile.displayName?.split(' ') || [''];
        const lastName = rest.join(' ');
        const telephone = '0789564' + (Math.floor(Math.random() * 900) + 100);
        user = await User.create({
          firstName,
          lastName,
          telephone: telephone,
          email,
          provider: 'google',
          profilePic: profile.photos?.[0]?.value || '',
          roleId: buyerRole?.id as string,
        });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;
