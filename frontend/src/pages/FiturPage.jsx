import React, { useEffect, useState } from 'react';
import { Search, QrCode, BarChart2, FileText, Clock, Users, CheckCircle, X, Download, ScanLine } from 'lucide-react';
import HeroImg from '../assets/hero-artwork.png';
import LaptopImg from '../assets/laptop.png';

const ALL_FEATURES = [
  {
    id: 1,
    category: 'Presensi QR',
    title: 'Scanner QR Code Otomatis',
    description: 'Proses absensi instan hanya dengan scan kode QR unik setiap siswa. Akurat, cepat, dan bebas manipulasi.',
    icon: QrCode,
    img: HeroImg,
    color: 'from-red-600/20 to-red-900/10',
    badge: 'Presensi QR',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/25',
  },
  {
    id: 2,
    category: 'Rekap Data',
    title: 'Data Kehadiran Real-Time',
    description: 'Dashboard analitik yang selalu sinkron. Pantau rekap kehadiran semua kelas dari satu layar tanpa refresh manual.',
    icon: BarChart2,
    img: LaptopImg,
    color: 'from-blue-600/20 to-blue-900/10',
    badge: 'Rekap Data',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/25',
  },
  {
    id: 3,
    category: 'Rekap Data',
    title: 'Ekspor Laporan Excel & PDF',
    description: 'Unduh laporan kehadiran lengkap dalam format Excel atau PDF dengan satu klik. Formatnya rapi dan siap cetak.',
    icon: FileText,
    img: HeroImg,
    color: 'from-green-600/20 to-green-900/10',
    badge: 'Rekap Data',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/25',
  },
  {
    id: 4,
    category: 'Akses Keamanan',
    title: 'Akses Multi-Peran',
    description: 'Level akses berbeda untuk Admin, Guru, dan Siswa. Setiap peran memiliki dashboard dan izin yang sesuai.',
    icon: Users,
    img: LaptopImg,
    color: 'from-purple-600/20 to-purple-900/10',
    badge: 'Akses Keamanan',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/25',
  },
  {
    id: 5,
    category: 'Presensi QR',
    title: 'Notifikasi Ketidakhadiran',
    description: 'Sistem otomatis mengirim notifikasi ke wali kelas saat siswa tidak hadir tanpa perlu pengecekan manual.',
    icon: Clock,
    img: HeroImg,
    color: 'from-yellow-600/20 to-yellow-900/10',
    badge: 'Presensi QR',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/25',
  },
  {
    id: 6,
    category: 'Akses Keamanan',
    title: 'Data Aman di Cloud',
    description: 'Semua data kehadiran tersimpan aman dan terenkripsi. Tidak ada lagi risiko buku absen hilang atau rusak.',
    icon: CheckCircle,
    img: LaptopImg,
    color: 'from-teal-600/20 to-teal-900/10',
    badge: 'Akses Keamanan',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/25',
  },
];

const CATEGORIES = ['Semua', 'Presensi QR', 'Rekap Data', 'Akses Keamanan'];

