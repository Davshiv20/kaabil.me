const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // Use environment variable for security
});
//const OpenAIApi = require('openai');
//require('dotenv').config(); // Ensure dotenv is configured to use .env variables
//
//const openai = new OpenAIApi.OpenAI({
//  apiKey: process.env.OPENAI_API_KEY,
//});

const processTutoringStep = async (userInput, sessionMessages = [], latexStyled = '') => {
  try {
    console.log("userinput before latex:", userInput);
    console.log("latexstyled:", latexStyled);

    if (latexStyled) {
      userInput += `\n\nLaTeX: ${latexStyled}`;
      console.log("userinput after latex:", userInput);
    }
    sessionMessages = sessionMessages.map(({ role, content }) => ({ role, content }));
    let response;
    if (!sessionMessages || sessionMessages.length === 0) {
      if (userInput) {
      sessionMessages.push({
        role: "user",
        content: userInput
      });
    }
      console.log("first part running")
      response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: `Goal: Guide the user through solving problems step-by-step without revealing the answer directly.

Steps:

Initial Step Prompt: Ask the user a question or provide an initial action related to the first step required to solve the problem. This question should nudge the user in the right direction without giving away the answer.

Wait for User Input: Pause after the initial prompt and wait for the user response.
Conditional Response:

Correct Answer: If the user provides a correct response or demonstrates a correct approach, acknowledge their progress and offer guidance for the next step.
Incorrect Answer: If the user response is incorrect, provide a gentle nudge or hint to help them get back on track without revealing the solution directly. Encourage them to analyze the problem again or rephrase the initial prompt in a different way.
"Direct Answer" Request Handling:

User Asks for Answer: If the user directly asks for the answer, politely inform them that the goal is to guide them through the problem-solving process. Encourage them to engage with the steps and build their problem-solving skills.
Commendation:

Problem Solved: Once the user successfully completes the final step and solves the problem, congratulate them on their achievement. Briefly summarize the key concepts or techniques learned during the process.
Example:

Problem:

$$\frac{1}{2} + \frac{1}{3} = \text{(?)} $$

Step 1 Prompt:

We can only add fractions if they have the same denominator. Considering the equation: $$ \frac{1}{2} + \frac{1}{3} = \text{(?)} $$ , what can we do to add these fractions?

Remember that your steps should follow the solution provided to you strictly. Do not try to solve the problem on your own. Use only "$" and "$$" for inlineMath and displayMath (blocks).`,
        messages: sessionMessages
      });
    } else {
      if (userInput) {
      sessionMessages.push({
        role: "user",
        content: userInput
      });
    }
      console.log("second part running")
      response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: sessionMessages
      });
    }


    const extractText = (response) => {
      if (response && response.content && Array.isArray(response.content)) {
        const textBlock = response.content.find(block => block.type === 'text');
        if (textBlock && textBlock.text) {
          return textBlock.text;
        }
      }
      return '';
    };

    const systemResponse = extractText(response);

    sessionMessages.push({
      role: "assistant",
      content: systemResponse
    });
    console.log("sessionmessages:",sessionMessages)
    return { systemResponse, sessionMessages };
  } catch (error) {
    console.error('Error processing tutoring step:', error);
    throw new Error('Failed to process tutoring step');
  }
};

module.exports = processTutoringStep;
