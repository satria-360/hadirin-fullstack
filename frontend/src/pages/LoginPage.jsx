import React, { useState } from 'react';

export default function LoginPage({ onNavigate }) {
  // Mode: 'login' | 'selectRole' | 'registerMurid' | 'registerGuru' | 'resetPassword'
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // ----------------------------------------------------
  // TAMPILAN: RESET PASSWORD
  // ----------------------------------------------------
  if (mode === 'resetPassword') {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
        {/* SISI KIRI (FORM RESET - BIRU) */}
        <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
            <span className="text-3xl font-black tracking-tighter text-white">R</span>
          </div>

          {/* STEPPER DOTS */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-12 text-gray-400">
            <div className="w-3 h-3 rounded-full border-2 border-white/60"></div>
            <div className="w-3 h-3 rounded-full border-2 border-white/60"></div>
            <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
          </div>

          <div className="w-full max-w-md mx-auto my-auto space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Halo, Selamat Pagi!
              </h1>
              <p className="text-xs text-gray-300">Konfirmasi Kode Email</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              alert('Instruksi reset password telah dikirim!');
              setMode('login');
            }}>
              <div className="space-y-1 text-left">
                <input
                  type="text"
                  placeholder="AGDA2"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition uppercase tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-sm hover:bg-white transition flex items-center justify-center gap-2 shadow-md mt-4"
              >
                Reset Password ↗
              </button>
            </form>

            <div className="text-center text-xs text-gray-300 pt-2">
              Sudah ingat kata sandi?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-white hover:underline cursor-pointer"
              >
                Login Disini
              </button>
            </div>
          </div>

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

  // ----------------------------------------------------
  // TAMPILAN: REGISTER GURU / WALI KELAS
  // ----------------------------------------------------
  if (mode === 'registerGuru') {
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
              Yuk, buat akun dan mulai perjalananmu bersama kami.
            </p>
          </div>

          <div className="h-6"></div>
        </div>

        {/* SISI KANAN (FORM GURU - BIRU) */}
        <div className="w-full md:w-1/2 bg-[#082052] text-white p-6 md:p-12 flex flex-col justify-center items-center relative min-h-screen overflow-y-auto">
          {/* STEPPER DOTS */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-10">
            <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-white shadow-md"></div>
            <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
            <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
          </div>

          <div className="w-full max-w-md space-y-4 my-auto py-6">
            <form className="space-y-3" onSubmit={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('dashboard'); // <-- Didelegasikan langsung ke Dashboard
            }}>
              
              {/* NAMA DEPAN & BELAKANG */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Depan</label>
                  <input
                    type="text"
                    placeholder="Asep"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Belakang</label>
                  <input
                    type="text"
                    placeholder="Sularjana"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              {/* KELAS YANG DIAMPU */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Kelas Yang Diampu</label>
                <input
                  type="text"
                  placeholder="XI TKJ 2"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              {/* JURUSAN */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Jurusan(Gunakan CapsLock)</label>
                <input
                  type="text"
                  placeholder="TEKNIK KOMPUTER JARINGAN"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 uppercase"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Asep123@gmail.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              {/* NOMOR TELEPON */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Nomor Telepon</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-xl">
                  <span className="text-xs">🇮🇩</span>
                  <span className="text-xs text-gray-300">+62</span>
                  <input
                    type="tel"
                    placeholder="8152211234"
                    className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1 text-left relative">
                <label className="text-[11px] text-gray-300 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* KONFIRMASI PASSWORD */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Konfirmasi Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              {/* TOMBOL SELANJUTNYA */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-xs hover:bg-white transition shadow-md mt-2"
              >
                Selanjutnya
              </button>

              {/* CHECKBOX SYARAT & KETENTUAN */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <input type="checkbox" id="termsGuru" className="rounded bg-white/10 border-white/20" />
                <label htmlFor="termsGuru" className="text-[10px] text-gray-300">
                  Saya Menyetujui Syarat & Ketentuan <span className="font-bold text-white">Hadirin.co</span>
                </label>
              </div>

            </form>

            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setMode('selectRole')}
                className="text-xs text-gray-300 hover:text-white underline"
              >
                ← Kembali Pilih Peran
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // TAMPILAN: REGISTER FORM MURID
  // ----------------------------------------------------
  if (mode === 'registerMurid') {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
        <div className="w-full md:w-1/2 bg-[#F5EFEB] text-[#082052] p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
            <span className="text-3xl font-black tracking-tighter text-gray-400">R</span>
          </div>

          <div className="max-w-md my-auto space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#082052]">
              Hai, Senang <br /> Bertemu <br /> Denganmu!
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              Yuk, buat akun dan mulai perjalananmu bersama kami.
            </p>
          </div>

          <div className="h-6"></div>
        </div>

        <div className="w-full md:w-1/2 bg-[#082052] text-white p-6 md:p-12 flex flex-col justify-center items-center relative min-h-screen overflow-y-auto">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-10">
            <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-white shadow-md"></div>
            <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
            <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
          </div>

          <div className="w-full max-w-md space-y-4 my-auto py-6">
            <form className="space-y-3" onSubmit={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('dashboard'); // <-- Didelegasikan langsung ke Dashboard
            }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Depan</label>
                  <input
                    type="text"
                    placeholder="Nama Depanmu"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Belakang</label>
                  <input
                    type="text"
                    placeholder="Nama Belakangmu"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left relative">
                <label className="text-[11px] text-gray-300 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Konfirmasi Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Nomor Telepon</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-xl">
                  <span className="text-xs">🇮🇩</span>
                  <span className="text-xs text-gray-300">+62</span>
                  <input
                    type="tel"
                    placeholder="8123456789"
                    className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">NISN</label>
                <input
                  type="text"
                  placeholder="Contoh: 12342"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">
                  Kode Kelas <span className="text-[10px] text-gray-400 font-normal">(Minta Wali Kelasmu Untuk Mendapatkannya)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: ABCD"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-xs hover:bg-white transition shadow-md mt-2"
              >
                Selanjutnya
              </button>

              <div className="flex items-center justify-center gap-2 pt-2">
                <input type="checkbox" id="termsMurid" className="rounded bg-white/10 border-white/20" />
                <label htmlFor="termsMurid" className="text-[10px] text-gray-300">
                  Saya Menyetujui Syarat & Ketentuan <span className="font-bold text-white">Hadirin.co</span>
                </label>
              </div>
            </form>

            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setMode('selectRole')}
                className="text-xs text-gray-300 hover:text-white underline"
              >
                ← Kembali Pilih Peran
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // TAMPILAN: PILIH PERAN
  // ----------------------------------------------------
  if (mode === 'selectRole') {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
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

        <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-center items-center relative min-h-screen">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-12 text-gray-400">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-white shadow-md"></div>
            <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
            <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
            <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
          </div>

          <div className="w-full max-w-lg space-y-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Silahkan Pilih Peran <br /> Kamu Disini.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-center">
                <button 
                  type="button"
                  onClick={() => setMode('registerMurid')}
                  className="w-full py-3.5 px-4 bg-[#F5EFEB] text-[#082052] font-bold rounded-2xl text-xs md:text-sm hover:bg-white transition shadow-lg"
                >
                  Ketua Murid/Sekretaris
                </button>
                <p className="text-[10px] text-gray-300 leading-relaxed px-2">
                  Catat kehadiran harian dan pantau tugas piket kelas.
                </p>
              </div>

              <div className="space-y-2 text-center">
                <button 
                  type="button"
                  onClick={() => setMode('registerGuru')}
                  className="w-full py-3.5 px-4 bg-[#F5EFEB] text-[#082052] font-bold rounded-2xl text-xs md:text-sm hover:bg-white transition shadow-lg"
                >
                  Wali Kelas/Guru Mapel
                </button>
                <p className="text-[10px] text-gray-300 leading-relaxed px-2">
                  Lihat rekap kehadiran dan kelola kelas kamu.
                </p>
              </div>
            </div>

            <div className="text-center pt-6 text-xs text-gray-300">
              Sudah punya akun?{' '}
              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="font-bold text-white hover:underline cursor-pointer"
              >
                Login Disini
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // TAMPILAN: LOGIN (UTAMA)
  // ----------------------------------------------------
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
      <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
          <span className="text-3xl font-black tracking-tighter text-white">R</span>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Halo, Selamat Pagi!
          </h1>

          {/* FORM LOGIN YANG SUDAH DIPERBAIKI */}
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('dashboard'); // <-- Pengalihan ke Dashboard
          }}>
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
              <button 
                type="button" 
                onClick={() => setMode('resetPassword')}
                className="text-xs font-semibold text-gray-200 hover:underline cursor-pointer"
              >
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
              onClick={() => setMode('selectRole')}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              Daftar Disini
            </button>
          </div>
        </div>

        <div className="h-6"></div>
      </div>

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