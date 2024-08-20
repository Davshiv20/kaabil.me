// Define a module that initializes the Course model with Sequelize
module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('Course', {
      // Define a 'subjectName' field which is used as the primary key
      subjectName: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      courseDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Name of the model to link to, make sure it matches your table name for courses
          key: 'id', // The column in the 'courses' table that this field refers to
        }
      },
      courseImage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
     
    }, {
      // Model options (optional)
      tableName: 'courses'  // Specify the table name in the database
    
    });

     return Course;  // Return the defined model to be used elsewhere
    
  };
  