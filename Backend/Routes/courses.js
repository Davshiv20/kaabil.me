const router = require('express').Router()
const CourseController = require('../Controllers/course.controller');
const { ensureAuth } = require('../Middleware/auth')


router.get('/courses/',ensureAuth,CourseController.getCourses);

module.exports=router;