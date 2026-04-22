import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import Background from './Background';

export default function Admin() {
    // Simple state for authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 text-slate-800 font-sans overflow-hidden">
            <Background />
            {!isAuthenticated ? (
                <AdminLogin onLogin={() => setIsAuthenticated(true)} />
            ) : (
                <AdminDashboard />
            )}
        </div>
    );
}
