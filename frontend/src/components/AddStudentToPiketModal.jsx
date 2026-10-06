import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function AddStudentToPiketModal({ student, onClose, onConfirm }) {
    const [selectedDay, setSelectedDay] = useState('Senin');
    const [showSuccess, setShowSuccess] = useState(false);
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    if (!student) return null;

    const handleConfirm = async () => {
        try {
            await onConfirm(selectedDay);
            // Tampilkan overlay sukses (hanya ditutup saat user klik tombol "Oke")
            setShowSuccess(true);
        } catch (err) {
            alert('Gagal menyimpan jadwal piket: ' + err.message);
        }
    };

    // OVERLAY SUKSES (Sesuai Desain Referensi)
    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                <div className="bg-white text-[#111827] w-full max-w-sm rounded-[28px] shadow-2xl px-7 py-8 relative border border-gray-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">

                    {/* Ikon Badge Lingkaran Biru dengan Bintang/Decagram di Tengah & Centang */}
                    <div className="mb-5 relative flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#0e3b91] to-[#082052] flex items-center justify-center shadow-lg shadow-blue-900/20">
                            {/* Inner Badge Star Decagram */}
                            <div className="w-10 h-10 bg-[#fbf5eb] rounded-lg rotate-45 flex items-center justify-center shadow-xs">
                                <div className="w-10 h-10 bg-[#fbf5eb] rounded-lg -rotate-45 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#082052]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Judul & Subjudul */}
                    <h3 className="text-[21px] font-black tracking-tight text-gray-950 mb-2 leading-snug">
                        Data Siswa Berhasil Dipindahkan!
                    </h3>
                    <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6 px-1">
                        Silahkan kembali ke pengaturan jika ada data yang salah
                    </p>

                    {/* Tombol Oke Biru Full Rounded */}
                    <button
                        onClick={() => { setShowSuccess(false); onClose(); }}
                        className="w-full py-3.5 px-6 bg-gradient-to-b from-[#0e3b91] to-[#082052] hover:from-[#1145ab] hover:to-[#0c2a68] text-white text-[15px] font-bold rounded-full shadow-lg shadow-blue-950/25 transition-all duration-150 cursor-pointer active:scale-[0.98]"
                    >
                        Oke
                    </button>
                </div>
            </div>
        );
    }

    // FORM PILIH HARI
    return (
        <div className="fixed inset-y-0 right-0 z-[55] w-full md:w-[420px] bg-white/98 backdrop-blur-md shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header Overlay */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#082052] tracking-tight">
                    Tambah Ke Jadwal Piket
                </h3>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
                >
                    <X className="w-4 h-4 stroke-[2.5]" />
                </button>
            </div>

            {/* Body Overlay */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">

                {/* Info Siswa Terpilih */}
                <div className="bg-[#F8F3ED] rounded-2xl p-4 border border-[#E4D8CE]">
                    <p className="text-xs text-gray-500 mb-1">Siswa Dipilih:</p>
                    <h4 className="font-bold text-[#082052] text-sm">{student.full_name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">NIS: {student.noAbsen || '-'}</p>
                </div>

                {/* Pilihan Hari */}
                <div>
                    <label className="block text-xs font-bold text-[#082052] mb-3 uppercase tracking-wide">
                        Pilih Jadwal Piket:
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {days.map((day) => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className={`py-2 px-1 rounded-xl text-[10px] font-bold transition cursor-pointer border ${selectedDay === day
                                        ? 'bg-[#082052] text-white border-[#082052] shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#082052]/30'
                                    }`}
                            >
                                {day.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Konfirmasi Teks */}
                <div className="pt-2">
                    <p className="text-xs text-gray-600 leading-relaxed text-center">
                        Kamu yakin ingin menambahkan{' '}
                        <span className="font-bold text-[#082052]">'{student.full_name}'</span>{' '}
                        ke jadwal piket hari{' '}
                        <span className="font-bold text-[#D6A143]">{selectedDay}</span>?
                    </p>
                </div>
            </div>

            {/* Footer Aksi */}
            <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                <button
                    onClick={onClose}
                    className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                    Tidak
                </button>
                <button
                    onClick={handleConfirm}
                    className="py-3 px-4 rounded-xl bg-[#D6A143] hover:bg-[#c4923b] text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                    Ya
                </button>
            </div>
        </div>
    );
}