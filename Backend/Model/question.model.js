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
          type: Sequelize.ENUM('COMPREHENSION', 'LIST BASED', 'MCQ','Numerical','Objective Question I',
           'Objective I', 'Integer Answer Type Question','Integer type question'), // New field for the type of question
        },
        comprehension_question: {
          type: Sequelize.TEXT, // New field for comprehension question text
          allowNull: true, // Allows null values as not all questions may be comprehension-based
        },
        chapter: {
          type: Sequelize.TEXT, // New field for chapter text
          allowNull: true, // Allows null values as not all questions may have chapters
        },
       
        question_image: {
  type:Sequelize.STRING,
  allowNull:true,
        },
        answer: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        courseName: {
          type: Sequelize.TEXT,
          references: {
            model: 'courses', // Name of the model to link to, make sure it matches your table name for courses
            key: 'subjectName', // The column in the 'courses' table that this field refers to
          }
        },
        LessonId: {
            type: Sequelize.INTEGER,
         //   allowNull: false,
         allowNull: true,
          }
      }, {
        // Model options
        tableName: 'questions' 
      });
       return Question;
      
    };
    
  

    /*
 question_type: {
          type: Sequelize.ENUM('COMPREHENSION', 'LIST BASED', 'MCQ','Numerical','Objective Question I',
          'Objective Question II',
          'Objective Question II (Only or More Than One)',
          'Objective Question II (Only one or More than one)',
          'Numerical Value',
          'Assertion and Reason',
          'Match the Columns',
          'Fill in the Blank',
          'True/False',
         'Integer Answer Type Questions',
         'Analytical and Descriptive Question',
         'Pragraph Based Questions',
         'Passage'), // New field for the type of question
        },



    */