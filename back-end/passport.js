const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Account, AccountDetail } = require('./models');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let account = await Account.findOne({ googleId: profile.id });
    if (!account) {
      // Create a new account if it doesn't exist
      account = new Account({
        googleId: profile.id,
        user_name: profile.displayName,
        role_id: 2, // Set a default role or handle role assignment
        password: null, // No password for Google login
        start_working: new Date(),
        is_working: true
      });
      await account.save();
    }
    done(null, account);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((account, done) => {
  done(null, account.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const account = await Account.findById(id);
    done(null, account);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;