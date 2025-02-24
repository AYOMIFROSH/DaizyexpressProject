const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileData: {
        type: Buffer,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['not processed', 'in process', 'processed'],
        default: 'not processed',
    },
    inProgress: {
        type: Boolean,
        default: false,
    },
    statusInProgressTime: {
        type: Date
    },
    timeFrame: {
        type: String,
        enum: ['morning', 'evening', 'new day', 'saturday']
    },
    statusProcessedTime: {
        type: Date
    },
    processedTimeFrame: {
        type: String,
        enum: ['morning', 'evening', 'new day', 'saturday']
    },
    attempts: {
        type: String,
        enum: ['not attempted', 'attempted 1', 'attempted 2', 'attempted 3'],
        default: 'not attempted',
      },   
    hasBeenReplaced: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentDetails',
        required: true,
    },
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
