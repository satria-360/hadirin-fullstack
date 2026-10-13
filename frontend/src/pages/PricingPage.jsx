import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    desc: 'Membuka fitur-fitur dasar, dan lainnya.',
    priceTitle: 'Free Plan',
    priceSub: '',
    headerStyle: 'bg-gradient-to-br from-[#1241a8] to-[#0a276b] text-white',
    badge: null,
    featuresTitle: 'Dapatkan fitur:',
    features: ['Absensi Siswa', 'Piket Kelas', 'Tambah Siswa'],
    cta: 'Coba Sekarang!',
    isFeatured: false,
  },
  {
    name: 'Paket Premium',
    desc: 'Fitur mendalam dari Hadirin.co.',
    priceTitle: 'Rp. 1.500.000',
    priceSub: '/Semester',
    headerStyle: 'bg-gradient-to-b from-[#8f7514] via-[#5c4a09] to-[#1f1b0a] text-white',
    badge: null,
    featuresTitle: 'Dapatkan fitur:',
    features: ['Akses Kelas Selama 6 Bulan', 'Unlimited Kelas', 'Dukungan WhatsApp'],
    cta: 'Langganan Sekarang!',
    isFeatured: true,
  },
  {
    name: 'Paket Platinum',
    desc: 'Membuka seluruh fitur Hadirin.co dan dapatkan layanan prioritas.',
    priceTitle: 'Rp. 2.500.000',
    priceSub: '/Tahun Ajaran',
    headerStyle: 'bg-gradient-to-b from-[#4d5248] via-[#3d4239] to-[#252822] text-white',
    badge: 'Paket Paling Hemat!',
    featuresTitle: 'Dapatkan fitur:',
    features: ['Akses Kelas Selama 12 Bulan', 'Unlimited Kelas', 'Layanan Prioritas'],
    cta: 'Langganan Sekarang!',
    isFeatured: false,
  },
];

export default function PricingPage({ onNavigate, onSelectPlan }) {
  const isFromUpgradeModal = typeof window !== 'undefined' && sessionStorage.getItem('pricingSource') === 'upgradeModal';
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('token');

  const handleCTA = (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      onNavigate && onNavigate('login');
      return;
    }

    // Jika memilih paket gratis (Starter), langsung ke dashboard
    if (plan.name === 'Starter') {
      sessionStorage.removeItem('pricingSource');
      onNavigate && onNavigate('dashboard');
      return;
    }

    // Jika memilih paket berbayar, arahkan ke halaman pembayaran (payment)
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else if (onNavigate) {
      onNavigate('payment');
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('pricingSource');
    const token = localStorage.getItem('token');
    if (token) {
      onNavigate && onNavigate('dashboard');
    } else {
      onNavigate && onNavigate('landing');
    }
  };

  return (
    <div className={`min-h-screen w-full bg-[#082052] text-white font-sans overflow-x-hidden ${isFromUpgradeModal || isLoggedIn ? 'pt-6 sm:pt-8 md:pt-10' : 'pt-2 md:pt-4'} pb-24`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header Nav / Back Button: Muncul saat dibuka dari modal upgrade atau saat user telah login */}
        {(isFromUpgradeModal || isLoggedIn) && (
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-white hover:text-amber-300 font-bold text-xl sm:text-2xl transition cursor-pointer select-none group"
              title="Kembali ke Dashboard"
            >
              <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
              <span>Langganan</span>
            </button>
          </div>
        )}

        {/* Sub-Header Pill Badge & Main Title */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md shadow-inner text-xs sm:text-sm font-semibold text-slate-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-white/90 shrink-0">
              <path fill="currentColor" d="m13.16 22.19l-1.66-3.84c1.6-.58 3.07-1.35 4.43-2.27l-2.78 6.11m-7.5-9.69l-3.84-1.65l6.11-2.78a20 20 0 0 0-2.27 4.43M21.66 2.35S23.78 7.31 18.11 13c-2.2 2.17-4.58 3.5-6.73 4.34c-.74.28-1.57.1-2.12-.46l-2.13-2.13c-.56-.56-.74-1.38-.47-2.13C7.5 10.5 8.83 8.09 11 5.89C16.69.216 21.66 2.35 21.66 2.35M6.25 22H4.84l4.09-4.1c.3.21.63.36.97.45zM2 22v-1.41l4.77-4.78l1.43 1.42L3.41 22zm0-2.84v-1.41l3.65-3.65c.09.35.24.68.45.97zM16 6a2 2 0 1 0 0 4c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"/>
            </svg>
            <span>Tingkatkan Paketmu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Mulai Dengan Paket Gratis!
          </h1>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-stretch justify-center max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className="relative flex flex-col pt-3">
              {/* Floating Red Pill Badge for Paket Platinum */}
              {plan.badge && (
                <div className="absolute top-0 right-0 sm:right-2 z-20">
                  <span className="inline-block bg-[#992222] text-white text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-400/30">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              {/* Outer Card Container */}
              <div className={`bg-[#F4ECE2] text-[#082052] rounded-[28px] p-4 sm:p-5 shadow-2xl flex flex-col justify-between h-full border border-[#e8dfd3] transition-all duration-300 hover:shadow-3xl ${plan.isFeatured ? 'md:-translate-y-2' : ''}`}>
                <div>
                  {/* Inner Top Capsule (Header with Gradient) */}
                  <div className={`${plan.headerStyle} rounded-[20px] p-5 sm:p-6 shadow-md mb-6 min-h-[145px] flex flex-col justify-between`}>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight">
                        {plan.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-white/80 mt-1 leading-snug">
                        {plan.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-1 font-bold tracking-tight">
                      <span className="text-lg sm:text-xl font-bold font-sans">
                        {plan.priceTitle}
                      </span>
                      {plan.priceSub && (
                        <span className="text-xs sm:text-sm font-medium text-white/90 ml-0.5">
                          {plan.priceSub}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="px-1.5 mb-6">
                    <p className="text-xs sm:text-sm font-semibold text-[#4a5568] mb-3.5">
                      {plan.featuresTitle}
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-black tracking-tight">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2 px-1">
                  <button
                    onClick={() => handleCTA(plan)}
                    className="w-full py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold border border-[#a89278]/40 text-[#695743] hover:text-[#082052] hover:bg-[#e7d9c9] transition duration-200 cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}