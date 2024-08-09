
const db = require('../Model/index.js'); // Adjust the path according to your project structure
const Message = db.Message;


/*
module.exports.createMessage = async (req, res) => {
  console.log("Request body for create messages =", req.body);
  try {
    // Extract chat data and other necessary fields from the request body
    const { questionIndex, chats, userInput, userOption } = req.body;
    const userId = req.user?.dataValues?.id; // Use optional chaining to avoid errors if req.user is undefined
    console.log("User id =", userId);
    console.log("Question id =", req.params);
    console.log("UserOption =", userOption);
    const { questionId } = req.params; // Extract QuestionId from URL parameters

    // Validation logic
    if (!userId || !questionId || !chats) {
      return res.status(400).json({ message: "UserId, QuestionId, and chats are required." });
    }

    // Ensure userInput is not null
    const safeUserInput = userInput || "No input provided";

    console.log("Creating message");
    // Create a new message in the database
    const message = await Message.create({
      questionIndex,
      chats,  // Assuming 'chats' is a structured JSON/JSONB that matches your chat format
      userInput: safeUserInput,
      UserId: userId,
      QuestionId: questionId,     
      userOption: userOption
    });

    console.log("Message created successfully: ", message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message: ", error);
    // Check if it's a Sequelize validation error
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }
    // For other types of errors
    res.status(500).json({ error: "An unexpected error occurred while creating the message." });
  }
};

*/


module.exports.createMessage = async (req, res) => {

  console.log("request body for create messages =",req.body)
    try {
        console.log("request body =",req.body)
      // Extract chat data and other necessary fields from the request body
      const { questionIndex, chats, userInput,userOption } = req.body;
      const userId = req.user.dataValues.id; // Extract UserId from req.user provided by authentication middleware
      console.log("user id =",userId)
      console.log("Question id=", req.params)
      console.log("UserOption =",userOption)
      const  {questionId}  = req.params; // Extract LessonId from URL parameters
  
      // Validation logic can be added here
      
      if (!userId || !questionId || !chats) {
        return res.status(400).json({ message: "UserId, QuestionId, and chats are required." });
      }
      console.log("i am here 2 create message")
      // Create a new message in the database
      const message = await Message.create({
        questionIndex,
        chats,  // Assuming 'chats' is a structured JSON/JSONB that matches your chat format
     //remove if not working   userInput,
     userInput: userInput || "No input provided", 
        UserId: userId,
        QuestionId:questionId,   
        userOption: userOption || null  
      //remove if not working  userOption: userOption
      });
      console.log("i am here 3 create message")
      console.log("Message created successfully: ", message);
      res.status(201).json(message);
    } catch (error) {
      console.log("i am here 4 create message")
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


  

  