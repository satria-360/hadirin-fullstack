import React from 'react';
import { X } from 'lucide-react';

export default function UpgradeModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-[#0a2a6b] via-[#082052] to-[#04123a]">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition cursor-pointer"
                    aria-label="Tutup"
                >
                    <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-[#D6A143]/25 blur-[80px]" />

                <div className="relative z-10 px-6 pt-6 pb-8">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-black">H</span>
                        <span className="text-white font-bold text-sm tracking-tight">Hadirin.co</span>
                    </div>

                    <h2 className="text-center leading-tight mb-1">
                        <span className="block text-white text-2xl md:text-[1.7rem] font-extrabold tracking-tight">UPGRADE UNTUK</span>
                        <span className="block text-[#E2B450] text-2xl md:text-[1.7rem] font-extrabold tracking-tight">PENGALAMAN TERBAIK!</span>
                    </h2>
                    <p className="text-center text-white text-xs md:text-sm font-semibold mt-2 mb-6 leading-snug">
                        MAKSIMALKAN MANAJEMEN<br />SEKOLAH ANDA!
                    </p>

                    <div className="relative h-[230px] mb-6 select-none">
                        <div className="absolute left-0 bottom-0 w-[42%] rotate-[-8deg] origin-bottom-left rounded-xl bg-gradient-to-b from-[#1a47a8] to-[#0e2c6e] border border-white/15 p-3 shadow-xl">
                            <h4 className="text-white text-[11px] font-extrabold">Starter</h4>
                            <p className="text-white/60 text-[7px] leading-tight mt-0.5 line-clamp-2">Membuka fitur-fitur dasar lainnya</p>
                            <div className="text-white text-[10px] font-black mt-2">FREE PLAN</div>
                            <div className="mt-2 space-y-1">
                                {['Absensi Siswa', 'Piket Kelas', 'Tambah Siswa'].map((f) => (
                                    <div key={f} className="flex items-center gap-1 text-white/80 text-[7px]"><span className="text-emerald-400">✓</span>{f}</div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute right-0 bottom-0 w-[42%] rotate-[8deg] origin-bottom-right rounded-xl bg-gradient-to-b from-[#3a3f47] to-[#1c1f23] border border-white/15 p-3 shadow-xl">
                            <span className="absolute -top-2 right-2 bg-[#ee0000] text-white text-[6px] font-bold px-2 py-0.5 rounded-full">Paket Paling Hemat!</span>
                            <h4 className="text-white text-[11px] font-extrabold">Paket Platinum</h4>
                            <p className="text-white/60 text-[7px] leading-tight mt-0.5 line-clamp-2">Seluruh fitur Hadirin.co dan layanan prioritas.</p>
                            <div className="text-white text-[10px] font-black mt-2">Rp 2.500.000<span className="text-[7px] font-medium">/Tahun Ajaran</span></div>
                            <div className="mt-2 space-y-1">
                                {['Akses Kelas Selama 12 Bulan', 'Unlimited Kelas', 'Layanan Prioritas'].map((f) => (
                                    <div key={f} className="flex items-center gap-1 text-white/80 text-[7px]"><span className="text-emerald-400">✓</span>{f}</div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[52%] z-10 rounded-xl bg-gradient-to-b from-[#E2B450] via-[#C6952E] to-[#7e5d10] border border-[#F5DFA0]/60 p-3 shadow-[0_0_30px_rgba(226,180,80,0.5)]">
                            <h4 className="text-[#1a1206] text-[11px] font-extrabold">Paket Premium</h4>
                            <p className="text-[#3a2a0a] text-[7px] leading-tight mt-0.5">Fitur mendalam dari Hadirin.co.</p>
                            <div className="text-[#1a1206] text-[11px] font-black mt-2">Rp 1.500.000<span className="text-[7px] font-semibold">/Semester</span></div>
                            <div className="text-[#3a2a0a] text-[7px] font-bold mt-2">Dapatkan fitur:</div>
                            <div className="mt-1 space-y-1">
                                {['Akses Kelas Selama 6 Bulan', 'Unlimited Kelas', 'Dukungan WhatsApp'].map((f) => (
                                    <div key={f} className="flex items-center gap-1 text-[#1a1206] text-[7px] font-semibold"><span className="text-emerald-800">✓</span>{f}</div>
                                ))}
                            </div>
                            <button className="mt-2 w-full py-1.5 rounded-lg bg-[#1a1206] text-[#E2B450] text-[8px] font-bold hover:bg-black transition cursor-pointer">Langganan Sekarang!</button>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E2B450] via-[#F5DFA0] to-[#C6952E] text-[#1a1206] text-xs md:text-sm font-extrabold tracking-wide shadow-lg hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
                    >
                        TINGKATKAN SEKARANG UNTUK HARGA TERBAIK!
                    </button>
                </div>
            </div>
        </div>
    );
}