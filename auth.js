const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
require("dotenv").config();
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      const account = profile._json;
      let user = {};
      try {
        const currentUserQuery = await pool.query(
          "SELECT * FROM users WHERE google_id=$1",
          [account.sub]
        );

        if (currentUserQuery.rows.length === 0) {
          // create user
          var num = '1234567890'
          var OTP = ''
          for (let i = 0; i < 5; i++) {
            OTP += num[Math.floor(Math.random() * 10)]
          }
          var created_email = account.family_name + account.given_name + '@gmail.com'

          await pool.query(
            "INSERT INTO users (username, email, otp, profile_picture, google_id) VALUES ($1,$2,$3,$4,$5)",
            [account.name, created_email, OTP, account.picture, account.sub]
          );

          const id = await pool.query("SELECT id FROM users WHERE google_id=$1", [
            account.sub,
          ]);
          user = {
            id: id.rows[0].id,
            username: account.name,
            profile_image: account.picture,
          };
        } else {
          // have user
          user = {
            id: currentUserQuery.rows[0].id,
            username: currentUserQuery.rows[0].username,
            email: currentUserQuery.rows[0].email,
            otp: currentUserQuery.rows[0].otp,
            profile_image: currentUserQuery.rows[0].profile_image

          };
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // loads into req.session.passport.user
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // loads into req.user
  done(null, user);
});
