import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'pricing', label: 'Harga' },
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'fitur', label: 'Fitur Utama' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 max-w-7xl mx-auto flex items-center justify-between">
      <button
        onClick={() => setActiveTab && setActiveTab('landing')}
        className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md text-white focus:outline-none hover:opacity-90 transition cursor-pointer"
      >
        Hadirin.co
      </button>

      <nav className="flex items-center bg-[#15233a]/45 backdrop-blur-[40px] rounded-2xl p-3 border border-white/15 shadow-2xl gap-2 md:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab && setActiveTab(tab.id)}
            className={`text-xs md:text-sm font-medium px-4 py-2 rounded-[12px] transition cursor-pointer ${activeTab === tab.id
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-gray-300 hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}