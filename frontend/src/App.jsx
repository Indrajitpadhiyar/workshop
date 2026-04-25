import React from 'react';
import { Toaster } from 'react-hot-toast';
import UnifiedLayout from './components/UnifiedLayout';
import Background from './components/Background';
import './App.css';

function App() {
  return (
    <div className="relative font-sans text-slate-800">
      <Toaster position="top-center" />
      <Background />
      <UnifiedLayout />
    </div>
  );
}

export default App;
