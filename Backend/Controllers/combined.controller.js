

/*
const { processImage } = require('./image.controller');
const processTutoringStep = require('../openai');
const path = require('path');
const fs = require('fs');

const handleRequest = async (req, res) => {
  try {
    console.log("Request received:");
    console.log("userInput:", req.body.userInput);
    console.log("sessionMessages:", req.body.sessionMessages);
    console.log("file:", req.file);

    const userInput = req.body.userInput;
    const sessionMessages = JSON.parse(req.body.sessionMessages);
    let latexStyled = '';

    if (req.file) {
      const imagePath = path.resolve(__dirname, '..', 'uploads', req.file.filename);
      const result = await processImage(imagePath);
      latexStyled = result;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted successfully');
        }
      });
    }

    const combinedUserInput = `${userInput}\n${latexStyled}`;
    console.log("combinedUserInput:", combinedUserInput);
    const { systemResponse, sessionMessages: updatedMessages } = await processTutoringStep(combinedUserInput, sessionMessages);

    res.json({ systemResponse, updatedMessages });
  } 
};

module.exports = { handleRequest };

*/


const { processImage } = require('./image.controller');
const processTutoringStep = require('../openai');
const QuestionController = require('../Controllers/question.controller');
const path = require('path');
const fs = require('fs');

const handleRequest = async (req, res) => {

  try {
    console.log("Request received:");
  //  console.log("userInput:", req.body.userInput);
    console.log("sessionMessages:", req.body.sessionMessages);
    console.log("file:", req.file);

  //  const userInput = req.body.userInput;
  const userInputString = req.body.userInput;
let userInput;
try {
  userInput = JSON.parse(userInputString);
} catch (error) {
  userInput = userInputString;
}
console.log("userInput:", userInput);

console.log("userInput type:", typeof userInput);
    console.log("userInput 2:", JSON.stringify(userInput, null, 2));


    const sessionMessages = JSON.parse(req.body.sessionMessages);
    let questionData;
    if(userInput.id){
     questionData = await QuestionController.fetchQuestionById(userInput.id);
    }
    console.log("question data = ", questionData)
    let latexStyled = '';

    if (req.file) {
      const imagePath = path.resolve(__dirname, '..', 'uploads', req.file.filename);
      const result = await processImage(imagePath);
      latexStyled = result;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted successfully');
        }
      });
    }



    const inputToOption = ["A", "B", "C", "D"];
    let Prompt;

    if (typeof userInput === 'object' && userInput !== null){
      console.log("userInput is an object");

      if (["Numerical", "Integer type question", "Integer Answer Type Question","Objective I"].includes(userInput.QuestionType)) {
/*
        Prompt = `Help me solve this numerical question step by step.
                        Here's the question: '${userInput.Question}'. The correct answer is ${userInput.Answer}. I entered ${userInput.UserAnswer}, which is incorrect. The correct solution to this question is: '${userInput.Solution}'. Please help me solve the question step by step, following the correct solution provided to you. Start directly from Step 1.`;

*/


Prompt = `Help me solve this numerical question step by step.
Here's the question: '${userInput.Question}'. I entered ${userInput.UserAnswer}, which is incorrect. Please help me solve the question step by step, following the correct solution provided to you. Start directly from Step 1.`;

      }
      // if mcq
      else{
        // if attempt === 0
        if (userInput.Attempts === 0){
          /*
          Prompt = `Help me solve this question step by step.
          Here's the question: '${userInput.Question}', here are the options: ${userInput.Options}. The correct answer was: '${userInput.Answer}'. I think the correct option is ${userInput.UserAnswer}, but this is wrong. The correct solution to this question is: '${userInput.Solution}'. Please help me solve the question step by step, following the correct solution provided to you. Start directly from Step 1.`;
       */
     

Prompt = `Help me solve this question step by step.
Here's the question: '${userInput.Question}', here are the options: ${userInput.Options}. I think the correct option is ${userInput.UserAnswer}. But this is wrong. Please help me solve the question step by step, following the correct solution provided to you. Start directly from Step 1.`;
        }
        // if attempts === 1
        else if(userInput.Attempts === 1){
          Prompt = `I think the answer is the option ${userInput.UserAnswer}. ${
            userInput.SecondAnswer
              ? `For my second attempt, i have selected ${userInput.SecondAnswer}.`
              : ""
          } `;
console.log("prompt for second attempt =",Prompt);

        }else{
          Prompt =
          userInput.AllUserInputs
            .map(
              (input, index) =>
                `Attempt ${index + 1}: I selected ${inputToOption[input]}`
            )
            .join("\n") +
          `\nHere's the question again: '${userInput.Question}', with options: ${userInput.Options}. Please try again!`;
        
        }
      }

    }
    // userinput is from gptcard
    // userinput is not an object
    else{
      console.log("user input for string and number = ", userInput)
     // Prompt = userInput;
     Prompt = String(userInput);

    }

    /*
    if(typeof userInput === 'string' || typeof userInput === 'number' ){
      Prompt = userInput
    }
*/

