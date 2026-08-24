import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import FiturPage from './pages/FiturPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0051d1] via-[#012d7c] to-[#051429] text-white font-sans flex flex-col justify-between">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="pt-24 min-h-screen flex flex-col justify-between">
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'tentang' && <TentangPage />}
        {activeTab === 'fitur' && <FiturPage />}
        {activeTab === 'login' && <LoginPage />}
      </div>
    </div>
  );
}