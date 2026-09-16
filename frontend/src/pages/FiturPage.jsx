import React, { useEffect, useState } from 'react';

// Import gambar sesuai nama file di folder assets kamu
import HeroImg from '../assets/hero-artwork.png';
import LaptopImg from '../assets/Laptop.png';

export default function FiturPage() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/fitur')
      .then((res) => res.json())
      .then((data) => setFeatures(data))
      .catch((err) => console.error('API Error:', err));
  }, []);

  // Masukkan gambar yang sudah di-import ke array
  const assetsImages = [HeroImg, LaptopImg];

  return (
    // Kode BARU (menyatu sempurna dengan Navbar)
<div className="w-full min-h-screen bg-[#082052] text-white font-sans overflow-x-hidden m-0 p-0">
      <main className="w-full flex flex-col items-center">
        
        {/* LENGKUNGAN MERAH 1 (ATAS) */}
        <section 
          className="w-full bg-[#ee0000] pt-16 pb-44 px-6 text-center shadow-lg relative z-0"
          style={{ borderRadius: '160px 160px 0 0' }}
        >
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              Didesain untuk Mempermudah Hidupmu.
            </h2>
            <p className="text-xs md:text-sm text-red-100/90 leading-relaxed max-w-md mx-auto">
              Jelajahi berbagai fitur unggulan yang dirancang khusus untuk membantu kamu bekerja lebih cepat, efisien, dan tanpa ribet.
            </p>
          </div>
        </section>

        {/* LENGKUNGAN MERAH 2 (BAWAH) */}
        <section 
          className="w-full bg-gradient-to-b from-[#ee0000] via-[#b80000] to-[#500407] -mt-32 pt-20 pb-16 px-6 md:px-16 shadow-[0_-20px_40px_rgba(0,0,0,0.4)] relative z-10 flex flex-col items-center"
          style={{ borderRadius: '160px 160px 0 0' }}
        >
          <div className="w-full max-w-4xl space-y-20 pt-6">
            {features.length > 0 ? (
              features.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item.id || index}
                    className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 ${
                      !isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="w-full md:w-1/2 flex justify-center">
                      <div className="w-full max-w-[340px] h-44 md:h-52 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20">
                        <img
                          src={assetsImages[index % assetsImages.length]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-2 text-left px-2 md:px-4">
                      <h3 className="text-base md:text-xl font-bold text-white tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-red-100/80 leading-relaxed max-w-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Fallback Statis */
              <>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-full max-w-[340px] h-44 md:h-52 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20">
                      <img src={HeroImg} alt="Hemat Waktu" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-1.5 text-left px-2 md:px-4">
                    <h3 className="text-base md:text-lg font-bold text-white tracking-wide">Hemat Waktu.</h3>
                    <p className="text-xs text-red-100/80 leading-relaxed max-w-xs">
                      Proses absensi yang cepat, dapat menghemat waktu pembelajaran.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-12">
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-full max-w-[340px] h-44 md:h-52 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20">
                      <img src={LaptopImg} alt="Data Real-Time" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-1.5 text-left px-2 md:px-4">
                    <h3 className="text-base md:text-lg font-bold text-white tracking-wide">Data Real–Time & Akurat.</h3>
                    <p className="text-xs text-red-100/80 leading-relaxed max-w-xs">
                      Data absensi langsung tersimpan aman tanpa risiko rekap hilang atau salah hitung.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-full max-w-[340px] h-44 md:h-52 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20">
                      <img src={HeroImg} alt="Hemat Waktu" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-1.5 text-left px-2 md:px-4">
                    <h3 className="text-base md:text-lg font-bold text-white tracking-wide">Hemat Waktu.</h3>
                    <p className="text-xs text-red-100/80 leading-relaxed max-w-xs">
                      Proses absensi yang cepat, dapat menghemat waktu pembelajaran.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* CARD HUBUNGI KAMI */}
            <div className="pt-12">
              <div className="w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  Hubungi Kami <span className="text-lg">↗</span>
                </h3>
                
                <div className="space-y-3 text-xs text-red-100/80">
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p>hadirin@gmail.com</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Our Office</p>
                    <p>Jl. Kuda Raya No.14, RT.4/RW.1, Sukabumi, West Java, Indonesia 43171</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}