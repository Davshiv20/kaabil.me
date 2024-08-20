const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const processImage = async (filePath) => {
  console.log("Processing image with filePath:", filePath);
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('options_json', JSON.stringify({
      math_inline_delimiters: ["$", "$"],
      rm_spaces: true
    }));

    const response = await axios.post("https://api.mathpix.com/v3/text", formData, {
      headers: {
        'app_id': process.env.MATHPIX_APP_ID,
        'app_key': process.env.MATHPIX_APP_KEY,
        ...formData.getHeaders()
      }
    });

    console.log("Mathpix API response:", response.data);
    return response.data.text;
  } catch (error) {
    console.error('Error processing image with Mathpix:', error);
    throw error;
  }
};

module.exports = {
  processImage,
  uploadImage: async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log("Upload Image function called with file:", req.file);

    const imagePath = path.resolve(__dirname, '..', 'uploads', req.file.filename);
    console.log("Image Path:", imagePath);

    try {
      const result = await processImage(imagePath);
      const latexStyled = result;
      req.latexStyled = latexStyled;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted successfully');
        }
      });
      res.status(200).json({ latex: latexStyled });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  }
};
