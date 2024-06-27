
const db = require('../Model/index.js'); // Adjust the path according to your project structure
const Message = db.Message;



module.exports.createMessage = async (req, res) => {
  console.log("request body =",req.body)
  console.log("request body =",req.body)
    try {
        console.log("request body =",req.body)
      // Extract chat data and other necessary fields from the request body
      const { questionIndex, chats, userInput } = req.body;
      const userId = req.user.dataValues.id; // Extract UserId from req.user provided by authentication middleware
      console.log("user id =",userId)
      console.log("Question id=", req.params)
      const  {questionId}  = req.params; // Extract LessonId from URL parameters
  
      // Validation logic can be added here
      
      if (!userId || !questionId || !chats) {
        return res.status(400).json({ message: "UserId, QuestionId, and chats are required." });
      }
  
      // Create a new message in the database
      const message = await Message.create({
        questionIndex,
        chats,  // Assuming 'chats' is a structured JSON/JSONB that matches your chat format
        userInput,
        UserId: userId,
        QuestionId:questionId
      });
  
      console.log("Message created successfully: ", message);
      res.status(201).json(message);
    } catch (error) {
      console.log("Error creating message: ", error);
      res.status(500).json({ error: error.message });
    }
  }

  





  
module.exports.getMessagesById = async (req, res) => {
//  console.log("i am here")
  try {
      const { questionId } = req.params;  // Capture 'questionId' from the URL parameters
      const userId = req.user.dataValues.id;
      console.log("Question Id = ", questionId);
      console.log("User Id = ", userId);

      const messages = await Message.findAll({
          where: {
            QuestionId: questionId,  // Filter messages where QuestionId matches questionId
                UserId: userId  // Filter messages where UserId matches userId
          }
      });

      console.log(`messages found for QuestionId ${questionId}  and the respective UserId are ${userId}`);
      res.status(200).json(messages);
  } catch (error) {
      console.log("Error fetching messages : ", error);
      res.status(500).json({ error: error.message });
  }
}


  

  