import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <main className="flex-grow flex items-center justify-center w-full max-w-6xl mx-auto my-auto z-10 py-10 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-6 max-w-lg">
          <h2 className="text-4xl md:text-[2.75rem] font-bold leading-[1.15] tracking-tight text-white">
            Cara Modern Untuk Mengelola Kehadiran Siswa.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-[90%]">
            Tinggalkan rekap manual dikertas. Catat, pantau dan buat laporan kehadiran siswa dalam satu aplikasi.
          </p>
          <div>
            <button
              onClick={() => onNavigate('fitur')}
              className="inline-flex bg-[#f3f4f6] text-[#0047b3] font-bold text-sm px-6 py-3.5 rounded-xl items-center gap-2 hover:bg-white transition shadow-lg"
            >
              Pelajari Lebih Lanjut
              <ExternalLink className="w-4 h-4 opacity-80" />
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end relative">
          <div className="w-full max-w-[380px] h-64 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <span className="text-sm text-gray-300">[ Ilustrasi Landing ]</span>
          </div>
        </div>
      </div>
    </main>
  );
}