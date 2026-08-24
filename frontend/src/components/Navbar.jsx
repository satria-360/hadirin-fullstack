import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 max-w-7xl mx-auto flex items-center justify-between">
      <button 
        onClick={() => setActiveTab('landing')} 
        className="text-2xl font-black tracking-tight drop-shadow-md text-white focus:outline-none"
      >
        Hadirin.co
      </button>

      <nav className="flex items-center bg-[#182942]/80 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 shadow-xl gap-1 md:gap-2">
        <button
          onClick={() => setActiveTab('tentang')}
          className={`text-xs md:text-sm font-medium px-3 md:px-4 py-2 rounded-xl transition ${
            activeTab === 'tentang' ? 'bg-white text-black font-semibold' : 'text-gray-300 hover:text-white'
          }`}
        >
          Tentang Kami
        </button>
        <button
          onClick={() => setActiveTab('fitur')}
          className={`text-xs md:text-sm font-medium px-3 md:px-4 py-2 rounded-xl transition ${
            activeTab === 'fitur' ? 'bg-white text-black font-semibold' : 'text-gray-300 hover:text-white'
          }`}
        >
          Fitur Utama
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className="text-xs md:text-sm font-medium text-gray-200 border border-white/20 hover:border-white rounded-xl px-3 md:px-4 py-2 flex items-center gap-2 transition"
        >
          Mulai Sekarang
          <span className="bg-white text-black rounded-full p-0.5 flex items-center justify-center">
            <ChevronRight className="w-3 h-3 stroke-[3]" />
          </span>
        </button>
      </nav>
    </header>
  );
}