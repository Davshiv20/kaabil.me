const router = require('express').Router()
const QuestionController = require('../Controllers/question.controller');
const { ensureAuth } = require('../Middleware/auth')
const messageController = require('../Controllers/message.controller');

/*
router.get('/', ensureGuest ,(req, res) => {
   // res.render('login')
  })
  */
 

  router.post('/openai', QuestionController.lessonai);
  router.get('/lessons/questions/',QuestionController.getQuestions);


  router.get('/lessons/questionType/:type',QuestionController.getQuestionsByType);
  router.get('/lessons/questions/:subjectName',ensureAuth,QuestionController.getQuestionsBySubjectName);
  router.get('/lessons/questions/:subjectName/:lessonId',QuestionController.getQuestionsByLessonId);
  router.post('/messages/:questionId', ensureAuth, messageController.createMessage);
  router.get('/messages/:questionId', ensureAuth, messageController.getMessagesById);


module.exports=router;

// api/openai