import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import HeroArtwork from '../components/HeroArtwork';
import LaptopIllustration from '../components/LaptopIllustration';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="w-full text-white">
      {/* 1. HERO SECTION */}
      <section className="min-h-[85vh] flex items-center justify-center py-12 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Hero Content */}
          <div className="space-y-6 max-w-xl text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.18] tracking-tight text-white drop-shadow-sm">
              Cara Modern Untuk<br className="hidden sm:inline" /> Mengelola Kehadiran Siswa.
            </h1>

            <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed max-w-lg">
              Tinggalkan rekap manual dikertas. Catat, pantau dan buat laporan kehadiran siswa dalam satu aplikasi.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate && onNavigate('fitur')}
                className="inline-flex items-center gap-2.5 bg-white text-[#0047b3] font-bold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-2xl shadow-xl hover:bg-slate-50 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Pelajari Lebih Lanjut
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Hero Artwork */}
          <div className="flex justify-center lg:justify-end">
            <HeroArtwork />
          </div>
        </div>
      </section>

      {/* 2. BENEFIT / FEATURE SECTION */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center">

          {/* Left Illustration */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <LaptopIllustration />
          </div>

          {/* Right Text Content */}
          <div className="space-y-5 max-w-xl text-left order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white leading-[1.2] tracking-tight">
              Rekap kehadiran siswa dengan lebih mudah, akurat, dan aman.
            </h2>

            <p className="text-slate-200/85 text-sm sm:text-base leading-relaxed">
              Tinggalkan tumpukan buku absen yang rawan lecek atau hilang, beralih ke rekap digital yang bisa diakses kapan saja, di mana saja
            </p>
          </div>
        </div>
      </section>

      {/* 3. HUBUNGI KAMI / CONTACT CARD SECTION */}
      <section className="py-12 md:py-16">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="w-full bg-white/[0.08] backdrop-blur-2xl border border-white/15 rounded-3xl p-8 sm:p-12 md:p-14 shadow-2xl space-y-8">

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
      </section>
    </div>
  );
}