
const dbConfig = require("../Config/db.config.js");
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

// Load and initialize models
// db.lesson = require("./lesson.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.Message = require("./messages.model.js")(sequelize, Sequelize);
db.course = require("./course.model.js")(sequelize, Sequelize);
db.question = require("./question.model.js")(sequelize, Sequelize);
db.lesson = require("./lesson.model.js")(sequelize, Sequelize);
db.userProgress = require("./progress.model.js")(sequelize, Sequelize);
// one to many (user to course, a user can particiapate in many courses)
// many to many (user to course, a user can participate in many courses and a course can have many users)
/*
db.user.hasMany(db.lesson);
db.lesson.belongsTo(db.user);
*/
// we are going with one to many
db.user.hasMany(db.course);
db.course.belongsTo(db.user);

/*
//one to many (a course can have many lessons )
db.course.hasMany(db.lesson);
db.lesson.belongsTo(db.course);
*/


 // 
 db.user.hasMany(db.userProgress);
 db.userProgress.belongsTo(db.user);

// one to one 
// a question can have a chat/ messages
db.question.hasOne(db.Message)


// one to many
// a user can have many chats/messages
db.user.hasMany(db.Message);
db.Message.belongsTo(db.user);


//a course can have many questions
db.course.hasMany(db.question);
db.question.belongsTo(db.course);

db.course.hasMany(db.userProgress);
db.userProgress.belongsTo(db.course);


db.course.hasMany(db.lesson);
db.lesson.belongsTo(db.course);

db.lesson.belongsToMany(db.question, { through: 'LessonQuestion' });
db.question.belongsToMany(db.lesson, { through: 'LessonQuestion' });

db.course.belongsToMany(db.question, { through: 'CourseQuestion' });
db.question.belongsToMany(db.course, { through: 'CourseQuestion' });






/*
db.userProgress.hasMany(db.question, {
  foreignKey: 'LessonId',
  sourceKey: 'lessonId'
});
db.question.belongsTo(db.userProgress, {
  foreignKey: 'LessonId',
  targetKey: 'lessonId'
});
*/

/*
// a lesson can have many questions
db.lesson.hasMany(db.question);
db.question.belongsTo(db.lesson);
*/




/*

This structure allows you to:

Track user progress for each lesson
Associate questions with lessons
Retrieve all questions for a specific lesson progress
Find the progress record for a specific user and lesson

*/
module.exports = db;