console.log("the prompt =",Prompt)




    const combinedUserInput = `${Prompt}\n${latexStyled}`;
    console.log("combinedUserInput:", combinedUserInput);
    const { systemResponse, sessionMessages: updatedMessages } = await processTutoringStep(combinedUserInput, sessionMessages, questionData);


    const processedMessages = processMessages(updatedMessages);
   //const processedMessages = processMessages(sessionMessages);
    console.log("processed message =", processedMessages);
    res.json({ systemResponse, processedMessages });


  }catch (error) {
    console.error('Error during tutoring session:', error);
    res.status(500).send('An error occurred during the tutoring session.');
  }




















}
module.exports = { handleRequest };




/*
function processMessages(updatedMessages) {
  return updatedMessages.map(message => {
    if (message.role === 'user' && Array.isArray(message.content)) {
      return {
        ...message,
        content: message.content.map(contentItem => {
          if (typeof contentItem.text === 'string') {
            // Check if the content has already been processed
            if (typeof contentItem.text === 'object' && 
                ('question' in contentItem.text || 'userInput' in contentItem.text)) {
              // If already processed, return as is
              return contentItem;
            }

            if (contentItem.text.includes("Here's the question:")) {
              // Complex question format
              const extracted = extractQuestionData(contentItem.text);
              return { text: extracted };
            } else {
              // Simple user input
            //  return { text: { userInput: contentItem.text.trim() } };
            return { text: contentItem.text  };
            }
          }
          return contentItem;
        })
      };
    }
    return message;
  });
}

function extractQuestionData(text) {
  const questionMatch = text.match(/Here's the question: '(.+?)'/);
  const optionsMatch = text.match(/here are the options: (.+?)\./);
//  const correctAnswerMatch = text.match(/The correct answer was: '(.+?)'/);
  const userPickedMatch = text.match(/I think the correct option is (.+?),/);
//  const solutionMatch = text.match(/The correct solution to this question is: '(.+?)'/s);

  return {
    question: questionMatch ? questionMatch[1] : '',
    options: optionsMatch ? optionsMatch[1].split(',').map(opt => opt.trim()) : [],
 //   correctAnswer: correctAnswerMatch ? correctAnswerMatch[1] : '',
    userPickedOption: userPickedMatch ? userPickedMatch[1] : '',
 //   correctSolution: solutionMatch ? solutionMatch[1] : ''
  };
}

*/


function processMessages(updatedMessages) {
  return updatedMessages.map(message => {
    if (message.role === 'user' && Array.isArray(message.content)) {
      return {
        ...message,
        content: message.content.map(contentItem => {
          if (typeof contentItem.text === 'string') {
            try {
              // Try to parse the text as JSON
              const parsedText = JSON.parse(contentItem.text);
              // If successful, it's already in the correct format, so return it
              return { text: parsedText };
            } catch (e) {
              // If parsing fails, it's not JSON, so process it as before
              if (contentItem.text.includes("Here's the question:")) {
                const extracted = extractQuestionData(contentItem.text);
                return { text: extracted };
              } else {
                return { text: contentItem.text.trim() };
              }
            }
          }
          return contentItem;
        })
      };
    }
    return message;
  });
}

function extractQuestionData(text) {
  const questionMatch = text.match(/Here's the question: '(.+?)'/);
  const optionsMatch = text.match(/here are the options: (.+?)\./);
  const userPickedMatch = text.match(/I think the correct option is (.+?)(?:,|\.|$)/);

  let userPickedOption = '';
  if (userPickedMatch) {
    // Extract only the option letter, removing any additional text
    userPickedOption = userPickedMatch[1].trim().split(' ')[0];
  }

  return {
    question: questionMatch ? questionMatch[1] : '',
    options: optionsMatch ? optionsMatch[1].split(',').map(opt => opt.trim()) : [],
    userPickedOption: userPickedOption
  };
}