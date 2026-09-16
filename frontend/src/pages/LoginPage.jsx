import React, { useState } from 'react';

export default function LoginPage({ onNavigate }) {
  // Mode: 'login' atau 'register'
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // TAMPILAN REGISTER (PILIH PERAN)
  if (mode === 'register') {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
        {/* SISI KIRI (WELCOME - KREM) */}
        <div className="w-full md:w-1/2 bg-[#F5EFEB] text-[#082052] p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
            <span className="text-3xl font-black tracking-tighter text-gray-400">R</span>
          </div>

          <div className="max-w-md my-auto space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#082052]">
              Hai, Senang <br /> Bertemu <br /> Denganmu!
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              Silahkan Pilih Peranmu
            </p>
          </div>

          <div className="h-6"></div>
        </div>

        {/* SISI KANAN (PILIH PERAN - BIRU) */}
        <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-center items-center relative min-h-screen">
          {/* STEPPER DOTS DI KANAN */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-12 text-gray-400">
            <div className="w-3 h-3 rounded-full border-2 border-white/60"></div>
            <div className="w-3 h-3 rounded-full border-2 border-white/60"></div>
            <div className="w-3 h-3 rounded-full border-2 border-white/60"></div>
            <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
          </div>

          <div className="w-full max-w-lg space-y-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Silahkan Pilih Peran <br /> Kamu Disini.
            </h2>

            {/* OPSI KARTU PERAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OPSI 1 */}
              <div className="space-y-2 text-center">
                <button 
                  type="button"
                  className="w-full py-3.5 px-4 bg-[#F5EFEB] text-[#082052] font-bold rounded-2xl text-xs md:text-sm hover:bg-white transition shadow-lg"
                >
                  Ketua Murid/Sekretaris
                </button>
                <p className="text-[10px] text-gray-300 leading-relaxed px-2">
                  Catat kehadiran harian dan pantau tugas piket kelas.
                </p>
              </div>

              {/* OPSI 2 */}
              <div className="space-y-2 text-center">
                <button 
                  type="button"
                  className="w-full py-3.5 px-4 bg-[#F5EFEB] text-[#082052] font-bold rounded-2xl text-xs md:text-sm hover:bg-white transition shadow-lg"
                >
                  Wali Kelas/Guru Mapel
                </button>
                <p className="text-[10px] text-gray-300 leading-relaxed px-2">
                  Lihat rekap kehadiran dan kelola kelas kamu.
                </p>
              </div>
            </div>

            {/* TOMBOL KEMBALI KE LOGIN */}
            <div className="text-center pt-6 text-xs text-gray-300">
              Sudah punya akun?{' '}
              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="font-bold text-white hover:underline"
              >
                Login Disini
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN LOGIN (UTAMA)
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
      {/* SISI KIRI (FORM LOGIN - BIRU) */}
      <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
          <span className="text-3xl font-black tracking-tighter text-white">R</span>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Halo, Selamat Pagi!
          </h1>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1 text-left">
              <label className="text-xs text-gray-300 font-medium">Email</label>
              <input
                type="email"
                placeholder="email@gmail.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition"
              />
            </div>

            <div className="space-y-1 text-left relative">
              <label className="text-xs text-gray-300 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs text-gray-300 font-medium">Konfirmasi Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition"
              />
            </div>

            <div className="text-right">
              <button type="button" className="text-xs font-semibold text-gray-200 hover:underline">
                Lupa Kata Sandi?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-sm hover:bg-white transition flex items-center justify-center gap-2 shadow-md mt-4"
            >
              Masuk ↗
            </button>
          </form>

          <div className="text-center text-xs text-gray-300 pt-2">
            Belum Punya Akun?{' '}
            <button
              type="button"
              onClick={() => setMode('register')}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              Daftar Disini
            </button>
          </div>
        </div>

        <div className="h-6"></div>
      </div>

      {/* SISI KANAN (WELCOME SCREEN - KREM) */}
      <div className="w-full md:w-1/2 bg-[#F5EFEB] text-[#082052] p-8 md:p-16 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Selamat Datang <br /> Kembali!
          </h2>
          <p className="text-xs md:text-sm text-gray-600">
            Silahkan Login Untuk Mengakses Semua Fitur.
          </p>
        </div>
      </div>
    </div>
  );
}