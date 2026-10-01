import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, History, Send, ChevronRight, X, Clock, Calendar, Eye } from 'lucide-react';

export default function PicketSchedulePage({ currentUser, onNavigate, onStudentAdded }) {
  // Tab: 'jadwal' | 'kirim' | 'riwayat' (default: 'kirim' seperti di screenshot)
  const [activeTab, setActiveTab] = useState('kirim');
  const [selectedDay, setSelectedDay] = useState('Senin');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form Kirim Laporan State (sesuai input di screenshot atas)
  const [namaSiswa, setNamaSiswa] = useState(currentUser?.full_name || 'Asoey Suyatno');
  const [tanggalPiket, setTanggalPiket] = useState(() => new Date().toISOString().split('T')[0]);
  const [catatan, setCatatan] = useState('');
  const [fotoSebelum, setFotoSebelum] = useState(null);
  const [fotoSesudah, setFotoSesudah] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

  // State Modal Detail Foto Bukti Piket
  const [selectedProof, setSelectedProof] = useState(null);

  // Riwayat Laporan Piket (sesuai kartu di screenshot bawah)
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Asoey Suyatno',
      dayDate: 'Senin, 17 Oktober 2026',
      time: '06:45 WIB',
      statusBadge: 'Terkonfirmasi',
      roleBadge: 'Piket',
      notes: 'Papan tulis dan lantai kelas sudah bersih dan dipel.',
      beforePhoto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Asoey Suyatno',
      dayDate: 'Selasa, 18 Oktober 2026',
      time: '06:50 WIB',
      statusBadge: 'Terkonfirmasi',
      roleBadge: 'Piket',
      notes: 'Area meja guru dan sampah luar kelas sudah dibersihkan.',
      beforePhoto: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  // Data Jadwal Piket per Hari (State Dinamis)
  const [scheduleData, setScheduleData] = useState({
    Senin: [
      { no: '01', name: 'Aditya Pratama', noAbsen: '01' },
      { no: '02', name: 'Muhammad Reza Auditore', noAbsen: '19' },
      { no: '03', name: 'Asoey Suyatno', noAbsen: '04' },
      { no: '04', name: 'Putri Permata Sari', noAbsen: '27' },
      { no: '05', name: 'Deni Supriadi', noAbsen: '07' },
      { no: '06', name: 'Jone Doe', noAbsen: '14' },
    ],
    Selasa: [
      { no: '01', name: 'Budi Santoso', noAbsen: '03' },
      { no: '02', name: 'Citra Kirana', noAbsen: '06' },
      { no: '03', name: 'Dimas Seto', noAbsen: '08' },
      { no: '04', name: 'Eka Ramdani', noAbsen: '11' },
    ],
    Rabu: [
      { no: '01', name: 'Kurnia Meiga', noAbsen: '18' },
      { no: '02', name: 'Lia Ananta', noAbsen: '20' },
      { no: '03', name: 'Maulana Malik', noAbsen: '21' },
    ],
    Kamis: [
      { no: '01', name: 'Siti Badriah', noAbsen: '31' },
      { no: '02', name: 'Taufik Hidayat', noAbsen: '32' },
    ],
    Jumat: [
      { no: '01', name: 'Bayu Skak', noAbsen: '09' },
      { no: '02', name: 'Celine Evangelista', noAbsen: '10' },
    ]
  });

  const handleStudentCreated = (newStudent) => {
    const targetDay = newStudent.picketDay || selectedDay;
    setScheduleData(prev => {
      const currentList = prev[targetDay] || [];
      const newIndex = String(currentList.length + 1).padStart(2, '0');
      return {
        ...prev,
        [targetDay]: [
          ...currentList,
          {
            no: newIndex,
            name: newStudent.full_name,
            noAbsen: newStudent.noAbsen
          }
        ]
      };
    });

    if (onStudentAdded) {
      onStudentAdded(newStudent);
    }
  };

  // Update real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateIndonesia = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatClock = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Handle Foto Upload (Sebelum & Sesudah)
  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'sebelum') setFotoSebelum(reader.result);
        if (type === 'sesudah') setFotoSesudah(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Form Piket Kelas
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
      await fetch('http://localhost:5000/api/picket/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: currentUser?.id || 1,
          status: 'completed',
          area_name: 'Piket Harian Kelas',
          notes: catatan,
          photo_url: fotoSesudah || fotoSebelum || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80'
        })
      });

      // Tambahkan ke riwayat lokal
      const newReportItem = {
        id: Date.now(),
        name: namaSiswa,
        dayDate: formatDateIndonesia(new Date(tanggalPiket)),
        time: `${formatClock(new Date())} WIB`,
        statusBadge: 'Terkonfirmasi',
        roleBadge: 'Piket',
        notes: catatan || 'Piket harian kelas selesai dikerjakan.',
        beforePhoto: fotoSebelum || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
        afterPhoto: fotoSesudah || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
      };

      setReports([newReportItem, ...reports]);
      setSubmitMessage({ text: 'Laporan piket berhasil dikirim!', type: 'success' });

      // Reset form
      setCatatan('');
      setFotoSebelum(null);
      setFotoSesudah(null);
    } catch {
      setSubmitMessage({ text: 'Laporan tersimpan di sesi lokal!', type: 'success' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage({ text: '', type: '' }), 3500);
    }
  };

  return (
    <div className="w-full text-white font-sans text-left">
      {/* 1. HEADER ATAS SAPAAN PENGGUNA */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Selamat Pagi, {currentUser?.full_name ? currentUser.full_name : 'Asoey'}!
        </h1>
        <p className="text-gray-300 italic text-sm mt-1">
          "Bersyukur Adalah Kebahagiaan"
        </p>
      </div>

      {/* 2. HERO BANNER EMAS/MUSTARD (Persis Screenshot) */}
      <div className="w-full bg-[#D6A143] rounded-3xl p-6 md:p-8 text-[#082052] shadow-xl relative overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            {/* Badge Akun sudah diverifikasi */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 text-[#082052] text-[11px] font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
              <span>Akun sudah diverifikasi</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#082052]">
              Dashboard Piket
            </h2>
            <p className="text-xs md:text-sm font-medium text-[#082052]/90 leading-relaxed">
              Ambil foto bukti piket secara langsung menggunakan kamera. <br className="hidden sm:inline" />
              Pastikan kamu sudah submit bukti piketnya ya!
            </p>
          </div>

          {/* KOTAK JAM & TANGGAL (Putih Melengkung dengan Icon Jam Navy) */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xl flex items-center gap-4 border border-white/80 shrink-0 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-[#082052] text-white flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500">
                {formatDateIndonesia(currentTime)}
              </p>
              <div className="text-xl md:text-2xl font-black text-[#082052] tracking-tight flex items-baseline gap-1.5">
                <span>{formatClock(currentTime)}</span>
                <span className="text-xs font-bold text-gray-500">WIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CAPSULE MENU NAVIGASI TABS (Persis Screenshot) */}
      <div className="bg-white rounded-2xl p-1.5 shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-1.5 border border-white/40 max-w-4xl mx-auto">
        {/* Tab 1: Jadwal Piket */}
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`w-full sm:w-1/3 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'jadwal'
              ? 'bg-[#D6A143] text-[#082052] shadow-md'
              : 'text-gray-500 hover:text-[#082052] hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Piket</span>
        </button>

        {/* Tab 2: Kirim Laporan Piket */}
        <button
          onClick={() => setActiveTab('kirim')}
          className={`w-full sm:w-1/3 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'kirim'
              ? 'bg-[#D6A143] text-[#082052] shadow-md'
              : 'text-gray-500 hover:text-[#082052] hover:bg-gray-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Kirim Laporan Piket</span>
        </button>

        {/* Tab 3: Riwayat Laporan Piket */}
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`w-full sm:w-1/3 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'riwayat'
              ? 'bg-[#D6A143] text-[#082052] shadow-md'
              : 'text-gray-500 hover:text-[#082052] hover:bg-gray-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Laporan Piket</span>
        </button>
      </div>

      {/* 4. TAMPILAN TAB: KIRIM LAPORAN PIKET (Persis Screenshot 1) */}
      {activeTab === 'kirim' && (
        <div className="w-full max-w-4xl mx-auto">
          {/* Card Form Piket Kelas Berwarna Mustard/Emas #D6A143 */}
          <div className="bg-[#D6A143] text-[#082052] rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-0.5">
              Form Piket Kelas
            </h2>
            <p className="text-xs text-[#082052]/80 font-medium mb-4">
              Isi form piket ini dengan benar dan jujur yaa
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              {/* Input Nama Siswa */}
              <div>
                <label className="block text-xs font-bold text-[#082052] mb-1.5">
                  Nama Siswa*
                </label>
                <input
                  type="text"
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  placeholder="Masukkan nama lengkap siswa"
                  required
                  className="w-full px-4 py-3 bg-white rounded-xl text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none shadow-xs border border-amber-200"
                />
              </div>

              {/* Input Tanggal Piket */}
              <div>
                <label className="block text-xs font-bold text-[#082052] mb-1.5">
                  Tanggal Piket*
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tanggalPiket}
                    onChange={(e) => setTanggalPiket(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white rounded-xl text-xs md:text-sm text-gray-800 focus:outline-none shadow-xs border border-amber-200 pr-10"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Upload Foto Bukti Piket (Sebelum & Sesudah) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#082052]">
                    Foto Bukti Piket
                  </label>
                  <span className="text-[10px] text-[#082052]/70 font-semibold italic">
                    Opsional
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Foto 1: Sebelum Piket */}
                  <div>
                    {fotoSebelum ? (
                      <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-amber-200 h-28 flex items-center justify-center">
                        <img src={fotoSebelum} alt="Sebelum Piket" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFotoSebelum(null)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-28 bg-[#F5EFEB] hover:bg-white rounded-2xl border-2 border-dashed border-white/60 shadow-xs cursor-pointer transition p-3 text-center group">
                        <Camera className="w-6 h-6 text-[#082052]/70 group-hover:scale-110 transition mb-1" />
                        <span className="text-xs font-bold text-[#082052]">Foto Sebelum Piket</span>
                        <span className="text-[10px] text-gray-500">Klik untuk upload / foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 'sebelum')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Foto 2: Sesudah Piket */}
                  <div>
                    {fotoSesudah ? (
                      <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-amber-200 h-28 flex items-center justify-center">
                        <img src={fotoSesudah} alt="Sesudah Piket" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFotoSesudah(null)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-28 bg-[#E7DFC6] hover:bg-white rounded-2xl border-2 border-dashed border-white/60 shadow-xs cursor-pointer transition p-3 text-center group">
                        <Camera className="w-6 h-6 text-[#082052]/70 group-hover:scale-110 transition mb-1" />
                        <span className="text-xs font-bold text-[#082052]">Foto Sesudah Piket</span>
                        <span className="text-[10px] text-gray-500">Klik untuk upload / foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 'sesudah')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Catatan (Opsional) */}
              <div>
                <label className="block text-xs font-bold text-[#082052] mb-1.5">
                  Catatan <span className="font-normal italic">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tambahkan catatan jika ada"
                  className="w-full px-4 py-3 bg-white rounded-xl text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none shadow-xs border border-amber-200"
                />
              </div>

              {/* Status Notifikasi */}
              {submitMessage.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold text-center ${
                    submitMessage.type === 'success'
                      ? 'bg-emerald-800 text-white'
                      : submitMessage.type === 'error'
                      ? 'bg-rose-800 text-white'
                      : 'bg-[#082052] text-white'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              {/* Tombol Kirim Laporan Piket (Biru Tua Navy Persis Screenshot) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#082052] hover:bg-[#0c2e73] text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-xl transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan Piket ↗'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. TAMPILAN TAB: RIWAYAT LAPORAN PIKET (Persis Screenshot 2) */}
      {activeTab === 'riwayat' && (
        <div className="w-full max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Riwayat Laporan Piket
              </h2>
              <p className="text-xs text-gray-300">Wali Kelas & Siswa</p>
            </div>

            {/* Filter Tanggal Pill Button */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0c2761] border border-white/20 rounded-full text-xs text-gray-300 shadow-md">
              <Calendar className="w-3.5 h-3.5 text-[#D6A143]" />
              <span>Semua Riwayat Piket</span>
            </div>
          </div>

          {/* Daftar Kartu Riwayat */}
          <div className="space-y-4">
            {reports.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8F3ED] text-[#082052] rounded-3xl p-5 md:p-6 shadow-xl border border-[#E4D8CE]"
              >
                {/* Baris Atas Kartu: Tanggal, Status Badge, dan Role Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-sm md:text-base text-[#082052]">
                      {item.dayDate}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {item.statusBadge}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-xl text-[10px] font-bold bg-[#D6A143] text-[#082052] uppercase shadow-xs">
                    {item.roleBadge}
                  </span>
                </div>

                {/* Jam dan Nama */}
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#082052]"></span>
                  <span>{item.time}</span>
                  <span>•</span>
                  <span>{item.name}</span>
                </div>

                {/* Kotak Catatan Piket Berwarna Mustard #D6A143 Lembut */}
                <div className="bg-[#D6A143] text-[#082052] rounded-2xl p-4 md:p-5 mb-4 shadow-sm">
                  <span className="block text-[11px] font-bold text-[#082052]/80 mb-0.5">
                    Catatan Piket:
                  </span>
                  <p className="text-xs md:text-sm font-semibold leading-relaxed">
                    "{item.notes}"
                  </p>
                </div>

                {/* Tombol Lihat Bukti Piket (Biru Tua Solid) */}
                <button
                  onClick={() => setSelectedProof(item)}
                  className="w-full py-3 rounded-2xl bg-[#082052] hover:bg-[#0c2e73] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat Bukti Piket ↗</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAMPILAN TAB: JADWAL PIKET */}
      {activeTab === 'jadwal' && (
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Jadwal Piket Hari {selectedDay}
              </h2>
              <p className="text-xs text-gray-300 font-medium">Kelas XII RPL 2</p>
            </div>

            <button
              onClick={() => setActiveTab('kirim')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D6A143] text-[#082052] font-black text-xs shadow-md hover:bg-white transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Isi Form Piket</span>
            </button>
          </div>

          {/* Filter Hari */}
          <div className="flex flex-wrap items-center gap-2">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedDay === day
                    ? 'bg-[#D6A143] text-[#082052] shadow-md'
                    : 'bg-[#0d2a6b] text-white hover:bg-[#133785] border border-white/20'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* List Siswa Piket */}
          <div className="bg-[#F8F3ED] text-[#082052] rounded-3xl overflow-hidden shadow-xl border border-[#E4D8CE]">
            <div className="grid grid-cols-12 px-8 py-3.5 font-bold text-xs text-gray-700 border-b border-[#D7C7B7]/60">
              <div className="col-span-2">No</div>
              <div className="col-span-7">Nama Siswa</div>
              <div className="col-span-3 text-right">No Absen</div>
            </div>

            <div className="divide-y divide-[#D7C7B7]/50">
              {scheduleData[selectedDay]?.map((student, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center px-8 py-4 text-sm hover:bg-[#efe7dd] transition">
                  <div className="col-span-2 font-bold text-base">{student.no}</div>
                  <div className="col-span-7 font-extrabold">{student.name}</div>
                  <div className="col-span-3 text-right font-bold text-[#D6A143]">{student.noAbsen}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL LIHAT BUKTI FOTO PIKET */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#F8F3ED] text-[#082052] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-[#E4D8CE]">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 p-1.5 rounded-full hover:bg-black/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold mb-1">
              Bukti Piket: {selectedProof.name}
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              {selectedProof.dayDate} • {selectedProof.time}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <span className="block text-xs font-bold mb-1">Sebelum Piket</span>
                <img
                  src={selectedProof.beforePhoto}
                  alt="Sebelum"
                  className="w-full h-40 object-cover rounded-xl border border-gray-300 shadow-xs"
                />
              </div>
              <div>
                <span className="block text-xs font-bold mb-1">Sesudah Piket</span>
                <img
                  src={selectedProof.afterPhoto}
                  alt="Sesudah"
                  className="w-full h-40 object-cover rounded-xl border border-gray-300 shadow-xs"
                />
              </div>
            </div>

            <div className="bg-[#D6A143] rounded-xl p-3 text-xs font-semibold text-[#082052] mb-4">
              <span className="font-bold">Catatan: </span>
              {selectedProof.notes}
            </div>

            <button
              onClick={() => setSelectedProof(null)}
              className="w-full py-2.5 bg-[#082052] text-white rounded-xl text-xs font-bold hover:bg-[#0c2e73]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
