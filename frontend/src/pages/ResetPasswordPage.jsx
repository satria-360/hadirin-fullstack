import React, { useState } from 'react';

export default function ResetPasswordPage({ onBackToLogin, onNavigate }) {
  const [step, setStep] = useState(1); // 1: Minta Kode (Input Email), 2: Masukkan Kode & Password Baru
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const clearAlerts = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Step 1: Kirim request kode OTP ke email yang dimasukkan
  const handleRequestCode = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!email) {
      setErrorMessage('Harap masukkan alamat email Anda.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/request-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengirim kode OTP.');
      }

      setGeneratedCode(data.previewUrl || '');
      setSuccessMessage('Kode OTP 6 digit telah dikirim ke email Anda! Silakan cek kotak masuk atau folder spam.');
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verifikasi kode OTP dan simpan password baru
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!code || !newPassword) {
      setErrorMessage('Harap masukkan kode OTP dan password baru.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengatur ulang kata sandi.');
      }

      setShowSuccessModal(true);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-y-auto md:overflow-hidden bg-[#082052]">
      {/* SISI KIRI (FORM RESET - BIRU) */}
      <div className="w-full md:w-1/2 bg-[#082052] text-white p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between h-auto md:h-screen overflow-y-auto relative">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => onNavigate && onNavigate('landing')}>
          <img
            src="/images/Logo_RekaEnam.svg"
            alt="Logo Reka Enam"
            className="h-8 sm:h-9 w-auto brightness-0 invert group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* STEPPER DOTS DI KIRI */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-12 text-gray-400">
          <div className={`w-3.5 h-3.5 rounded-full border-2 border-white transition-all ${step === 1 ? 'bg-white shadow-md' : 'bg-transparent'}`}></div>
          <div className={`w-3.5 h-3.5 rounded-full border-2 border-white transition-all ${step === 2 ? 'bg-white shadow-md' : 'bg-transparent'}`}></div>
          <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
        </div>

        {/* CONTAINER FORM */}
        <div className="w-full max-w-md mx-auto my-auto py-1 space-y-3.5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {step === 1 ? 'Lupa Kata Sandi?' : 'Verifikasi OTP'}
            </h1>
            <p className="text-xs text-gray-300 mt-0.5">
              {step === 1
                ? 'Masukkan email anda untuk menerima kode OTP verifikasi.'
                : `Masukkan 6 digit kode OTP yang dikirim ke ${email}.`}
            </p>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs">
              {successMessage}
              {generatedCode && (
                <div className="mt-1">
                  <a
                    href={generatedCode}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-emerald-100 hover:text-white"
                  >
                    Buka Kotak Masuk Email (Preview) ↗
                  </a>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: INPUT EMAIL */}
          {step === 1 ? (
            <form className="space-y-3.5" onSubmit={handleRequestCode}>
              <div className="space-y-1 text-left">
                <label className="text-sm text-gray-300 font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="asep123@gmail.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition hover:bg-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-50 cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
              >
                {loading ? 'Mengirim...' : 'Kirim Kode OTP ↗'}
              </button>
            </form>
          ) : (
            /* STEP 2: INPUT KODE OTP & PASSWORD BARU */
            <form className="space-y-2.5" onSubmit={handleResetPassword}>
              <div className="space-y-1 text-left">
                <label className="text-sm text-gray-300 font-medium">Kode OTP (6 Digit)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Contoh: 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition tracking-widest text-center text-lg font-mono hover:bg-white/10"
                />
              </div>

              <div className="space-y-1 text-left relative">
                <label className="text-sm text-gray-300 font-medium">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition pr-10 hover:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
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
                <label className="text-sm text-gray-300 font-medium">Konfirmasi Password Baru</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Ketik ulang password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition hover:bg-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#F5EFEB] text-[#082052] font-bold rounded-xl text-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md mt-1.5 disabled:opacity-50 cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
              >
                {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru ↗'}
              </button>

              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    clearAlerts();
                  }}
                  className="text-xs text-gray-300 hover:text-white underline cursor-pointer"
                >
                  ← Ganti Email / Minta Kode Ulang
                </button>
              </div>
            </form>
          )}

        </div>

        <div className="h-4 shrink-0"></div>
      </div>

      {/* SISI KANAN (WELCOME SCREEN - KREM) */}
      <div className="w-full md:w-1/2 bg-[#F5EFEB] text-[#082052] p-8 md:p-16 flex flex-col items-center justify-center text-center min-h-[300px] md:h-screen">
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Reset Password
          </h2>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            Silahkan Isi Semua Data Yang Dibutuhkan <br /> Untuk Mereset Password Anda.
          </p>
        </div>
      </div>

      {/* POP UP OVERLAY SUKSES (SESUAI DESAIN GAMBAR) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl relative transform animate-in zoom-in-95 duration-200">
            {/* Icon Lingkaran Biru Gradient dengan Badge Centang */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#0e3b8a] to-[#082052] flex items-center justify-center shadow-lg shadow-blue-900/30 mb-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#F5EFEB] rounded-xl rotate-45 flex items-center justify-center shadow-inner relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-7 sm:h-7 text-[#082052] -rotate-45 stroke-[3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Judul & Deskripsi */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Kata Sandi Berhasil Diubah!
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">
              Silahkan masuk kembali ke akun anda menggunakan kata sandi yang baru.
            </p>

            {/* Tombol Oke Lonjong Biru */}
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                if (onBackToLogin) onBackToLogin();
              }}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#0d347c] to-[#082052] hover:from-[#0b2b66] hover:to-[#06173a] text-white font-semibold rounded-full shadow-lg shadow-blue-950/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm sm:text-base"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
}