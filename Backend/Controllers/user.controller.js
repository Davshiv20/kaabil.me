const passport = require('passport')
const db = require("../Model");
const User = db.user;
const GoogleStrategy = require('passport-google-oauth20').Strategy


// Module exports to configure passport for Google OAuth authentication
module.exports = function (passport) {
  // Use GoogleStrategy within Passport to handle Google authentication
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //  callbackURL: 'http://localhost:3000/api/auth/google/callback',// Local development callback URL

      // Uncomment the following line for production environment callback URL
      callbackURL: 'https://www.kaabil.me/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
         // Extract user information from Google profile
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value
        }

        try {
            // Attempt to find the user in the database by googleId
            let user = await User.findOne({ where: { googleId: profile.id } });
          
            if (user) {
              // If user present in our database.
              done(null, user);
            } else {
              // If user is not present in our database, save user data to database.
              user = await User.create(newUser);
              done(null, user);
            }
          } catch (err) {
            // Log any server errors
            console.error(err);
          }

      
      }
    )
  )

   // Serialize the user session by saving only the user ID into the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

 // Deserialize the user session by fetching the user from the database by ID
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => done(null, user))
      .catch(err => done(err));
  });
} 


// Authenticate requests using Google OAuth with required scopes for profile and email
module.exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });


// Logout function to end the user session and redirect to home page
module.exports.logout = (req, res) => {
  req.logout();
  // uncomment for production
  res.redirect('"https://www.kaabil.me/');

// res.redirect('http://localhost:5173/');
};

