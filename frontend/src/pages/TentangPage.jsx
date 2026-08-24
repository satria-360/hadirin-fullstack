import React from 'react';

export default function TentangPage() {
  return (
    <main className="flex-grow flex items-center justify-between w-full max-w-7xl mx-auto my-auto z-10 py-8 relative px-6 md:px-12">
      <div className="max-w-2xl space-y-6">
        <div className="bg-[#1e2d42]/70 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl">
          <p className="text-gray-200 text-sm md:text-base leading-relaxed">
            Berawal dari keresahan kecil tentang rekapan absensi,{' '}
            <strong className="text-white font-bold">RekaEnam</strong> lahir
            dengan satu misi: membuat sistem absensi yang saat ini masih secara
            manual menjadi jauh lebih mudah.
          </p>
        </div>

        <div className="bg-[#1e2d42]/70 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 w-fit shadow-lg">
          <p className="text-gray-300 text-xs md:text-sm font-medium">
            Dibuat oleh siswa SMKN 4 jurusan RPL
          </p>
        </div>
      </div>
    </main>
  );
}