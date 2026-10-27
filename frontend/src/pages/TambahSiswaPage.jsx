import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function TambahSiswaPage({ onBack, onSuccess, defaultType = 'absensi' }) {
  // Mode: 'manual' | 'import'
  const [mode, setMode] = useState('manual');

  // ── STATE MANUAL ──────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: '', nis: '', jenisKelamin: '', picketDay: 'Senin' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ── STATE IMPORT ──────────────────────────────────────────────
  const [importRows, setImportRows] = useState([]); // baris preview
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null); // { inserted, skipped, errors }
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  // ────────────────────────────────────────────────────────────────
  //  MANUAL — handlers
  // ────────────────────────────────────────────────────────────────
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) throw new Error('Server backend belum direstart untuk endpoint tambah siswa.');
        data = { success: true };
      }
      if (!response.ok || !data.success) throw new Error(data.message || 'Gagal menambahkan data siswa.');
      if (onSuccess) {
        onSuccess(data.student || { id: Date.now(), noAbsen: formData.nis, full_name: formData.fullName, gender: formData.jenisKelamin, status: '' });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  //  IMPORT — handlers
  // ────────────────────────────────────────────────────────────────

  /** Parse file Excel/CSV → array baris */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError('');
    setImportResult(null);
    setImportFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });

        // Normalise kolom → internal field names
        const rows = json.map((row, i) => ({
          rowNum: i + 1,
          fullName: (row['Nama Lengkap'] || row['nama lengkap'] || row['fullName'] || row['nama'] || '').toString().trim(),
          nis: (row['NIS'] || row['nis'] || '').toString().trim(),
          jenisKelamin: (row['Jenis Kelamin'] || row['jenis kelamin'] || row['jenisKelamin'] || 'Laki-laki').toString().trim(),
          picketDay: (row['Hari Piket'] || row['hari piket'] || row['picketDay'] || 'Senin').toString().trim(),
          _valid: !!(row['Nama Lengkap'] || row['nama lengkap'] || row['fullName'] || row['nama']) &&
            !!(row['NIS'] || row['nis'])
        }));

        if (rows.length === 0) {
          setImportError('File kosong atau format tidak dikenali.');
          setImportRows([]);
          return;
        }
        if (rows.length > 200) {
          setImportError('Maksimal 200 baris per impor. Silakan bagi menjadi beberapa file.');
          setImportRows([]);
          return;
        }
        setImportRows(rows);
      } catch (err) {
        setImportError('Gagal membaca file: ' + err.message);
        setImportRows([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  /** Kirim data ke backend */
  const handleImportSubmit = async () => {
    const validRows = importRows.filter(r => r._valid);
    if (validRows.length === 0) {
      setImportError('Tidak ada baris valid yang bisa diimpor.');
      return;
    }
    setImportLoading(true);
    setImportError('');
    setImportResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/students/import-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ students: validRows })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal impor.');
      setImportResult(data);
      if (onSuccess && data.inserted > 0) {
        // Beri sinyal ke parent bahwa ada siswa baru (reload)
        onSuccess({ _bulk: true, inserted: data.inserted });
      }
    } catch (err) {
      setImportError(err.message);
    } finally {
      setImportLoading(false);
    }
  };

  /** Download template Excel kosong */
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Nama Lengkap', 'NIS', 'Jenis Kelamin'],
      ['Asep Mulyana', '12345', 'Laki-laki'],
      ['Siti Nurhaliza', '12346', 'Perempuan'],
    ]);
    // Set column widths
    ws['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
    XLSX.writeFile(wb, 'template_import_siswa.xlsx');
  };

  const resetImport = () => {
    setImportRows([]);
    setImportFile(null);
    setImportResult(null);
    setImportError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validCount = importRows.filter(r => r._valid).length;
  const invalidCount = importRows.length - validCount;

  // ────────────────────────────────────────────────────────────────
  //  LEFT PANEL text per state
  // ────────────────────────────────────────────────────────────────
  const leftTitle = mode === 'import'
    ? importResult
      ? <>Impor<br />Selesai! 🎉</>
      : importRows.length > 0
        ? <>Preview<br />Data Siswa</>
        : <>Impor dari<br />Excel / CSV</>
    : step === 1 ? <>Hai, Senang<br />Bertemu<br />Denganmu!</> : <>Konfirmasi<br />Data Siswa</>;

  const leftSub = mode === 'import'
    ? importResult
      ? `${importResult.inserted} siswa berhasil ditambahkan.`
      : importRows.length > 0
        ? `${validCount} baris valid siap diimpor.`
        : 'Upload file Excel atau CSV, lalu cek preview sebelum menyimpan.'
    : step === 1
      ? 'Isi semua kolom untuk menambahkan siswa baru.'
      : 'Pastikan data yang diisi sudah sesuai ya!';

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row font-sans m-0 p-0 overflow-hidden bg-[#082052] selection:bg-blue-500 selection:text-white">

      {/* ── SISI KIRI ─────────────────────────────────────────────── */}
      <div className="w-full md:w-1/2 bg-[#F5EFEB] text-[#082052] p-8 md:p-16 lg:p-24 flex flex-col justify-between relative min-h-screen">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack} title="Kembali">
          <span className="text-3xl font-black tracking-tighter text-gray-400 hover:text-[#082052] transition">R</span>
        </div>

        <div className="max-w-md my-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#082052] leading-tight">
            {leftTitle}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{leftSub}</p>

          {/* Panduan format kolom */}
          {mode === 'import' && !importResult && importRows.length === 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-[#082052]">Kolom yang dikenali:</p>
              {[
                ['Nama Lengkap', 'Wajib'],
                ['NIS', 'Wajib — dipakai sebagai No Absen'],
                ['Jenis Kelamin', 'Opsional (default: Laki-laki)'],
              ].map(([col, info]) => (
                <div key={col} className="flex items-start gap-2 text-xs">
                  <span className="font-mono bg-[#082052] text-white px-2 py-0.5 rounded text-[10px] shrink-0">{col}</span>
                  <span className="text-gray-500">{info}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Hadirin.co • {defaultType === 'piket' ? 'Tambah Data Siswa Piket' : 'Tambah Data Absensi Siswa'}
        </div>
      </div>

      {/* ── SISI KANAN ────────────────────────────────────────────── */}
      <div className="w-full md:w-1/2 bg-[#082052] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-start relative min-h-screen overflow-y-auto">
        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="self-end text-xs font-semibold text-gray-300 hover:text-white border border-white/20 hover:border-white/40 px-3.5 py-1.5 rounded-full transition cursor-pointer mb-8"
        >
          ← Kembali ke Pengaturan
        </button>

        {/* ── TAB SWITCHER ── */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-2xl">
          <button
            onClick={() => { setMode('manual'); setStep(1); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${mode === 'manual' ? 'bg-[#F5EFEB] text-[#082052] shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            ✏️ Input Manual
          </button>
          <button
            onClick={() => { setMode('import'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${mode === 'import' ? 'bg-[#F5EFEB] text-[#082052] shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            📂 Impor Excel / CSV
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════
            MODE MANUAL
        ════════════════════════════════════════════════════════ */}
        {mode === 'manual' && (
          <div className="w-full max-w-md mx-auto space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">{errorMsg}</div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">Nama Lengkap</label>
                  <input type="text" required value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="contoh: Asep Mulyana"
                    className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">NIS</label>
                  <input type="text" required value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="contoh: 32721.."
                    className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">Jenis Kelamin</label>
                  <div className="relative">
                    <select required value={formData.jenisKelamin}
                      onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                      className="w-full appearance-none px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-white/60 cursor-pointer pr-10"
                    >
                      <option value="" disabled className="bg-[#082052] text-gray-400">Pilih</option>
                      <option value="Laki-laki" className="bg-[#082052] text-white">Laki-laki</option>
                      <option value="Perempuan" className="bg-[#082052] text-white">Perempuan</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs font-bold">▼</span>
                  </div>
                </div>
                <button type="submit"
                  className="w-full py-3.5 bg-[#F5EFEB] text-[#082052] hover:bg-white font-bold rounded-2xl text-xs md:text-sm shadow-xl transition cursor-pointer mt-6"
                >
                  Selanjutnya
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4 text-left">
                {[['Nama Lengkap', formData.fullName], ['NIS', formData.nis], ['Jenis Kelamin', formData.jenisKelamin]].map(([label, val]) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs text-gray-300 font-medium">{label}</label>
                    <div className="w-full px-4 py-3 bg-[#112963] border border-white/20 rounded-xl text-xs md:text-sm text-white font-semibold">{val}</div>
                  </div>
                ))}
                <div className="pt-4 flex flex-col gap-2.5">
                  <button type="button" onClick={handleSubmitFinal} disabled={loading}
                    className="w-full py-3.5 bg-[#F5EFEB] text-[#082052] hover:bg-white font-bold rounded-2xl text-xs md:text-sm shadow-xl transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Menyimpan...' : 'Tambah Data Siswa'}
                  </button>
                  <button type="button" onClick={() => setStep(1)}
                    className="w-full py-2 text-xs text-gray-300 hover:text-white transition cursor-pointer text-center"
                  >
                    ← Kembali Edit Data
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            MODE IMPORT
        ════════════════════════════════════════════════════════ */}
        {mode === 'import' && (
          <div className="w-full max-w-2xl mx-auto space-y-5">

            {/* ── Hasil Impor ── */}
            {importResult && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-700/30 border border-emerald-500/40 text-emerald-200 text-sm font-semibold">
                  ✅ {importResult.message}
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-4 space-y-2 max-h-48 overflow-y-auto">
                    <p className="text-xs font-bold text-amber-300 mb-1">Baris yang dilewati:</p>
                    {importResult.errors.map((e, i) => (
                      <div key={i} className="text-[11px] text-gray-300 flex gap-2">
                        <span className="text-gray-500 shrink-0">Baris {e.row}</span>
                        <span>{e.reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={resetImport}
                  className="w-full py-3 rounded-2xl bg-[#F5EFEB] text-[#082052] font-bold text-xs hover:bg-white transition cursor-pointer"
                >
                  Impor File Lain
                </button>
              </div>
            )}

            {/* ── Upload Area ── */}
            {!importResult && (
              <>
                {/* Error */}
                {importError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">{importError}</div>
                )}

                {/* Drop Zone / File Picker */}
                {importRows.length === 0 && (
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/25 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/50 hover:bg-white/5 transition group"
                    >
                      <svg className="w-10 h-10 text-white/30 group-hover:text-white/60 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white/70 group-hover:text-white">Klik untuk pilih file</p>
                        <p className="text-xs text-gray-400 mt-1">Mendukung .xlsx, .xls, .csv</p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button onClick={handleDownloadTemplate}
                      className="w-full py-2.5 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 9v4l-3-3-3 3V11h2V8h2v3h2z" />
                      </svg>
                      Download Template Excel
                    </button>
                  </div>
                )}

                {/* ── Preview Tabel ── */}
                {importRows.length > 0 && (
                  <div className="space-y-4">
                    {/* Ringkasan */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-700/40 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        ✓ {validCount} baris valid
                      </span>
                      {invalidCount > 0 && (
                        <span className="px-3 py-1 rounded-full bg-rose-700/40 text-rose-300 text-xs font-bold border border-rose-500/30">
                          ✕ {invalidCount} baris tidak valid
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-medium">
                        📄 {importFile?.name}
                      </span>
                    </div>

                    {/* Tabel Preview */}
                    <div className="rounded-2xl overflow-hidden border border-white/10 max-h-72 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-white/10 sticky top-0">
                          <tr>
                            <th className="px-3 py-2.5 text-left text-gray-300 font-bold">#</th>
                            <th className="px-3 py-2.5 text-left text-gray-300 font-bold">Nama Lengkap</th>
                            <th className="px-3 py-2.5 text-left text-gray-300 font-bold">NIS / No Absen</th>
                            <th className="px-3 py-2.5 text-left text-gray-300 font-bold">Jenis Kelamin</th>
                            <th className="px-3 py-2.5 text-center text-gray-300 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {importRows.map((row) => (
                            <tr key={row.rowNum} className={`transition ${row._valid ? 'bg-white/[0.03] hover:bg-white/[0.07]' : 'bg-rose-900/20'}`}>
                              <td className="px-3 py-2 text-gray-400">{row.rowNum}</td>
                              <td className="px-3 py-2 text-white font-medium">{row.fullName || <span className="text-rose-400 italic">kosong</span>}</td>
                              <td className="px-3 py-2 text-white">{row.nis || <span className="text-rose-400 italic">kosong</span>}</td>
                              <td className="px-3 py-2 text-gray-300">{row.jenisKelamin}</td>
                              <td className="px-3 py-2 text-center">
                                {row._valid
                                  ? <span className="text-emerald-400 font-bold">✓</span>
                                  : <span className="text-rose-400 font-bold">✕</span>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2.5">
                      <button onClick={resetImport}
                        className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 text-xs font-semibold transition cursor-pointer"
                      >
                        Ganti File
                      </button>
                      <button
                        onClick={handleImportSubmit}
                        disabled={importLoading || validCount === 0}
                        className="flex-[2] py-3 rounded-xl bg-[#F5EFEB] text-[#082052] hover:bg-white font-bold text-xs shadow-xl transition cursor-pointer disabled:opacity-50"
                      >
                        {importLoading ? 'Mengimpor...' : `Impor ${validCount} Siswa`}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
