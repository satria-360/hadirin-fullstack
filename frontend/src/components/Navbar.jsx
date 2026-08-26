import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 max-w-7xl mx-auto flex items-center justify-between">
      {/* Brand Logo */}
      <button
        onClick={() => setActiveTab && setActiveTab('landing')}
        className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md text-white focus:outline-none hover:opacity-90 transition"
      >
        Hadirin.co
      </button>

      {/* Floating Capsule Menu */}
      <nav className="flex items-center bg-[#15233a]/45 backdrop-blur-[40px] rounded-2xl p-3 border border-white/15 shadow-2xl gap-2 md:gap-4 ">
        <button
          onClick={() => setActiveTab && setActiveTab('tentang')}
          className={`text-xs md:text-sm font-medium px-4 py-2 rounded-[12px] transition ${activeTab === 'tentang'
            ? 'bg-white text-slate-950 font-bold shadow-md'
            : 'text-gray-300 hover:text-white'
            }`}
        >
          Tentang Kami
        </button>

        <button
          onClick={() => setActiveTab && setActiveTab('fitur')}
          className={`text-xs md:text-sm font-medium px-4 py-2 rounded-[12px] transition ${activeTab === 'fitur'
            ? 'bg-white text-slate-950 font-bold shadow-md'
            : 'text-gray-300 hover:text-white'
            }`}
        >
          Fitur Utama
        </button>

        <button
          onClick={() => setActiveTab && setActiveTab('login')}
          className="bg-transparent border border-white/20 text-white text-xs md:text-sm font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 hover:bg-white/10 active:scale-[0.98] transition shadow-md"
        >
          Mulai Sekarang
          <span className="w-5 h-5 bg-white text-slate-950 rounded-full flex items-center justify-center">
            <ArrowRight className="w-3 h-3 stroke-[3]" />
          </span>
        </button>
      </nav>
    </header>
  );
}