import React from 'react';
import heroImg from '../assets/hero-artwork.png';

export default function HeroArtwork() {
  return (
    <div className="relative w-full max-w-[420px] md:max-w-[500px] mx-auto flex items-center justify-center select-none">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-blue-500/15 blur-3xl animate-pulse-glow pointer-events-none" />
      {/* Red accent blob */}
      <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

      {/* Main image with float animation */}
      <div className="relative z-10 w-full animate-float">
        <img
          src={heroImg}
          alt="Ilustrasi Sistem Presensi Hadirin.co"
          className="w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)] rounded-3xl"
        />
      </div>

      {/* Floating badge – Presensi real-time */}
      <div className="absolute -bottom-4 left-4 glass rounded-2xl px-4 py-2.5 shadow-xl z-20 animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
        <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Akurasi Presensi</p>
        <p className="text-white font-bold text-lg leading-none mt-0.5">99.9<span className="text-green-400">%</span></p>
      </div>

      {/* Floating badge – Sekolah */}
      <div className="absolute top-6 -right-2 md:-right-6 glass rounded-2xl px-4 py-2.5 shadow-xl z-20 animate-slide-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
        <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Sekolah Terdaftar</p>
        <p className="text-white font-bold text-lg leading-none mt-0.5">50<span className="text-red-400">+</span></p>
      </div>
    </div>
  );
}
