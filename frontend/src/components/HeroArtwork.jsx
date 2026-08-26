import React from 'react';
import heroImg from '../assets/hero-artwork.png';

export default function HeroArtwork() {
  return (
    <div className="relative w-full max-w-[380px] md:max-w-[440px] mx-auto flex items-center justify-center select-none">
      {/* Subtle background glow */}
      <div className="absolute -inset-4 bg-blue-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Illustration Container */}
      <div className="relative w-full flex items-center justify-center p-2">
        <img
          src={heroImg}
          alt="Ilustrasi Pendidikan Hadirin"
          className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] rounded-3xl transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
    </div>
  );
}

