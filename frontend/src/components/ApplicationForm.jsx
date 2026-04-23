import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Send, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DragDropZone from './DragDropZone';

export default function ApplicationForm({ onSubmitSuccess, itemVariants }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload your resume to continue.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Registering your application...');

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('position', formData.position);
      data.append('resume', resumeFile);

      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        body: data,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to register.');
      }

      toast.success('Registration successful!', { id: loadingToast });
      setIsSubmitting(false);
      onSubmitSuccess(formData.firstName);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred during registration.', { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
      className="flex flex-col h-full justify-center"
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <img src="/IDR.jpeg" alt="IDRTECH Logo" className="h-20 w-auto rounded-3xl shadow-lg shadow-slate-200" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          Join Our Workshop
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Upload your resume and provide your details below to register. We're looking forward to having you at the workshop.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <User size={18} />
              </div>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm" placeholder="Jane" />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <User size={18} />
              </div>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm" placeholder="Doe" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm" placeholder="jane@example.com" />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Desired Position</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Briefcase size={18} />
              </div>
              <input type="text" name="position" required value={formData.position} onChange={handleInputChange} className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm" placeholder="e.g. Frontend Developer" />
            </div>
          </motion.div>
        </div>

        <DragDropZone resumeFile={resumeFile} setResumeFile={setResumeFile} itemVariants={itemVariants} />

        <motion.div variants={itemVariants} className="pt-4">
          <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl shadow-blue-500/30 transform transition-all duration-200 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Register for Workshop
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
