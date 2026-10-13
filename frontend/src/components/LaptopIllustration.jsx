import React from 'react';

export default function LaptopIllustration() {
  return (
    <div className="relative w-full max-w-[340px] md:max-w-[400px] mx-auto flex items-center justify-center select-none">
      <img
        src="/images/paper-stacked.png"
        alt="Tumpukan Berkas Kertas Absensi"
        className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}
