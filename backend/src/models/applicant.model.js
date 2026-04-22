import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    resumeUrl: {
        type: String,
        required: true, // Will store Cloudinary URL
    }
}, { timestamps: true });

export const Applicant = mongoose.model('Applicant', applicantSchema);
