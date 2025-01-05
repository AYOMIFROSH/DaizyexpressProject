const express = require('express');
const { authenticate } = require('./middleware');
const fileController = require('../controllers/fileController');
const upload = require('./fileUpload')

const router = express.Router();

router.post('/upload', authenticate, upload.single('file'), fileController.uploadFile);
router.get('/user-files', authenticate, fileController.getUserFiles);
router.get('/download/:fileId', authenticate, fileController.downloadFileForUser);
router.get('/user-files-count', authenticate, fileController.getFileUploadCount)


module.exports = router;

