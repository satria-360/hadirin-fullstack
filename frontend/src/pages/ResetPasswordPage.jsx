import React from 'react';

export default function ResetPasswordPage({ onBackToLogin, onNavigate }) {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
      
      {/* SISI KIRI (FORM RESET - BIRU) */}
      <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
          <span className="text-3xl font-black tracking-tighter text-white">R</span>
        </div>

        {/* STEPPER DOTS DI KIRI */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-12 text-gray-400">
          <div className="w-3 h-3 rounded-full border-2 border-white/60"></div>
          <div className="w-3 h-3 rounded-full border-2 border-white/60"></div>
          <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
        </div>

        {/* CONTAINER FORM */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Halo, Selamat Pagi!
            </h1>
            <p className="text-xs text-gray-300">Konfirmasi Kode Email</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* INPUT KODE EMAIL */}
            <div className="space-y-1 text-left">
              <input
                type="text"
                placeholder="AGDA2"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition uppercase tracking-widest"
              />
            </div>

            {/* TOMBOL RESET PASSWORD */}
            <button
              type="submit"
              className="w-full py-3 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-sm hover:bg-white transition flex items-center justify-center gap-2 shadow-md mt-4"
            >
              Reset Password ↗
            </button>
          </form>

          {/* NAVIGASI KEMBALI */}
          <div className="text-center text-xs text-gray-300 pt-2">
            Sudah ingat kata sandi?{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              Login Disini
            </button>
          </div>
        </div>

        {/* SPACING KOSONG */}
        <div className="h-6"></div>
      </div>

      {/* SISI KANAN (WELCOME SCREEN - KREM) */}
      <div className="w-full md:w-1/2 bg-[#F5EFEB] text-[#082052] p-8 md:p-16 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Reset Password
          </h2>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            Silahkan Isi Semua Data Yang Dibutuhkan <br /> Untuk Mereset Password.
          </p>
        </div>
      </div>

    </div>
  );
}