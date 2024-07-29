const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../Controllers/image.controller');
const processTutoringStep = require('../openai').processTutoringStep; // Ensure this path is correct

const router = express.Router();

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, 'uploads/');
   },
   filename: function (req, file, cb) {
       cb(null, `${Date.now()}-${file.originalname}`);
   }
});

const fileFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
       cb(null, true);
   } else {
       cb(new Error('Only images are allowed'), false);
   }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/', upload.single('file'), (req, res, next) => {
   console.log("Received file:", req.file);
   uploadImage(req, res, next);
});

module.exports = router;
