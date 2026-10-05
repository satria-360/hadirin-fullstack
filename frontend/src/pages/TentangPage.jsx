import React from 'react';
import TentangImg from '../assets/tentang-illustration.png';

export default function TentangPage() {
  return (
    <div className="w-full min-h-screen bg-[#082052] text-white font-sans overflow-x-hidden relative">
      {/* Glow merah BESAR di belakang ilustrasi (kiri-bawah) — sesuai screenshot */}
      <div className="pointer-events-none absolute bottom-[10%] left-[6%] w-[720px] h-[720px] rounded-full bg-[#ee0000]/45 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[18%] left-[14%] w-[420px] h-[420px] rounded-full bg-[#ff1a1a]/35 blur-[90px]" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* KIRI: Ilustrasi Tim (di atas glow merah) */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start relative">
            <img
              src={TentangImg}
              alt="Ilustrasi Tim Hadirin.co"
              className="w-full max-w-[560px] h-auto object-contain drop-shadow-2xl select-none relative z-10"
              draggable="false"
            />
          </div>

          {/* KANAN: Judul Horizontal + Paragraf */}
          <div className="order-1 lg:order-2 space-y-5 text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
              Tentang Kami
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Berawal dari keresahan kecil tentang rekapan absensi, RekaEnam lahir saat ini masih secara manual menjadi jauh lebih mudah. Kami berkomitmen untuk memberikan hasil yang terbaik dalam setiap tahapan pengembangan proyek. Kami juga percaya bahwa transformasi dan kemajuan pendidikan dimulai dari kesadaran serta penguasaan terhadap teknologi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}