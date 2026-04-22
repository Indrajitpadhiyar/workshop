import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Download, LogOut, FileText, Trash2, X } from 'lucide-react';

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/applicants');
                if (response.ok) {
                    const data = await response.json();
                    // Map MongoDB _id to id, and format dates if needed
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
                }
            } catch (error) {
                console.error('Failed to fetch applicants:', error);
            }
        };

        fetchApplicants();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            try {
                const response = await fetch(`http://localhost:4000/api/applicants/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setApplicants(applicants.filter(app => app.id !== id));
                } else {
                    alert('Failed to delete registration.');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('An error occurred while deleting.');
            }
        }
    };

    const filteredApplicants = applicants.filter(app =>
        (app.firstName + ' ' + app.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-6xl h-[85vh] bg-white/90 backdrop-blur-xl shadow-2xl shadow-blue-900/10 rounded-3xl overflow-hidden flex flex-col z-10 border border-white/50"
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
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search participants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors" title="Export to CSV">
                        <Download size={20} />
                    </button>
                    <button onClick={() => window.location.href = '/'} className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-2" title="Log Out">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="py-4 px-6">Name</th>
                                <th className="py-4 px-6">Email</th>
                                <th className="py-4 px-6">Desired Position</th>
                                <th className="py-4 px-6">Registration Date</th>
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
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                    {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{app.firstName} {app.lastName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 font-medium">{app.email}</td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {app.position}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 text-sm">{app.date}</td>
                                        <td className="py-4 px-6 text-center">
                                            <a 
                                                href={app.resumeUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex justify-center mx-auto inline-flex" 
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
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex justify-center mx-auto" 
                                                title="Delete Record"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-500">
                                        No participants found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>

        {/* Profile Modal */}
        {selectedApplicant && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">Applicant Profile</h2>
                        <button onClick={() => setSelectedApplicant(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[500px]">
                        {/* Left side: Info */}
                        <div className="w-full md:w-1/3 p-6 border-r border-slate-100 bg-white overflow-y-auto">
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
                                <div className="pt-4 flex justify-center">
                                    <a href={selectedApplicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20">
                                        <Download size={18} />
                                        Download Resume
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right side: Resume Preview */}
                        <div className="w-full md:w-2/3 bg-slate-100 flex flex-col p-4 overflow-hidden">
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
