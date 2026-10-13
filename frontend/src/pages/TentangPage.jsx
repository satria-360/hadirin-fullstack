import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TentangPage() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animasi Teks
      gsap.from(textRef.current.children, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });

      // Animasi Gambar (Muncul dari kiri dengan sedikit rotasi)
      gsap.from(imgRef.current, {
        x: -100,
        opacity: 0,
        rotation: -5,
        scale: 0.9,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#082052] text-white font-sans overflow-x-hidden relative">

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* KIRI: Ilustrasi Tim */}
          <div ref={imgRef} className="order-2 lg:order-1 flex justify-center lg:justify-start relative">
            <img
              src="/images/about.jpg"
              alt="Ilustrasi Tim Hadirin.co"
              className="w-full max-w-[560px] h-auto object-contain rounded-2xl drop-shadow-2xl select-none relative z-10"
              draggable="false"
            />
          </div>
          
          {/* KANAN: Judul Horizontal + Paragraf */}
          <div ref={textRef} className="order-1 lg:order-2 space-y-5 text-left max-w-xl">
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