import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminEmail = process.env.EMAIL_USER || 'idrtech23@gmail.com';

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(
                { email: adminEmail, role: 'admin' },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '30d' } // Extended to 30 days for maximum persistence
            );

            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: false, // Set to true if using HTTPS, false for localhost
                sameSite: 'lax', 
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            return res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const logoutAdmin = (req, res) => {
    res.clearCookie('adminToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const verifyToken = (req, res) => {
    res.status(200).json({ success: true, message: 'Token is valid' });
};
