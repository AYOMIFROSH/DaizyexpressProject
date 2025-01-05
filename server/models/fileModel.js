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
    hasBeenReplaced: { 
        type: Boolean, 
        default: false 
    }, 


});

const File = mongoose.model('File', fileSchema);
module.exports = File;
