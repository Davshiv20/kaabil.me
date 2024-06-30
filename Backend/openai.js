const OpenAIApi = require('openai');
//require('dotenv').config(); // Ensure dotenv is configured to use .env variables

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.API_KEY,
});

// Adjusted function to handle one step at a time
module.exports =async function processTutoringStep(userInput, sessionMessages) {
  // Add user input to session messages if not null
  if (userInput) {
    sessionMessages.push({
      role: "user",
      content: userInput
    });
  }
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: sessionMessages,
  });

  const systemResponse = response.choices[0].message.content;
  sessionMessages.push({
    role: "system",
    content: systemResponse
  });

  return { systemResponse, sessionMessages };
}