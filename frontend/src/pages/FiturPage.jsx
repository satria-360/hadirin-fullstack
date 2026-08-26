import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import catImg from '../assets/cat-feature.png';
import monkeyImg from '../assets/monkey-feature.png';

export default function FiturPage() {
  const featureList = [
    {
      id: 1,
      type: 'left-image',
      title: 'Hemat Waktu.',
      description: 'Proses absensi yang cepat dapat menghemat waktu pembelajaran',
      image: catImg,
      alt: 'Fitur Hemat Waktu',
    },
    {
      id: 2,
      type: 'right-image',
      title: 'Data Real-Time & Akurat.',
      description: 'Data absensi langsung tersimpan aman tanpa risiko rekap hilang atau salah hitung.',
      image: monkeyImg,
      alt: 'Fitur Data Real-Time & Akurat',
    },
    {
      id: 3,
      type: 'left-image',
      title: 'Hemat Waktu.',
      description: 'Proses absensi yang cepat dapat menghemat waktu pembelajaran',
      image: catImg,
      alt: 'Fitur Efisiensi Waktu',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center pt-2 sm:pt-4">
      {/* 1. OUTER RED ARCH CONTAINER (Full-width 1 full-page hero) */}
      <div className="w-full">
        <div className="w-full bg-[#f10606] rounded-t-[100px] sm:rounded-t-[160px] md:rounded-t-[240px] lg:rounded-t-[320px] shadow-[0_-15px_30px_rgba(241,6,6,0.3)] transition-all">

          {/* Full Page Hero Header (Mengisi 1 layar penuh & teks di tengah) */}
          <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center text-center px-6 pb-16">
            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.2] drop-shadow-sm">
                Didesain untuk Mempermudah Hidupmu.
              </h1>
              <p className="text-white/95 text-xs sm:text-sm md:text-base lg:text-lg font-normal leading-relaxed max-w-xl mx-auto">
                Jelajahi berbagai fitur unggulan yang dirancang khusus untuk membantu kamu bekerja lebih cepat, efisien, dan tanpa ribet.
              </p>
            </div>
          </div>

          {/* 2. INNER RED ARCH CONTAINER (Overlays / nimpa on scroll with drop shadow) */}
          <div className="relative z-10 w-full bg-[#d60505] rounded-t-[100px] sm:rounded-t-[140px] md:rounded-t-[200px] lg:rounded-t-[180px] pt-20 sm:pt-20 md:pt-28 pb-16 sm:pb-24 px-6 sm:px-10 md:px-16 shadow-[0_-20px_70px_rgba(0,0,0,0.5)]">

            {/* Feature Items List */}
            <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16 md:space-y-24">
              {featureList.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center"
                >
                  {/* Media Card (Left or Right) */}
                  <div
                    className={`flex justify-center ${item.type === 'right-image' ? 'order-1 md:order-2 md:justify-end' : 'order-1 md:justify-start'
                      }`}
                  >
                    <div className="group relative w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-black/20 shadow-2xl border border-white/20 transition-transform duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover group-hover:brightness-105 transition-all duration-500"
                      />
                      {/* Glass glare effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/15 pointer-events-none" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div
                    className={`space-y-2 sm:space-y-2.5 ${item.type === 'right-image'
                      ? 'order-2 md:order-1 text-left md:text-right'
                      : 'order-2 md:order-2 text-left'
                      }`}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                      {item.title}
                    </h2>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. FOOTER ("Hubungi Kami") */}
            <div className="w-full max-w-7xl mx-auto mt-16 sm:mt-24 md:mt-32">
              <div className="w-full bg-[#521c1c]/50 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-12 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.55)] drop-shadow-[0_20px_25px_rgba(0,0,0,0.4)] space-y-8 text-left">
                {/* Title with Arrow Icon */}
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white tracking-tight">
                    Hubungi Kami
                  </h3>
                  <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.5]" />
                </div>

                {/* Contact Details */}
                <div className="space-y-6 pt-2">
                  <div>
                    <h4 className="text-white font-bold text-base sm:text-lg">Email</h4>
                    <a
                      href="mailto:hadirin.co@gmail.com"
                      className="text-slate-300 text-xs sm:text-sm hover:text-white transition mt-0.5 inline-block"
                    >
                      hadirin.co@gmail.com
                    </a>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-base sm:text-lg">Our Office</h4>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5 leading-relaxed max-w-xl">
                      Jl. Gede Bage Selatan No.11, Kota Bandung, Jawa Barat, Indonesia, 401233
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}