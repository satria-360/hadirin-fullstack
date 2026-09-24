import React, { useState, useEffect } from 'react';

export default function DashboardPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Bahasa Indonesia (07:00 - 9:00)');
  const [activeMenu, setActiveMenu] = useState('attendance'); // 'attendance' | 'stats' | 'settings'
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
    // Update tampilan lokal secara instan
    setStudents(prev =>
      prev.map(student => (student.id === id ? { ...student, status: newStatus } : student))
    );

    // Kirim perubahan status ke backend
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
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/reports/export/excel', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Gagal mengunduh');

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
      {/* SIDEBAR KIRI */}
      <aside className="w-20 bg-[#F5EFEB] flex flex-col items-center justify-between py-6 rounded-r-3xl shadow-xl z-10 shrink-0">
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="w-12 h-12 rounded-full bg-[#082052]/10 flex items-center justify-center border border-[#082052]/20">
            <span className="text-xl font-bold text-[#082052]">🎓</span>
          </div>

          <div className="flex flex-col gap-4 w-full px-2">
            <button
              onClick={() => setActiveMenu('attendance')}
              className={`w-full py-3.5 rounded-2xl flex items-center justify-center transition-all ${
                activeMenu === 'attendance'
                  ? 'bg-[#082052] text-white shadow-lg scale-105'
                  : 'text-[#082052]/60 hover:bg-[#082052]/10'
              }`}
              title="Absensi"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            <button
              onClick={() => setActiveMenu('stats')}
              className={`w-full py-3.5 rounded-2xl flex items-center justify-center transition-all ${
                activeMenu === 'stats'
                  ? 'bg-[#082052] text-white shadow-lg scale-105'
                  : 'text-[#082052]/60 hover:bg-[#082052]/10'
              }`}
              title="Statistik"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full py-3.5 rounded-2xl flex items-center justify-center transition-all ${
                activeMenu === 'settings'
                  ? 'bg-[#082052] text-white shadow-lg scale-105'
                  : 'text-[#082052]/60 hover:bg-[#082052]/10'
              }`}
              title="Pengaturan"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('login')}
          className="w-12 h-12 rounded-2xl text-[#082052]/60 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition"
          title="Keluar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Selamat Pagi, Asoey!
            </h1>
            <p className="text-gray-300 italic text-sm mt-1">
              "Bersyukur Adalah Kebahagiaan"
            </p>
          </div>

          <div className="text-right">
            <label className="text-xs text-gray-300 block mb-1">Jadwalmu Saat Ini :</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white text-[#082052] font-semibold px-5 py-2.5 rounded-full text-xs md:text-sm shadow-lg focus:outline-none cursor-pointer pr-8 border border-white/20"
            >
              <option value="Bahasa Indonesia (07:00 - 9:00)">Bahasa Indonesia (07:00 - 9:00)</option>
              <option value="Matematika (09:15 - 11:15)">Matematika (09:15 - 11:15)</option>
              <option value="Bahasa Inggris (11:30 - 13:00)">Bahasa Inggris (11:30 - 13:00)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Daftar Siswa</h2>
            <p className="text-xs text-gray-300">Absen Disini.</p>
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
              className="px-5 py-2 bg-white text-[#082052] hover:bg-gray-100 font-bold text-xs rounded-full shadow-md transition"
            >
              Set Hadir Semua
            </button>

            <button
              onClick={handleReset}
              className="px-5 py-2 border border-white/30 text-white hover:bg-white/10 font-medium text-xs rounded-full transition"
            >
              Reset
            </button>

            {/* Tombol Ekspor Excel */}
            <button
              onClick={handleExportExcel}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-md transition"
            >
              📊 Ekspor Excel
            </button>
          </div>
        </div>

        {/* TABEL DAFTAR SISWA */}
        <div className="bg-[#F5EFEB] text-[#082052] rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 px-6 py-4 font-bold text-xs border-b border-[#082052]/10 uppercase tracking-wider">
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
      </main>
    </div>
  );
}