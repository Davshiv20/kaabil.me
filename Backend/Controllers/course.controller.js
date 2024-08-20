
const db = require('../Model/index.js'); // Adjust the path according to your project structure
const Course = db.course; 


module.exports.getCourses = async (req, res) => {

    const userId = req.user.dataValues.id;
    console.log("user id for course =", userId)
    try {
        const courses = await Course.findAll();
   //     console.log("these are the courses   = "      course     )
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}