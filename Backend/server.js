require('dotenv').config(); // Load environment variables from .env file
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require('multer');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const dbConfig = require("./Config/db.config.js");
const configurePassport = require('./Controllers/user.controller');
const db = require("./Model");

const app = express();

// CORS configuration for production
  app.use(cors())

// for local dev
/*
app.use(cors({
  origin: "http://localhost:5173", // Adjust for production if necessary
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: 'Content-Type,X-Requested-With'
}));
*/

app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
// uncomment for production
 app.use(express.static(path.join(__dirname, 'dist')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.post('/api/openai', upload.single('image'), require('./Controllers/combined.controller').handleRequest);

// Static file serving
app.use('/api/images/uploads', require('./Routes/image.routes'));
app.use('/', express.static(path.join(__dirname, 'uploads')));

// Session and database configuration
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

const sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // Cleanup expired sessions every 15 minutes
  expiration: 24 * 60 * 60 * 1000  // Max age of a valid session is 24 hours
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Secure must be true if SameSite is None
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Ensure the session store is ready
sessionStore.sync();

// Synchronize Sequelize models with the database
db.sequelize.sync()
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

// Passport configuration
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api', require("./Routes/question"));
app.use('/api/auth', require('./Routes/auth'));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Welcome to Kaabil application." });
});

// uncomment for production
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});


// Set port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
