import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, X } from 'lucide-react';

export default function DragDropZone({ resumeFile, setResumeFile, itemVariants }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div variants={itemVariants} className="space-y-2 pt-2">
      <label className="text-sm font-semibold text-slate-700 ml-1">Your Resume</label>
      
      <div 
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
            : resumeFile 
              ? 'border-blue-300 bg-blue-50/50 hover:bg-blue-50' 
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-slate-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        
        <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {resumeFile ? (
              <motion.div 
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                  <File size={28} className="fill-blue-100" />
                </div>
                <div className="max-w-[80%] overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">{resumeFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button"
                  onClick={removeFile}
                  className="mt-2 text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <X size={14} /> Remove File
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    <span className="text-blue-600 font-semibold cursor-pointer">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
