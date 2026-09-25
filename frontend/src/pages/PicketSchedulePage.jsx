import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, History, Send, ChevronRight, X, Clock, Calendar } from 'lucide-react';

export default function PicketSchedulePage({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('jadwal'); // 'jadwal' | 'kirim' | 'riwayat'
  const [selectedDay, setSelectedDay] = useState('Senin');
  const [currentTime, setCurrentTime] = useState(new Date());

  // State Modal / Form Kirim Laporan
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('Area Kelas & Papan Tulis');
  const [reportNotes, setReportNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Riwayat laporan
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Aditya Pratama',
      date: '2026-09-21',
      day: 'Senin',
      area: 'Sapu & Pel Lantai Kelas',
      status: 'verified',
      time: '06:45 WIB'
    },
    {
      id: 2,
      name: 'Muhammad Reza Auditore',
      date: '2026-09-21',
      day: 'Senin',
      area: 'Bersihkan Papan Tulis & Meja Guru',
      status: 'verified',
      time: '06:50 WIB'
    },
    {
      id: 3,
      name: currentUser?.full_name || 'Asoey Suyatno',
      date: '2026-09-21',
      day: 'Senin',
      area: 'Buang Sampah & Rapikan Kursi',
      status: 'completed',
      time: '06:55 WIB'
    }
  ]);

  // Data Jadwal Piket per Hari
  const scheduleData = {
    Senin: [
      { no: '01', name: 'Aditya Pratama', noAbsen: '01' },
      { no: '02', name: 'Muhammad Reza Auditore', noAbsen: '19' },
      { no: '03', name: 'Asoey Suyatno', noAbsen: '04' },
      { no: '04', name: 'Putri Permata Sari', noAbsen: '27' },
      { no: '05', name: 'Deni Supriadi', noAbsen: '07' },
      { no: '06', name: 'Jone Doe', noAbsen: '14' },
      { no: '07', name: 'Bambang Laksana', noAbsen: '05' },
      { no: '08', name: 'Qiara Kiyoshi', noAbsen: '34' }
    ],
    Selasa: [
      { no: '01', name: 'Budi Santoso', noAbsen: '03' },
      { no: '02', name: 'Citra Kirana', noAbsen: '06' },
      { no: '03', name: 'Dimas Seto', noAbsen: '08' },
      { no: '04', name: 'Eka Ramdani', noAbsen: '11' },
      { no: '05', name: 'Fajar Nugraha', noAbsen: '12' },
      { no: '06', name: 'Gita Gutawa', noAbsen: '13' },
      { no: '07', name: 'Hafiz Prasetyo', noAbsen: '15' },
      { no: '08', name: 'Indah Pertiwi', noAbsen: '17' }
    ],
    Rabu: [
      { no: '01', name: 'Kurnia Meiga', noAbsen: '18' },
      { no: '02', name: 'Lia Ananta', noAbsen: '20' },
      { no: '03', name: 'Maulana Malik', noAbsen: '21' },
      { no: '04', name: 'Nabila Syakieb', noAbsen: '22' },
      { no: '05', name: 'Oki Setiana', noAbsen: '23' },
      { no: '06', name: 'Pandu Wicaksono', noAbsen: '25' },
      { no: '07', name: 'Qori Sandioriva', noAbsen: '28' },
      { no: '08', name: 'Rian D’Masiv', noAbsen: '30' }
    ],
    Kamis: [
      { no: '01', name: 'Siti Badriah', noAbsen: '31' },
      { no: '02', name: 'Taufik Hidayat', noAbsen: '32' },
      { no: '03', name: 'Umar Bakri', noAbsen: '33' },
      { no: '04', name: 'Vina Panduwinata', noAbsen: '35' },
      { no: '05', name: 'Wahyu Ramadhan', noAbsen: '36' },
      { no: '06', name: 'Yosep Pratama', noAbsen: '37' },
      { no: '07', name: 'Zaskia Sungkar', noAbsen: '38' },
      { no: '08', name: 'Agung Gunawan', noAbsen: '02' }
    ],
    Jumat: [
      { no: '01', name: 'Bayu Skak', noAbsen: '09' },
      { no: '02', name: 'Celine Evangelista', noAbsen: '10' },
      { no: '03', name: 'Dewi Sandra', noAbsen: '16' },
      { no: '04', name: 'Glenn Fredly', noAbsen: '24' },
      { no: '05', name: 'Irfan Hakim', noAbsen: '26' },
      { no: '06', name: 'Luna Maya', noAbsen: '29' }
    ]
  };

  // Jam real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Tanggal Indonesia
  const formatDateIndonesia = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dName = days[date.getDay()];
    const dNum = date.getDate();
    const mName = months[date.getMonth()];
    const yNum = date.getFullYear();
    return `${dName}, ${dNum} ${mName} ${yNum}`;
  };

  const formatClock = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Handle Foto Upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Laporan Piket
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          area_name: selectedArea,
          notes: reportNotes,
          photo_url: photoPreview || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
        })
      });

      // Tambahkan ke riwayat lokal
      const newReport = {
        id: Date.now(),
        name: currentUser?.full_name || 'Asoey Suyatno',
        date: new Date().toISOString().split('T')[0],
        day: selectedDay,
        area: selectedArea,
        status: 'completed',
        time: `${formatClock(new Date())} WIB`
      };

      setReports([newReport, ...reports]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsSubmitModalOpen(false);
        setReportNotes('');
        setPhotoPreview(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim laporan piket!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  return (
    <div className="w-full text-white font-sans text-left">
      {/* 1. HERO BANNER KUNING-EMAS */}
      <div className="w-full bg-gradient-to-r from-[#cf9a3c] via-[#d6a143] to-[#c79135] rounded-3xl p-6 md:p-8 text-[#082052] shadow-xl relative overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            {/* Badge Akun sudah diverifikasi */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/35 backdrop-blur-md text-[#082052] text-[11px] font-bold shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
              <span>Akun sudah diverifikasi</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#082052]">
              Dashboard Piket
            </h1>
            <p className="text-xs md:text-sm font-medium text-[#082052]/90 leading-relaxed">
              Ambil foto bukti piket secara langsung menggunakan kamera. <br className="hidden sm:inline" />
              Pastikan kamu sudah submit bukti piketnya ya!
            </p>
          </div>

          {/* KOTAK JAM & TANGGAL */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-2xl flex items-center gap-4 border border-white/60 shrink-0 self-start md:self-auto">
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

      {/* 2. CAPSULE MENU NAVIGASI KECIL (Jadwal Piket, Kirim Laporan, Riwayat) */}
      <div className="bg-white rounded-2xl p-2 shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between gap-2 border border-white/20">
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`w-full sm:w-1/3 py-3 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'jadwal'
              ? 'bg-[#d6a143] text-[#082052] shadow-md'
              : 'text-gray-600 hover:text-[#082052] hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Piket</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('kirim');
            setIsSubmitModalOpen(true);
          }}
          className={`w-full sm:w-1/3 py-3 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'kirim'
              ? 'bg-[#d6a143] text-[#082052] shadow-md'
              : 'text-gray-600 hover:text-[#082052] hover:bg-gray-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Kirim Laporan Piket</span>
        </button>

        <button
          onClick={() => setActiveTab('riwayat')}
          className={`w-full sm:w-1/3 py-3 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'riwayat'
              ? 'bg-[#d6a143] text-[#082052] shadow-md'
              : 'text-gray-600 hover:text-[#082052] hover:bg-gray-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Laporan Piket</span>
        </button>
      </div>

      {/* 3. TAMPILAN UTAMA TAB: JADWAL PIKET */}
      {activeTab === 'jadwal' && (
        <div className="space-y-6">
          {/* Header Baris Judul & Tombol Kirim */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Jadwal Piket Hari {selectedDay}
              </h2>
              <p className="text-xs text-gray-300 font-medium">Kelas XII RPL 2</p>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0d2a6b] hover:bg-[#133785] border border-white/20 text-white font-bold text-xs md:text-sm shadow-xl transition active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <Camera className="w-4 h-4 text-[#d6a143]" />
              <span>Kirim Laporan Piket</span>
            </button>
          </div>

          {/* Filter Hari (Senin, Selasa, Rabu, Kamis, Jumat) */}
          <div className="flex flex-wrap items-center gap-2">
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedDay === day
                    ? 'bg-[#d6a143] text-[#082052] shadow-md'
                    : 'bg-[#082052] text-gray-300 hover:text-white border border-white/20 hover:border-white/40'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* GRID KARTU SISWA PIKET (Krem, rounded 2xl, badge nomor) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(scheduleData[selectedDay] || []).map((student, idx) => (
              <div
                key={idx}
                className="bg-[#F5EFEB] hover:bg-white text-[#082052] p-5 rounded-2xl shadow-lg border border-[#082052]/5 transition-all duration-300 hover:shadow-xl flex items-center gap-4 group"
              >
                {/* Badge Nomor Bulat Kuning */}
                <div className="w-8 h-8 rounded-full bg-[#d6a143] text-[#082052] font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                  {student.no}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm md:text-base text-[#082052] truncate">
                    {student.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    No Absen : {student.noAbsen}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#082052]/5 text-[#082052] group-hover:bg-[#082052] group-hover:text-white transition">
                    Piket Pagi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAMPILAN TAB: RIWAYAT LAPORAN PIKET */}
      {activeTab === 'riwayat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Riwayat Pengiriman Bukti Piket
            </h2>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 bg-[#d6a143] text-[#082052] font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-white transition"
            >
              + Buat Laporan Baru
            </button>
          </div>

          <div className="bg-[#F5EFEB] text-[#082052] rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 px-6 py-4 font-bold text-xs border-b border-[#082052]/10 uppercase tracking-wider bg-[#eae3dc]">
              <div className="col-span-3">Nama Siswa</div>
              <div className="col-span-3">Area Piket</div>
              <div className="col-span-3">Waktu & Tanggal</div>
              <div className="col-span-3 text-right">Status</div>
            </div>

            <div className="divide-y divide-[#082052]/10">
              {reports.map((item) => (
                <div key={item.id} className="grid grid-cols-12 items-center px-6 py-4 text-xs hover:bg-black/5 transition">
                  <div className="col-span-3 font-bold">{item.name}</div>
                  <div className="col-span-3 text-gray-600">{item.area}</div>
                  <div className="col-span-3 text-gray-600">
                    {item.day}, {item.date} • {item.time}
                  </div>
                  <div className="col-span-3 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status === 'verified' ? '✓ Terverifikasi' : '⏱ Menunggu'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL FORM: KIRIM LAPORAN PIKET (KAMERA & FOTO) */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F5EFEB] text-[#082052] w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Tombol Tutup */}
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 p-1.5 rounded-full hover:bg-black/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#d6a143] uppercase tracking-wider">
                Verifikasi Tugas
              </span>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#082052]">
                Kirim Laporan Piket
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Lampirkan bukti foto area kelas yang telah Anda bersihkan hari ini.
              </p>
            </div>

            {submitSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-[#082052]">
                  Laporan Berhasil Terkirim!
                </h3>
                <p className="text-xs text-gray-500">
                  Bukti piket Anda telah disimpan dan menunggu verifikasi wali kelas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-left">
                {/* PILIH AREA PIKET */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#082052]">Area yang Dibersihkan</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:border-[#d6a143]"
                  >
                    <option value="Area Kelas & Papan Tulis">Area Kelas & Papan Tulis</option>
                    <option value="Sapu & Pel Lantai Kelas">Sapu & Pel Lantai Kelas</option>
                    <option value="Kaca Jendela & Tirai">Kaca Jendela & Tirai</option>
                    <option value="Buang Sampah & Wastafel">Buang Sampah & Wastafel</option>
                    <option value="Meja Guru & Podium">Meja Guru & Podium</option>
                  </select>
                </div>

                {/* UPLOAD FOTO BUKTI / KAMERA */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#082052]">Foto Bukti Pekerjaan</label>
                  
                  {photoPreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-md">
                      <img src={photoPreview} alt="Bukti Piket" className="w-full h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition cursor-pointer"
                        title="Hapus Foto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#d6a143] rounded-2xl bg-white hover:bg-yellow-50/50 cursor-pointer transition">
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Camera className="w-8 h-8 text-[#d6a143] mb-2" />
                        <p className="text-xs font-bold text-gray-700">
                          Klik untuk Ambil Foto / Unggah
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, atau JPEG (Maks. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* CATATAN TAMBAHAN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#082052]">Catatan Tambahan (Opsional)</label>
                  <textarea
                    rows="3"
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder="Contoh: Papan tulis sudah bersih, tempat sampah sudah dikosongkan..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs placeholder-gray-400 focus:outline-none focus:border-[#d6a143]"
                  ></textarea>
                </div>

                {/* TOMBOL SUBMIT */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#d6a143] hover:bg-[#c99538] text-[#082052] font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Mengirim...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Laporan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
