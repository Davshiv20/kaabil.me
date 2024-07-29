require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const dbConfig = require("./Config/db.config.js");
const session = require('express-session');
// const { ensureAuth, ensureGuest } = require('./Middleware/auth')
const Sequelize = require('sequelize');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const configurePassport = require('./Controllers/user.controller'); // Include the user controller to configure Passport strategies
const app = express();

// CORS configuration for production
 // app.use(cors())

// for local dev

app.use(cors({
    origin: "http://localhost:5173", // Adjust for production if necessary
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // This allows session cookies from the browser to be passed back
}));



app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
//uncomment for production
// app.use(express.static(path.join(__dirname, 'dist')));


// Body parser for forms and json data

app.use(express.json());  


// Database connection setup
const db = require("./Model");

configurePassport(passport);

// Sequelize instance configuration
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

// Session configuration with Sequelize store
const sessionStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    expiration: 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session.
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      //  secure: process.env.NODE_ENV === 'production', // secure: true in production for https use
      //  sameSite: 'None',
      secure: false, // Secure must be true if SameSite is None
     
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Ensure the session store is ready
sessionStore.sync();


// Synchronize the Sequelize models with the database
db.sequelize.sync({alter:true})
    .then(() => {
        console.log("Database connection successful!");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
    });



    
// Passport configuration

app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api', require("./Routes/question"));
app.use('/api', require("./Routes/courses"));
app.use('/api/auth', require('./Routes/auth'));

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Welcome to Kaabil application." });
});


//uncomment for production
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// do not delete this part
/*
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  });
  */
  


// Set port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});