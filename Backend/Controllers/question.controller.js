
const db = require('../Model/index.js');
const Question = db.question;
const processTutoringStep = require("../openai.js");
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


module.exports.lessonai = async (req, res, latexStyled) => {

  // data = req.body
  
   // prompt_question=data.question
   // prompt_option=data.option
  // prompt_solution=data.prompt_solution
  // prompt_user_input=data.prompt_user_input

/*
   const sessionPrompt = `Question and option: 
   ${prompt_question}
   ${prompt_option}
   
   Answer:
   ${prompt_solution}
   
   
   Use the below style of interaction with the student to help the student solve problems. 
    
   Take SMALL STEPS!
   Break down the solution to the question given to you into small and simple steps. The steps are directions given by you and then wait for my response and then based on my response take next step as direction. Try to learn my learning rate based on my responses and break down the solution into steps accordingly. For example, if I am not able to answer even the most simple questions, make the next question very basic. Give me one-sentence feedback about what you think my current learning speed/stage is. Also let me know if I am improving. Wait for my response after each step and make the next step according to my answer. 
   `;
*/

let { userInput, sessionMessages } = req.body;
console.log("Received userInput:", userInput);

//   Initialize the session with a prompt if starting
//  if (!sessionMessages || sessionMessages.length === 0) {
//    sessionMessages = [{
//      role: "system",
//      content:`Guide the user through solving problems step by step, without revealing the final answer. Let the user solve each step, and then only move on to the next step. Do not solve it yourself. Each response from GPT should lead the user closer to the solution through incremental steps.
//Here’s an example of how you should function:
//
//Question:
//1/2 + 1/3 = ?
//
//Solution:
//LCM of 2 and 3 is 6 \\
//So converting fractions, \\
//\frac{3}{6} + \frac{2}{6} \\
//\frac{5}{6}
//
//Step-by-Step Guidance:
//
//Step 1: Provide an initial analysis or action for the user to perform related to the problem. Do not move beyond this step. Wait for the user to respond. (For example: We need to make the denominators same. Hence we take the ____)
//User Input: [User Response]
//
//Step 2: [Conditional: Triggered only if User Input from Step 1 is correct] Guide the user to the next logical step, offering assistance if necessary but not solving the step for them. (For example: Correct. The LCM of 2 & 3 is ____)
//User Input: [User Response]
//
//Step 3: [Conditional: Respond appropriately if User asks for the direct answer] Inform the user that direct answers are not provided, and encourage them to engage with the problem-solving process. Offer a hint or guide them to focus on the current step.
//User Input: [User Response]
//
//Continue with subsequent steps, each conditioned on the users correct engagement with the previous step. Each step should be crafted to require input or confirmation from the user that they understand and are ready to proceed.
//
//Final Step: [Conditional: If User completes the last problem-solving step correctly] Congratulate the user and summarize what has been learned or achieved.
//
//[If at any point the User response is incorrect or incomplete, provide specific guidance related to the step they are struggling with, and encourage them to try again or offer a hint to proceed.]
//
//Do not proceed to the next step without correct and complete user input at each stage. Provide a concise and crisp answer.
//`
//    }];
//  }


  
  try {
    const { systemResponse, sessionMessages: updatedMessages } = await processTutoringStep(userInput, sessionMessages, latexStyled);
    res.json({ systemResponse, updatedMessages });
  } catch (error) {
    console.error('Error during tutoring session:', error);
    res.status(500).send('An error occurred during the tutoring session.');
  }




  

  };
  



  module.exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll();
        console.log("these are the questions   = ",
          questions
         )
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports.getQuestionsByType = async (req, res) => {
  try {
      const { type } = req.params;
      console.log("lessons type = ",type)
      const questions = await Question.findAll({
          where: {
              question_type: type
          }
      });
      console.log("questions found  = ",questions)
      res.status(200).json(questions);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}




module.exports.getQuestionsBySubjectName = async (req, res) => {
  console.log("i am here")
  try {
      const { subjectName } = req.params;  // Capture 'subjectName' from the URL parameters
      console.log("Requested CourseSubjectName = ", subjectName);

      const questions = await Question.findAll({
          where: {
              CourseSubjectName: subjectName  // Filter lessons where 'CourseSubjectName' matches 'subjectName'
          }
      });

      console.log("Lessons found for subject = ", questions);
      res.status(200).json(lessons);
  } catch (error) {
      console.log("Error fetching lessons by subject name: ", error);
      res.status(500).json({ error: error.message });
  }
}



module.exports.getQuestionsByLessonId = async (req, res) => {
  console.log("i am here")
  try {
      const { lessonId } = req.params;  // Capture 'subjectName' from the URL parameters
      const { subjectName } = req.params;
      console.log("Requested CourseSubjectName = ", subjectName);
      console.log("Requested lessonId = ", lessonId);

      const questions = await Question.findAll({
          where: {
                LessonId: lessonId,  // Filter questions where 'LessonId' matches 'lessonId'
                CourseSubjectName: subjectName  // Filter questions where 'CourseSubjectName' matches 'subjectName'
          }
      });

      console.log(`questions found for LessonID ${lessonId}  and the respective questions are ${questions}`);
      res.status(200).json(questions);
  } catch (error) {
      console.log("Error fetching lessons by question name: ", error);
      res.status(500).json({ error: error.message });
  }
}






module.exports.lesson = async (req, res, latexStyled) => {

  // data = req.body
  
   // prompt_question=data.question
   // prompt_option=data.option
  // prompt_solution=data.prompt_solution
  // prompt_user_input=data.prompt_user_input

/*
   const sessionPrompt = `Question and option: 
   ${prompt_question}
   ${prompt_option}
   
   Answer:
   ${prompt_solution}
   
   
   Use the below style of interaction with the student to help the student solve problems. 
    
   Take SMALL STEPS!
   Break down the solution to the question given to you into small and simple steps. The steps are directions given by you and then wait for my response and then based on my response take next step as direction. Try to learn my learning rate based on my responses and break down the solution into steps accordingly. For example, if I am not able to answer even the most simple questions, make the next question very basic. Give me one-sentence feedback about what you think my current learning speed/stage is. Also let me know if I am improving. Wait for my response after each step and make the next step according to my answer. 
   `;
*/

let { userInput, sessionMessages } = req.body;

  // Initialize the session with a prompt if starting
  if (!sessionMessages || sessionMessages.length === 0) {
    sessionMessages = [{
      role: "system",
      content: `
      answer in small steps without revealing the answer to the students. reveal each step in each interaction only ask students questions to answer which lead them to the actual answer. You are a teaching assistant.
      `
    }];
  }


  
  try {
    const { systemResponse, sessionMessages: updatedMessages } = await processTutoringStep(userInput, sessionMessages, latexStyled);
    res.json({ systemResponse, updatedMessages });
  } catch (error) {
    console.error('Error during tutoring session:', error);
    res.status(500).send('An error occurred during the tutoring session.');
  }
  };
