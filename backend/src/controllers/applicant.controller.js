import { Applicant } from '../models/applicant.model.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Submit new application
export const registerApplicant = async (req, res) => {
    try {
        const { firstName, lastName, email, position } = req.body;
        console.log('Registering applicant:', { firstName, lastName, email, position });

        // Check for duplicate email
        const existingApplicant = await Applicant.findOne({ email });
        if (existingApplicant) {
            console.error('Registration failed: Email already exists');
            return res.status(400).json({ message: 'You have already registered with this email.' });
        }

        if (!req.file) {
            console.error('Registration failed: No resume file provided');
            return res.status(400).json({ message: 'Resume is required.' });
        }

        // Construct local URL for the resume
        // Note: Using a relative path for the DB, and serving it statically in server.js
        const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log('Local file saved:', resumeUrl);

        console.log('Saving applicant to database...');
        const newApplicant = new Applicant({
            firstName,
            lastName,
            email,
            position,
            resumeUrl: resumeUrl
        });

        await newApplicant.save();
        console.log('Applicant saved successfully');

        res.status(201).json({ message: 'Registration successful', applicant: newApplicant });
    } catch (error) {
        console.error('Registration error detail:', error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        });
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

// Send email to applicant
export const sendInviteEmail = async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ message: 'Recipient and message are required.' });
        }

        // It is recommended to configure EMAIL_USER and EMAIL_PASS in your .env
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `IDRTECH <${process.env.EMAIL_USER}>`,
            to,
            subject: subject || 'Workshop Invitation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:logo" alt="IDRTECH Logo" style="width: 80px; height: auto; border-radius: 12px;" />
                    </div>
                    <h2 style="color: #1e293b; text-align: center;">Workshop Invitation</h2>
                    <div style="color: #475569; line-height: 1.6; white-space: pre-line;">
                        ${message}
                    </div>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
                        © ${new Date().getFullYear()} IDRTECH. All rights reserved.
                    </div>
                </div>
            `,
            attachments: [{
                filename: 'IDR.jpeg',
                path: path.join(__dirname, '../../../frontend/public/IDR.jpeg'),
                cid: 'logo'
            }]
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ message: 'Failed to send email. Ensure EMAIL_USER and EMAIL_PASS are set correctly.' });
    }
};
