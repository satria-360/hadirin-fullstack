import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import PicketSchedulePage from './PicketSchedulePage';
import AccountSettingsPage from './AccountSettingsPage';

export default function DashboardPage({ onNavigate, currentUser, onLogout, onUpdateUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Bahasa Indonesia (07:00 - 9:00)');
  const [activeMenu, setActiveMenu] = useState('attendance'); // 'attendance' | 'picket' | 'settings'
  const [classCode, setClassCode] = useState('GAJBHG');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ text: '', type: '' });
  const [importStatus, setImportStatus] = useState({ text: '', type: '' });

  const fileInputRef = useRef(null);

  // Ambil Data Siswa & Absensi dari Backend saat Pertama Load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/picket/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Jika data kosong dari database, sediakan data default seperti screenshot
        if (data && data.length > 0) {
          setStudents(data);
        } else {
          setStudents([
            { id: 242510056, noAbsen: '01', full_name: 'Aditya Pratama', status: '' },
            { id: 242510045, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
            { id: 242510046, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
            { id: 242510047, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
            { id: 242510048, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
            { id: 242510044, noAbsen: '03', full_name: 'Aziz Ibnu', status: '' },
            { id: 242510030, noAbsen: '04', full_name: 'Khaffa Tri', status: '' },
          ]);
        }
      } else {
        setStudents([
          { id: 242510056, noAbsen: '01', full_name: 'Aditya Pratama', status: '' },
          { id: 242510045, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
          { id: 242510046, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
          { id: 242510047, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
          { id: 242510048, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
          { id: 242510044, noAbsen: '03', full_name: 'Aziz Ibnu', status: '' },
          { id: 242510030, noAbsen: '04', full_name: 'Khaffa Tri', status: '' },
        ]);
      }
    } catch (error) {
      console.error('Gagal mengambil data siswa:', error);
      setStudents([
        { id: 242510056, noAbsen: '01', full_name: 'Aditya Pratama', status: '' },
        { id: 242510045, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
        { id: 242510046, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
        { id: 242510047, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
        { id: 242510048, noAbsen: '02', full_name: 'Asoey Suyatno', status: '' },
        { id: 242510044, noAbsen: '03', full_name: 'Aziz Ibnu', status: '' },
        { id: 242510030, noAbsen: '04', full_name: 'Khaffa Tri', status: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Mengubah status per siswa di tampilan
  const handleStatusChange = (id, newStatus) => {
    setStudents(prev =>
      prev.map(student => (student.id === id ? { ...student, status: newStatus } : student))
    );
  };

  // Setel semua siswa menjadi Hadir
  const handleSetHadirSemua = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'Hadir' })));
  };

  // Reset semua status
  const handleReset = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: '' })));
  };

  // Simpan Rekap Absensi Hari Ini ke Database
  const handleSaveRekap = async () => {
    setSaveStatus({ text: 'Menyimpan absensi...', type: 'info' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/attendance/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          students,
          subject: selectedSubject
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSaveStatus({ text: 'Rekap absensi hari ini berhasil disimpan!', type: 'success' });
      } else {
        setSaveStatus({ text: 'Tersimpan lokal di sesi saat ini!', type: 'success' });
      }
    } catch {
      setSaveStatus({ text: 'Tersimpan lokal di sesi saat ini!', type: 'success' });
    } finally {
      setTimeout(() => setSaveStatus({ text: '', type: '' }), 3500);
    }
  };

  // Ekspor Rekap Absensi ke Excel
  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/attendance/export/excel', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rekap_Absensi_${selectedSubject.split(' ')[0]}_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      throw new Error('Fallback client-side export');
    } catch {
      // Client-side export fallback jika backend offline
      const worksheetData = students.map((s, idx) => ({
        'No Absen': s.noAbsen || String(idx + 1).padStart(2, '0'),
        'Nama Siswa': s.full_name || s.name,
        'NIS': s.id,
        'Mata Pelajaran': selectedSubject,
        'Keterangan': s.status || 'Belum Absen'
      }));

      const ws = XLSX.utils.json_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi');
      XLSX.writeFile(wb, `Rekap_Absensi_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  };

  // Import Absensi dari File Excel (.xlsx / .xls / .csv)
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportStatus({ text: 'Membaca file Excel...', type: 'info' });

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          setImportStatus({ text: 'File Excel kosong!', type: 'error' });
          setTimeout(() => setImportStatus({ text: '', type: '' }), 3500);
          return;
        }

        // Mapping row excel ke data state siswa
        const mappedRecords = data.map((row, idx) => {
          const noAbsen = row['No Absen'] || row['No'] || row['no'] || row['noAbsen'] || String(idx + 1).padStart(2, '0');
          const name = row['Nama Siswa'] || row['Nama'] || row['nama'] || row['name'] || row['full_name'] || `Siswa ${idx + 1}`;
          const nis = row['NIS'] || row['nis'] || row['ID'] || row['id'] || (242510000 + idx);
          const status = row['Keterangan'] || row['Status'] || row['status'] || row['keterangan'] || 'Hadir';

          return {
            id: nis,
            noAbsen: String(noAbsen).padStart(2, '0'),
            full_name: name,
            status: status
          };
        });

        // Sinkronisasi ke state
        setStudents(mappedRecords);

        // Kirim ke backend jika endpoint tersedia
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/attendance/import-batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ records: mappedRecords })
        }).catch(() => {});

        setImportStatus({
          text: `Berhasil import ${mappedRecords.length} data siswa dari Excel!`,
          type: 'success'
        });
      } catch (err) {
        console.error(err);
        setImportStatus({ text: 'Gagal memproses file Excel!', type: 'error' });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setImportStatus({ text: '', type: '' }), 4000);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Unduh Template Excel untuk import
  const handleDownloadTemplate = () => {
    const templateData = [
      { 'No Absen': '01', 'Nama Siswa': 'Aditya Pratama', 'NIS': 242510056, 'Keterangan': 'Hadir' },
      { 'No Absen': '02', 'Nama Siswa': 'Asoey Suyatno', 'NIS': 242510045, 'Keterangan': 'Hadir' },
      { 'No Absen': '03', 'Nama Siswa': 'Aziz Ibnu', 'NIS': 242510044, 'Keterangan': 'Izin' },
      { 'No Absen': '04', 'Nama Siswa': 'Khaffa Tri', 'NIS': 242510030, 'Keterangan': 'Sakit' },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Absensi');
    XLSX.writeFile(wb, 'Template_Import_Absensi.xlsx');
  };

  // Filter siswa berdasarkan pencarian Nama atau NIS
  const filteredStudents = students.filter(
    s =>
      (s.full_name && s.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.id && s.id.toString().includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-[#082052] text-white flex font-sans selection:bg-blue-500 selection:text-white">
      {/* SIDEBAR KIRI (Persis screenshot: Krem lembut, rounded-r-3xl, tombol aktif kapsul) */}
      <aside className="w-20 md:w-22 bg-[#F5EFEB] flex flex-col items-center justify-between py-6 rounded-r-3xl shadow-2xl z-20 shrink-0 min-h-screen">
        {/* LOGO PENDIDIKAN DI ATAS */}
        <div className="flex flex-col items-center w-full">
          <div 
            onClick={() => onNavigate && onNavigate('landing')}
            className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 shadow-md cursor-pointer hover:scale-105 transition"
            title="Kembali ke Beranda"
          >
            <svg className="w-7 h-7 text-[#0055b8]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13c-3.31 0-6-1.34-6-3v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4c0 1.66-2.69 3-6 3z" />
            </svg>
          </div>
        </div>

        {/* 3 MENU SIDEBAR DI TENGAH */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* 1. Menu Guru / Absensi Siswa (Wali Kelas) */}
          <button
            onClick={() => setActiveMenu('attendance')}
            className={`w-full py-3.5 flex items-center justify-center transition-all cursor-pointer relative ${
              activeMenu === 'attendance'
                ? 'bg-[#082052] text-white shadow-xl rounded-r-2xl mr-auto pl-1'
                : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10 rounded-2xl w-12 h-12 mx-auto'
            }`}
            title="Presensi Siswa Wali Kelas"
          >
            {/* Icon User / Students */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </button>

          {/* 2. Menu Jadwal Piket */}
          <button
            onClick={() => setActiveMenu('picket')}
            className={`w-full py-3.5 flex items-center justify-center transition-all cursor-pointer relative ${
              activeMenu === 'picket'
                ? 'bg-[#082052] text-white shadow-xl rounded-r-2xl mr-auto pl-1'
                : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10 rounded-2xl w-12 h-12 mx-auto'
            }`}
            title="Jadwal Piket"
          >
            {/* Icon Piket Bersih-bersih */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.36 2.72l1.42 1.42-3.8 3.8-1.41-1.42 3.79-3.8M5.93 17.57C5.93 17.57 6.94 15.54 9 14.5c2.06-1.04 3.47-.63 4.26-.26l2.12-2.12c-.5-.73-.85-1.78-.34-2.86.6-1.28 1.9-1.76 1.9-1.76s-.65 2.14.39 3.18c1.04 1.04 3.18.39 3.18.39s-.48 1.3-1.76 1.9c-1.08.51-2.13.16-2.86-.34L13.76 14.85c.37.79.78 2.2-2.26 4.26-1.04 2.06-3.07 3.07-3.07 3.07l-2.5-2.5 1.41-1.41-1.41-1.41-1.41 1.41-2.5-2.5s1.01-2.03 3.07-3.07c2.06-1.04 3.47-.63 4.26-.26z" />
            </svg>
          </button>

          {/* 3. Menu Pengaturan / Setting */}
          <button
            onClick={() => setActiveMenu('settings')}
            className={`w-full py-3.5 flex items-center justify-center transition-all cursor-pointer relative ${
              activeMenu === 'settings'
                ? 'bg-[#082052] text-white shadow-xl rounded-r-2xl mr-auto pl-1'
                : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10 rounded-2xl w-12 h-12 mx-auto'
            }`}
            title="Pengaturan"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* TOMBOL LOGOUT */}
        <button
          onClick={() => {
            if (onLogout) onLogout();
            else if (onNavigate) onNavigate('login');
          }}
          className="w-12 h-12 rounded-2xl text-[#082052]/60 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition cursor-pointer"
          title="Keluar"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto">
        {/* TAMPILAN DASHBOARD ABSEN WALI KELAS (Persis Screenshot) */}
        {activeMenu === 'attendance' && (
          <div className="space-y-6 text-left">
            
            {/* 1. HEADER ATAS: Sapaan, Jadwalmu Saat Ini, & Kode Kelas */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Selamat Pagi, {currentUser?.full_name ? currentUser.full_name : 'Asoey'}!
                </h1>
                <p className="text-gray-300 italic text-sm mt-1">
                  "Bersyukur Adalah Kebahagiaan"
                </p>
              </div>

              {/* Widget Jadwal & Kode Kelas (Kanan Atas) */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Jadwalmu Saat Ini */}
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-300 font-medium mb-1">
                    Jadwalmu Saat Ini :
                  </span>
                  <div className="relative">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="appearance-none bg-white text-[#082052] font-bold text-xs md:text-sm px-4 py-2.5 pr-8 rounded-xl shadow-md cursor-pointer focus:outline-none"
                    >
                      <option value="Bahasa Indonesia (07:00 - 9:00)">Bahasa Indonesia (07:00 - 9:00)</option>
                      <option value="Matematika Wajib (09:15 - 11:30)">Matematika Wajib (09:15 - 11:30)</option>
                      <option value="Pemrograman Web (12:30 - 15:00)">Pemrograman Web (12:30 - 15:00)</option>
                      <option value="Basis Data (07:00 - 09:30)">Basis Data (07:00 - 09:30)</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#082052] text-xs font-bold">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Kode Kelasmu */}
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-300 font-medium mb-1">
                    Kode Kelasmu :
                  </span>
                  <div className="bg-[#D6A143] text-white font-extrabold text-sm md:text-base px-6 py-2.5 rounded-xl shadow-md tracking-wider flex items-center justify-center">
                    {classCode}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SUBHEADER: Daftar Siswa + Search + Set Hadir Semua + Reset + Import Excel Button */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Daftar Siswa
                </h2>
                <p className="text-xs text-gray-300">Absen Disini.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar pill shape */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Cari nama/NIS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[#122b68] border border-white/20 rounded-full text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 w-44 md:w-56"
                  />
                </div>

                {/* Tombol Set Hadir Semua */}
                <button
                  onClick={handleSetHadirSemua}
                  className="px-5 py-2 bg-white text-[#082052] hover:bg-gray-100 font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                >
                  Set Hadir Semua
                </button>

                {/* Tombol Reset */}
                <button
                  onClick={handleReset}
                  className="px-5 py-2 border border-white/40 text-white hover:bg-white/10 font-medium text-xs rounded-full transition cursor-pointer"
                >
                  Reset
                </button>

                {/* Input File Tersembunyi untuk Import Excel */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportExcel}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />

                {/* Tombol Import ke Excel */}
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer flex items-center gap-1.5"
                  title="Import daftar siswa / absensi dari file Excel"
                >
                  <span>📥</span>
                  <span>Import Excel</span>
                </button>

                {/* Tombol Unduh Template Excel */}
                <button
                  onClick={handleDownloadTemplate}
                  className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-full shadow-md transition cursor-pointer"
                  title="Unduh format template Excel"
                >
                  📄 Format
                </button>
              </div>
            </div>

            {/* Status Notifikasi Toast / Alert */}
            {importStatus.text && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-800/80 text-emerald-100 border border-emerald-500'
                    : importStatus.type === 'error'
                    ? 'bg-rose-800/80 text-rose-100 border border-rose-500'
                    : 'bg-blue-800/80 text-blue-100 border border-blue-500'
                }`}
              >
                <span>{importStatus.text}</span>
                <button onClick={() => setImportStatus({ text: '', type: '' })}>✕</button>
              </div>
            )}

            {saveStatus.text && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  saveStatus.type === 'success'
                    ? 'bg-emerald-800/80 text-emerald-100 border border-emerald-500'
                    : 'bg-blue-800/80 text-blue-100 border border-blue-500'
                }`}
              >
                <span>{saveStatus.text}</span>
                <button onClick={() => setSaveStatus({ text: '', type: '' })}>✕</button>
              </div>
            )}

            {/* 3. TABEL DAFTAR SISWA (Persis Screenshot) */}
            <div className="bg-[#F8F3ED] text-[#082052] rounded-3xl overflow-hidden shadow-2xl border border-[#E4D8CE]">
              {/* Header Kolom Tabel */}
              <div className="grid grid-cols-12 px-8 py-3.5 font-bold text-xs text-gray-700 border-b border-[#D7C7B7]/60">
                <div className="col-span-2 md:col-span-1">No Absen</div>
                <div className="col-span-6 md:col-span-7">Nama Siswa</div>
                <div className="col-span-4 md:col-span-4 text-right pr-6">Keterangan</div>
              </div>

              {/* Baris Tabel Siswa */}
              <div className="divide-y divide-[#D7C7B7]/50">
                {loading ? (
                  <div className="p-8 text-center text-xs text-gray-500">Memuat data siswa...</div>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <div
                      key={student.id || index}
                      className="grid grid-cols-12 items-center px-8 py-4.5 text-sm hover:bg-[#efe7dd] transition"
                    >
                      {/* No Absen (Ukuran font besar tipis persis screenshot: 01, 02) */}
                      <div className="col-span-2 md:col-span-1 text-2xl md:text-3xl font-light text-[#082052]/90 tracking-tight">
                        {student.noAbsen || String(index + 1).padStart(2, '0')}
                      </div>

                      {/* Nama & NIS Siswa */}
                      <div className="col-span-6 md:col-span-7">
                        <h3 className="font-extrabold text-[#082052] text-sm md:text-base leading-snug">
                          {student.full_name || student.name}
                        </h3>
                        <p className="text-xs text-gray-600 font-medium mt-0.5">
                          NIS: {student.id}
                        </p>
                      </div>

                      {/* Dropdown Keterangan / Pilih Aksi (Tombol Kapsul Biru Tua Berpanah) */}
                      <div className="col-span-4 md:col-span-4 flex justify-end">
                        <div className="relative w-44 md:w-56">
                          <select
                            value={student.status || ''}
                            onChange={(e) => handleStatusChange(student.id, e.target.value)}
                            className={`w-full appearance-none px-5 py-3 rounded-2xl font-bold text-xs transition cursor-pointer shadow-md focus:outline-none pr-9 text-center ${
                              student.status === 'Hadir'
                                ? 'bg-emerald-600 text-white'
                                : student.status === 'Izin'
                                ? 'bg-amber-500 text-white'
                                : student.status === 'Sakit'
                                ? 'bg-blue-600 text-white'
                                : student.status === 'Alpa'
                                ? 'bg-rose-600 text-white'
                                : 'bg-[#082052] text-white hover:bg-[#0c2e73]'
                            }`}
                          >
                            <option value="" className="bg-[#082052] text-white">
                              Pilih Aksi
                            </option>
                            <option value="Hadir" className="bg-[#082052] text-white">Hadir</option>
                            <option value="Izin" className="bg-[#082052] text-white">Izin</option>
                            <option value="Sakit" className="bg-[#082052] text-white">Sakit</option>
                            <option value="Alpa" className="bg-[#082052] text-white">Alpa</option>
                          </select>
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs">
                            ▼
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-gray-500">Siswa tidak ditemukan.</div>
                )}
              </div>
            </div>

            {/* 4. TOMBOL BAWAH (Persis Screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Tombol Ekspor Rekap Absensi (Outlined / Dark Blue Button dengan icon file) */}
              <button
                onClick={handleExportExcel}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-white/20 bg-[#0d2761]/60 hover:bg-[#0d2761] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
                <span>Ekspor Rekap Absensi</span>
              </button>

              {/* Tombol Simpan Rekap Absensi Hari Ini (Gold / Mustard Solid Button) */}
              <button
                onClick={handleSaveRekap}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#D6A143] hover:bg-[#c4923b] text-white font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <span>Simpan Rekap Absensi Hari Ini</span>
              </button>
            </div>

          </div>
        )}

        {/* TAMPILAN JADWAL PIKET */}
        {activeMenu === 'picket' && (
          <PicketSchedulePage currentUser={currentUser} onNavigate={onNavigate} />
        )}

        {/* TAMPILAN PENGATURAN AKUN */}
        {activeMenu === 'settings' && (
          <AccountSettingsPage 
            currentUser={currentUser} 
            onNavigate={onNavigate} 
            onUpdateUser={onUpdateUser}
          />
        )}
      </main>
    </div>
  );
}