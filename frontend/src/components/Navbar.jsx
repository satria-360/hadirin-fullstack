import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

const navItems = [
  { key: 'tentang', label: 'Tentang Kami' },
  { key: 'fitur', label: 'Fitur Utama' },
];

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (key) => {
    setActiveTab && setActiveTab(key);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
          {/* Brand */}
          <button
            id="nav-brand"
            onClick={() => handleNav('landing')}
            className="text-xl md:text-2xl font-black tracking-tight text-white hover:opacity-85 transition-opacity focus:outline-none"
          >
            Hadirin<span className="text-red-500">.co</span>
          </button>

          {/* Desktop Nav */}
          <nav
            className={`hidden md:flex items-center gap-1 px-3 py-2 rounded-2xl border transition-all duration-300 ${
              scrolled
                ? 'bg-[#082052]/90 backdrop-blur-2xl border-white/15 shadow-2xl'
                : 'bg-white/[0.07] backdrop-blur-xl border-white/10'
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                id={`nav-${item.key}`}
                onClick={() => handleNav(item.key)}
                className={`text-sm font-medium px-4 py-2 rounded-[12px] transition-all duration-200 ${
                  activeTab === item.key
                    ? 'bg-white text-slate-900 font-semibold shadow-md'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              id="nav-login"
              onClick={() => handleNav('login')}
              className="ml-2 flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Mulai Sekarang
              <span className="w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center">
                <ArrowRight className="w-3 h-3 stroke-[3]" />
              </span>
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white backdrop-blur"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-[#082052]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col pt-24 px-6 gap-3 transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.key}
              id={`nav-mobile-${item.key}`}
              onClick={() => handleNav(item.key)}
              className={`text-left text-base font-medium px-5 py-3.5 rounded-xl transition-all ${
                activeTab === item.key
                  ? 'bg-white text-slate-900 font-semibold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            id="nav-mobile-login"
            onClick={() => handleNav('login')}
            className="mt-2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-3.5 rounded-xl transition-all"
          >
            Mulai Sekarang
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}