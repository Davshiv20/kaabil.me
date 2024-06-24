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
  } catch (error) {
    console.error('Error during tutoring session:', error);
    res.status(500).send('An error occurred during the tutoring session.');
  }
};

module.exports = { handleRequest };
