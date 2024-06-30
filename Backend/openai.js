require('dotenv').config();

const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");



// Create a Bedrock Runtime client in the AWS Region of your choice.
const client = new BedrockRuntimeClient({ region: "us-east-1" });

// Set the model ID, e.g., Llama 3 8B Instruct.
const modelId = "meta.llama3-70b-instruct-v1:0";

const processTutoringStep = async (userInput, sessionMessages = [], latexStyled = '') => {
  try {
    console.log("userinput before latex:", userInput);
    console.log("latexstyled:", latexStyled);

    if (latexStyled) {
      userInput += `\n\nLaTeX: ${latexStyled}`;
      console.log("userinput after latex:", userInput);
    }

    const client = new BedrockRuntimeClient({ region: "us-east-1" });

    // Set the model ID, e.g., Llama 3 8b Instruct.
    const modelId = "meta.llama3-70b-instruct-v1:0";

    const system_prompts = [{text: "Help the student solve the problem step by step. Let the user solve each step using your hint before moving on to the next step. Give the mathematical equations and expressions in latex."}];

    if (userInput) {
      sessionMessages.push({
        role: "user",
        content: [{ text: userInput }],
      });
      console.log("after appending userinput",sessionMessages);
    }


    // Create a command with the model ID, the message, and a basic configuration.
    const command = new ConverseCommand({
      modelId,
      messages: sessionMessages,
      system: system_prompts,
      inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
    });

      // Send the command to the model and wait for the response
      const response = await client.send(command);

      // Extract and print the response text.
      const systemResponse=response.output.message.content[0].text;
      console.log(systemResponse);
      sessionMessages.push({
      role: "assistant",
      content: [{ text: systemResponse }],
    });

//    console.log("sessionmessages:", sessionMessages);
    return { systemResponse, sessionMessages };
  } catch (error) {
    console.error('Error processing tutoring step:', error);
    throw new Error('Failed to process tutoring step');
  }
};

module.exports = processTutoringStep;
