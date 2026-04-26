import React, { useState } from 'react';
import { motion } from 'framer-motion'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const apiBaseUrl = import.meta.env.VITE_API_URL || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.token) {
                localStorage.setItem('adminToken', data.token);
                onLogin(data.token);
            } else {
                setError(data.message || 'Incorrect password. Please try again.');
                setPassword('');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 rounded-3xl p-8 z-10 border border-white/50"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white mb-6 shadow-lg shadow-slate-500/30">
                    <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Admin Access</h2>
                <p className="text-slate-500 text-sm">Enter the master password to view workshop registrations.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            required
                            className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
                            placeholder="Enter password..."
                        />
                    </div>
                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium mt-2 pl-1">
                            {error}
                        </motion.p>
                    )}
                </div>

                <button
                    type="submit"
                    className="group relative w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-xl shadow-slate-900/20 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                    Access Dashboard
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </form>
        </motion.div>
    );
}
