import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function Navbar({ activeTab, setActiveTab, currentUser }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari 40px, tulisan Hadirin.co disembunyikan
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'pricing', label: 'Harga' },
    { id: 'tentang', label: 'Tentang Kami' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        'header',
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
      <button
        onClick={() => setActiveTab && setActiveTab('landing')}
        className={`pointer-events-auto text-2xl md:text-3xl font-black tracking-tight drop-shadow-md text-white focus:outline-none hover:opacity-90 transition-all duration-300 ease-out cursor-pointer ${
          scrolled
            ? 'opacity-0 -translate-y-3 pointer-events-none scale-95'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
        aria-hidden={scrolled}
        tabIndex={scrolled ? -1 : 0}
      >
        Hadirin.co
      </button>

      <nav className="pointer-events-auto flex items-center bg-[#15233a]/45 backdrop-blur-[44px] rounded-2xl p-5 md:p-4 border border-white/15 shadow-2xl gap-1.5 md:gap-2 transition-all duration-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab && setActiveTab(tab.id)}
            className={`text-xs md:text-sm font-medium px-4 py-2 rounded-[12px] transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white/15 text-white font-semibold'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="h-5 w-[1px] bg-white/20 mx-1 hidden sm:block" />

        {currentUser ? (
          <button
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className="text-xs md:text-sm font-bold px-4 py-2 rounded-[12px] bg-white text-black shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <span>Dashboard</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab && setActiveTab('login')}
            className={`text-xs md:text-sm font-bold px-4 py-2 rounded-[12px] transition-all duration-200 cursor-pointer active:scale-95 shadow-md ${
              activeTab === 'login'
                ? 'bg-white text-slate-950 font-bold'
                : 'bg-white text-[#082052] hover:bg-slate-100 hover:shadow-white/20'
            }`}
          >
            Coba Sekarang!
          </button>
        )}
      </nav>
    </header>
  );
}