import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import gsap from 'gsap';

export default function App() {
  // Helper untuk membaca tab dari history state atau localStorage
  const getInitialTab = () => {
    try {
      const stateTab = window.history.state?.tab;
      if (stateTab) return stateTab;
      const savedTab = localStorage.getItem('activeTab');
      const token = localStorage.getItem('token');
      if (savedTab) {
        if (savedTab === 'dashboard' && !token) return 'landing';
        return savedTab;
      }
      return token ? 'dashboard' : 'landing';
    } catch {
      return 'landing';
    }
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fungsi setActiveTab yang sinkron dengan History API browser
  const setActiveTab = (tab, addToHistory = true) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('activeTab', tab);
      if (addToHistory && window.history.state?.tab !== tab) {
        window.history.pushState({ tab }, '', window.location.pathname);
      }
    } catch {}
  };

  // Dengarkan tombol back / forward browser
  useEffect(() => {
    // Inisialisasi initial state jika belum ada
    if (!window.history.state || !window.history.state.tab) {
      window.history.replaceState({ tab: activeTab }, '', window.location.pathname);
    }

    const handlePopState = (event) => {
      if (event.state && event.state.tab) {
        setActiveTabState(event.state.tab);
        try {
          localStorage.setItem('activeTab', event.state.tab);
        } catch {}
      } else {
        // Jika tidak ada state di history (misal kembali ke titik awal), arahkan ke landing atau dashboard
        const token = localStorage.getItem('token');
        const fallback = token ? 'dashboard' : 'landing';
        setActiveTabState(fallback);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cek validitas token saat web dimuat (opsional, tapi bagus untuk UX)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Opsional: Jika sudah login otomatis, mungkin ingin arahkan ke dashboard?
            // Tapi sesuai permintaanmu, kita biarkan tetap di landing kecuali user klik sendiri.
          } else {
            handleLogout();
          }
        })
        .catch(() => { });
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    setActiveTab('dashboard'); // Setelah login sukses, baru masuk dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setActiveTab('landing'); // Logout kembali ke landing page
  };

   useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('main', 
        { opacity: 0, y: 30, filter: 'blur(8px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#082052] text-white font-sans flex flex-col selection:bg-blue-500 selection:text-white">

      {/* Navbar ditampilkan pada landing, tentang, dan pricing publik (disembunyikan saat login, dashboard, payment, atau mode upgrade langganan) */}
      {activeTab !== 'login' && activeTab !== 'dashboard' && activeTab !== 'payment' && (activeTab !== 'pricing' || (!currentUser && (typeof window === 'undefined' || sessionStorage.getItem('pricingSource') !== 'upgradeModal'))) && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (typeof window !== 'undefined') sessionStorage.removeItem('pricingSource');
            setActiveTab(tab);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Konten Utama */}
      <main className={`flex-1 flex flex-col ${activeTab === 'login' || activeTab === 'dashboard' || activeTab === 'payment' || (activeTab === 'pricing' && (currentUser || (typeof window !== 'undefined' && sessionStorage.getItem('pricingSource') === 'upgradeModal'))) ? '' : 'pt-32'}`}>

        {activeTab === 'landing' && (
          <LandingPage onNavigate={setActiveTab} currentUser={currentUser} />
        )}

        {activeTab === 'tentang' && <TentangPage onNavigate={setActiveTab} />}

        {activeTab === 'pricing' && (
          <PricingPage
            onNavigate={setActiveTab}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setActiveTab('payment');
            }}
          />
        )}

        {activeTab === 'payment' && (
          <PaymentPage
            plan={selectedPlan}
            onBack={() => setActiveTab('pricing')}
            onSuccess={() => {
              sessionStorage.removeItem('pricingSource');
              setActiveTab('dashboard');
            }}
          />
        )}

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
            onUpdateUser={setCurrentUser}
          />
        )}

      </main>
    </div>
  );
}