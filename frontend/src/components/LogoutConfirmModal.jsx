import React from 'react';

export default function LogoutConfirmModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white text-[#1E293B] w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 relative border border-gray-100">

                {/* Ikon Keluar */}
                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-[#082052] flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>
                </div>

                {/* Judul & Subjudul */}
                <h3 className="text-center text-xl font-extrabold tracking-tight text-[#111827] mb-1">
                    Kamu Yakin Ingin Keluar?
                </h3>
                <p className="text-center text-xs text-gray-500 mb-6">
                    Kamu bisa login kembali nanti.
                </p>

                {/* Tombol Aksi */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onConfirm}
                        className="py-3 px-4 bg-[#082052] hover:bg-[#0c2e73] text-white text-sm font-bold rounded-xl shadow-md transition cursor-pointer active:scale-[0.98]"
                    >
                        Ya
                    </button>
                    <button
                        onClick={onCancel}
                        className="py-3 px-4 bg-white border-2 border-[#082052]/20 hover:border-[#082052]/40 text-[#082052] text-sm font-bold rounded-xl transition cursor-pointer active:scale-[0.98]"
                    >
                        Tidak
                    </button>
                </div>
            </div>
        </div>
    );
}