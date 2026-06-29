const mongoose = require('mongoose');

const userDocumentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    documentType: {
        type: String,
        required: true,
        enum: ['identity_card', 'passport', 'driver_license', 'profile_picture'] 
    },
    fileUrl: {
        type: String, 
        required: true
    },
    mimeType: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected'] 
    },
    rejectionReason: {
        type: String, 
        default: null
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('UserDocument', userDocumentSchema);