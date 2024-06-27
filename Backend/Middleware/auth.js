// Module exports to include custom middleware functions for authentication checks
module.exports = {
    ensureAuth: function (req, res, next) {
      // ensureAuth checks if the user is authenticated before proceeding
      if (req.isAuthenticated()) {
        console.log("yes the user is authenticated")
        console.log("user id=",req.user.dataValues.id)
      // req.user.dataValues.id;
          // If the user is authenticated, proceed to the next middleware or route handler
          console.log("yes the user is authenticated")
          return next();
      } else {
         // If the user is not authenticated, redirect them to the Home page
       //  res.redirect('http://localhost:5173/')
       res.status(401).json({ error: "Authentication failed" });
      //uncomment for production
  //   res.redirect('https://www.kaabil.me/')
      }
    },
     // ensureGuest checks if the user is not authenticated before proceeding, will not be used
    ensureGuest: function (req, res, next) {
      // If the user is not authenticated, proceed to the next middleware or route handler
      if (!req.isAuthenticated()) {
        return next();
      } else {
         // If the user is authenticated, redirect them to the dashboard
      //  res.redirect('/http://localhost:5173/dashboard');
      // uncomment for production
       // res.redirect('https://www.kaabil.me/dashboard')
      //  res.redirect('https://www.kaabil.me/dashboard')
      }
    },
  }