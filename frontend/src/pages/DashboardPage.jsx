import React, { useState, useEffect } from 'react';
import PicketSchedulePage from './PicketSchedulePage';

export default function DashboardPage({ onNavigate, currentUser, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Bahasa Indonesia (07:00 - 9:00)');
  const [activeMenu, setActiveMenu] = useState('picket'); // 'attendance' | 'picket' | 'settings'
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setStudents(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data siswa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mengubah status per siswa & Simpan ke Database
  const handleStatusChange = async (id, newStatus) => {
    setStudents(prev =>
      prev.map(student => (student.id === id ? { ...student, status: newStatus } : student))
    );

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/picket/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: id,
          status: newStatus,
          subject: selectedSubject,
        }),
      });
    } catch (error) {
      console.error('Gagal memperbarui status di server:', error);
    }
  };

  // Setel semua siswa menjadi Hadir
  const handleSetHadirSemua = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'Hadir' })));
  };

  // Reset semua status
  const handleReset = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: '' })));
  };

  // Fitur Unduh / Ekspor ke File Excel
  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reports/export/excel', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengekspor laporan');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Absensi_Piket.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert('Gagal mengunduh file Excel');
    }
  };

  // Filter siswa berdasarkan pencarian Nama atau NIS
  const filteredStudents = students.filter(
    s =>
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.id && s.id.toString().includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-[#082052] text-white flex font-sans selection:bg-blue-500 selection:text-white">
      {/* SIDEBAR KIRI (Persis seperti screenshot: Krem, rounder, icon di tengah) */}
      <aside className="w-20 md:w-22 bg-[#F5EFEB] flex flex-col items-center justify-between py-6 rounded-r-3xl shadow-2xl z-20 shrink-0 min-h-screen">
        {/* LOGO SEKOLAH / PENDIDIKAN DI ATAS */}
        <div className="flex flex-col items-center w-full">
          <div 
            onClick={() => onNavigate && onNavigate('landing')}
            className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 shadow-md cursor-pointer hover:scale-105 transition"
            title="Kembali ke Beranda"
          >
            {/* Logo Emblem Pendidikan SMK/Sekolah */}
            <svg className="w-7 h-7 text-[#0055b8]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13c-3.31 0-6-1.34-6-3v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4c0 1.66-2.69 3-6 3z" />
            </svg>
          </div>
        </div>

        {/* 3 MENU SIDEBAR DI TENGAH SESUAI SCREENSHOT */}
        <div className="flex flex-col items-center gap-5 w-full">
          {/* 1. Menu Guru / Absensi Siswa */}
          <button
            onClick={() => setActiveMenu('attendance')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              activeMenu === 'attendance'
                ? 'bg-[#082052] text-white shadow-xl scale-110'
                : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10'
            }`}
            title="Presensi Siswa"
          >
            {/* Icon User / Students */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </button>

          {/* 2. Menu Jadwal Piket (ICON TENGAH - Kapsul Biru dengan Icon Sapu / Bersih-bersih) */}
          <button
            onClick={() => setActiveMenu('picket')}
            className={`w-full py-4 flex items-center justify-center transition-all cursor-pointer relative ${
              activeMenu === 'picket'
                ? 'bg-[#082052] text-white shadow-xl rounded-r-2xl mr-auto pl-1'
                : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10 rounded-2xl'
            }`}
            title="Jadwal Piket"
          >
            {/* Icon Sapu / Piket Bersih-bersih sesuai gambar */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.36 2.72l1.42 1.42-3.8 3.8-1.41-1.42 3.79-3.8M5.93 17.57C5.93 17.57 6.94 15.54 9 14.5c2.06-1.04 3.47-.63 4.26-.26l2.12-2.12c-.5-.73-.85-1.78-.34-2.86.6-1.28 1.9-1.76 1.9-1.76s-.65 2.14.39 3.18c1.04 1.04 3.18.39 3.18.39s-.48 1.3-1.76 1.9c-1.08.51-2.13.16-2.86-.34L13.76 14.85c.37.79.78 2.2-2.26 4.26-1.04 2.06-3.07 3.07-3.07 3.07l-2.5-2.5 1.41-1.41-1.41-1.41-1.41 1.41-2.5-2.5s1.01-2.03 3.07-3.07c2.06-1.04 3.47-.63 4.26-.26z" />
            </svg>
          </button>

          {/* 3. Menu Pengaturan / Setting */}
          <button
            onClick={() => setActiveMenu('settings')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              activeMenu === 'settings'
                ? 'bg-[#082052] text-white shadow-xl scale-110'
                : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10'
            }`}
            title="Pengaturan"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* TOMBOL LOGOUT DI BAGIAN PALING BAWAH */}
        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else if (onNavigate) {
              onNavigate('login');
            }
          }}
          className="w-12 h-12 rounded-2xl text-[#082052]/60 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition cursor-pointer"
          title="Keluar"
        >
          {/* Icon Power Off persis screenshot */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto">
        {/* HEADER SAPAAN PENGGUNA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Selamat Pagi, {currentUser?.full_name ? currentUser.full_name : 'Asoey'}!
            </h1>
            <p className="text-gray-300 italic text-sm mt-1">
              "Bersyukur Adalah Kebahagiaan"
            </p>
          </div>
        </div>

        {/* TAMPILAN KONTEN BERDASARKAN MENU YANG DIPILIH */}
        {activeMenu === 'picket' && (
          <PicketSchedulePage currentUser={currentUser} onNavigate={onNavigate} />
        )}

        {activeMenu === 'attendance' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Daftar Presensi Kelas</h2>
                <p className="text-xs text-gray-300">Kelola status kehadiran siswa harian.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                  <input
                    type="text"
                    placeholder="Cari nama/NIS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[#0d2a6b] border border-white/20 rounded-full text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 w-48 md:w-60"
                  />
                </div>

                <button
                  onClick={handleSetHadirSemua}
                  className="px-5 py-2 bg-white text-[#082052] hover:bg-gray-100 font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                >
                  Set Hadir Semua
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-2 border border-white/30 text-white hover:bg-white/10 font-medium text-xs rounded-full transition cursor-pointer"
                >
                  Reset
                </button>

                <button
                  onClick={handleExportExcel}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                >
                  📊 Ekspor Excel
                </button>
              </div>
            </div>

            {/* TABEL DAFTAR SISWA */}
            <div className="bg-[#F5EFEB] text-[#082052] rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 px-6 py-4 font-bold text-xs border-b border-[#082052]/10 uppercase tracking-wider bg-[#eae3dc]">
                <div className="col-span-2 md:col-span-1">No Absen</div>
                <div className="col-span-6 md:col-span-7">Nama Siswa</div>
                <div className="col-span-4 md:col-span-4 text-right pr-4">Keterangan</div>
              </div>

              <div className="divide-y divide-[#082052]/10">
                {loading ? (
                  <div className="p-8 text-center text-xs text-gray-500">Memuat data siswa...</div>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <div
                      key={student.id || index}
                      className="grid grid-cols-12 items-center px-6 py-4 text-sm hover:bg-black/5 transition"
                    >
                      <div className="col-span-2 md:col-span-1 text-xl md:text-2xl font-bold text-[#082052]/80">
                        {student.noAbsen || String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="col-span-6 md:col-span-7">
                        <h3 className="font-bold text-[#082052] text-sm md:text-base leading-tight">
                          {student.full_name || student.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                          NIS: {student.id}
                        </p>
                      </div>

                      <div className="col-span-4 md:col-span-4 flex justify-end">
                        <select
                          value={student.status || ''}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                          className={`w-36 md:w-48 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-md focus:outline-none ${
                            student.status === 'Hadir'
                              ? 'bg-emerald-600 text-white'
                              : student.status === 'Izin'
                              ? 'bg-amber-500 text-white'
                              : student.status === 'Sakit'
                              ? 'bg-blue-600 text-white'
                              : student.status === 'Alpa'
                              ? 'bg-rose-600 text-white'
                              : 'bg-[#082052] text-white hover:bg-[#0d2a6b]'
                          }`}
                        >
                          <option value="" disabled className="bg-[#082052] text-white">
                            Pilih Aksi
                          </option>
                          <option value="Hadir" className="bg-[#082052] text-white">Hadir</option>
                          <option value="Izin" className="bg-[#082052] text-white">Izin</option>
                          <option value="Sakit" className="bg-[#082052] text-white">Sakit</option>
                          <option value="Alpa" className="bg-[#082052] text-white">Alpa</option>
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-gray-500">Siswa tidak ditemukan.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'settings' && (
          <div className="bg-[#F5EFEB] text-[#082052] p-8 rounded-3xl shadow-xl max-w-xl text-left">
            <h2 className="text-2xl font-bold mb-4">Pengaturan Akun</h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-bold text-gray-600">Nama Lengkap</label>
                <p className="font-semibold text-base">{currentUser?.full_name || 'Asoey Suyatno'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Email</label>
                <p className="font-semibold text-base">{currentUser?.email || 'user@hadirin.co'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Role / Hak Akses</label>
                <p className="font-semibold text-base">{currentUser?.role_name || 'Siswa (Kelas XII RPL 2)'}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}