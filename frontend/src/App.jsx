import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import FiturPage from './pages/FiturPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  const showFooter = activeTab !== 'login';
  const showNavbar = activeTab !== 'login';

  return (
    <div className="min-h-screen bg-[#082052] text-white font-sans flex flex-col selection:bg-blue-500/60 selection:text-white">
      {/* Navbar */}
      {showNavbar && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}

      {/* Main content */}
      <main className={`flex-1 flex flex-col ${activeTab === 'login' ? 'justify-center' : 'pt-20'}`}>
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'tentang' && <TentangPage onNavigate={setActiveTab} />}
        {activeTab === 'fitur' && <FiturPage onNavigate={setActiveTab} />}
        {activeTab === 'login' && <LoginPage onNavigate={setActiveTab} />}
      </main>

      {/* Footer */}
      {showFooter && <Footer onNavigate={setActiveTab} />}
    </div>
  );
}