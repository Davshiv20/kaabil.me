const { AzureOpenAI } = require("openai");

// Load the .env file if it exists
require("dotenv").config();

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<api key>";
const apiVersion = "2024-05-01-preview";
const deployment = "GPT4o";


async function processTutoringStep(userInput, sessionMessages) {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  try {
    if (userInput) {
      sessionMessages.push({
        role: "user",
        content: userInput
      });
    }

    const response = await client.chat.completions.create({
      messages: sessionMessages,
      model: deployment
    });

    const systemResponse = response.choices[0].message.content;
    sessionMessages.push({
      role: "system",
      content: systemResponse
    });

    return { systemResponse, sessionMessages };
  } catch (error) {
    console.error('Error during the Azure OpenAI API call:', error);
    throw new Error('Failed to process tutoring step due to an API error');
  }
}


module.exports = { processTutoringStep };
