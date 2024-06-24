const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient("", new AzureKeyCredential(""));

const processTutoringStep = async (userInput, sessionMessages, latexStyled = '') => {
  console.log("userinput before latex:", userInput);
  console.log("latexstyled:", latexStyled);

  if (latexStyled) {
    userInput += `\n\nLaTeX: ${latexStyled}`;
    console.log("userinput after latex:", userInput);
  }

  if (userInput) {
    sessionMessages.push({
      role: "user",
      content: userInput
    });
  }

  const deploymentId = "GPT4o";
  const response = await client.getChatCompletions(deploymentId, sessionMessages);

  const systemResponse = response.choices[0].message.content;
  sessionMessages.push({
    role: "system",
    content: systemResponse
  });
  return { systemResponse, sessionMessages };
};

module.exports = processTutoringStep;
