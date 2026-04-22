import express from 'express';
import multer from 'multer';
import path from 'path';
import { registerApplicant, getApplicants, deleteApplicant } from '../controllers/applicant.controller.js';

const router = express.Router();

// Local disk storage for resumes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/register', upload.single('resume'), registerApplicant);
router.get('/applicants', getApplicants);
router.delete('/applicants/:id', deleteApplicant);

export default router;
