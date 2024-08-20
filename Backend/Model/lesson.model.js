// Define a Sequelize model for Lessons
/*
module.exports = (sequelize, Sequelize) => {
  const Lesson = sequelize.define(
    "Lesson",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
     
      CourseSubjectName: {
        type: Sequelize.TEXT,
        references: {
          model: 'courses', // Name of the model to link to, make sure it matches your table name for courses
          key: 'subjectName', // The column in the 'courses' table that this field refers to
        }
      }

    }, {
      // Model options
      tableName: 'lessons' 
    });
     return Lesson;
    
  };
  */
// lesson.model.js
module.exports = (sequelize, Sequelize) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lessonName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    courseName: {
      type: Sequelize.TEXT,
      references: {
        model: 'courses', // Name of the model to link to, make sure it matches your table name for courses
        key: 'subjectName', // The column in the 'courses' table that this field refers to
      }
    }
  }, {
    tableName: 'lessons'
  });

  return Lesson;
};