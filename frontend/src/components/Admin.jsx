import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import Background from './Background';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const response = await fetch(`${apiBaseUrl}/api/admin/verify`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('adminToken');
                    }
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    localStorage.removeItem('adminToken');
                }
            }
        };
        checkAuth();
    }, [apiBaseUrl]);

    const handleLogin = (token) => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 text-slate-800 font-sans overflow-hidden">
            <Background />
            {!isAuthenticated ? (
                <AdminLogin onLogin={handleLogin} />
            ) : (
                <AdminDashboard onLogout={handleLogout} />
            )}
        </div>
    );
}
