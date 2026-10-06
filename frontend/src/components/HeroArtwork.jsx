import React from 'react';
import hadirinLogo from '../assets/hadirin-logo.png';

export default function HeroArtwork() {
  return (
    <div className="relative w-full max-w-[460px] lg:max-w-[520px] flex items-center justify-center lg:justify-end select-none">
      {/* Subtle background glow */}
      <div className="absolute -inset-4 bg-blue-500/25 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Illustration Container */}
      <div className="relative w-full flex items-center justify-center lg:justify-end">
        <img
          src="/images/hadirin-co-logo.png"
          alt="Logo Hadirin.co"
          className="w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] h-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.38)] transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}