// QR Demo Modal
function QrDemoModal({ onClose }) {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(true); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-[#0d1f4a] border border-white/15 rounded-3xl p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-5">
          <div className="space-y-1">
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Simulasi Demo</p>
            <h3 className="text-white text-xl font-bold">Scanner QR Code</h3>
          </div>

          {/* QR Preview */}
          <div className="relative mx-auto w-48 h-48 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
            {scanned ? (
              <div className="text-center space-y-2 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-green-400 font-bold text-sm">Presensi Berhasil!</p>
                <p className="text-white/60 text-xs">Andini Rahayu · XII RPL 1</p>
              </div>
            ) : scanning ? (
              <div className="text-center space-y-2">
                <ScanLine className="w-10 h-10 text-blue-400 mx-auto animate-pulse" />
                <p className="text-blue-400 text-xs font-medium">Memindai...</p>
                {/* Scan line animation */}
                <div className="absolute inset-x-4 h-0.5 bg-blue-400 blur-sm animate-bounce" style={{ top: '40%' }} />
              </div>
            ) : (
              <div className="text-center space-y-2">
                <QrCode className="w-12 h-12 text-white/30 mx-auto" />
                <p className="text-white/40 text-xs">Tekan tombol untuk scan</p>
              </div>
            )}

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-red-400 rounded-tl" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-red-400 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-red-400 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-red-400 rounded-br" />
          </div>

          <button
            onClick={scanned ? () => { setScanned(false); setScanning(false); } : handleScan}
            disabled={scanning}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              scanned
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : scanning
                ? 'bg-blue-600/50 text-white/60 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {scanned ? '↺ Scan Ulang' : scanning ? 'Memindai...' : 'Simulasi Scan QR'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Export Demo Modal
function ExportModal({ onClose }) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(null);

  const handleExport = (type) => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setDone(type); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-[#0d1f4a] border border-white/15 rounded-3xl p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Simulasi Demo</p>
            <h3 className="text-white text-xl font-bold">Ekspor Laporan</h3>
          </div>

          {/* Preview table */}
          <div className="rounded-xl overflow-hidden border border-white/10 text-xs">
            <div className="grid grid-cols-4 bg-white/10 text-white/60 font-semibold">
              <div className="px-3 py-2">Nama</div>
              <div className="px-3 py-2">Kelas</div>
              <div className="px-3 py-2">Hadir</div>
              <div className="px-3 py-2">Alpha</div>
            </div>
            {[['Andini R.', 'XII RPL 1', '22', '0'], ['Bagas P.', 'XII RPL 1', '20', '2'], ['Citra M.', 'XII RPL 1', '21', '1']].map(([n, k, h, a]) => (
              <div key={n} className="grid grid-cols-4 border-t border-white/5 text-white/75">
                <div className="px-3 py-2">{n}</div>
                <div className="px-3 py-2">{k}</div>
                <div className="px-3 py-2 text-green-400">{h}</div>
                <div className="px-3 py-2 text-red-400">{a}</div>
              </div>
            ))}
          </div>

          {done ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              File {done} berhasil diunduh!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleExport('Excel')}
                disabled={exporting}
                className="flex items-center justify-center gap-2 bg-green-700/80 hover:bg-green-600 text-white text-sm font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting ? '...' : 'Excel'}
              </button>
              <button
                onClick={() => handleExport('PDF')}
                disabled={exporting}
                className="flex items-center justify-center gap-2 bg-red-700/80 hover:bg-red-600 text-white text-sm font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting ? '...' : 'PDF'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FiturPage() {
  const [apiFitur, setApiFitur] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [qrModal, setQrModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/fitur')
      .then((res) => res.json())
      .then((data) => setApiFitur(data))
      .catch(() => {});
  }, []);

  const features = apiFitur.length > 0
    ? apiFitur.map((f, i) => ({ ...ALL_FEATURES[i % ALL_FEATURES.length], ...f }))
    : ALL_FEATURES;

  const filtered = features.filter((f) => {
    const matchCat = activeCategory === 'Semua' || f.category === activeCategory;
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full min-h-screen text-white overflow-x-hidden">

      {qrModal && <QrDemoModal onClose={() => setQrModal(false)} />}
      {exportModal && <ExportModal onClose={() => setExportModal(false)} />}

      {/* ── TOP ARCH SECTION ── */}
      <div className="flex flex-col items-center">
        <section
          className="w-full bg-red-600 pt-14 pb-52 px-6 text-center relative overflow-hidden"
          style={{ borderRadius: '140px 140px 0 0' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-transparent pointer-events-none" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <p className="text-red-200 text-xs font-semibold uppercase tracking-widest">Fitur Unggulan</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Didesain untuk Mempermudah Hidupmu.
            </h1>
            <p className="text-red-100/85 text-sm leading-relaxed max-w-lg mx-auto">
              Jelajahi berbagai fitur unggulan yang dirancang khusus untuk membantu kamu bekerja lebih cepat, efisien, dan tanpa ribet.
            </p>

            {/* Quick Demo Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <button
                id="fitur-demo-qr"
                onClick={() => setQrModal(true)}
                className="flex items-center gap-2 bg-white text-red-600 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all hover:scale-[1.02] shadow-lg"
              >
                <QrCode className="w-4 h-4" />
                Demo QR Scanner
              </button>
              <button
                id="fitur-demo-export"
                onClick={() => setExportModal(true)}
                className="flex items-center gap-2 bg-red-800/50 border border-white/20 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-red-700/60 transition-all"
              >
                <Download className="w-4 h-4" />
                Demo Ekspor
              </button>
            </div>
          </div>
        </section>

        {/* ── SECOND ARCH SECTION ── */}
        <section
          className="w-full bg-gradient-to-b from-red-700 via-[#8b0000] to-[#3d0204] -mt-36 pt-8 pb-24 px-6 md:px-12 relative z-10 flex flex-col items-center"
          style={{ borderRadius: '140px 140px 0 0' }}
        >
          {/* Search & Filter Bar */}
          <div className="w-full max-w-4xl mx-auto pt-6 space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="fitur-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari fitur..."
                className="w-full bg-white/[0.08] border border-white/15 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/35 focus:outline-none focus:border-white/30 focus:bg-white/[0.12] transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`fitur-cat-${cat.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                    activeCategory === cat
                      ? 'bg-white text-red-700 border-transparent shadow-md'
                      : 'bg-white/[0.07] border-white/15 text-white/70 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="space-y-10 pt-4">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-white/40 text-sm">
                  Tidak ada fitur yang cocok dengan pencarian "{search}".
                </div>
              ) : (
                filtered.map((item, index) => {
                  const isEven = index % 2 === 0;
                  const Icon = item.icon || QrCode;
                  return (
                    <div
                      key={item.id || index}
                      className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 ${!isEven ? 'md:flex-row-reverse' : ''}`}
                    >
                      {/* Image side */}
                      <div className="w-full md:w-1/2 flex justify-center">
                        <div className={`relative w-full max-w-[360px] h-52 md:h-60 rounded-2xl overflow-hidden bg-gradient-to-br ${item.color || 'from-white/5 to-white/0'} border border-white/15 shadow-2xl`}>
                          <img
                            src={item.img || HeroImg}
                            alt={item.title}
                            className="w-full h-full object-cover mix-blend-luminosity opacity-70"
                          />
                          {/* Overlay badge */}
                          <div className="absolute bottom-4 left-4">
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${item.badgeColor || 'bg-white/20 text-white border-white/20'}`}>
                              {item.badge || item.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Text side */}
                      <div className="w-full md:w-1/2 space-y-3 px-2 md:px-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white/80" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-white leading-snug">{item.title}</h3>
                        <p className="text-red-100/75 text-sm leading-relaxed max-w-sm">{item.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Contact Card */}
            <div className="pt-14">
              <div className="w-full bg-white/[0.07] backdrop-blur-md border border-white/12 rounded-2xl p-7 md:p-9 space-y-4 shadow-xl">
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  Hubungi Kami <span className="text-lg opacity-60">↗</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-white text-sm">Email</p>
                    <a href="mailto:hadirin.co@gmail.com" className="text-red-300 hover:text-red-200 transition mt-1 inline-block">hadirin.co@gmail.com</a>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Our Office</p>
                    <p className="text-red-100/65 mt-1 leading-relaxed">Jl. Gede Bage Selatan No.11, Kota Bandung, Jawa Barat 40293</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}