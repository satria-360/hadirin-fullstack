import React from 'react';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#082052] text-white font-sans flex items-center justify-between relative overflow-hidden px-8 md:px-16 lg:px-24">
      <div className="max-w-xl z-10 space-y-6 relative">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg">
          <p className="text-gray-200 text-sm md:text-base leading-relaxed tracking-wide">
            Berawal dari keresahan kecil tentang rekapan absensi, <strong className="text-white font-semibold">RekaEnam</strong> lahir dengan satu misi: membuat sistem absensi yang saat ini masih secara manual menjadi jauh lebih mudah. Kami berkomitmen untuk memberikan hasil yang terbaik dalam setiap tahapan pengembangan proyek. Kami juga percaya bahwa transformasi dan kemajuan pendidikan dimulai dari kesadaran serta penguasaan terhadap teknologi.
          </p>
        </div>

        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 shadow-sm">
          Dibuat oleh siswa SMKN 4 jurusan RPL
        </div>
      </div>

      <div className="z-10 select-none pointer-events-none pr-4">
        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wide rotate-90 transform origin-center whitespace-nowrap">
          Tentang Kami
        </h1>
      </div>
    </div>
  );
}