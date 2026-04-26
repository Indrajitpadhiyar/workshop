import express from 'express';
import { adminLogin, verifyToken } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/verify', authMiddleware, verifyToken);

export default router;
