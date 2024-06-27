// Define a Sequelize model for Questions
module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define(
      "Question",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        question: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        options: {
        //  type: Sequelize.ARRAY(Sequelize.STRING), // Stores an array of strings for multiple choice options
        type: Sequelize.JSONB, 
  
          // some questions might not have options
        },
        solution: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        reference: {
          // Optional field for additional references, like a textbook page, year of question
          type: Sequelize.TEXT,
        },
        level: {
          type: Sequelize.ENUM("easy", "medium", "hard"), // Restricts the level to specific values
          defaultValue: "easy", // Sets 'easy' as the default difficulty level
        },
        question_type: {
          type: Sequelize.ENUM('COMPREHENSION', 'LIST BASED', 'MCQ','Numerical'), // New field for the type of question
        },
        comprehension_question: {
          type: Sequelize.TEXT, // New field for comprehension question text
          allowNull: true, // Allows null values as not all questions may be comprehension-based
        },
       
        question_image: {
  type:Sequelize.STRING,
  allowNull:true,
        },
        answer: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        CourseSubjectName: {
          type: Sequelize.TEXT,
          references: {
            model: 'courses', // Name of the model to link to, make sure it matches your table name for courses
            key: 'subjectName', // The column in the 'courses' table that this field refers to
          }
        },
        LessonId: {
            type: Sequelize.INTEGER,
            allowNull: false,
          }
      }, {
        // Model options
        tableName: 'questions' 
      });
       return Question;
      
    };
    
  