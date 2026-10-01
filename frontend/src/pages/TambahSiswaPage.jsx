import React, { useState } from 'react';

export default function TambahSiswaPage({ onBack, onSuccess, defaultType = 'absensi' }) {
  // Step 1: Input Data ('input') | Step 2: Konfirmasi Data ('confirm')
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    nis: '',
    jenisKelamin: '',
    picketDay: 'Senin'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.fullName.trim() || !formData.nis.trim() || !formData.jenisKelamin) {
      setErrorMsg('Harap lengkapi Nama Lengkap, NIS, dan Jenis Kelamin.');
      return;
    }
    setStep(2);
  };

  const handleSubmitFinal = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/students/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          throw new Error('Server backend belum direstart untuk endpoint tambah siswa. Harap restart backend (node index.js).');
        }
        data = { success: true };
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal menambahkan data siswa.');
      }

      if (onSuccess) {
        onSuccess(data.student || {
          id: Date.now(),
          noAbsen: formData.nis,
          full_name: formData.fullName,
          gender: formData.jenisKelamin,
          status: ''
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden bg-[#082052] selection:bg-blue-500 selection:text-white">
      {/* SISI KIRI (KREM LEMBUT #F5EFEB) */}
      <div className="w-full md:w-1/2 bg-[#F5EFEB] text-[#082052] p-8 md:p-16 lg:p-24 flex flex-col justify-between relative min-h-screen">
        {/* Logo / Tombol Kembali */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack} title="Kembali ke Pengaturan">
          <span className="text-3xl font-black tracking-tighter text-gray-400 hover:text-[#082052] transition">R</span>
        </div>

        {/* Teks Judul dan Subjudul */}
        <div className="max-w-md my-auto space-y-3">
          {step === 1 ? (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#082052] leading-tight">
                Hai, Senang <br /> Bertemu <br /> Denganmu!
              </h1>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed pt-2">
                Yuk, isi semua kolom yang dibutuhkan untuk menambahkan siswa baru.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#082052] leading-tight">
                Konfirmasi Data <br /> Siswa
              </h1>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed pt-2">
                Pastikan data yang diisi sudah sesuai ya!
              </p>
            </>
          )}
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Hadirin.co • {defaultType === 'piket' ? 'Tambah Data Siswa Piket' : 'Tambah Data Absensi Siswa'}
        </div>
      </div>

      {/* SISI KANAN (BIRU TUA NAVY #082052) */}
      <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-16 lg:p-24 flex flex-col justify-center items-center relative min-h-screen">
        {/* Tombol Kembali di Pojok Kanan Atas */}
        <button
          onClick={onBack}
          className="absolute top-8 right-8 text-xs font-semibold text-gray-300 hover:text-white border border-white/20 hover:border-white/40 px-3.5 py-1.5 rounded-full transition cursor-pointer"
        >
          ← Kembali ke Pengaturan
        </button>

        {/* Stepper Indikator Bulat Samping Kanan (Persis Screenshot) */}
        <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-14">
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 border-white transition ${
              step === 1 ? 'bg-white shadow-lg scale-110' : 'bg-transparent'
            }`}
          ></div>
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 border-white transition ${
              step === 2 ? 'bg-white shadow-lg scale-110' : 'bg-transparent'
            }`}
          ></div>
          <div className="absolute top-2 bottom-2 w-[1px] bg-white/25 -z-10"></div>
        </div>

        <div className="w-full max-w-md space-y-6 my-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: FORM INPUT DATA SISWA (Persis Screenshot) */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 text-left">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="contoh: Asep Mulyana"
                  className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition"
                />
              </div>

              {/* NIS */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">NIS</label>
                <input
                  type="text"
                  required
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  placeholder="contoh: 32721.."
                  className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">Jenis Kelamin</label>
                <div className="relative">
                  <select
                    required
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                    className="w-full appearance-none px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-white/60 cursor-pointer pr-10"
                  >
                    <option value="" disabled className="bg-[#082052] text-gray-400">
                      Pilih
                    </option>
                    <option value="Laki-laki" className="bg-[#082052] text-white">
                      Laki-laki
                    </option>
                    <option value="Perempuan" className="bg-[#082052] text-white">
                      Perempuan
                    </option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs font-bold">
                    ▼
                  </span>
                </div>
              </div>

              {/* Tombol Selanjutnya (Krem Lebar Berisi) */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#F5EFEB] text-[#082052] hover:bg-white font-bold rounded-2xl text-xs md:text-sm shadow-xl transition cursor-pointer mt-6"
              >
                Selanjutnya
              </button>
            </form>
          )}

          {/* STEP 2: KONFIRMASI DATA SISWA */}
          {step === 2 && (
            <div className="space-y-4 text-left">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">Nama Lengkap</label>
                <div className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white font-semibold">
                  {formData.fullName}
                </div>
              </div>

              {/* NIS */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">NIS</label>
                <div className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white font-semibold">
                  {formData.nis}
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">Jenis Kelamin</label>
                <div className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white font-semibold">
                  {formData.jenisKelamin}
                </div>
              </div>

              {/* Tombol Tambah Data Siswa */}
              <div className="pt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleSubmitFinal}
                  disabled={loading}
                  className="w-full py-3.5 bg-[#F5EFEB] text-[#082052] hover:bg-white font-bold rounded-2xl text-xs md:text-sm shadow-xl transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Tambah Data Siswa'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-xs text-gray-300 hover:text-white transition cursor-pointer text-center"
                >
                  ← Kembali Edit Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
