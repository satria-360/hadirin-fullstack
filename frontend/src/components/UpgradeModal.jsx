import React from 'react';

export default function UpgradeModal({ onClose, onSelectPlan }) {
    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[24px] overflow-visible shadow-2xl transition-transform"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Iklan Gambar Pop-up (Dapat diklik menuju Pricing) */}
                <img
                    src="/images/overlay-pop-up.png"
                    alt="Upgrade Untuk Pengalaman Terbaik"
                    onClick={() => {
                        if (onSelectPlan) onSelectPlan();
                    }}
                    className="w-full h-auto block rounded-[24px] shadow-2xl select-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200"
                    draggable={false}
                />

                {/* Tombol Tutup / Close (X) di Pojok Kanan Atas */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#082052] border-2 border-white text-white flex items-center justify-center shadow-xl hover:bg-[#0c2e73] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-40 group"
                    aria-label="Tutup Overlay"
                    title="Tutup (Esc)"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}