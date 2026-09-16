import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import FiturPage from './pages/FiturPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // 1. Tambahkan import DashboardPage

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen bg-[#082052] text-white font-sans flex flex-col selection:bg-blue-500 selection:text-white">                  
      {/* Navbar ditampilkan kecuali pada halaman login dan dashboard */}
      {activeTab !== 'login' && activeTab !== 'dashboard' && (
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* Sesuaikan padding top: hanya aktif untuk halaman publik (landing, tentang, fitur) */}
      <main className={`flex-1 flex flex-col ${
        activeTab === 'login' || activeTab === 'dashboard' ? '' : 'pt-32'
      }`}>
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'tentang' && <TentangPage onNavigate={setActiveTab} />}
        {activeTab === 'fitur' && <FiturPage onNavigate={setActiveTab} />}
        {activeTab === 'login' && <LoginPage onNavigate={setActiveTab} />}
        
        {/* 2. Tambahkan pengondisian halaman dashboard */}
        {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
      </main>
    </div>
  );
}