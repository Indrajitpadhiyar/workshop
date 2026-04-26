import jwt from 'jsonwebtoken';

// Token duration: 7 days
const TOKEN_EXPIRY_DAYS = 7;
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminEmail = process.env.EMAIL_USER || 'idrtech23@gmail.com';

        if (email === adminEmail && password === adminPassword) {
            const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString();

            const token = jwt.sign(
                { email: adminEmail, role: 'admin', expiresAt },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: `${TOKEN_EXPIRY_DAYS}d` } // 7 days
            );

            // Cookie bhi set karo (same-origin pe kaam karega)
            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',  // cross-origin ke liye zaroori
                maxAge: TOKEN_EXPIRY_MS
            });

            // Token response mein bhi return karo — yahi MAIN solution hai
            // Frontend ise localStorage mein save karega aur Authorization header se bhejega
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                token,                 // <-- YEH HAI MAIN FIX — token response mein
                expiresAt,
                tokenDays: TOKEN_EXPIRY_DAYS
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const logoutAdmin = (req, res) => {
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const verifyToken = (req, res) => {
    // Token valid hai — expiry info bhi return karo
    const decoded = req.admin; // authMiddleware ne set kiya
    res.status(200).json({
        success: true,
        message: 'Token is valid',
        email: decoded?.email,
        expiresAt: decoded?.expiresAt
    });
};
