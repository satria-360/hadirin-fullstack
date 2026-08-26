import React from 'react';
import laptopImg from '../assets/laptop.png';

export default function LaptopIllustration() {
  return (
    <div className="relative w-full max-w-[380px] md:max-w-[440px] mx-auto flex items-center justify-center select-none">
      <img
        src={laptopImg}
        alt="Ilustrasi Laptop Hadirin"
        className="w-full h-auto object-contain drop-shadow-2xl mix-blend-screen rounded-2xl"
      />
    </div>
  );
}
