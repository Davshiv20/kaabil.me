const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // Use environment variable for security
});

const processTutoringStep = async (
  userInput,
  sessionMessages = [],
  latexStyled = ""
) => {
  try {
    console.log("userinput before latex:", userInput);
    console.log("latexstyled:", latexStyled);

    if (latexStyled) {
      userInput += `\n\nLaTeX: ${latexStyled}`;
      console.log("userinput after latex:", userInput);
    }
    sessionMessages = sessionMessages.map(({ role, content }) => ({
      role,
      content,
    }));
    let response;
    if (!sessionMessages || sessionMessages.length === 0) {
      if (userInput) {
        sessionMessages.push({
          role: "user",
          content: userInput,
        });
      }
      console.log("first part running");
      response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: `. Your goal is to guide the user through solving problems step by step, without revealing the final answer. Let the user solve a smaller problem in each step that would lead the user closer to the solution through incremental steps, and you should only proceed to the next step after the user provides the correct answer or follows the methodology correctly.
                If User completes the last problem-solving step correctly, Congratulate the user and summarize what has been learned or achieved.
                Do not proceed to the next step without correct and complete user input at each stage. Provide a concise and crisp answer.
                Only reply the equations and mathematical expressions in Latex. Write expressions and equations in a new line.
                Here is an example of how to function:
                Initial Problem Statement:
                    1/2 + 1/3 = ?
                    Step-by-Step Guidance:
                    Step 1: Provide an initial analysis or action for the user to perform related to the problem. Do not move beyond this step. Wait for the user to respond. (For example: We need to make the denominators same. Hence we take the ____)
                    User Input: [User Response]
                    Step 2: [Conditional: Triggered only if User Input from Step 1 is correct] Guide the user to the next logical step, offering assistance if necessary but not solving the step for them. (For example: Correct. The LCM of 2 & 3 is ____)
                    User Input: [User Response]
                    Step 3: [Conditional: Respond appropriately if User asks for the direct answer] Inform the user that direct answers are not provided, and encourage them to engage with the problem-solving process. Offer a hint or guide them to focus on the current step.
                    User Input: [User Response]`,
        messages: sessionMessages,
      });
    } else {
      if (userInput) {
        sessionMessages.push({
          role: "user",
          content: userInput,
        });
      }
      console.log("second part running");
      response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: sessionMessages,
      });
    }

    const extractText = (response) => {
      if (response && response.content && Array.isArray(response.content)) {
        const textBlock = response.content.find(
          (block) => block.type === "text"
        );
        if (textBlock && textBlock.text) {
          return textBlock.text;
        }
      }
      return "";
    };

    const systemResponse = extractText(response);
    sessionMessages.push({
      role: "assistant",
      content: systemResponse,
    });
    return { systemResponse, sessionMessages };
  } catch (error) {
    console.error("Error processing tutoring step:", error);
    throw new Error("Failed to process tutoring step");
  }
};

module.exports = processTutoringStep;