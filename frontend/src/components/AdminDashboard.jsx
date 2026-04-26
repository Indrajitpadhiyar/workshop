import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Download, LogOut, FileText, Trash2, X, Send, CheckCircle, AlertCircle, Bell, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard({ onLogout }) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const [searchTerm, setSearchTerm] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [inviteLink, setInviteLink] = useState('https://chat.whatsapp.com/your-group-link');
    const [isSending, setIsSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState('');
    const [activeTab, setActiveTab] = useState('applicants');
    const [isMobileView, setIsMobileView] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Registration', message: 'Indrajit Padhiyar just registered for Web Developer position.', time: '5m ago', read: false },
        { id: 2, title: 'System Update', message: 'The registration form has been updated to include mobile view.', time: '1h ago', read: true },
    ]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${apiBaseUrl}/api/applicants`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const contentType = response.headers.get("content-type");
                
                if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    const processedData = data.map(app => ({
                        id: app._id,
                        firstName: app.firstName,
                        lastName: app.lastName,
                        email: app.email,
                        position: app.position,
                        date: new Date(app.createdAt).toLocaleDateString(),
                        resumeUrl: app.resumeUrl
                    }));
                    setApplicants(processedData);
                } else if (response.status === 401) {
                    toast.error('Session expired. Please login again.');
                    onLogout();
                } else {
                    const errorText = await response.text();
                    console.error('Fetch applicants failed:', response.status, errorText);
                    toast.error(`Failed to load applicants: Server error ${response.status}`);
                }
            } catch (error) {
                console.error('Failed to fetch applicants:', error);
                toast.error('Failed to load applicants. Network error.');
            }
        };

        fetchApplicants();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            const deleteToast = toast.loading('Deleting registration...');
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${apiBaseUrl}/api/applicants/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setApplicants(applicants.filter(app => app.id !== id));
                    toast.success('Registration deleted successfully.', { id: deleteToast });
                } else {
                    toast.error('Failed to delete registration.', { id: deleteToast });
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('An error occurred while deleting.', { id: deleteToast });
            }
        }
    };

    const filteredApplicants = applicants.filter(app =>
        (app.firstName + ' ' + app.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendInvite = async () => {
        setIsSending(true);
        setEmailStatus('');
        try {
            const message = `Hello ${selectedApplicant.firstName},\n\nYou have been selected! Please join our group using the link below:\n\n${inviteLink}\n\nBest regards,\nWorkshop Team`;
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${apiBaseUrl}/api/send-email`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    to: selectedApplicant.email,
                    subject: 'Workshop Group Invitation',
                    message
                })
            });

            if (response.ok) {
                setEmailStatus('success');
            } else {
                setEmailStatus('error');
            }
        } catch (error) {
            console.error('Send email error:', error);
            setEmailStatus('error');
        }
        setIsSending(false);
    };

    return (
        <>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                width: isMobileView ? '400px' : '100%',
                transition: { type: 'spring', damping: 25, stiffness: 200 }
            }}
            className={`h-[85vh] bg-white/90 backdrop-blur-xl shadow-2xl shadow-blue-900/10 rounded-3xl overflow-hidden flex flex-col z-10 border border-white/50 mx-auto`}
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-white/50 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Workshop Registrations</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage and view all registered participants.</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => setActiveTab('applicants')}
                        className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${activeTab === 'applicants' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                        title="Applicants"
                    >
                        <Users size={20} />
                        <span className="hidden md:inline text-sm font-medium">Applicants</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`p-2 rounded-lg border transition-all flex items-center gap-2 relative ${activeTab === 'notifications' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                        title="Notifications"
                    >
                        <Bell size={20} />
                        {notifications.some(n => !n.read) && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                        <span className="hidden md:inline text-sm font-medium">Notifications</span>
                    </button>
                    <div className="w-[1px] h-8 bg-slate-200 mx-1 hidden sm:block"></div>
                    <button 
                        onClick={() => setIsMobileView(!isMobileView)}
                        className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${isMobileView ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                        title="Toggle Mobile View"
                    >
                        <Smartphone size={20} />
                        <span className="hidden md:inline text-sm font-medium">Mobile View</span>
                    </button>
                    <button onClick={onLogout} className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-2" title="Log Out">
                        <LogOut size={20} />
                        <span className="hidden md:inline text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
                {activeTab === 'applicants' ? (
                    <div className="flex flex-col gap-6">
                        {/* Search and Filter Bar */}
                        {!isMobileView && (
                            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search participants..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <button className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Download size={18} /> Export
                                </button>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                            <th className="py-4 px-6">Name</th>
                                            <th className={`py-4 px-6 ${isMobileView ? 'hidden' : ''}`}>Email</th>
                                            <th className="py-4 px-6">Position</th>
                                            <th className={`py-4 px-6 ${isMobileView ? 'hidden' : ''}`}>Date</th>
                                            <th className="py-4 px-6 text-center">Resume</th>
                                            <th className="py-4 px-6 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredApplicants.length > 0 ? (
                                            filteredApplicants.map((app, index) => (
                                                <motion.tr
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    key={app.id}
                                                    onClick={() => setSelectedApplicant(app)}
                                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                                >
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                                                                {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                                                            </div>
                                                            <div className="truncate">
                                                                <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{app.firstName} {app.lastName}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`py-4 px-6 text-slate-600 font-medium ${isMobileView ? 'hidden' : ''}`}>{app.email}</td>
                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tight">
                                                            {app.position}
                                                        </span>
                                                    </td>
                                                    <td className={`py-4 px-6 text-slate-500 text-sm ${isMobileView ? 'hidden' : ''}`}>{app.date}</td>
                                                    <td className="py-4 px-6 text-center">
                                                        <a 
                                                            href={app.resumeUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex" 
                                                            title="View Resume"
                                                        >
                                                            <FileText size={18} />
                                                        </a>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(app.id);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex" 
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={isMobileView ? "4" : "6"} className="py-12 text-center text-slate-500 font-medium">
                                                    No participants found matching your search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                            <button 
                                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                                className="text-sm text-blue-600 font-semibold hover:underline"
                            >
                                Mark all as read
                            </button>
                        </div>
                        <div className="space-y-3">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <motion.div 
                                        key={notif.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${notif.read ? 'bg-white border-slate-100 opacity-75' : 'bg-white border-blue-100 shadow-md ring-1 ring-blue-50'}`}
                                        onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                                                    <Bell size={20} />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h4>
                                                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">{notif.message}</p>
                                                    <span className="text-xs text-slate-400 mt-3 block font-medium uppercase tracking-wider">{notif.time}</span>
                                                </div>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Bell size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium">No notifications yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>

        {/* Profile Modal */}
        {selectedApplicant && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-[95vw] max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">Applicant Profile</h2>
                        <button onClick={() => setSelectedApplicant(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                        {/* Left side: Info */}
                        <div className="w-full md:w-72 lg:w-80 p-6 border-r border-slate-100 bg-white overflow-y-auto flex-shrink-0">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">
                                    {selectedApplicant.firstName.charAt(0)}{selectedApplicant.lastName.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 text-center">{selectedApplicant.firstName} {selectedApplicant.lastName}</h3>
                                <p className="text-blue-600 font-medium mt-1">{selectedApplicant.position}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-slate-800 font-medium break-words">{selectedApplicant.email}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Registration Date</p>
                                    <p className="text-slate-800 font-medium">{selectedApplicant.date}</p>
                                </div>
                                <div className="pt-2 flex flex-col gap-3">
                                    <a href={selectedApplicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-medium transition-colors border border-blue-100">
                                        <Download size={18} />
                                        Download Resume
                                    </a>
                                </div>

                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mt-4">
                                    <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider mb-2">Send Group Invite</p>
                                    <p className="text-xs text-slate-500 mb-3">Send a pre-written invitation to <strong>{selectedApplicant.email}</strong>.</p>
                                    <input 
                                        type="text" 
                                        value={inviteLink}
                                        onChange={(e) => setInviteLink(e.target.value)}
                                        placeholder="Group Link (e.g., WhatsApp, Discord)"
                                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button 
                                        onClick={handleSendInvite}
                                        disabled={isSending}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
                                    >
                                        {isSending ? (
                                            <span className="animate-pulse">Sending...</span>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Send Invite
                                            </>
                                        )}
                                    </button>

                                    {emailStatus === 'success' && (
                                        <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
                                            <CheckCircle size={14} /> Email sent successfully!
                                        </div>
                                    )}
                                    {emailStatus === 'error' && (
                                        <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                            <AlertCircle size={14} /> Failed to send email. Check setup.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Right side: Resume Preview */}
                        <div className="flex-1 bg-slate-100 flex flex-col p-4 overflow-hidden">
                            <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Resume Preview</p>
                            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                                {selectedApplicant.resumeUrl ? (
                                    <iframe 
                                        src={selectedApplicant.resumeUrl} 
                                        className="w-full h-full border-0 absolute inset-0"
                                        title="Resume Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-slate-400">
                                        No resume provided
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
        </>
    );
}
