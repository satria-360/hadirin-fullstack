import React from 'react';
import hadirinLogo from '../assets/hadirin-logo.png';

export default function HeroArtwork() {
  return (
    <div className="relative w-full max-w-[340px] md:max-w-[400px] mx-auto flex items-center justify-center select-none">
      {/* Subtle background glow */}
      <div className="absolute -inset-6 bg-blue-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Illustration Container */}
      <div className="relative w-full flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
        <img
          src={hadirinLogo}
          alt="Logo Hadirin.co"
          className="w-full max-w-[280px] md:max-w-[320px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.03]"
        />
      </div>
    </div>
  );
}

