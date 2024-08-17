const express = require('express')
const passport = require('passport')
const router = express.Router()

const userController = require('../Controllers/user.controller');
const { ensureAuth, ensureGuest } = require('../Middleware/auth');



// Route to initiate Google OAuth authentication
router.get('/google', userController.googleAuth);






//router.get('/google/callback', userController.handleGoogleCallback);


// Route to handle the callback after Google has authenticated the user
// Uncomment the necessary lines for deployment in a production environment
//http://localhost:5173
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }),
  

   //uncomment for production
  //  passport.authenticate('google', { failureRedirect: 'https://www.kaabil.me/' }),
    (req, res) => {
    // On successful authentication, redirect to the dashboard

  //  res.redirect("https://www.kaabil.me/dashboard") // Use for production environment
    
    res.redirect("http://localhost:5173/dashboard") // Use for local environment
    }
  )


  // Route to log out the user and end the session
router.get('/logout', userController.logout);



// auth/login/sucess
// Route to validate successful login, only accessible to authenticated users
router.get("/login/sucess",ensureAuth, async(req,res)=>{
//  console.log("req user = ",req.user) // Log user data for debugging purposes
  if (req.user) {
 //   console.log("req user = ",req.user)
     // If user is authenticated, return success message and user data
    res.status(200).json({
        error: false,
        message: "Successfully Logged In",
        user: req.user,
    });
   // console.log("req user = ",req.user)
} else {
   // If user is not authenticated, return error
    res.status(403).json({ error: true, message: "Not Authorized" });
}
})

module.exports = router;

// http://localhost:3000/auth//google/callback