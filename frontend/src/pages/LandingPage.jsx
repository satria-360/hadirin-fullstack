import React from 'react';
import { CheckCircle, Clock, Users, BarChart2, QrCode, FileText } from 'lucide-react';
import HeroArtwork from '../components/HeroArtwork';
import LaptopIllustration from '../components/LaptopIllustration';

const stats = [
  { value: '99.9%', label: 'Akurasi Presensi', color: 'text-green-400' },
  { value: '5.000+', label: 'Siswa Terdaftar', color: 'text-blue-400' },
  { value: '50+', label: 'Sekolah Bermitra', color: 'text-red-400' },
];

const highlights = [
  { icon: QrCode, title: 'Scanner QR Code', desc: 'Presensi instan hanya dengan scan kode unik siswa. Akurat dan anti-manipulasi.' },
  { icon: BarChart2, title: 'Rekap Data Real-Time', desc: 'Dashboard analitik kehadiran yang selalu sinkron tanpa perlu refresh manual.' },
  { icon: FileText, title: 'Ekspor Laporan', desc: 'Unduh laporan Excel atau PDF lengkap kapan saja dan di mana saja.' },
  { icon: Clock, title: 'Hemat Waktu', desc: 'Proses absensi yang cepat sehingga tidak memotong waktu pembelajaran.' },
  { icon: Users, title: 'Multi-Pengguna', desc: 'Akses berbeda untuk Admin, Guru, dan Siswa dengan peran yang jelas.' },
  { icon: CheckCircle, title: 'Data Aman', desc: 'Tersimpan aman di cloud, bebas risiko hilang atau rusak seperti buku fisik.' },
];

export default function LandingPage({ onNavigate }) {
  return (
    <div className="w-full text-white overflow-x-hidden">

      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-center py-28 md:py-32 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.03] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left: Hero Copy */}
          <div className="space-y-7 max-w-xl">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/25 text-red-400 text-xs font-semibold px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Platform Absensi Digital #1 Untuk Sekolah
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.12] tracking-tight text-white">
              Cara Modern Untuk{' '}
              <span className="relative">
                <span className="text-shimmer">Mengelola</span>
              </span>{' '}
              Kehadiran Siswa.
            </h1>

            <p className="text-slate-300/85 text-base leading-relaxed max-w-lg">
              Tinggalkan rekap manual di kertas. Catat, pantau, dan buat laporan kehadiran siswa dalam satu aplikasi yang cepat, akurat, dan aman.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-cta-fitur"
                onClick={() => onNavigate && onNavigate('fitur')}
                className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Pelajari Fitur Lengkap
                <span className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">→</span>
              </button>
              <button
                id="hero-cta-login"
                onClick={() => onNavigate && onNavigate('login')}
                className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl hover:bg-white/8 hover:border-white/30 active:scale-[0.98] transition-all duration-200"
              >
                Masuk Sekarang
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero Artwork */}
          <div className="flex justify-center lg:justify-end">
            <HeroArtwork />
          </div>
        </div>
      </section>

      {/* ── 2. FEATURES HIGHLIGHT GRID ─────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 space-y-14">
          {/* Heading */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-red-400 text-sm font-semibold uppercase tracking-widest">Mengapa Hadirin.co?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Semua yang Kamu Butuhkan, <br className="hidden sm:inline" />
              <span className="text-blue-400">Dalam Satu Platform</span>
            </h2>
            <p className="text-slate-300/75 text-sm leading-relaxed">
              Dirancang khusus untuk sekolah, Hadirin.co menghadirkan fitur lengkap yang mudah digunakan oleh guru, admin, maupun siswa.
            </p>
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="glass rounded-2xl p-6 space-y-3 hover:bg-white/[0.09] hover:border-white/20 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-500/20 flex items-center justify-center group-hover:bg-red-600/25 transition-all">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-white font-bold text-base">{title}</h3>
                <p className="text-slate-300/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. DEMO PREVIEW SECTION ────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: Laptop Illustration */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
            <LaptopIllustration />
          </div>

          {/* Right: Copy */}
          <div className="space-y-6 max-w-lg">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Rekap Digital</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Rekap Kehadiran Siswa Lebih Mudah, Akurat, dan Aman.
            </h2>
            <p className="text-slate-300/80 text-sm leading-relaxed">
              Tinggalkan tumpukan buku absen yang rawan rusak atau hilang. Beralih ke rekap digital yang bisa diakses kapan saja, di mana saja — langsung dari laptop atau smartphone.
            </p>

            {/* Feature checklist */}
            <ul className="space-y-3">
              {['Data tersimpan aman di cloud', 'Notifikasi ketidakhadiran otomatis', 'Ekspor PDF & Excel satu klik', 'Akses multi-perangkat (mobile friendly)'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              id="preview-cta-fitur"
              onClick={() => onNavigate && onNavigate('fitur')}
              className="inline-flex items-center gap-2 bg-white text-[#082052] font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Lihat Semua Fitur →
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. CONTACT SECTION ─────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative glass rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              {/* Left */}
              <div className="space-y-5 max-w-md">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Hubungi Kami</h3>
                  <span className="text-2xl text-white/60">↗</span>
                </div>
                <p className="text-slate-300/75 text-sm leading-relaxed">
                  Ada pertanyaan atau ingin demo langsung? Tim kami siap membantu kamu.
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-white font-semibold text-sm">Email</p>
                    <a href="mailto:hadirin.co@gmail.com" className="text-blue-400 text-sm hover:text-blue-300 transition mt-0.5 inline-block">
                      hadirin.co@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Our Office</p>
                    <p className="text-slate-300/70 text-sm mt-0.5 leading-relaxed">
                      Jl. Gede Bage Selatan No.11,<br />
                      Kota Bandung, Jawa Barat, Indonesia 40293
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col gap-3 md:items-end justify-center">
                <button
                  id="contact-cta-login"
                  onClick={() => onNavigate && onNavigate('login')}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm"
                >
                  Coba Gratis Sekarang
                </button>
                <p className="text-white/40 text-xs text-center md:text-right">Tidak perlu kartu kredit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}