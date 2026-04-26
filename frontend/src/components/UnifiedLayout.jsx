import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationForm from './ApplicationForm';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import SuccessScreen from './SuccessScreen';
import { Shield, UserPlus, ArrowLeft } from 'lucide-react';

export default function UnifiedLayout() {
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const [view, setView] = useState(() => localStorage.getItem('activeView') || 'selection');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

    // Persist view
    React.useEffect(() => {
        localStorage.setItem('activeView', view);
    }, [view]);

    // Check auth on mount
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/admin/verify`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    setIsAdminAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsInitialCheckDone(true);
            }
        };
        checkAuth();
    }, [apiBaseUrl]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const backToSelection = () => {
        setView('selection');
        setSuccessData(null);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
            {!isInitialCheckDone && (
                <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-100/50 rounded-full blur-3xl" />
            </div>

            <AnimatePresence mode="wait">
                {view === 'selection' ? (
                    <motion.div 
                        key="selection"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="z-10 flex flex-col md:flex-row gap-8 items-center"
                    >
                        {/* Admin Profile Card */}
                        <motion.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setView('admin')}
                            className="group relative flex flex-col items-center p-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white w-64 md:w-80 transition-all hover:shadow-blue-500/10"
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white mb-6 shadow-xl group-hover:shadow-slate-900/20 transition-all overflow-hidden relative">
                                <Shield size={48} className="z-10" />
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Profile</h2>
                            <p className="text-slate-500 text-center text-sm">Access dashboard and manage participants</p>
                            
                            <div className="mt-6 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-xs font-bold uppercase tracking-wider group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                Locked Access
                            </div>
                        </motion.button>

                        <div className="hidden md:block w-px h-32 bg-slate-200" />

                        {/* Register Profile Card */}
                        <motion.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setView('register')}
                            className="group relative flex flex-col items-center p-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white w-64 md:w-80 transition-all hover:shadow-blue-500/10"
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white mb-6 shadow-xl group-hover:shadow-blue-500/20 transition-all overflow-hidden relative">
                                <UserPlus size={48} className="z-10" />
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">User Profile</h2>
                            <p className="text-slate-500 text-center text-sm">Register for the upcoming workshop</p>
                            
                            <div className="mt-6 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                Open Registration
                            </div>
                        </motion.button>
                    </motion.div>
                ) : view === 'admin' ? (
                    <motion.div 
                        key="admin-view"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="z-10 w-full max-w-6xl h-full flex flex-col"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <button 
                                onClick={backToSelection}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                            >
                                <ArrowLeft size={18} /> Back to Selection
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg">
                                <Shield size={18} />
                                <span className="font-bold">Admin Portal</span>
                            </div>
                        </div>

                        {!isAdminAuthenticated ? (
                            <div className="flex-1 flex items-center justify-center">
                                <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />
                            </div>
                        ) : (
                            <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                                <AdminDashboard />
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="register-view"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="z-10 w-full max-w-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <button 
                                onClick={backToSelection}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                            >
                                <ArrowLeft size={18} /> Back to Selection
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg">
                                <UserPlus size={18} />
                                <span className="font-bold">Registration</span>
                            </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-white">
                            <AnimatePresence mode="wait">
                                {!successData ? (
                                    <ApplicationForm 
                                        onSubmitSuccess={(firstName) => setSuccessData({ firstName })} 
                                        itemVariants={itemVariants} 
                                    />
                                ) : (
                                    <SuccessScreen 
                                        onReset={() => {
                                            setSuccessData(null);
                                            backToSelection();
                                        }} 
                                        firstName={successData.firstName} 
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
