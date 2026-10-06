import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as XLSX from 'xlsx';
import PicketSchedulePage from './PicketSchedulePage';
import AccountSettingsPage from './AccountSettingsPage';
import TambahSiswaPage from './TambahSiswaPage';
import AttendanceHistoryPage from './AttendanceHistoryPage';
import AddPiketStudentPage from './AddPiketStudentPage';
import UpgradeModal from '../components/UpgradeModal';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import AttendanceDetailModal from '../components/AttendanceDetailModal';
import hadirinLogo from '../assets/hadirin-logo.png';

export default function DashboardPage({ onNavigate, currentUser, onLogout, onUpdateUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Bahasa Indonesia (07:00 - 9:00)');
  const [activeMenu, setActiveMenuState] = useState(() => {
    try {
      if (window.history.state?.menu) return window.history.state.menu;
      return localStorage.getItem('dashboardActiveMenu') || 'attendance';
    } catch {
      return 'attendance';
    }
  });

  const setActiveMenu = (menu, addToHistory = true) => {
    setActiveMenuState(menu);
    try {
      localStorage.setItem('dashboardActiveMenu', menu);
      if (addToHistory && window.history.state?.menu !== menu) {
        window.history.pushState({ tab: 'dashboard', menu }, '', window.location.pathname);
      }
    } catch {}
  };

  useEffect(() => {
    // Pastikan state dashboard tersimpan di history
    if (!window.history.state?.menu) {
      window.history.replaceState({ tab: 'dashboard', menu: activeMenu }, '', window.location.pathname);
    }

    const handleDashboardPopState = (event) => {
      if (event.state && event.state.tab === 'dashboard' && event.state.menu) {
        setActiveMenuState(event.state.menu);
        try {
          localStorage.setItem('dashboardActiveMenu', event.state.menu);
        } catch {}
      }
    };

    window.addEventListener('popstate', handleDashboardPopState);
    return () => window.removeEventListener('popstate', handleDashboardPopState);
  }, []);
  const [addStudentType, setAddStudentType] = useState('absensi');
  const [classCode, setClassCode] = useState(currentUser?.class_code || 'GAJBHG');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ text: '', type: '' });
  const [importStatus, setImportStatus] = useState({ text: '', type: '' });
  const [showUpgrade, setShowUpgrade] = useState(true);

  // 🎓 REF UNTUK ANIMASI GSAP KONTEN DASHBOARD
  const mainContentRef = useRef(null);

  // Animasi GSAP saat tab menu berpindah
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [activeMenu]);

  // Animasi GSAP stagger saat data siswa selesai di-load
  useEffect(() => {
    if (!loading && students.length > 0) {
      gsap.fromTo(
        '.student-row-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power1.out', delay: 0.05 }
      );
    }
  }, [loading, students.length]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  // ✅ STATE BARU UNTUK MODAL RIWAYAT REKAP ABSEN
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyDate, setHistoryDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (currentUser?.class_code) setClassCode(currentUser.class_code);
  }, [currentUser?.class_code]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/picket/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const mappedData = (Array.isArray(data) ? data : []).map(student => ({
          ...student,
          status: student.status || ''
        }));
        setStudents(mappedData);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Gagal mengambil data siswa:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev =>
      prev.map(student => (student.id === id ? { ...student, status: newStatus } : student))
    );
  };

  const handleSetHadirSemua = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'Hadir' })));
  };

  const handleReset = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: '' })));
  };

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
        body: JSON.stringify({ students, subject: selectedSubject })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSaveStatus({ text: 'Rekap absensi hari ini berhasil disimpan!', type: 'success' });
        setTimeout(() => { setActiveMenu('history'); }, 800);
      } else {
        setSaveStatus({ text: 'Tersimpan lokal di sesi saat ini!', type: 'success' });
      }
    } catch {
      setSaveStatus({ text: 'Tersimpan lokal di sesi saat ini!', type: 'success' });
    } finally {
      setTimeout(() => setSaveStatus({ text: '', type: '' }), 3500);
    }
  };

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
      const worksheetData = students.map((s, idx) => ({
        'No Absen': s.noUrut || String(idx + 1).padStart(2, '0'),
        'Nama Siswa': s.full_name || s.name,
        'NIS': s.noAbsen || '-',
        'Mata Pelajaran': selectedSubject,
        'Keterangan': s.status || 'Belum Absen'
      }));

      const ws = XLSX.utils.json_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi');
      XLSX.writeFile(wb, `Rekap_Absensi_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  };

  const handleSaveProof = async (updated) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/attendance/save-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          student_id: updated.id,
          status: updated.status,
          proof_url: updated.proof_url,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStudents(prev => prev.map(s => (s.id === updated.id ? { ...s, ...updated } : s)));
        setSaveStatus({ text: 'Bukti kehadiran berhasil disimpan!', type: 'success' });
      } else {
        setStudents(prev => prev.map(s => (s.id === updated.id ? { ...s, ...updated } : s)));
        setSaveStatus({ text: 'Tersimpan lokal di sesi saat ini!', type: 'success' });
      }
    } catch {
      setStudents(prev => prev.map(s => (s.id === updated.id ? { ...s, ...updated } : s)));
      setSaveStatus({ text: 'Tersimpan lokal di sesi saat ini!', type: 'success' });
    } finally {
      setDetailStudent(null);
      setTimeout(() => setSaveStatus({ text: '', type: '' }), 3500);
    }
  };

  const filteredStudents = [...students]
    .filter(s => !currentUser?.id || String(s.id) !== String(currentUser.id))
    .sort((a, b) => (a.full_name || a.name || '').localeCompare(b.full_name || b.name || '', 'id', { sensitivity: 'base' }))
    .map((s, idx) => ({
      ...s,
      noUrut: String(idx + 1).padStart(2, '0')
    }))
    .filter(
      s =>
        (s.full_name && s.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.id && s.id.toString().includes(searchQuery)) ||
        (s.noAbsen && s.noAbsen.toString().includes(searchQuery))
    );

  const isTeacher =
    currentUser?.role_id === 3 ||
    ['guru', 'wali kelas', 'supervisor'].includes((currentUser?.role_name || '').toLowerCase());

  const isEmptyState = !loading && students.length === 0;

  const handleCloseUpgrade = () => {
    setShowUpgrade(false);
  };

  const totalHadir = students.filter(s => s.status === 'Hadir').length;

  if (activeMenu === 'addPiketStudent') {
    return (
      <AddPiketStudentPage
        currentUser={currentUser}
        onBack={() => setActiveMenu('settings')}
        onPiketAssigned={(updatedStudent) => {
          setStudents(prev => prev.map(s =>
            s.id === updatedStudent.id ? { ...s, picket_day: updatedStudent.picketDay } : s
          ));
        }}
      />
    );
  }

  if (activeMenu === 'addStudent') {
    return (
      <TambahSiswaPage
        defaultType={addStudentType}
        onBack={() => setActiveMenu('settings')}
        onSuccess={(newStudent) => {
          setStudents(prev => [newStudent, ...prev]);
          if (addStudentType === 'piket') {
            setActiveMenu('picket');
          } else {
            setActiveMenu('attendance');
          }
          setImportStatus({
            text: `Siswa "${newStudent.full_name}" berhasil ditambahkan dan masuk ke sistem!`,
            type: 'success'
          });
          setTimeout(() => setImportStatus({ text: '', type: '' }), 4000);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#082052] text-white flex font-sans selection:bg-blue-500 selection:text-white relative">
      <aside className="w-20 md:w-22 bg-[#F5EFEB] flex flex-col items-center justify-between py-6 rounded-r-3xl shadow-2xl z-30 shrink-0 h-screen sticky top-0 left-0">
        <div className="flex flex-col items-center w-full">
          <div
            onClick={() => onNavigate && onNavigate('landing')}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-[#D7C7B7] shadow-md cursor-pointer hover:scale-105 transition overflow-hidden p-1"
            title="Kembali ke Beranda"
          >
            <img src={hadirinLogo} alt="Hadirin.co" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <button
            onClick={() => setActiveMenu('attendance')}
            className={`w-full flex items-center transition-all cursor-pointer relative ${activeMenu === 'attendance'
              ? 'bg-gradient-to-r from-[#082052] to-[#1248B8] text-white shadow-lg py-4 rounded-r-[28px] rounded-l-none pl-4 pr-3 mr-4'
              : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10 rounded-2xl w-12 h-12 justify-center mx-auto'
              }`}
            title="Presensi Siswa Wali Kelas"
          >
            <div className={`flex items-center ${activeMenu === 'attendance' ? 'w-full justify-center pr-2' : ''}`}>
              <svg viewBox="0 0 16 16" className="w-6 h-6 fill-current" aria-hidden="true">
                <g fill="currentColor">
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7m1.679-4.493l-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548l1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0a3 3 0 0 1 6 0"/>
                  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                </g>
              </svg>
            </div>
          </button>

          <button
            onClick={() => setActiveMenu('picket')}
            className={`w-full flex items-center transition-all cursor-pointer relative ${activeMenu === 'picket'
              ? 'bg-gradient-to-r from-[#082052] to-[#1248B8] text-white shadow-lg py-4 rounded-r-[28px] rounded-l-none pl-4 pr-3 mr-4'
              : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10 rounded-2xl w-12 h-12 justify-center mx-auto'
              }`}
            title="Jadwal Piket"
          >
            <div className={`flex items-center ${activeMenu === 'picket' ? 'w-full justify-center pr-2' : ''}`}>
              <svg viewBox="0 0 14 14" className="w-6 h-6 fill-current" aria-hidden="true">
                <path fill="currentColor" fillRule="evenodd" d="M7.106.087a.75.75 0 0 1 .413.977L4.8 7.779c.354.124.714.312 1.03.564c.55.439.998 1.1.998 1.979c0 .535.131.98.33 1.344c.318.584 1.016.793 1.682.793a.75.75 0 0 1 0 1.5h-.09v.01H2.251c-1.048 0-2.154-.701-2.182-1.925c-.023-1.026.195-2.193.815-3.084c.52-.747 1.303-1.27 2.368-1.361L6.13.5a.75.75 0 0 1 .977-.413m6.075 13.872a.75.75 0 0 0 0-1.5h-1.927a.75.75 0 1 0 0 1.5zm-.142-3.472a.75.75 0 0 1-.75.75h-1.916a.75.75 0 1 1 0-1.5h1.916a.75.75 0 0 1 .75.75m-1.785-2.073a.75.75 0 0 0 0-1.5H9.338a.75.75 0 1 0 0 1.5z" clipRule="evenodd"/>
              </svg>
            </div>
          </button>

          <button
            onClick={() => setActiveMenu('settings')}
            className={`w-full flex items-center transition-all cursor-pointer relative ${activeMenu === 'settings'
              ? 'bg-gradient-to-r from-[#082052] to-[#1248B8] text-white shadow-lg py-4 rounded-r-[28px] rounded-l-none pl-4 pr-3 mr-4'
              : 'text-[#082052]/60 hover:text-[#082052] hover:bg-[#082052]/10 rounded-2xl w-12 h-12 justify-center mx-auto'
              }`}
            title="Pengaturan"
          >
            <div className={`flex items-center ${activeMenu === 'settings' ? 'w-full justify-center pr-2' : ''}`}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                <path fill="currentColor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/>
              </svg>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-12 h-12 rounded-2xl text-[#082052]/60 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition cursor-pointer"
          title="Keluar"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </aside>

      <main ref={mainContentRef} className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto">
        {activeMenu === 'attendance' && (
          <div className="space-y-6 text-left">

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Selamat Datang, {currentUser?.full_name ? currentUser.full_name : 'Asoey'}!
                </h1>
                <p className="text-gray-300 italic text-sm mt-1">
                  "Bersyukur Adalah Kebahagiaan"
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
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

                {isTeacher && (
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-300 font-medium mb-1">
                      Kode Kelasmu :
                    </span>
                    <div className="bg-[#D6A143] text-white font-extrabold text-sm md:text-base px-6 py-2.5 rounded-xl shadow-md tracking-wider flex items-center justify-center">
                      {classCode || '—'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isEmptyState ? (
              <>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      Daftar Siswa
                    </h2>
                    <p className="text-xs text-gray-300">Absen Disini.</p>
                  </div>
                </div>

                <p className="text-xs text-gray-300">
                  Kamu Belum Punya Data Absensi Siswa, Untuk Menambahkan Klik Tombol Dibawah Ini:
                </p>

                <button
                  onClick={() => {
                    setAddStudentType('absensi');
                    setActiveMenu('addStudent');
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-white/25 bg-white/[0.03] hover:bg-white/[0.08] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span className="text-lg leading-none">+</span>
                  <span>Tambah Siswa</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      Daftar Siswa
                    </h2>
                    <p className="text-xs text-gray-300">Absen Disini.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* ✅ TOMBOL RIWAYAT REKAP ABSEN */}
                    <button
                      onClick={() => setShowHistoryModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Riwayat Rekap Absen</span>
                    </button>

                    <button
                      onClick={handleSetHadirSemua}
                      className="px-5 py-2 bg-white text-[#082052] hover:bg-gray-100 font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                    >
                      Set Hadir Semua
                    </button>

                    <button
                      onClick={handleReset}
                      className="px-5 py-2 border border-white/40 text-white hover:bg-white/10 font-medium text-xs rounded-full transition cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {importStatus.text && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${importStatus.type === 'success'
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
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${saveStatus.type === 'success'
                      ? 'bg-emerald-800/80 text-emerald-100 border border-emerald-500'
                      : 'bg-blue-800/80 text-blue-100 border border-blue-500'
                      }`}
                  >
                    <span>{saveStatus.text}</span>
                    <button onClick={() => setSaveStatus({ text: '', type: '' })}>✕</button>
                  </div>
                )}

                <div className="bg-[#F8F3ED] text-[#082052] rounded-3xl overflow-hidden shadow-2xl border border-[#E4D8CE]">
                  <div className="grid grid-cols-12 px-6 md:px-8 py-3.5 font-bold text-xs text-gray-700 border-b border-[#D7C7B7]/60">
                    <div className="col-span-2 md:col-span-2 min-w-0">No Absen</div>
                    <div className="col-span-5 md:col-span-5 min-w-0">Nama Siswa</div>
                    <div className="col-span-5 md:col-span-5 text-right pr-2 md:pr-6">Keterangan</div>
                  </div>

                  <div className="divide-y divide-[#D7C7B7]/50">
                    {loading ? (
                      <div className="p-8 text-center text-xs text-gray-500">Memuat data siswa...</div>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <div key={student.id || index} className="student-row-item grid grid-cols-12 items-center px-6 md:px-8 py-4 text-sm hover:bg-[#efe7dd] transition">
                          <div className="col-span-2 md:col-span-2 min-w-0 text-base md:text-lg font-bold text-[#082052] tracking-tight truncate whitespace-nowrap">
                            {student.noUrut || String(index + 1).padStart(2, '0')}
                          </div>

                          <div className="col-span-5 md:col-span-5 min-w-0">
                            <h3 className="font-extrabold text-[#082052] text-sm md:text-base leading-snug truncate">{student.full_name || student.name}</h3>
                            <p className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5 break-all">NIS: {student.noAbsen || '-'}</p>
                          </div>

                          <div className="col-span-5 md:col-span-5 flex items-center justify-end gap-2">
                            <div className="relative w-36 md:w-44">
                              <select
                                value={student.status || ''}
                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                className={`w-full appearance-none px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer shadow-md focus:outline-none pr-8 text-center ${student.status === 'Hadir' ? 'bg-emerald-600 text-white'
                                  : student.status === 'Izin' ? 'bg-amber-500 text-white'
                                    : student.status === 'Sakit' ? 'bg-blue-600 text-white'
                                      : student.status === 'Alpa' || student.status === 'Alpha' ? 'bg-rose-600 text-white'
                                        : 'bg-[#082052] text-white hover:bg-[#0c2e73]'
                                  }`}
                              >
                                <option value="" className="bg-[#082052] text-white">Pilih Aksi</option>
                                <option value="Hadir" className="bg-[#082052] text-white">Hadir</option>
                                <option value="Izin" className="bg-[#082052] text-white">Izin</option>
                                <option value="Sakit" className="bg-[#082052] text-white">Sakit</option>
                                <option value="Alpha" className="bg-[#082052] text-white">Alpha</option>
                              </select>
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white text-xs">▼</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setDetailStudent(student)}
                              className="shrink-0 px-3 py-2.5 rounded-xl border border-[#082052]/15 bg-white/90 text-[#082052] text-[11px] font-bold flex items-center gap-1.5 hover:bg-white transition cursor-pointer shadow-sm"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              Upload Bukti
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-gray-500">Siswa tidak ditemukan.</div>
                    )}
                  </div>

                  {!loading && filteredStudents.length > 0 && (
                    <div className="border-t border-[#D7C7B7]/60 px-6 md:px-8 py-3 flex items-center justify-between bg-[#F1EAE0]">
                      <span className="text-xs font-bold text-[#082052]">Total Murid Hadir:</span>
                      <span className="text-sm font-extrabold text-emerald-600">{totalHadir} Murid</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={handleExportExcel}
                    className="w-full py-3.5 px-6 rounded-2xl border-2 border-white/20 bg-[#0d2761]/60 hover:bg-[#0d2761] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    <span>Ekspor Rekapan Absen</span>
                  </button>

                  <button
                    onClick={handleSaveRekap}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#D6A143] hover:bg-[#c4923b] text-white font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <span>Simpan Rekap Absensi Hari Ini</span>
                  </button>
                </div>
              </>
            )}

          </div>
        )}

        {activeMenu === 'picket' && (
          <PicketSchedulePage
            currentUser={currentUser}
            onNavigate={onNavigate}
            onStudentAdded={(newStudent) => {
              setStudents(prev => [newStudent, ...prev]);
            }}
          />
        )}

        {activeMenu === 'settings' && (
          <AccountSettingsPage
            currentUser={currentUser}
            onNavigate={onNavigate}
            onUpdateUser={onUpdateUser}
            onOpenAddStudent={(type) => {
              if (type === 'piket') {
                setActiveMenu('addPiketStudent');
              } else {
                setAddStudentType(type);
                setActiveMenu('addStudent');
              }
            }}
            onStudentAdded={(newStudent) => {
              setStudents(prev => [newStudent, ...prev]);
            }}
          />
        )}

        {activeMenu === 'history' && (
          <AttendanceHistoryPage
            students={students}
            historyDate={historyDate}
            onBack={() => setActiveMenu('attendance')}
          />
        )}
      </main>

      {showUpgrade && (
        <UpgradeModal
          onClose={handleCloseUpgrade}
          onSelectPlan={() => {
            handleCloseUpgrade();
            if (onNavigate) {
              sessionStorage.setItem('pricingSource', 'upgradeModal');
              onNavigate('pricing');
            }
          }}
        />
      )}

      {showLogoutConfirm && (
        <LogoutConfirmModal
          onConfirm={() => {
            setShowLogoutConfirm(false);
            if (onLogout) onLogout();
            else if (onNavigate) onNavigate('login');
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {detailStudent && (
        <AttendanceDetailModal
          student={detailStudent}
          onClose={() => setDetailStudent(null)}
          onSave={handleSaveProof}
        />
      )}

      {/* ✅ MODAL POP-UP: LIHAT RIWAYAT REKAP ABSEN */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[75] flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F8F3ED] text-[#082052] w-full max-w-md rounded-3xl shadow-2xl p-6 border border-[#E4D8CE] relative">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#082052] text-white flex items-center justify-center hover:bg-[#0c2e73] transition cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-extrabold tracking-tight mb-4">
              Lihat Riwayat Rekap Absen
            </h3>

            <label className="block text-xs font-bold text-[#082052] mb-1.5">
              Pilih Waktu Absensi
            </label>
            <div className="relative mb-5">
              <input
                type="date"
                value={historyDate}
                onChange={(e) => setHistoryDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-[#D6A143] text-[#082052] font-bold text-sm rounded-xl focus:outline-none shadow-md border border-[#c4923b] [color-scheme:light]"
              />
            </div>

            <button
              onClick={() => {
                setShowHistoryModal(false);
                setActiveMenu('history');
              }}
              className="w-full py-3 px-4 rounded-xl border border-[#082052]/20 bg-white hover:bg-gray-50 text-[#082052] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Lihat Rekap Absen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}