import React from 'react';
import { Check } from 'lucide-react';

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
        price: 'Rp 1.800.000/Semester',
        headerClass: 'bg-gradient-to-br from-[#E2B450] via-[#C6952E] to-[#7e5d10]',
        features: ['Akses Rekap Selama 6 Bulan', 'Unlimited Kelas', 'Dukungan WhatsApp'],
        cta: 'Langganan Sekarang!',
        highlight: true,
    },
    {
        name: 'Paket Platform',
        desc: 'Untuk kebutuhan enterprise dan instansi besar.',
        price: 'Rp 2.600.000/Tahun Ajaran',
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
                <div className="text-center mb-12 md:mb-14">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Mulai Dengan Paket Gratis!</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                    {plans.map((plan, i) => (
                        <div key={i} className="relative flex flex-col">
                            {plan.highlight && (
                                <span className="absolute -top-3 right-4 z-20 bg-[#ee0000] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                                    Paling Populer!
                                </span>
                            )}

                            <div className={`rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-full ${plan.highlight ? 'ring-2 ring-[#E2B450]' : ''}`}>
                                <div className={`${plan.headerClass} p-6 md:p-7`}>
                                    <h3 className="text-lg md:text-xl font-extrabold">{plan.name}</h3>
                                    <p className="text-xs text-white/70 mt-1 leading-relaxed">{plan.desc}</p>
                                    <div className="text-white font-extrabold text-xl md:text-2xl mt-6 tracking-tight">{plan.price}</div>
                                </div>

                                <div className="bg-white text-[#082052] p-6 md:p-7 flex flex-col flex-1">
                                    <p className="text-xs font-bold text-[#7c828c] mb-5">Dapatkan Akses:</p>
                                    <ul className="space-y-4 flex-1">
                                        {plan.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                <span className="w-5 h-5 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-white stroke-[3]" />
                                                </span>
                                                <span className="text-sm font-medium">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={handleCTA}
                                        className={`mt-8 w-full py-3 rounded-xl text-sm font-bold transition cursor-pointer ${plan.highlight
                                                ? 'bg-[#082052] text-white hover:bg-[#0c2e73]'
                                                : 'border border-[#082052]/20 text-[#082052] hover:bg-[#082052]/5'
                                            }`}
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