import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessScreen({ onReset, firstName }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-12"
    >
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <CheckCircle2 size={48} className="text-green-500" />
        </motion.div>
        <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping-[3s]"></div>
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Registration Successful!</h2>
      <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
        Thank you for registering, {firstName}. We've successfully received your details. We will get back to you shortly with more information about the workshop.
      </p>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-200 shadow-sm"
      >
        Register another participant
      </button>
    </motion.div>
  );
}
