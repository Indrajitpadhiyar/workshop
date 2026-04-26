import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import Background from './Background';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/admin/verify`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
            }
        };
        checkAuth();
    }, [apiBaseUrl]);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            await fetch(`${apiBaseUrl}/api/admin/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
            setIsAuthenticated(false);
        }
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
