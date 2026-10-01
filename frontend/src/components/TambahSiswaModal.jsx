import React, { useState } from 'react';

export default function TambahSiswaModal({ isOpen, onClose, onSuccess, initialDay = 'Senin' }) {
  // Step 1: Input Data ('input') | Step 2: Konfirmasi Data ('confirm')
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    nis: '',
    jenisKelamin: '',
    picketDay: initialDay
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal menambahkan data siswa.');
      }

      if (onSuccess) {
        onSuccess(data.student);
      }
      handleClose();
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      fullName: '',
      nis: '',
      jenisKelamin: '',
      picketDay: initialDay
    });
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      {/* Container 2 Kolom Persis Screenshot */}
      <div className="w-full max-w-4xl bg-[#F5EFEB] text-[#082052] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative min-h-[520px]">
        {/* Tombol Tutup X */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          title="Tutup"
        >
          ✕
        </button>

        {/* 1. SISI KIRI (KREM) */}
        <div className="w-full md:w-5/12 bg-[#F5EFEB] p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-4 my-auto">
            {step === 1 ? (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#082052] leading-tight">
                  Hai, Senang <br /> Bertemu <br /> Denganmu!
                </h2>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Yuk, isi semua kolom yang dibutuhkan untuk menambahkan siswa baru.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#082052] leading-tight">
                  Konfirmasi Data <br /> Siswa
                </h2>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Pastikan data yang diisi sudah sesuai ya!
                </p>
              </>
            )}
          </div>
          <div className="text-[11px] text-gray-400 font-medium">Hadirin.co Presensi & Piket</div>
        </div>

        {/* 2. SISI KANAN (BIRU TUA) */}
        <div className="w-full md:w-7/12 bg-[#082052] text-white p-8 md:p-12 flex flex-col justify-center relative">
          {/* Stepper Indikator Samping */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-10">
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 border-white transition ${
                step === 1 ? 'bg-white shadow-md' : 'bg-transparent'
              }`}
            ></div>
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 border-white transition ${
                step === 2 ? 'bg-white shadow-md' : 'bg-transparent'
              }`}
            ></div>
            <div className="absolute top-2 bottom-2 w-[1px] bg-white/20 -z-10"></div>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: FORM INPUT SISWA */}
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
                    placeholder="contoh: 12121..."
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
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Hari Jadwal Piket */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">Jadwal Hari Piket</label>
                  <div className="relative">
                    <select
                      value={formData.picketDay}
                      onChange={(e) => setFormData({ ...formData, picketDay: e.target.value })}
                      className="w-full appearance-none px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-white/60 cursor-pointer pr-10"
                    >
                      <option value="Senin" className="bg-[#082052] text-white">Senin</option>
                      <option value="Selasa" className="bg-[#082052] text-white">Selasa</option>
                      <option value="Rabu" className="bg-[#082052] text-white">Rabu</option>
                      <option value="Kamis" className="bg-[#082052] text-white">Kamis</option>
                      <option value="Jumat" className="bg-[#082052] text-white">Jumat</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Tombol Selanjutnya */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F5EFEB] text-[#082052] hover:bg-white font-bold rounded-2xl text-xs md:text-sm shadow-xl transition cursor-pointer mt-4"
                >
                  Selanjutnya
                </button>
              </form>
            )}

            {/* STEP 2: KONFIRMASI DATA SISWA */}
            {step === 2 && (
              <div className="space-y-4 text-left">
                {/* Nama Lengkap (Read-only review) */}
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

                {/* Jadwal Hari Piket */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">Jadwal Hari Piket</label>
                  <div className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white font-semibold">
                    {formData.picketDay}
                  </div>
                </div>

                {/* Tombol Tambah Data Siswa */}
                <div className="pt-2 flex flex-col gap-2">
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
                    className="w-full py-2 text-xs text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    ← Kembali Edit Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
