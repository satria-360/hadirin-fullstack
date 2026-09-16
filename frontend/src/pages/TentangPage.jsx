import React from 'react';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#082052] text-white font-sans flex items-center justify-between relative overflow-hidden px-8 md:px-16 lg:px-24">
      
      {/* KONTEN UTAMA (KIRI) */}
      <div className="max-w-xl z-10 space-y-6 relative">
        
        {/* CARD GLASSMORPHISM BACKGROUND (DITIMPA TEKS) */}
        <div className="relative">
          {/* Box Glassmorphism di Belakang Teks */}
          <div className="absolute top-1 left-0 w-[110%] h-44 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl -z-10 shadow-lg" />
          
          {/* Teks Deskripsi Utama */}
          <p className="text-gray-200 text-sm md:text-base leading-relaxed tracking-wide font-normal pt-2">
            Berawal dari keresahan kecil tentang rekapan absensi, <strong className="text-white font-semibold">RekaEnam</strong> lahir dengan satu misi: membuat sistem absensi yang saat ini masih secara manual menjadi jauh lebih mudah. Kami berkomitmen untuk memberikan hasil yang terbaik dalam setiap tahapan pengembangan proyek. Kami juga percaya bahwa transformasi dan kemajuan pendidikan dimulai dari kesadaran serta penguasaan terhadap teknologi.
          </p>
        </div>

        {/* BADGE / CARD KECIL */}
        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 shadow-sm">
          Dibuat oleh siswa SMKN 4 jurusan RPL
        </div>

      </div>

      {/* TEKS VERTIKAL (KANAN) */}
      <div className="z-10 select-none pointer-events-none pr-4">
        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wide rotate-90 transform origin-center whitespace-nowrap">
          Tentang Kami
        </h1>
      </div>

    </div>
  );
}