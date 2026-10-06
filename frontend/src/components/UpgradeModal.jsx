import React from 'react';
import popupImg from '../assets/overlay-popup.png';

export default function UpgradeModal({ onClose, onSelectPlan }) {
    const handleAction = (planName) => {
        if (onSelectPlan) {
            onSelectPlan(planName);
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-[420px] rounded-[28px] overflow-visible shadow-2xl transition-transform"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gambar Pop-up Baru */}
                <img
                    src={popupImg}
                    alt="Upgrade Untuk Pengalaman Terbaik"
                    className="w-full h-auto block rounded-[24px] shadow-2xl select-none"
                    draggable={false}
                />

                {/* Hotspot Tutup / Close (X) di pojok kanan atas gambar (gambar sudah memiliki ikon X bulat) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-[1.2%] right-[1.2%] w-11 h-11 rounded-full opacity-0 hover:opacity-20 bg-white cursor-pointer transition z-30"
                    aria-label="Tutup"
                />

                {/* Hotspot / Button: Starter (Coba Sekarang) */}
                <button
                    type="button"
                    onClick={() => handleAction('Starter')}
                    className="absolute left-[17%] bottom-[20.5%] w-[27%] h-[4.5%] rounded-full opacity-0 hover:opacity-20 bg-white cursor-pointer transition z-20"
                    title="Coba Sekarang - Starter"
                    aria-label="Coba Sekarang Starter"
                />

                {/* Hotspot / Button: Paket Premium (Langganan Sekarang) */}
                <button
                    type="button"
                    onClick={() => handleAction('Paket Premium')}
                    className="absolute left-[30%] bottom-[35%] w-[40%] h-[5.2%] rounded-xl opacity-0 hover:opacity-25 bg-white cursor-pointer transition z-20"
                    title="Langganan Sekarang - Paket Premium"
                    aria-label="Langganan Sekarang Paket Premium"
                />

                {/* Hotspot / Button: Paket Platinum (Langganan Sekarang) */}
                <button
                    type="button"
                    onClick={() => handleAction('Paket Platinum')}
                    className="absolute right-[22%] bottom-[13.5%] w-[29%] h-[4.5%] rounded-full opacity-0 hover:opacity-20 bg-white cursor-pointer transition z-20"
                    title="Langganan Sekarang - Paket Platinum"
                    aria-label="Langganan Sekarang Paket Platinum"
                />

                {/* Hotspot / Button Utama: TINGKATKAN SEKARANG UNTUK HARGA TERBAIK! */}
                <button
                    type="button"
                    onClick={() => handleAction('Tingkatkan Sekarang')}
                    className="absolute left-[9%] bottom-[4.8%] w-[82%] h-[6.5%] rounded-full opacity-0 hover:opacity-20 bg-white cursor-pointer transition active:scale-[0.99] z-20 shadow-md"
                    title="Tingkatkan Sekarang Untuk Harga Terbaik!"
                    aria-label="Tingkatkan Sekarang Untuk Harga Terbaik"
                />
            </div>
        </div>
    );
}