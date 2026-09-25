import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import FiturPage from './pages/FiturPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cek validitas token saat web dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            handleLogout();
          }
        })
        .catch(() => {
          // Abaikan bila backend belum menyala
        });
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-[#082052] text-white font-sans flex flex-col selection:bg-blue-500 selection:text-white">                  
      {/* Navbar ditampilkan kecuali pada halaman login dan dashboard */}
      {activeTab !== 'login' && activeTab !== 'dashboard' && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Sesuaikan padding top: hanya aktif untuk halaman publik */}
      <main className={`flex-1 flex flex-col ${
        activeTab === 'login' || activeTab === 'dashboard' ? '' : 'pt-32'
      }`}>
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} currentUser={currentUser} />}
        {activeTab === 'tentang' && <TentangPage onNavigate={setActiveTab} />}
        {activeTab === 'fitur' && <FiturPage onNavigate={setActiveTab} />}
        {activeTab === 'login' && (
          <LoginPage 
            onNavigate={setActiveTab} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        
        {activeTab === 'dashboard' && (
          <DashboardPage 
            onNavigate={setActiveTab} 
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}