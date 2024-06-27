// Define a module that initializes the Message model with Sequelize
module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('Message', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,  
          },
      questionIndex: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
        chats: {
      //  type: Sequelize.STRING,
        type: Sequelize.JSONB,
        allowNull: false,
      },
      userInput: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Name of the model to link to, make sure it matches your table name for courses
          key: 'id', // The column in the 'courses' table that this field refers to
        }
      },
      QuestionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'questions', // Name of the model to link to, make sure it matches your table name for courses
          key: 'id', // The column in the 'courses' table that this field refers to
        }
      }
     
    }, {
      // Model options (optional)
      tableName: 'messages'  // Specify the table name in the database
    
    });

     return Message;  // Return the defined model to be used elsewhere
    
  };
  
