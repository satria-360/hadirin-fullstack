import React, { useState } from 'react';

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [guruForm, setGuruForm] = useState({
    firstName: '',
    lastName: '',
    kelasAmampu: '',
    jurusan: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [muridForm, setMuridForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    nisn: '',
    kodeKelas: '',
    agreeTerms: false
  });

  const clearAlerts = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSwitchMode = (newMode) => {
    clearAlerts();
    setMode(newMode);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Harap isi email dan password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login gagal, periksa email dan kata sandi Anda.');
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.token);
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterGuruSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!guruForm.firstName || !guruForm.email || !guruForm.password) {
      setErrorMessage('Harap lengkapi nama depan, email, dan password.');
      return;
    }

    if (guruForm.password !== guruForm.confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    if (!guruForm.agreeTerms) {
      setErrorMessage('Harap menyetujui syarat & ketentuan.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'guru',
          ...guruForm
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Pendaftaran gagal.');
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.token);
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMuridSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!muridForm.firstName || !muridForm.email || !muridForm.password) {
      setErrorMessage('Harap lengkapi nama depan, email, dan password.');
      return;
    }

    if (muridForm.password !== muridForm.confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    if (!muridForm.agreeTerms) {
      setErrorMessage('Harap menyetujui syarat & ketentuan.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'murid',
          ...muridForm
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Pendaftaran gagal.');
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.token);
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'resetPassword') {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
        <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
            <span className="text-3xl font-black tracking-tighter text-white">R</span>
          </div>

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

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs">
                {successMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              setSuccessMessage('Instruksi reset kata sandi telah dikirim ke email Anda!');
              setTimeout(() => {
                handleSwitchMode('login');
              }, 2000);
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
                className="w-full py-3 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-sm hover:bg-white transition flex items-center justify-center gap-2 shadow-md mt-4 cursor-pointer"
              >
                Reset Password ↗
              </button>
            </form>

            <div className="text-center text-xs text-gray-300 pt-2">
              Sudah ingat kata sandi?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="font-bold text-white hover:underline cursor-pointer"
              >
                Login Disini
              </button>
            </div>
          </div>

          <div className="h-6"></div>
        </div>

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

  if (mode === 'registerGuru') {
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
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleRegisterGuruSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Depan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Asep"
                    value={guruForm.firstName}
                    onChange={(e) => setGuruForm({ ...guruForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Belakang</label>
                  <input
                    type="text"
                    placeholder="Sularjana"
                    value={guruForm.lastName}
                    onChange={(e) => setGuruForm({ ...guruForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Kelas Yang Diampu</label>
                <input
                  type="text"
                  placeholder="XI TKJ 2"
                  value={guruForm.kelasAmampu}
                  onChange={(e) => setGuruForm({ ...guruForm, kelasAmampu: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">NUPTK</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={18}
                  placeholder="Contoh: 198701012015031002"
                  value={guruForm.jurusan}
                  onChange={(e) => setGuruForm({ ...guruForm, jurusan: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="asep@hadirin.co"
                  value={guruForm.email}
                  onChange={(e) => setGuruForm({ ...guruForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Nomor Telepon</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-xl">
                  <span className="text-xs">🇮</span>
                  <span className="text-xs text-gray-300">+62</span>
                  <input
                    type="tel"
                    placeholder="8152211234"
                    value={guruForm.phoneNumber}
                    onChange={(e) => setGuruForm({ ...guruForm, phoneNumber: e.target.value })}
                    className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left relative">
                <label className="text-[11px] text-gray-300 font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={guruForm.password}
                    onChange={(e) => setGuruForm({ ...guruForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Konfirmasi Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={guruForm.confirmPassword}
                  onChange={(e) => setGuruForm({ ...guruForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-xs hover:bg-white transition shadow-md mt-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Sebagai Wali Kelas / Guru'}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="termsGuru"
                  checked={guruForm.agreeTerms}
                  onChange={(e) => setGuruForm({ ...guruForm, agreeTerms: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 cursor-pointer"
                />
                <label htmlFor="termsGuru" className="text-[10px] text-gray-300 cursor-pointer">
                  Saya Menyetujui Syarat & Ketentuan <span className="font-bold text-white">Hadirin.co</span>
                </label>
              </div>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => handleSwitchMode('selectRole')}
                className="text-xs text-gray-300 hover:text-white underline cursor-pointer"
              >
                ← Kembali Pilih Peran
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleRegisterMuridSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Depan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Depanmu"
                    value={muridForm.firstName}
                    onChange={(e) => setMuridForm({ ...muridForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[11px] text-gray-300 font-medium">Nama Belakang</label>
                  <input
                    type="text"
                    placeholder="Nama Belakangmu"
                    value={muridForm.lastName}
                    onChange={(e) => setMuridForm({ ...muridForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="siswa@hadirin.co"
                  value={muridForm.email}
                  onChange={(e) => setMuridForm({ ...muridForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left relative">
                <label className="text-[11px] text-gray-300 font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={muridForm.password}
                    onChange={(e) => setMuridForm({ ...muridForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Konfirmasi Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={muridForm.confirmPassword}
                  onChange={(e) => setMuridForm({ ...muridForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">Nomor Telepon</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-xl">
                  <span className="text-xs">🇮</span>
                  <span className="text-xs text-gray-300">+62</span>
                  <input
                    type="tel"
                    placeholder="8123456789"
                    value={muridForm.phoneNumber}
                    onChange={(e) => setMuridForm({ ...muridForm, phoneNumber: e.target.value })}
                    className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] text-gray-300 font-medium">NISN / No Induk</label>
                <input
                  type="text"
                  placeholder="Contoh: 12342"
                  value={muridForm.nisn}
                  onChange={(e) => setMuridForm({ ...muridForm, nisn: e.target.value })}
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
                  value={muridForm.kodeKelas}
                  onChange={(e) => setMuridForm({ ...muridForm, kodeKelas: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-xs hover:bg-white transition shadow-md mt-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Sebagai Siswa / Sekretaris'}
              </button>

              <div className="flex items-center justify-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="termsMurid"
                  checked={muridForm.agreeTerms}
                  onChange={(e) => setMuridForm({ ...muridForm, agreeTerms: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 cursor-pointer"
                />
                <label htmlFor="termsMurid" className="text-[10px] text-gray-300 cursor-pointer">
                  Saya Menyetujui Syarat & Ketentuan <span className="font-bold text-white">Hadirin.co</span>
                </label>
              </div>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => handleSwitchMode('selectRole')}
                className="text-xs text-gray-300 hover:text-white underline cursor-pointer"
              >
                ← Kembali Pilih Peran
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  onClick={() => handleSwitchMode('registerMurid')}
                  className="w-full py-3.5 px-4 bg-[#F5EFEB] text-[#082052] font-bold rounded-2xl text-xs md:text-sm hover:bg-white transition shadow-lg cursor-pointer"
                >
                  Ketua Murid / Sekretaris
                </button>
                <p className="text-[10px] text-gray-300 leading-relaxed px-2">
                  Catat kehadiran harian dan pantau tugas piket kelas.
                </p>
              </div>

              <div className="space-y-2 text-center">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('registerGuru')}
                  className="w-full py-3.5 px-4 bg-[#F5EFEB] text-[#082052] font-bold rounded-2xl text-xs md:text-sm hover:bg-white transition shadow-lg cursor-pointer"
                >
                  Wali Kelas / Guru Mapel
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
                onClick={() => handleSwitchMode('login')}
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

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden">
      <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('landing')}>
          <span className="text-3xl font-black tracking-tighter text-white">R</span>
        </div>

        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Halo, Selamat Pagi!
            </h1>
            <p className="text-xs text-gray-300 mt-1">Masukkan kredensial Anda untuk masuk ke sistem.</p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div className="space-y-1 text-left">
              <label className="text-xs text-gray-300 font-medium">Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@hadirin.co"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition"
              />
            </div>

            <div className="space-y-1 text-left relative">
              <label className="text-xs text-gray-300 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => handleSwitchMode('resetPassword')}
                className="text-xs font-semibold text-gray-200 hover:underline cursor-pointer"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-sm hover:bg-white transition flex items-center justify-center gap-2 shadow-md mt-4 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Memproses...' : 'Masuk ↗'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-300 pt-2">
            Belum Punya Akun?{' '}
            <button
              type="button"
              onClick={() => handleSwitchMode('selectRole')}
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