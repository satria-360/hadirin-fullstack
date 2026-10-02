import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        desc: 'Untuk kebutuhan awal sekolah atau kelas.',
        price: 'Free Plan',
        headerClass: 'bg-gradient-to-b from-[#1a47a8] to-[#0e2c6e]',
        features: ['Absensi QR', 'Filter Kelas', 'Terbatas Siswa'],
        cta: 'Coba Sekarang!',
        highlight: false,
    },
    {
        name: 'Paket Premium',
        desc: 'Untuk sekolah menengah & komunitas.',
        price: 'Rp 1.500.000/Semester',
        headerClass: 'bg-gradient-to-br from-[#E2B450] via-[#C6952E] to-[#7e5d10]',
        features: ['Akses Rekap Selama 6 Bulan', 'Unlimited Kelas', 'Dukungan WhatsApp'],
        cta: 'Langganan Sekarang!',
        highlight: true,
    },
    {
        name: 'Paket Platform',
        desc: 'Untuk kebutuhan enterprise dan instansi besar.',
        price: 'Rp 3.300.000/Tahun Ajaran',
        headerClass: 'bg-gradient-to-br from-[#9aa0aa] via-[#5c616b] to-[#33373e]',
        features: ['Akses Rekap Selama 12 Bulan', 'Unlimited Kelas', 'Laporan PDF/Excel'],
        cta: 'Langganan Sekarang!',
        highlight: false,
    },
];

export default function PricingPage({ onNavigate }) {
    const handleCTA = () => onNavigate && onNavigate('login');

    return (
        <div className="min-h-screen w-full bg-[#082052] text-white font-sans overflow-x-hidden pt-6 md:pt-8 pb-24">
            <div className="max-w-6xl mx-auto px-5 md:px-8">

                {/* ===== HEADER: badge + judul ===== */}
                <div className="text-center mb-12 md:mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] md:text-xs font-semibold text-gray-200 mb-5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Tingkatkan Paketmu
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
                        Mulai Dengan Paket Gratis!
                    </h1>
                </div>

                {/* ===== GRID 3 KARTU — items-start: tinggi mengikuti konten (persis referensi) ===== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 items-start">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`bg-[#F8F3ED] text-[#1E293B] rounded-[28px] p-5 md:p-6 border border-[#E9DFD5] flex flex-col transition-all duration-300 ${plan.highlight
                                    ? 'md:-translate-y-3 md:scale-[1.04] z-10 shadow-[0_24px_55px_rgba(0,0,0,0.5)]'
                                    : 'shadow-[0_12px_34px_rgba(0,0,0,0.30)] hover:-translate-y-1'
                                }`}
                        >
                            {/* Header berwarna (inset) — padding lega */}
                            <div className={`rounded-2xl p-6 md:p-7 ${plan.headerClass}`}>
                                <h3 className="text-white font-bold text-base md:text-lg leading-tight">
                                    {plan.name}
                                </h3>
                                <p className="text-white/80 text-[11px] md:text-xs leading-snug mt-1.5">
                                    {plan.desc}
                                </p>
                                <div className="text-white font-extrabold text-xl md:text-2xl mt-6 tracking-tight">
                                    {plan.price}
                                </div>
                            </div>

                            {/* Daftar fitur — TANPA flex-1, jarak tetap seperti referensi */}
                            <div className="px-1 pt-8 pb-2">
                                <p className="text-xs font-bold text-[#7c828c] mb-5">
                                    Dapatkan Akses:
                                </p>
                                <ul className="space-y-4">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <span className="w-5 h-5 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-white stroke-[3]" />
                                            </span>
                                            <span className="text-[#1E293B] text-[13px] md:text-sm font-semibold">
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tombol CTA -> login */}
                            <div className="px-1 pt-6 pb-1">
                                <button
                                    onClick={handleCTA}
                                    className="w-full py-4 rounded-xl border border-[#1E293B]/20 text-[#1E293B] text-sm font-bold hover:bg-[#1E293B] hover:text-white transition cursor-pointer"
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}