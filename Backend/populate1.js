

require('dotenv').config(); 
const fs = require('fs');
const path = require('path');

const dbConfig = require("./Config/db.config.js");
//import Sequelize from "sequelize";
const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
  // Uncomment this line to automatically create the database (if not existing)
    // createDatabase: true
  },
  pool: {
    max: dbConfig.pool.max,    // Maximum number of connections in pool
    min: dbConfig.pool.min,    // Minimum number of connections in pool
    acquire: dbConfig.pool.acquire, // Maximum time (in ms) the pool will try to get connection before throwing error
    idle: dbConfig.pool.idle   // Maximum time (in ms) a connection can be idle before being released
  }
});



const db = {}; // Initialize an empty database object to store models

// Assign Sequelize library and connection instance to the database object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import the model

// db.lesson = require("./Model/lesson.model.js")(sequelize, Sequelize);
db.course = require("./Model/course.model.js")(sequelize, Sequelize);
// Function to seed data
async function seedData() {
  try {
   // await sequelize.authenticate();
   // console.log('Connection has been established successfully.');
  //  await sequelize.sync({ force: true }); // This line will drop the table if it already exists

  // Read JSON data from file as a string
 // const filePath = path.join(__dirname, 'updated_merged_file_final.json');
  // let rawData = fs.readFileSync(filePath);
   
  const filePath1 = path.join(__dirname, 'courses2.json');
  let rawData1 = fs.readFileSync(filePath1);

  // Replace single backslashes with double backslashes for JSON compatibility
  //rawData = rawData.replace(/\\(?!\\)/g, '\\\\');

  // Parse the JSON
 // const lessons = JSON.parse(rawData);
  const courses = JSON.parse(rawData1);
 // Database operations
  await sequelize.authenticate();
 console.log('Connection has been established successfully.');
  await sequelize.sync(); // This line will drop the table if it already exists
 // console.log('Data to be inserted:', JSON.stringify(lessons, null, 2));
 console.log('Courses to be inserted:', JSON.stringify(courses));
 await db.course.bulkCreate(courses);
// await db.lesson.bulkCreate(lessons);
 console.log('Data has been inserted successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or seed data:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the seeding function
seedData();



