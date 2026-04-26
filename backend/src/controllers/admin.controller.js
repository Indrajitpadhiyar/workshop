import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
    try {
        const { password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (password === adminPassword) {
            const token = jwt.sign(
                { role: 'admin' },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '24h' }
            );
            return res.status(200).json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const verifyToken = (req, res) => {
    res.status(200).json({ success: true, message: 'Token is valid' });
};
