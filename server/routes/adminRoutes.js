const express = require('express');
const { verifyAdmin } = require('./middleware');
const fileController = require('../controllers/fileController');
const upload = require('./fileUpload')

const router = express.Router();

router.get('/files/:fileId/download', verifyAdmin, fileController.getdownloadById);
router.get('/usage-metrics', verifyAdmin, fileController.getPlatformUsageMetrics);
router.get('/users', verifyAdmin,  fileController.getAllUsers);
router.get('/users/:id/details', verifyAdmin, fileController.getUserByIdWithFiles);
router.get('/users/:id', verifyAdmin, fileController.getUserById);
router.get('/users-with-documents', verifyAdmin, fileController.getUsersWithDocuments);
router.patch('/files/:fileId/update-status', verifyAdmin, fileController.updateFileStatus);
router.post('/files/:fileId/replace', verifyAdmin, upload.single('file'), fileController.replaceFileData);

module.exports = router;