import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, SquareArrowOutUpRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroArtwork from '../components/HeroArtwork';
import LaptopIllustration from '../components/LaptopIllustration';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({ onNavigate }) {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const ctaRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations - staggered text reveal
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      heroTl.from('.hero-title-line', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
      })
      .from('.hero-description', {
        y: 40,
        opacity: 0,
        duration: 0.8,
      }, '-=0.6')
      .from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }, '-=0.4')
      .from('.hero-artwork', {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, '-=1');

      // Floating animation for artwork
      gsap.to('.hero-floating', {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Benefits section - scroll triggered
      gsap.from('.benefits-content', {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.from('.benefits-image', {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        x: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out',
      });

      // Feature cards stagger
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      });

      // CTA section
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });

      // Contact section
      gsap.from('.contact-card', {
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="w-full text-white overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="min-h-[90vh] flex items-center justify-center py-16 md:py-24 relative">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Hero Content */}
          <div className="space-y-8 max-w-2xl text-left">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white">
                <span className="hero-title-line block">Cara Modern</span>
                <span className="hero-title-line block">Untuk Mengelola</span>
                <span className="hero-title-line block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  Kehadiran Siswa.
                </span>
              </h1>
            </div>
            
            <p className="hero-description text-slate-300 text-lg sm:text-xl leading-relaxed max-w-lg">
              Tinggalkan rekap manual di kertas. Catat, pantau dan buat laporan kehadiran siswa dalam satu aplikasi terintegrasi.
            </p>
            
            <div className="hero-cta pt-4">
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="group inline-flex items-center gap-3 bg-white text-[#0047b3] font-bold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Coba Sekarang
                <SquareArrowOutUpRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Hero Artwork */}
          <div className="hero-artwork hero-floating flex justify-center lg:justify-end">
            <HeroArtwork />
          </div>
        </div>
      </section>

      {/* 3. BENEFITS SECTION */}
      <section ref={benefitsRef} className="py-20 md:py-32 relative">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="benefits-image flex justify-center lg:justify-start order-2 lg:order-1">
            <LaptopIllustration />
          </div>
          
          <div className="benefits-content space-y-6 max-w-xl text-left order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Rekap kehadiran siswa dengan lebih{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                mudah, akurat, dan aman.
              </span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Tinggalkan tumpukan buku absen yang rawan lecek atau hilang, beralih ke rekap digital yang bisa diakses kapan saja, di mana saja.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section ref={ctaRef} className="py-20 md:py-32 relative">
        <div className="w-full max-w-4xl mx-auto px-6 md:px-12">
          <div className="cta-content p-12 md:p-16 text-center overflow-hidden">
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Tunggu Apa Lagi?
              </h2>
              <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
                Tingkatkan kehadiran siswa dengan sistem modern yang mudah dan aman.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="group inline-flex items-center gap-3 bg-white text-[#082052] font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl hover:shadow-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Mulai Sekarang
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section ref={contactRef} className="py-16 md:py-24 pb-32">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="contact-card bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/15 rounded-[40px] p-10 sm:p-14 md:p-20 shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
                Hubungi Kami
              </h3>
              <ArrowUpRight className="w-10 h-10 sm:w-12 sm:h-12 text-white/80" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div className="space-y-4">
                <h4 className="text-white font-bold text-xl">Email</h4>
                <a
                  href="mailto:hadirin.co@gmail.com"
                  className="text-slate-300 text-lg hover:text-white transition-colors duration-300 inline-block"
                >
                  hadirin.co@gmail.com
                </a>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white font-bold text-xl">Kantor Kami</h4>
                <p className="text-slate-300 text-base leading-relaxed">
                  Jl. Gede Bage Selatan No.11,<br />
                  Kota Bandung, Jawa Barat,<br />
                  Indonesia, 401233
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}