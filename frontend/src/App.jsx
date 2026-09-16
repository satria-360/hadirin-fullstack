import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import FiturPage from './pages/FiturPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen bg-[#082052] text-white font-sans flex flex-col selection:bg-blue-500 selection:text-white">                          
      {/* Navbar ditampilkan kecuali pada halaman login */}
      {activeTab !== 'login' && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}

      <main className={`flex-1 flex flex-col ${activeTab === 'login' ? 'justify-center items-center' : 'pt-32'}`}>
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'tentang' && <TentangPage onNavigate={setActiveTab} />}
        {activeTab === 'fitur' && <FiturPage onNavigate={setActiveTab} />}
        {activeTab === 'login' && <LoginPage onNavigate={setActiveTab} />}
      </main>
    </div>
  );
}