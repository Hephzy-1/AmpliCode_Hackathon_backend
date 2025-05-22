import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user';
import environment from './env';
import { ErrorResponse } from '../utils/errorResponse';

if (!environment.CLIENT_ID || !environment.CLIENT_SECRET) {
  throw new ErrorResponse('Google client ID and secret are required', 500);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: environment.CLIENT_ID,
      clientSecret: environment.CLIENT_SECRET,
      callbackURL: environment.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, tokenSecret, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          picture: profile.photos?.[0]?.value,
        });
        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        console.error('Error in Google authentication:', error);
        
        return done(error);
      }
    }
  )
);

// export const googleAuth = passport.authenticate('google', {
//   scope: ['profile', 'email'],
//   prompt: 'select_account',
//   accessType: 'offline',
//   approvalPrompt: 'force',
//   includeGrantedScopes: true,
//   hd: 'example.com', // Optional: restrict to specific Google Workspace domain
// });
// export const googleAuthCallback = passport.authenticate('google', {
//   failureRedirect: '/auth/google/failure',
//   successFlash: 'Welcome back!',
//   failureFlash: 'Failed to authenticate with Google. Please try again.',
// });

// export const googleLogout = (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error logging out' });
//     }
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error destroying session' });
//       }
//       res.clearCookie('connect.sid');
//       return res.status(200).json({ message: 'Logged out successfully' });
//     });
//   });
// };
export default passport;