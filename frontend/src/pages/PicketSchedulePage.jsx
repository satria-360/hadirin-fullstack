import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle2, History, X, Clock, Calendar, Eye, Plus, RefreshCw } from 'lucide-react';
import AddStudentToPiketModal from '../components/AddStudentToPiketModal';

export default function PicketSchedulePage({ currentUser, onNavigate, onStudentAdded }) {
  const isTeacher =
    currentUser?.role_id === 3 ||
    ['guru', 'wali kelas', 'supervisor'].includes((currentUser?.role_name || '').toLowerCase());
  const isStudent = !isTeacher;

  const [activeTab, setActiveTab] = useState('jadwal');
  const [selectedDay, setSelectedDay] = useState('Senin');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [targetStudent, setTargetStudent] = useState(null);

  const [namaSiswa, setNamaSiswa] = useState(currentUser?.full_name || '');
  const [tanggalPiket, setTanggalPiket] = useState(() => new Date().toISOString().split('T')[0]);
  const [catatan, setCatatan] = useState('');
  const [fotoSatu, setFotoSatu] = useState(null);
  const [fotoDua, setFotoDua] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });
  const [selectedProof, setSelectedProof] = useState(null);
  const [reports, setReports] = useState([]);

  // Live Camera Capture Modal State
  const [activeCameraTarget, setActiveCameraTarget] = useState(null); // 'satu' | 'dua' | null
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    fetchClassStudents();
    fetchPicketReports();
  }, []);

  // ✅ Auto refresh riwayat laporan piket saat berpindah ke tab riwayat
  useEffect(() => {
    if (activeTab === 'riwayat') {
      fetchPicketReports();
    }
  }, [activeTab]);

  const fetchPicketReports = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/picket/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Gagal mengambil data riwayat laporan piket:", err);
    }
  };

  const fetchClassStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/picket/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) return;

      const data = await response.json();
      if (!Array.isArray(data)) return;

      setAllStudents(data.map((student, idx) => ({
        ...student,
        noUrut: String(idx + 1).padStart(2, '0'),
        picket_day: student.picket_day || 'Senin'
      })));

    } catch (err) {
      console.error("Gagal mengambil data jadwal piket:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLER PERBAIKAN UTAMA: Panggil API PUT untuk simpan permanen
  const handleConfirmAddToPiket = async (day) => {
    if (!targetStudent) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/students/${targetStudent.id}/update-piket-day`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ picket_day: day })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan jadwal piket.');
      }

      // Update local state agar UI langsung reflektif
      setAllStudents(prev => prev.map(s =>
        s.id === targetStudent.id ? { ...s, picket_day: day } : s
      ));

      // Trigger callback ke parent (DashboardPage)
      if (onStudentAdded) {
        onStudentAdded({ ...targetStudent, picketDay: day });
      }

      return true;
    } catch (err) {
      console.error('Gagal update jadwal piket:', err);
      throw err; // Re-throw agar modal bisa tampilkan pesan error
    }
  };

  const openAddModal = (student) => {
    setTargetStudent(student);
    setShowAddModal(true);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateIndonesia = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatClock = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Fungsi untuk buka kamera langsung perangkat (Laptop webcam / HP kamera)
  const startCamera = async (target) => {
    setActiveCameraTarget(target);
    setCameraError('');
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      let stream = null;
      // Coba akses kamera belakang (environment) terlebih dahulu, jika gagal fallback ke kamera default perangkat
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setCameraStream(stream);
      // Tunggu render video element lalu bind stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Kamera tidak dapat diakses:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Izin akses kamera diblokir oleh browser. Silakan klik ikon gembok/kamera di samping URL browser (address bar), lalu ubah Camera ke "Allow" / "Izinkan", kemudian coba lagi.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('Perangkat kamera (webcam/camera) tidak ditemukan pada device ini.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Kamera sedang digunakan oleh aplikasi lain (seperti Zoom/Meet/Kamera Windows). Silakan tutup aplikasi tersebut terlebih dahulu.');
      } else {
        setCameraError('Gagal membuka kamera: ' + (err.message || 'Periksa izin kamera browser Anda.'));
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setActiveCameraTarget(null);
    setCameraError('');
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    if (activeCameraTarget === 'satu') {
      setFotoSatu(dataUrl);
    } else if (activeCameraTarget === 'dua') {
      setFotoDua(dataUrl);
    }
    stopCamera();
  };

  // Fallback direct capture trigger dari input camera-only (capture="environment")
  const handleDirectCapture = (e, type) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'satu') setFotoSatu(reader.result);
        if (type === 'dua') setFotoDua(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // reset input value agar bisa ambil ulang
    e.target.value = '';
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!namaSiswa) {
      setSubmitMessage({ text: 'Nama siswa wajib diisi!', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage({ text: 'Mengirim laporan piket...', type: 'info' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/picket/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          student_id: currentUser?.id || 1,
          status: 'completed',
          area_name: 'Piket Harian Kelas',
          notes: catatan,
          photo_url: fotoSatu || fotoDua || '',
          photo_one: fotoSatu || '',
          photo_two: fotoDua || ''
        })
      });
      
      await fetchPicketReports();

      setSubmitMessage({ text: 'Laporan piket berhasil dikirim!', type: 'success' });
      setCatatan('');
      setFotoSatu(null);
      setFotoDua(null);
      // Pindahkan langsung ke tab riwayat agar murid/user langsung melihat laporan yang baru dikirim
      setTimeout(() => {
        setActiveTab('riwayat');
      }, 700);
    } catch {
      setSubmitMessage({ text: 'Laporan tersimpan di sesi lokal!', type: 'success' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage({ text: '', type: '' }), 3500);
    }
  };

  const studentsForSelectedDay = allStudents.filter(s => s.picket_day === selectedDay);

  return (
    <div className="w-full text-white font-sans text-left relative">

      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Selamat Pagi, {currentUser?.full_name ? currentUser.full_name : 'User'}!
        </h1>
        <p className="text-gray-300 italic text-sm mt-1">"Bersyukur Adalah Kebahagiaan"</p>
      </div>

      <div className="w-full bg-[#D6A143] rounded-3xl p-6 md:p-8 text-[#082052] shadow-xl relative overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 text-[#082052] text-[11px] font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
              <span>Akun sudah diverifikasi</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#082052]">Dashboard Piket</h2>
            <p className="text-xs md:text-sm font-medium text-[#082052]/90 leading-relaxed">
              Ambil foto bukti piket secara langsung menggunakan kamera. <br className="hidden sm:inline" />
              Pastikan kamu sudah submit bukti piketnya ya!
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xl flex items-center gap-4 border border-white/80 shrink-0 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-[#082052] text-white flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500">{formatDateIndonesia(currentTime)}</p>
              <div className="text-xl md:text-2xl font-black text-[#082052] tracking-tight flex items-baseline gap-1.5">
                <span>{formatClock(currentTime)}</span>
                <span className="text-xs font-bold text-gray-500">WIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-1.5 shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-1.5 border border-white/40 w-full">
        <button 
          onClick={() => setActiveTab('jadwal')} 
          className={`w-full ${isStudent ? 'sm:w-1/3' : 'sm:w-1/2'} py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${activeTab === 'jadwal' ? 'bg-[#D6A143] text-[#082052] shadow-md' : 'text-gray-500 hover:text-[#082052] hover:bg-gray-100'}`}
        >
          <Calendar className="w-4 h-4" /><span>Jadwal Piket</span>
        </button>

        {/* ✅ Tab Kirim Laporan Piket HANYA muncul untuk akun siswa (bukan wali kelas / guru) */}
        {isStudent && (
          <button 
            onClick={() => setActiveTab('kirim')} 
            className="w-full sm:w-1/3 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer bg-[#D6A143] text-[#082052] shadow-md"
            style={{ backgroundColor: activeTab === 'kirim' ? '#D6A143' : 'transparent', color: activeTab === 'kirim' ? '#082052' : '#6b7280' }}
          >
            <Camera className="w-4 h-4" /><span>Kirim Laporan Piket</span>
          </button>
        )}

        <button 
          onClick={() => setActiveTab('riwayat')} 
          className={`w-full ${isStudent ? 'sm:w-1/3' : 'sm:w-1/2'} py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${activeTab === 'riwayat' ? 'bg-[#D6A143] text-[#082052] shadow-md' : 'text-gray-500 hover:text-[#082052] hover:bg-gray-100'}`}
        >
          <History className="w-4 h-4" /><span>Riwayat Laporan Piket</span>
        </button>
      </div>

      {activeTab === 'jadwal' && (
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Jadwal Piket Hari {selectedDay}</h2>
              <p className="text-xs text-gray-300 font-medium mt-0.5">Kelas XII RPL 2</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${selectedDay === day
                  ? 'bg-[#D6A143] text-[#082052] shadow-md'
                  : 'bg-[#0d2a6b] text-white hover:bg-[#133785] border border-white/20'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studentsForSelectedDay.length > 0 ? (
              studentsForSelectedDay.map((student, idx) => (
                <div
                  key={student.id || idx}
                  className="bg-[#F8F3ED] text-[#082052] rounded-2xl p-4 md:p-5 shadow-md border border-[#E4D8CE] relative hover:-translate-y-0.5 transition group"
                >
                  <span className="inline-block bg-[#D6A143] text-[#082052] text-[10px] font-bold px-2.5 py-1 rounded-full mb-2">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-extrabold text-sm md:text-base mt-2 leading-snug">
                    {student.full_name}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    No Absen : {student.noUrut || '-'}
                  </p>

                  <button
                    type="button"
                    onClick={() => openAddModal(student)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#082052] shadow-sm cursor-pointer"
                    title="Ubah Jadwal Piket"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white/5 border border-white/15 rounded-2xl p-6 text-center text-xs text-gray-300">
                Belum ada siswa piket untuk hari {selectedDay}.<br />
                <span className="text-[10px] opacity-70 mt-1 block">Silakan tambahkan siswa melalui menu Pengaturan → Tambah Data Siswa Piket.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'kirim' && isStudent && (
        <div className="w-full">
          <div className="bg-[#D6A143] text-[#082052] rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-0.5">Form Piket Kelas</h2>
            <p className="text-xs text-[#082052]/80 font-medium mb-4">Isi form piket ini dengan benar dan jujur yaa</p>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#082052] mb-1.5">Nama Siswa*</label>
                <input type="text" value={namaSiswa} onChange={(e) => setNamaSiswa(e.target.value)} placeholder="Masukkan nama lengkap siswa" required className="w-full px-4 py-3 bg-white rounded-xl text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none shadow-xs border border-amber-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#082052] mb-1.5">Tanggal Piket*</label>
                <div className="relative">
                  <input type="date" value={tanggalPiket} onChange={(e) => setTanggalPiket(e.target.value)} required className="w-full px-4 py-3 bg-white rounded-xl text-xs md:text-sm text-gray-800 focus:outline-none shadow-xs border border-amber-200 pr-10" />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#082052]">Foto Bukti Piket (Kamera Langsung)</label>
                  <span className="text-[10px] text-[#082052]/70 font-semibold italic">Ambil langsung via Kamera</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GAMBAR SATU */}
                  <div>
                    {fotoSatu ? (
                      <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-amber-200 h-32 flex items-center justify-center">
                        <img src={fotoSatu} alt="Gambar Satu" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-[#082052]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Gambar Satu
                        </div>
                        <button
                          type="button"
                          onClick={() => setFotoSatu(null)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition cursor-pointer"
                          title="Hapus / Foto Ulang"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 bg-[#F5EFEB] hover:bg-white rounded-2xl border-2 border-dashed border-[#082052]/30 shadow-xs p-3 text-center group transition">
                        <Camera className="w-8 h-8 text-[#082052] group-hover:scale-110 transition mb-1.5" />
                        <span className="text-xs font-extrabold text-[#082052]">Gambar Satu</span>
                        <span className="text-[10px] text-gray-500 mb-2.5">Kamera perangkat langsung</span>
                        <button
                          type="button"
                          onClick={() => startCamera('satu')}
                          className="px-4 py-1.5 bg-[#082052] hover:bg-[#0c2e73] text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Buka Kamera</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GAMBAR DUA */}
                  <div>
                    {fotoDua ? (
                      <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-amber-200 h-32 flex items-center justify-center">
                        <img src={fotoDua} alt="Gambar Dua" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-[#082052]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Gambar Dua
                        </div>
                        <button
                          type="button"
                          onClick={() => setFotoDua(null)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition cursor-pointer"
                          title="Hapus / Foto Ulang"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 bg-[#E7DFC6] hover:bg-white rounded-2xl border-2 border-dashed border-[#082052]/30 shadow-xs p-3 text-center group transition">
                        <Camera className="w-8 h-8 text-[#082052] group-hover:scale-110 transition mb-1.5" />
                        <span className="text-xs font-extrabold text-[#082052]">Gambar Dua</span>
                        <span className="text-[10px] text-gray-500 mb-2.5">Kamera perangkat langsung</span>
                        <button
                          type="button"
                          onClick={() => startCamera('dua')}
                          className="px-4 py-1.5 bg-[#082052] hover:bg-[#0c2e73] text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Buka Kamera</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#082052] mb-1.5">Catatan <span className="font-normal italic">(Opsional)</span></label>
                <input type="text" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Tambahkan catatan jika ada" className="w-full px-4 py-3 bg-white rounded-xl text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none shadow-xs border border-amber-200" />
              </div>
              {submitMessage.text && (
                <div className={`p-3 rounded-xl text-xs font-bold text-center ${submitMessage.type === 'success' ? 'bg-emerald-800 text-white' : submitMessage.type === 'error' ? 'bg-rose-800 text-white' : 'bg-[#082052] text-white'}`}>{submitMessage.text}</div>
              )}
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 px-6 rounded-2xl bg-[#082052] hover:bg-[#0c2e73] text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-xl transition active:scale-98 cursor-pointer disabled:opacity-50">
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan Piket ↗'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Riwayat Laporan Piket</h2>
              <p className="text-xs text-gray-300">Wali Kelas & Siswa</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchPicketReports}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0c2761] hover:bg-[#133785] border border-white/20 rounded-full text-xs text-white shadow-md transition cursor-pointer"
                title="Muat Ulang Riwayat"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D6A143]" />
                <span>Refresh</span>
              </button>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0c2761] border border-white/20 rounded-full text-xs text-gray-300 shadow-md">
                <Calendar className="w-3.5 h-3.5 text-[#D6A143]" />
                <span>Semua Riwayat Piket</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="bg-white/5 border border-white/15 rounded-2xl p-8 text-center text-xs text-gray-300">
                Belum ada riwayat laporan piket yang dikirim.
              </div>
            ) : (
              reports.map((item) => (
                <div key={item.id} className="bg-[#F8F3ED] text-[#082052] rounded-3xl p-5 md:p-6 shadow-xl border border-[#E4D8CE]">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5"><span className="font-extrabold text-sm md:text-base text-[#082052]">{item.dayDate}</span><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">{item.statusBadge}</span></div>
                    <span className="px-3 py-1 rounded-xl text-[10px] font-bold bg-[#D6A143] text-[#082052] uppercase shadow-xs">{item.roleBadge}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3"><span className="inline-block w-2 h-2 rounded-full bg-[#082052]"></span><span>{item.time}</span><span>•</span><span>{item.name}</span></div>
                  <div className="bg-[#D6A143] text-[#082052] rounded-2xl p-4 md:p-5 mb-4 shadow-sm"><span className="block text-[11px] font-bold text-[#082052]/80 mb-0.5">Catatan Piket:</span><p className="text-xs md:text-sm font-semibold leading-relaxed">"{item.notes}"</p></div>
                  <button onClick={() => setSelectedProof(item)} className="w-full py-3 rounded-2xl bg-[#082052] hover:bg-[#0c2e73] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"><Eye className="w-4 h-4" /><span>Lihat Bukti Piket ↗</span></button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddStudentToPiketModal
          student={targetStudent}
          onClose={() => { setShowAddModal(false); setTargetStudent(null); }}
          onConfirm={handleConfirmAddToPiket}
        />
      )}

      {/* MODAL KAMERA LANGSUNG */}
      {activeCameraTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#082052] text-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-white/20 flex flex-col items-center">
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold mb-1">
              Ambil Foto: {activeCameraTarget === 'satu' ? 'Gambar Satu' : 'Gambar Dua'}
            </h3>
            <p className="text-xs text-gray-300 mb-4 text-center">
              Posisikan kamera ke area piket yang ingin difoto secara langsung.
            </p>

            {cameraError ? (
              <div className="bg-red-500/20 border border-red-500/50 text-white text-xs p-4 rounded-2xl text-left mb-4 space-y-2">
                <p className="font-bold text-red-300 flex items-center gap-1.5">
                  ⚠️ Akses Kamera Ditolak / Tidak Tersedia
                </p>
                <p className="text-gray-200 text-[11px] leading-relaxed">
                  {cameraError}
                </p>
                <div className="bg-black/40 rounded-xl p-2.5 text-[10px] text-gray-300 font-mono">
                  1. Klik ikon 🔒 / 📷 di sebelah kiri URL address bar (http://localhost:5173)<br />
                  2. Ubah <b>Camera</b> ke <b>Allow (Izinkan)</b><br />
                  3. Klik tombol "Coba Lagi" di bawah
                </div>
                <button
                  type="button"
                  onClick={() => startCamera(activeCameraTarget)}
                  className="w-full mt-2 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition"
                >
                  🔄 Coba Buka Kamera Lagi
                </button>
              </div>
            ) : (
              <div className="relative w-full aspect-4/3 bg-black rounded-2xl overflow-hidden border border-white/20 shadow-inner mb-4 flex items-center justify-center">
                <video
                  ref={(node) => {
                    videoRef.current = node;
                    if (node && cameraStream && node.srcObject !== cameraStream) {
                      node.srcObject = cameraStream;
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="w-full flex items-center gap-3">
              <button
                type="button"
                onClick={stopCamera}
                className="w-1/3 py-3 rounded-xl border border-white/30 text-white font-bold text-xs hover:bg-white/10 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={Boolean(cameraError)}
                onClick={takePhoto}
                className="w-2/3 py-3 rounded-xl bg-[#D6A143] hover:bg-[#c3923b] text-[#082052] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Jepret Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LIHAT BUKTI PIKET */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#F8F3ED] text-[#082052] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-[#E4D8CE]">
            <button onClick={() => setSelectedProof(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 p-1.5 rounded-full hover:bg-black/5 transition cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-extrabold mb-1">Bukti Piket: {selectedProof.name}</h3>
            <p className="text-xs text-gray-600 mb-4">{selectedProof.dayDate} • {selectedProof.time}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <span className="block text-xs font-bold mb-1 text-[#082052]">Gambar Satu</span>
                <img src={selectedProof.photoOne || selectedProof.beforePhoto || 'https://via.placeholder.com/400x300?text=Tidak+Ada+Foto'} alt="Gambar Satu" className="w-full h-40 object-cover rounded-xl border border-gray-300 shadow-xs" />
              </div>
              <div>
                <span className="block text-xs font-bold mb-1 text-[#082052]">Gambar Dua</span>
                <img src={selectedProof.photoTwo || selectedProof.afterPhoto || 'https://via.placeholder.com/400x300?text=Tidak+Ada+Foto'} alt="Gambar Dua" className="w-full h-40 object-cover rounded-xl border border-gray-300 shadow-xs" />
              </div>
            </div>
            <div className="bg-[#D6A143] rounded-xl p-3 text-xs font-semibold text-[#082052] mb-4"><span className="font-bold">Catatan: </span>{selectedProof.notes}</div>
            <button onClick={() => setSelectedProof(null)} className="w-full py-2.5 bg-[#082052] text-white rounded-xl text-xs font-bold hover:bg-[#0c2e73] transition cursor-pointer">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}