import express from 'express';
import multer from 'multer';
import path from 'path';
import { registerApplicant, getApplicants, deleteApplicant, sendInviteEmail, updateApplicantStatus } from '../controllers/applicant.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Disk storage to save files locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/register', upload.single('resume'), registerApplicant);
router.get('/applicants', authMiddleware, getApplicants);
router.put('/applicants/status/:id', authMiddleware, updateApplicantStatus);
router.delete('/applicants/:id', authMiddleware, deleteApplicant);
router.post('/send-email', authMiddleware, sendInviteEmail);

export default router;
