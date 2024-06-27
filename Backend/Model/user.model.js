

// Define a Sequelize model for Users, particularly for managing user information post-authentication
module.exports= (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Ensures email addresses are unique within the table
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    }, {
      // Model options (optional)
      tableName: 'users' // Explicitly defines the table name in the database
    });
 
    return User;
  };
  