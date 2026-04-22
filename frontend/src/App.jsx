import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import ApplicationForm from './components/ApplicationForm';
import SuccessScreen from './components/SuccessScreen';
import Admin from './components/Admin';
import './App.css';

function App() {
  const [successData, setSuccessData] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Simple routing using the window location
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Background />

      <motion.div
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 rounded-3xl p-8 md:p-12 z-10 border border-white/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {!successData ? (
            <ApplicationForm onSubmitSuccess={(firstName) => setSuccessData({ firstName })} itemVariants={itemVariants} />
          ) : (
            <SuccessScreen onReset={() => setSuccessData(null)} firstName={successData.firstName} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
