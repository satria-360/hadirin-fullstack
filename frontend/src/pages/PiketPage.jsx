import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Eye,
  RefreshCw,
  X,
  FileCheck,
  Search,
  ArrowLeft,
  Image as ImageIcon,
  Users,
  Sparkles,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Send,
  Info,
  Check,
  Flame
} from 'lucide-react';

// Jadwal Piket Mingguan Per Hari (Default / Template Kelas)
const DEFAULT_JADWAL_PIKET = {
  Senin: [
    { nama: 'Aditya Pratama', peran: 'Koordinator', avatar: 'AP' },
    { nama: 'Asoey Suyatno', peran: 'Menyapu Lantai', avatar: 'AS' },
    { nama: 'Ahmad Dahlan', peran: 'Mengepel & Buang Sampah', avatar: 'AD' },
    { nama: 'Anisa Rahmawati', peran: 'Membersihkan Papan Tulis', avatar: 'AR' }
  ],
  Selasa: [
    { nama: 'Budi Santoso', peran: 'Koordinator', avatar: 'BS' },
    { nama: 'Aziz Ibnu', peran: 'Menyapu Lantai', avatar: 'AI' },
    { nama: 'Citra Lestari', peran: 'Mengepel Lantai', avatar: 'CL' },
    { nama: 'Dimas Anggara', peran: 'Membersihkan Jendela & Meja', avatar: 'DA' }
  ],
  Rabu: [
    { nama: 'Eka Saputra', peran: 'Koordinator', avatar: 'ES' },
    { nama: 'Farhan Maulana', peran: 'Menyapu & Lap Kaca', avatar: 'FM' },
    { nama: 'Gita Gutawa', peran: 'Mengepel Lantai', avatar: 'GG' },
    { nama: 'Hendra Setiawan', peran: 'Buang Sampah & Papan', avatar: 'HS' }
  ],
  Kamis: [
    { nama: 'Intan Permata', peran: 'Koordinator', avatar: 'IP' },
    { nama: 'Joko Widodo', peran: 'Menyapu Kelas & Teras', avatar: 'JW' },
    { nama: 'Kiki Amalia', peran: 'Membersihkan Papan Tulis', avatar: 'KA' },
    { nama: 'Lukman Hakim', peran: 'Mengepel Lantai', avatar: 'LH' }
  ],
  Jumat: [
    { nama: 'Muhammad Rizky', peran: 'Koordinator', avatar: 'MR' },
    { nama: 'Nabila Syakieb', peran: 'Menyapu & Merapikan Meja', avatar: 'NS' },
    { nama: 'Oki Setiana', peran: 'Mengepel Lantai', avatar: 'OS' },
    { nama: 'Putra Pratama', peran: 'Buang Sampah & Sanitasi', avatar: 'PP' }
  ],
  Sabtu: [
    { nama: 'Rian D’Masiv', peran: 'Koordinator', avatar: 'RD' },
    { nama: 'Siti Badriah', peran: 'Piket Bersih Total Akhir Pekan', avatar: 'SB' },
    { nama: 'Taufik Hidayat', peran: 'Mengepel & Merapikan Kursi', avatar: 'TH' }
  ],
  Minggu: [
    { nama: '-', peran: 'Hari Libur Sekolah', avatar: 'LB' }
  ]
};

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function PiketPage({ onNavigate, currentUser }) {
  // Ambil data kelas dari akun pengguna yang sedang login
  const userClass = currentUser?.className || 'XII RPL 1';

  // Form State Sederhana
  const [namaKelas, setNamaKelas] = useState(userClass);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [catatan, setCatatan] = useState('');

  // Hitung nama hari dari tanggal terpilih
  const getDayNameFromDate = (dateString) => {
    try {
      if (!dateString) return 'Senin';
      const [y, m, d] = dateString.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return NAMA_HARI[dateObj.getDay()] || 'Senin';
    } catch {
      return 'Senin';
    }
  };

  // State untuk tab hari yang sedang dilihat (default sinkron dengan tanggal aktif)
  const [activeHariTab, setActiveHariTab] = useState(() => getDayNameFromDate(new Date().toISOString().split('T')[0]));

  // Update activeHariTab saat input tanggal berubah
  useEffect(() => {
    setActiveHariTab(getDayNameFromDate(tanggal));
  }, [tanggal]);

  const listPetugasHariIni = DEFAULT_JADWAL_PIKET[activeHariTab] || DEFAULT_JADWAL_PIKET['Senin'];

  // Foto Bukti (Maksimal 2 foto langsung dari kamera)
  const [photos, setPhotos] = useState([]); // [{ url, timestamp }]
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Modal Preview Foto
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Search & Filter Riwayat
  const [searchQuery, setSearchQuery] = useState('');

  // Tab View Utama: 'jadwal' | 'form' | 'riwayat'
  const [activePageTab, setActivePageTab] = useState('jadwal');

  // Interactive Jadwal Tab States
  const [jadwalFilterHari, setJadwalFilterHari] = useState('semua'); // 'semua' | 'hari_ini' | 'Senin' | 'Selasa' | ...
  const [searchPetugasQuery, setSearchPetugasQuery] = useState('');
  const [selectedPetugas, setSelectedPetugas] = useState(null); // detail modal interactivity

  // Live Clock Real-time WIB
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mobileCameraInputRef = useRef(null);

  // Callback ref untuk memastikan stream langsung dipasang begitu elemen <video> di-mount di DOM
  const setVideoRef = (node) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch((e) => console.warn('Autoplay error:', e));
    }
  };

  // Sync video source whenever camera becomes active or stream updates
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((e) => console.warn('Autoplay error:', e));
    }
  }, [isCameraActive]);

  // Update namaKelas jika user login berubah
  useEffect(() => {
    if (currentUser?.className) {
      setNamaKelas(currentUser.className);
    }
  }, [currentUser]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Format Helper: Tanggal & Jam WIB Realtime
  const getFormattedTimestamp = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const d = pad(now.getDate());
    const m = pad(now.getMonth() + 1);
    const y = now.getFullYear();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `${d}/${m}/${y} ${hh}:${mm}:${ss} WIB`;
  };

  // Mulai Live Kamera Langsung
  const startCamera = async (overrideFacing) => {
    if (photos.length >= 2) {
      alert('Maksimal hanya 2 foto bukti piket!');
      return;
    }

    setCameraError('');
    stopCamera();

    const targetFacing = overrideFacing || facingMode;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Browser tidak support getUserMedia (misal non-HTTPS), gunakan kamera sistem
      if (mobileCameraInputRef.current) {
        mobileCameraInputRef.current.click();
      } else {
        setCameraError('Kamera tidak didukung di browser ini.');
      }
      return;
    }

    try {
      // Coba akses kamera dengan facingMode ideal
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (err1) {
        console.warn('Constraint ideal gagal, mencoba fallback standar:', err1);
        // Fallback jika laptop / webcam tidak support facingMode: 'environment'
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      setIsCameraActive(true);

      // Pasang ke video element jika sudah ada
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Camera stream error, falling back to native capture:', err);
      // Jika izin kamera diblokir atau error, coba buka kamera langsung bawaan perangkat
      setCameraError(
        'Gagal menyalakan live kamera. Silakan periksa izin kamera pada icon gembok di address bar browser, atau klik tombol Kamera Perangkat di bawah.'
      );
    }
  };

  // Switch Depan / Belakang
  const toggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Hentikan Stream Kamera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Ambil Jepretan dari Live Kamera + Watermark Timestamp Otomatis
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const currentTimestamp = getFormattedTimestamp();
    const kelasText = namaKelas || 'Kelas';

    // Watermark Banner di bagian bawah foto
    const bannerHeight = Math.max(50, canvas.height * 0.12);
    ctx.fillStyle = 'rgba(8, 32, 82, 0.88)';
    ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

    // Text Watermark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('BUKTI PIKET HADIRIN.CO', 16, canvas.height - (bannerHeight * 0.55));

    ctx.fillStyle = '#67e8f9';
    ctx.font = '12px monospace';
    ctx.fillText(`Kelas: ${kelasText} | ${currentTimestamp}`, 16, canvas.height - (bannerHeight * 0.2));

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setPhotos((prev) => [...prev, { url: dataUrl, timestamp: currentTimestamp }]);
    stopCamera();
  };

  // Fallback jepretan kamera langsung via HTML input capture="environment" (Mobile Camera)
  const handleMobileCameraCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const currentTimestamp = getFormattedTimestamp();
        const kelasText = namaKelas || 'Kelas';

        // Watermark Banner
        const bannerHeight = Math.max(50, canvas.height * 0.1);
        ctx.fillStyle = 'rgba(8, 32, 82, 0.88)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(14, Math.round(bannerHeight * 0.28))}px sans-serif`;
        ctx.fillText('BUKTI PIKET HADIRIN.CO', 16, canvas.height - (bannerHeight * 0.55));

        ctx.fillStyle = '#67e8f9';
        ctx.font = `${Math.max(11, Math.round(bannerHeight * 0.22))}px monospace`;
        ctx.fillText(`Kelas: ${kelasText} | ${currentTimestamp}`, 16, canvas.height - (bannerHeight * 0.2));

        const watermarkedUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPhotos((prev) => [...prev, { url: watermarkedUrl, timestamp: currentTimestamp }]);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Hapus salah satu foto
  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, idx) => idx !== index));
  };

  // Dummy Initial Riwayat Piket (Dibuat sederhana dengan 2 foto per laporan)
  const [riwayatPiket, setRiwayatPiket] = useState([
    {
      id: 'PKT-001',
      namaKelas: 'XII RPL 1',
      tanggal: '2026-09-17',
      timestamp: '17/09/2026 06:45 WIB',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
          timestamp: '17/09/2026 06:45:12 WIB'
        },
        {
          url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
          timestamp: '17/09/2026 06:46:08 WIB'
        }
      ],
      catatan: 'Lantai sudah dipel dan papan tulis bersih.',
      status: 'Selesai'
    },
    {
      id: 'PKT-002',
      namaKelas: 'XI TKJ 2',
      tanggal: '2026-09-17',
      timestamp: '17/09/2026 06:55 WIB',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
          timestamp: '17/09/2026 06:55:40 WIB'
        },
        {
          url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
          timestamp: '17/09/2026 06:56:15 WIB'
        }
      ],
      catatan: 'Sampah kelas telah dibuang ke tempat pembuangan.',
      status: 'Selesai'
    }
  ]);

  // Handle Submit Laporan
  const handleSubmitPiket = (e) => {
    e.preventDefault();

    if (!namaKelas.trim()) {
      alert('Nama kelas tidak boleh kosong!');
      return;
    }

    if (!tanggal) {
      alert('Tanggal tidak boleh kosong!');
      return;
    }

    if (photos.length === 0) {
      alert('Silakan ambil foto bukti piket menggunakan kamera!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newEntry = {
        id: `PKT-${String(riwayatPiket.length + 1).padStart(3, '0')}`,
        namaKelas: namaKelas.trim(),
        tanggal: tanggal,
        timestamp: getFormattedTimestamp(),
        photos: [...photos],
        catatan: catatan.trim() || 'Piket kelas telah selesai dilaksanakan.',
        status: 'Selesai'
      };

      setRiwayatPiket([newEntry, ...riwayatPiket]);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form & pindah ke tab riwayat agar user langsung melihat bukti tersimpan
      setPhotos([]);
      setCatatan('');
      setActivePageTab('riwayat');

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 4000);
    }, 800);
  };

  // Filter Riwayat Sederhana
  const filteredRiwayat = riwayatPiket.filter((item) =>
    item.namaKelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.catatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tanggal.includes(searchQuery)
  );

  return (
    <div className="w-full min-h-screen bg-[#082052] text-white font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Hidden canvas for image watermarking */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Direct Native Camera Shutter Input (Hanya kamera langsung) */}
      <input
        ref={mobileCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleMobileCameraCapture}
        className="hidden"
      />

      {/* NOTIFIKASI SUKSES */}
      {submitSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <div>
            <h4 className="font-bold text-xs">Laporan Piket Berhasil Terkirim!</h4>
            <p className="text-[11px] text-emerald-100">Foto bukti dengan timestamp otomatis telah tersimpan.</p>
          </div>
        </div>
      )}

      {/* HEADER UTAMA SESUAI REFERENSI DESAIN */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-6">
        
        {/* Salam & Quotes Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Selamat {new Date().getHours() < 12 ? 'Pagi' : new Date().getHours() < 16 ? 'Siang' : new Date().getHours() < 19 ? 'Sore' : 'Malam'}, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Asoey'}!
            </h1>
            <p className="text-sm text-slate-300 italic mt-1 font-medium">
              “Bersyukur Adalah Kebahagiaan”
            </p>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="self-start sm:self-auto px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Absensi
            </button>
          )}
        </div>

        {/* HERO BANNER KUNING MUSTARD PERSIS DESAIN REFERENSI */}
        <div className="bg-[#cc9441] text-[#082052] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/20">
          {/* Subtle Ambient Pattern */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Sisi Kiri: Badge Akun Terverifikasi + Judul + Subtitle */}
          <div className="space-y-3 max-w-2xl relative z-10">
            {/* Pill Akun sudah diverifikasi */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#1f2937] text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Akun sudah diverifikasi</span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#082052]">
                Dashboard Piket
              </h2>
              <p className="text-xs md:text-sm font-semibold text-[#082052]/90 mt-1 leading-relaxed">
                Ambil foto bukti piket secara langsung menggunakan kamera.<br className="hidden sm:inline" />
                Pastikan kamu sudah submit bukti piketnya ya!
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Kartu Waktu & Tanggal Putih (Clock Widget) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4 shrink-0 border border-black/5 relative z-10">
            {/* Navy Icon Container */}
            <div className="w-12 h-12 rounded-2xl bg-[#082052] text-white flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>

            {/* Time & Date Text */}
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-500 block leading-tight">
                {activeHariTab}, {currentTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl md:text-3xl font-black text-[#082052] font-mono tracking-tight">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  WIB
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SEGMENTED NAVIGATION TABS */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0a235c]/90 border border-white/15 p-2 rounded-2xl md:rounded-full backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActivePageTab('jadwal')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePageTab === 'jadwal'
                  ? 'bg-[#cc9441] text-[#082052] shadow-lg shadow-[#cc9441]/30 scale-[1.02] font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Jadwal Piket</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activePageTab === 'jadwal' ? 'bg-[#082052]/20 text-[#082052]' : 'bg-white/10 text-slate-300'
              }`}>
                {listPetugasHariIni[0]?.nama !== '-' ? listPetugasHariIni.length : 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePageTab('form')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePageTab === 'form'
                  ? 'bg-[#cc9441] text-[#082052] shadow-lg shadow-[#cc9441]/30 scale-[1.02] font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Kirim Laporan Piket</span>
              {photos.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActivePageTab('riwayat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePageTab === 'riwayat'
                  ? 'bg-[#cc9441] text-[#082052] shadow-lg shadow-[#cc9441]/30 scale-[1.02] font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Riwayat & Galeri</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activePageTab === 'riwayat' ? 'bg-[#082052]/20 text-[#082052]' : 'bg-white/10 text-slate-300'
              }`}>
                {riwayatPiket.length}
              </span>
            </button>
          </div>

          {/* Quick Info Badge Kanan */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 text-xs text-slate-300 border-l border-white/10">
            <span className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-[#cc9441]" /> {namaKelas}
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#f7d59b]">
              <Calendar className="w-3.5 h-3.5 text-[#cc9441]" /> {tanggal}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT AREA BERDASARKAN TAB AKTIF */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        
        {/* ======================================================== */}
        {/* TAB 1: JADWAL PIKET KELAS (CLEAN SINGLE DAY PER VIEW)     */}
        {/* ======================================================== */}
        {activePageTab === 'jadwal' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Main Board Container */}
            <div className="bg-[#f5f6f8] text-[#1e293b] rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200/80">
              
              {/* Header: Title, Active Day & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Jadwal Piket Kelas • {namaKelas}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Jadwal Hari {activeHariTab}
                    </h2>
                    {activeHariTab === getDayNameFromDate(tanggal) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Hari Ini
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => setActivePageTab('form')}
                  className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#cc9441] hover:bg-[#b88235] text-[#082052] font-black text-xs shadow-md hover:scale-[1.02] transition flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Upload Bukti Piket
                </button>
              </div>

              {/* Day Selector Pills Bar (Sederhana & Interaktif) */}
              <div className="flex items-center gap-2 py-4 border-b border-slate-200 overflow-x-auto scrollbar-none">
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((hari) => {
                  const isActive = activeHariTab === hari;
                  const isCurrentDay = getDayNameFromDate(tanggal) === hari;

                  return (
                    <button
                      key={hari}
                      type="button"
                      onClick={() => setActiveHariTab(hari)}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#18181b] text-white shadow-md scale-[1.02]'
                          : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {hari}
                      {isCurrentDay && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Content Grid: Hanya Menampilkan Jadwal untuk Hari Terpilih (Tanpa Foto Profil) */}
              <div className="pt-6 pb-2">
                {listPetugasHariIni && listPetugasHariIni.length > 0 && listPetugasHariIni[0]?.nama !== '-' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {listPetugasHariIni.map((petugas, idx) => {
                      // Distinct clean pastel cards per item matching reference
                      const cardThemes = [
                        { card: 'bg-[#fdf2f8] border-[#fbcfe8] hover:border-pink-300 text-[#831843]', tag: 'bg-pink-100 text-pink-700' },
                        { card: 'bg-[#f5f3ff] border-[#ddd6fe] hover:border-violet-300 text-[#4c1d95]', tag: 'bg-violet-100 text-violet-700' },
                        { card: 'bg-[#eef2ff] border-[#c7d2fe] hover:border-indigo-300 text-[#312e81]', tag: 'bg-indigo-100 text-indigo-700' },
                        { card: 'bg-[#fef9c3] border-[#fde047] hover:border-amber-300 text-[#713f12]', tag: 'bg-amber-100 text-amber-800' },
                      ][idx % 4];

                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group flex flex-col justify-between ${cardThemes.card}`}
                        >
                          {/* Top row: Number index badge & status dots */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-full bg-black/5 text-slate-700 tracking-wider">
                              #{String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-slate-400 text-xs font-black tracking-widest leading-none group-hover:text-slate-700">
                                •••
                              </span>
                            </div>
                          </div>

                          {/* Nama Petugas (Typography Dominant, Clean & Bold) */}
                          <div className="py-2">
                            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-900 transition">
                              {petugas.nama}
                            </h4>
                          </div>

                          {/* Bottom indicator strip */}
                          <div className="pt-3 mt-2 border-t border-black/5 flex items-center justify-between">
                            <div className="w-16 bg-black/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  idx % 2 === 0 ? 'bg-slate-800 w-full' : 'bg-slate-600 w-3/4'
                                }`}
                              />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                              Petugas Aktif
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-2xl bg-white border border-dashed border-slate-200 space-y-2">
                    <span className="text-3xl">🏖️</span>
                    <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Jadwal Piket</h3>
                    <p className="text-xs text-slate-400">Hari ini libur sekolah atau tidak ada jadwal piket.</p>
                  </div>
                )}
              </div>

              {/* Simple Footer Bar */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>Petugas piket hari {activeHariTab} diharapkan hadir lebih awal untuk memastikan kelas siap pakai.</span>
                </div>
                <div className="font-mono text-slate-600 font-semibold">
                  Total: {listPetugasHariIni && listPetugasHariIni[0]?.nama !== '-' ? listPetugasHariIni.length : 0} Petugas
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: FORM SUBMIT LAPORAN PIKET (PREMIUM STUDIO LOOK)    */}
        {/* ======================================================== */}
        {activePageTab === 'form' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300 space-y-6">
            
            {/* Top Info Banner Card */}
            <div className="bg-gradient-to-r from-cyan-900/40 via-[#0e2c6e]/60 to-blue-950/50 border border-cyan-400/30 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-[#082052] font-black shadow-lg shadow-cyan-400/30 shrink-0">
                  <Camera className="w-7 h-7 text-[#082052]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      Live Studio Capture
                    </span>
                    <span className="text-[11px] text-slate-300 font-mono">
                      Timestamp Otomatis
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
                    Laporan Kebersihan & Piket Kelas
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pastikan foto diambil langsung di ruang kelas dengan pencahayaan yang jelas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end relative z-10">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Status Bukti</span>
                  <span className={`text-xs font-black font-mono ${photos.length === 2 ? 'text-emerald-400' : photos.length === 1 ? 'text-amber-300' : 'text-slate-400'}`}>
                    {photos.length}/2 Foto Lengkap
                  </span>
                </div>
              </div>
            </div>

            {/* Main Form Box Glassmorphism */}
            <div className="bg-gradient-to-b from-[#0e275f]/90 to-[#071b45]/95 border border-white/15 rounded-3xl p-6 md:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-1/2 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <form onSubmit={handleSubmitPiket} className="space-y-8 relative z-10">
                
                {/* SECTION 1: IDENTITAS KELAS & WAKTU */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider font-mono">
                    <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center text-[10px]">1</span>
                    <span>Informasi Kelas & Waktu Pelaksanaan</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kelas Input */}
                    <div className="bg-white/5 border border-white/15 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 rounded-2xl p-3.5 transition-all">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase font-mono">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Kelas
                      </label>
                      <input
                        type="text"
                        value={namaKelas}
                        onChange={(e) => setNamaKelas(e.target.value)}
                        placeholder="Contoh: XII RPL 1"
                        className="w-full mt-1.5 bg-transparent border-0 text-white font-bold text-base focus:outline-none placeholder-slate-500"
                        required
                      />
                    </div>

                    {/* Tanggal Input */}
                    <div className="bg-white/5 border border-white/15 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 rounded-2xl p-3.5 transition-all">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase font-mono">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Tanggal Laporan
                      </label>
                      <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className="w-full mt-1.5 bg-transparent border-0 text-white font-bold text-base focus:outline-none [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: VIEW FINDER & DUA FOTO BUKTI (HERO KAMERA) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider font-mono">
                      <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center text-[10px]">2</span>
                      <span>Foto Bukti Fisik Kebersihan (Live Camera)</span>
                    </div>

                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                      Wajib 2 Sudut Foto
                    </span>
                  </div>

                  {cameraError && (
                    <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-200 text-xs rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                        <span>{cameraError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => mobileCameraInputRef.current && mobileCameraInputRef.current.click()}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 transition"
                      >
                        <Camera className="w-4 h-4" /> Buka Kamera Bawaan HP
                      </button>
                    </div>
                  )}

                  {/* LIVE CAMERA VIEWFINDER (Jika Kamera Dinyalakan) */}
                  {isCameraActive && (
                    <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-cyan-400 shadow-2xl shadow-cyan-400/20 animate-in zoom-in-95 duration-200">
                      <video
                        ref={setVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-72 md:h-96 object-cover"
                      />
                      
                      {/* Grid Viewfinder Overlay (Rule of Thirds) */}
                      <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
                        <div className="border-r border-b border-white"></div>
                        <div className="border-r border-b border-white"></div>
                        <div className="border-b border-white"></div>
                        <div className="border-r border-b border-white"></div>
                        <div className="border-r border-b border-white"></div>
                        <div className="border-b border-white"></div>
                        <div className="border-r border-white"></div>
                        <div className="border-r border-white"></div>
                        <div></div>
                      </div>

                      {/* Header HUD Viewfinder */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                        <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400 flex items-center gap-2 border border-white/20 shadow-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                          <span>REC LIVE HUD • {facingMode === 'environment' ? 'Belakang' : 'Depan'}</span>
                        </div>

                        <button
                          type="button"
                          onClick={toggleFacingMode}
                          className="px-3.5 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs font-bold rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition shadow-lg active:scale-95"
                          title="Ganti Kamera Depan/Belakang"
                        >
                          🔄 Putar Lensa
                        </button>
                      </div>

                      {/* Watermark Live Preview Footer */}
                      <div className="absolute bottom-20 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-mono text-cyan-300 border border-white/10">
                        📍 Auto-Watermark: Kelas {namaKelas} • {getFormattedTimestamp()}
                      </div>

                      {/* Shutter Bar Controls */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 px-4 pointer-events-auto">
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-5 py-2.5 bg-black/70 hover:bg-black text-white font-bold text-xs rounded-full border border-white/20 backdrop-blur-md transition cursor-pointer"
                        >
                          Batal
                        </button>

                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-[#082052] font-black text-sm rounded-full shadow-2xl shadow-emerald-400/40 flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Jepret Foto Sekarang</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TWO PHOTO CARDS (FOTO 1 & FOTO 2) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* KARTU SLOT 1: FOTO SEBELUM / SAAT PIKET */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Foto 1 (Sudut Depan / Papan)
                        </span>
                        {photos[0] && (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-mono font-bold">
                            <Check className="w-3.5 h-3.5" /> Terambil
                          </span>
                        )}
                      </div>

                      {photos[0] ? (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400/60 h-48 md:h-52 bg-black group shadow-xl">
                          <img
                            src={photos[0].url}
                            alt="Bukti 1"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent text-[10px] font-mono text-cyan-300 p-3 flex items-center justify-between">
                            <span className="truncate">{photos[0].timestamp}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30">
                              Foto 1
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-3 backdrop-blur-xs">
                            <button
                              type="button"
                              onClick={() => setPreviewPhoto(photos[0])}
                              className="px-3 py-1.5 bg-white text-[#082052] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg hover:bg-slate-100 transition cursor-pointer"
                            >
                              <Eye className="w-4 h-4" /> Pratinjau
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(0)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Ulangi
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="w-full h-48 md:h-52 rounded-2xl border-2 border-dashed border-cyan-400/40 hover:border-cyan-300 bg-white/5 hover:bg-white/[0.09] text-white flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer p-5 group shadow-inner"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-400/20 transition-all text-cyan-300 shadow-md">
                            <Camera className="w-7 h-7" />
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-black tracking-wide text-cyan-300 block">
                              AMBIL FOTO 1
                            </span>
                            <span className="text-[11px] text-slate-300 mt-0.5 block">
                              Klik untuk menyalakan kamera
                            </span>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* KARTU SLOT 2: FOTO SESUDAH / KESELURUHAN */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Foto 2 (Sudut Belakang / Lantai)
                        </span>
                        {photos[1] && (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-mono font-bold">
                            <Check className="w-3.5 h-3.5" /> Terambil
                          </span>
                        )}
                      </div>

                      {photos[1] ? (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400/60 h-48 md:h-52 bg-black group shadow-xl">
                          <img
                            src={photos[1].url}
                            alt="Bukti 2"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent text-[10px] font-mono text-cyan-300 p-3 flex items-center justify-between">
                            <span className="truncate">{photos[1].timestamp}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30">
                              Foto 2
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-3 backdrop-blur-xs">
                            <button
                              type="button"
                              onClick={() => setPreviewPhoto(photos[1])}
                              className="px-3 py-1.5 bg-white text-[#082052] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg hover:bg-slate-100 transition cursor-pointer"
                            >
                              <Eye className="w-4 h-4" /> Pratinjau
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(1)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Ulangi
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startCamera}
                          disabled={photos.length === 0}
                          className={`w-full h-48 md:h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all duration-200 p-5 ${
                            photos.length === 0
                              ? 'border-white/10 bg-white/5 text-slate-500 cursor-not-allowed opacity-60'
                              : 'border-cyan-400/40 hover:border-cyan-300 bg-white/5 hover:bg-white/[0.09] text-white cursor-pointer group shadow-inner'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                            photos.length === 0 ? 'bg-white/5 text-slate-600' : 'bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 group-hover:scale-110 group-hover:bg-cyan-400/20'
                          }`}>
                            <Camera className="w-7 h-7" />
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-black tracking-wide block">
                              {photos.length === 0 ? 'KUNCI (FOTO 1 DAHULU)' : 'AMBIL FOTO 2'}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              {photos.length === 0 ? 'Lengkapi foto pertama di sebelah kiri' : 'Kondisi kelas setelah selesai dibersihkan'}
                            </span>
                          </div>
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                {/* SECTION 3: CATATAN & TEMPLATE CEPAT (CHIP QUICK ACTIONS) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider font-mono">
                      <span className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center text-[10px]">3</span>
                      <span>Catatan / Keterangan Tambahan</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Pilih template atau ketik manual</span>
                  </div>

                  {/* Quick Note Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      'Lantai telah disapu & dipel bersih',
                      'Papan tulis & meja guru rapi',
                      'Sampah sudah dibuang ke TPS luar',
                      'Jendela & kaca telah dilap bersih',
                      'Piket pagi terlaksana lengkap'
                    ].map((templateText, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCatatan((prev) => prev ? `${prev}, ${templateText}` : templateText)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-400/20 border border-white/10 hover:border-cyan-400/40 text-[11px] font-semibold text-slate-300 hover:text-cyan-200 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <span>+</span>
                        <span>{templateText}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-white/15 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 rounded-2xl p-3.5 transition-all">
                    <textarea
                      rows="3"
                      placeholder="Tuliskan catatan kondisi kelas, petugas yang hadir, atau hal lainnya di sini..."
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full bg-transparent border-0 text-white font-medium text-xs md:text-sm focus:outline-none placeholder-slate-400 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR DENGAN SUBMIT GLOW */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Laporan tersimpan permanen di arsip absensi & piket sekolah.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || photos.length === 0}
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-2xl cursor-pointer ${
                      photos.length === 0
                        ? 'bg-slate-700/60 text-slate-400 border border-white/10 cursor-not-allowed'
                        : isSubmitting
                        ? 'bg-cyan-700 text-white cursor-wait'
                        : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#082052] shadow-cyan-400/30 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Mengunggah & Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Kirim Laporan Piket Sekarang</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: RIWAYAT & GALERI BUKTI PIKET                      */}
        {/* ======================================================== */}
        {activePageTab === 'riwayat' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Riwayat & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-5 md:p-6 shadow-xl">
              <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-cyan-400" /> Riwayat Piket Kelas
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Lihat timestamp foto, kelas, dan tanggal laporan piket.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari kelas, tanggal, atau catatan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#082052]/80 border border-white/20 rounded-xl text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setActivePageTab('form')}
                  className="hidden sm:flex px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#082052] font-bold text-xs transition items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" /> Submit Piket
                </button>
              </div>
            </div>

            {/* Daftar riwayat menonjolkan data foto, kelas, dan tanggal */}
            <div className="space-y-4">
              {filteredRiwayat.length > 0 ? (
                filteredRiwayat.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/10 hover:bg-white/[0.14] backdrop-blur-xl border border-white/15 hover:border-cyan-400/40 rounded-2xl p-4 md:p-5 transition-all duration-200 shadow-xl group"
                  >
                    <div className="grid gap-5 md:grid-cols-[minmax(0,1.5fr)_minmax(150px,0.8fr)_minmax(140px,0.7fr)_auto] md:items-center">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Timestamp Foto</p>
                        {item.photos?.length > 0 ? (
                          <div className="space-y-2">
                            {item.photos.map((foto, idx) => (
                              <button
                                key={`${item.id}-${idx}`}
                                type="button"
                                onClick={() => setPreviewPhoto(foto)}
                                className="flex w-full items-center gap-3 text-left rounded-xl hover:bg-white/5 transition cursor-pointer"
                                title="Lihat foto bukti"
                              >
                                <img src={foto.url} alt={`Bukti piket ${idx + 1}`} className="w-12 h-12 rounded-lg object-cover border border-white/15 shrink-0" />
                                <span className="min-w-0">
                                  <span className="block text-[10px] text-slate-400">Foto {idx + 1}</span>
                                  <span className="block text-xs text-cyan-200 font-mono">{foto.timestamp}</span>
                                </span>
                                <Eye className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Tidak ada foto bukti</span>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Nama Kelas</p>
                        <h4 className="font-extrabold text-base text-white group-hover:text-cyan-200 transition">{item.namaKelas}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Tanggal</p>
                        <p className="flex items-center gap-2 text-sm text-slate-200 font-mono">
                          <Calendar className="w-4 h-4 text-cyan-400 shrink-0" /> {item.tanggal}
                        </p>
                        <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">{item.status}</span>
                      </div>

                      <div className="md:justify-self-end">
                        <button
                          type="button"
                          onClick={() => setActivePageTab('form')}
                          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#082052] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4" /> Submit Piket
                        </button>
                      </div>
                      {item.catatan && (
                        <p className="md:col-span-4 text-xs text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5 italic">"{item.catatan}"</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-slate-400 space-y-3">
                  <ImageIcon className="w-12 h-12 mx-auto text-slate-500 opacity-60" />
                  <h4 className="text-sm font-bold text-white">Tidak Ada Laporan yang Cocok</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {searchQuery ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada laporan piket yang dikirimkan.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL PREVIEW FOTO BUKTI INTERAKTIF */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#082052] border border-white/20 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-3.5 px-4 border-b border-white/15 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Bukti Foto Piket</h4>
                <p className="text-[10px] text-cyan-300 font-mono">{previewPhoto.timestamp}</p>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-black flex justify-center items-center">
              <img
                src={previewPhoto.url}
                alt="Detail Foto Bukti"
                className="max-h-[60vh] w-auto object-contain rounded-xl border border-white/10 shadow-lg"
              />
            </div>

            <div className="p-3 px-4 bg-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-mono">Timestamp Otomatis Terverifikasi</span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="px-4 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
