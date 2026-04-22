import { Applicant } from '../models/applicant.model.js';

// Submit new application
export const registerApplicant = async (req, res) => {
    try {
        const { firstName, lastName, email, position } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Resume is required.' });
        }

        const resumeUrl = `http://localhost:4000/uploads/${req.file.filename}`;

        const newApplicant = new Applicant({
            firstName,
            lastName,
            email,
            position,
            resumeUrl: resumeUrl
        });

        await newApplicant.save();

        res.status(201).json({ message: 'Registration successful', applicant: newApplicant });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all applicants for admin
export const getApplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find().sort({ createdAt: -1 });
        res.status(200).json(applicants);
    } catch (error) {
        console.error('Fetch applicants error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Delete an applicant
export const deleteApplicant = async (req, res) => {
    try {
        const { id } = req.params;
        const applicant = await Applicant.findById(id);
        
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        // Delete the resume file if it is stored locally
        if (applicant.resumeUrl && applicant.resumeUrl.includes('/uploads/')) {
            const filename = applicant.resumeUrl.split('/').pop();
            const filePath = path.join(__dirname, '../../uploads', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete from database
        await Applicant.findByIdAndDelete(id);

        res.status(200).json({ message: 'Applicant deleted successfully' });
    } catch (error) {
        console.error('Delete applicant error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
