import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerApplicant, getApplicants, deleteApplicant, sendInviteEmail, updateApplicantStatus } from '../controllers/applicant.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Disk storage to save files locally
// Use absolute path to ensure files always go to backend/uploads/
const uploadsDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
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
