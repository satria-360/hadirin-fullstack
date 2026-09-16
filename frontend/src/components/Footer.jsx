import React from 'react';
import { Github, Twitter, Instagram, Mail, ArrowUpRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Tentang Kami', key: 'tentang' },
  { label: 'Fitur Utama', key: 'fitur' },
  { label: 'Masuk', key: 'login' },
];

const SOCIALS = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:hadirin.co@gmail.com', label: 'Email' },
];

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full border-t border-white/[0.07] bg-[#06193d]/60 backdrop-blur mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <button
              onClick={() => onNavigate && onNavigate('landing')}
              className="text-2xl font-black text-white tracking-tight hover:opacity-80 transition"
            >
              Hadirin<span className="text-red-400">.co</span>
            </button>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Platform absensi digital modern untuk sekolah. Dibuat oleh siswa SMKN 4 Bandung, jurusan RPL — Tim RekaEnam.
            </p>
            <div className="flex gap-2 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Navigasi</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.key)}
                    className="text-white/60 text-sm hover:text-white transition-all flex items-center gap-1.5 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">Kontak</p>
            <div className="space-y-3 text-sm text-white/60">
              <div>
                <p className="text-white/80 font-medium text-xs mb-0.5">Email</p>
                <a href="mailto:hadirin.co@gmail.com" className="hover:text-blue-400 transition">hadirin.co@gmail.com</a>
              </div>
              <div>
                <p className="text-white/80 font-medium text-xs mb-0.5">Alamat</p>
                <p className="leading-relaxed">Jl. Gede Bage Selatan No.11,<br />Kota Bandung, Jawa Barat 40293</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>© 2025 Hadirin.co · Tim RekaEnam · SMKN 4 Bandung</p>
          <p>Semua hak dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  );
}