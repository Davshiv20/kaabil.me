

module.exports = (sequelize, Sequelize) => {
    const UserProgress = sequelize.define('UserProgress', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      courseSubjectName: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'subjectName',
        },
      },
      LessonId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      xpGained: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      cpGained: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      questionsAttempted: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      questionsCorrect: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      lessonCompleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      tableName: 'userProgress',
      indexes: [
        {
          unique: true,
          fields: ['UserId', 'courseSubjectName', 'LessonId']
        }
      ]
    });
  
    return UserProgress;
  };



  /*

We're creating a UserProgress model that will track a user's progress for each lesson within a course.
The model includes:

UserId: Links to the User model
courseSubjectName: Links to the Course model
lessonId: Corresponds to the LessonId in your Question model
xpGained and cpGained: Track points earned in this lesson
questionsAttempted and questionsCorrect: Track performance in the lesson
lessonCompleted: Boolean to mark lesson completion
completedAt: Timestamp for lesson completion


We've added a unique index on UserId, courseSubjectName, and lessonId to ensure each user has only one progress record per lesson per course.

To implement the gamification system with this structure:

When a user starts a lesson, create a new UserProgress record.
As the user answers questions:

Update questionsAttempted and questionsCorrect
Update cpGained based on correct answers (+4 CP for first try, +2 CP for second try)


When all questions in a lesson are answered:

Set lessonCompleted to true and set completedAt
Calculate and update xpGained (+70 XP if all questions are correct)
Update the User model's xp and cp fields
Update the User model's streak and lastLessonDate fields



  */


/*

async function updateProgressAfterQuestion(userId, courseSubjectName, lessonId, isCorrect, attemptNumber) {
  const [userProgress, created] = await UserProgress.findOrCreate({
    where: { UserId: userId, courseSubjectName, lessonId },
    defaults: { questionsAttempted: 0, questionsCorrect: 0, cpGained: 0 }
  });

  userProgress.questionsAttempted += 1;
  if (isCorrect) {
    userProgress.questionsCorrect += 1;
    if (attemptNumber === 1) {
      userProgress.cpGained += 4;
    } else if (attemptNumber === 2) {
      userProgress.cpGained += 2;
    }
  }

  await userProgress.save();

  // Check if lesson is completed (assuming 10 questions per lesson)
  if (userProgress.questionsAttempted === 10) {
    await completeLesson(userId, courseSubjectName, lessonId);
  }
}

async function completeLesson(userId, courseSubjectName, lessonId) {
  const userProgress = await UserProgress.findOne({
    where: { UserId: userId, courseSubjectName, lessonId }
  });

  userProgress.lessonCompleted = true;
  userProgress.completedAt = new Date();

  if (userProgress.questionsCorrect === 10) {
    userProgress.xpGained = 70;
  }

  await userProgress.save();

  // Update user's total XP and CP
  const user = await User.findByPk(userId);
  user.xp += userProgress.xpGained;
  user.cp += userProgress.cpGained;

  // Update streak
  const today = new Date().toDateString();
  if (user.lastLessonDate !== today) {
    user.streak += 1;
    user.xp += 10 * user.streak;  // Bonus XP for streak
    user.lastLessonDate = today;
  }

  await user.save();
}


*/