import React from 'react';
import { GitBranch, BriefcaseBusiness, Code2, Zap, Target, Heart } from 'lucide-react';

const TEAM = [
  { name: 'Satria Pramudya', role: 'Full-Stack Developer & Project Lead', initials: 'SP', color: 'from-blue-600 to-blue-800', github: '#', linkedin: '#' },
  { name: 'Anggota 2', role: 'Backend Developer', initials: 'A2', color: 'from-red-600 to-red-800', github: '#', linkedin: '#' },
  { name: 'Anggota 3', role: 'Frontend Developer', initials: 'A3', color: 'from-purple-600 to-purple-800', github: '#', linkedin: '#' },
  { name: 'Anggota 4', role: 'UI/UX Designer', initials: 'A4', color: 'from-green-600 to-green-800', github: '#', linkedin: '#' },
  { name: 'Anggota 5', role: 'Database Engineer', initials: 'A5', color: 'from-yellow-600 to-yellow-800', github: '#', linkedin: '#' },
  { name: 'Anggota 6', role: 'QA & Testing', initials: 'A6', color: 'from-teal-600 to-teal-800', github: '#', linkedin: '#' },
];

const VALUES = [
  { icon: Code2, title: 'Teknologi Terdepan', desc: 'Memanfaatkan stack modern untuk performa terbaik.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Zap, title: 'Efisiensi Pertama', desc: 'Setiap fitur dirancang untuk menghemat waktu guru dan admin.', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { icon: Target, title: 'Akurasi Data', desc: 'Sistem presensi yang bebas dari manipulasi dan kesalahan hitung.', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { icon: Heart, title: 'Peduli Pendidikan', desc: 'Kami percaya transformasi pendidikan dimulai dari teknologi.', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
];

export default function TentangPage() {
  return (
    <div className="w-full text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="min-h-[60vh] flex items-center py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-32 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text */}
            <div className="flex-1 max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/25 text-red-400 text-xs font-semibold px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Tentang Kami
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.12] tracking-tight">
                Dari Keresahan<br />
                <span className="text-red-400">Lahir Solusi.</span>
              </h1>
              <p className="text-slate-300/80 text-base leading-relaxed">
                Berawal dari keresahan kecil tentang rekap absensi,{' '}
                <strong className="text-white font-semibold">RekaEnam</strong> lahir dengan satu misi: membuat sistem absensi yang masih manual menjadi jauh lebih mudah.
              </p>
              <p className="text-slate-300/70 text-sm leading-relaxed">
                Kami berkomitmen untuk memberikan hasil terbaik dalam setiap tahap pengembangan. Kami percaya bahwa transformasi dan kemajuan pendidikan dimulai dari kesadaran dan penguasaan teknologi.
              </p>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 glass rounded-xl px-5 py-3 text-sm text-white/75 font-medium">
                🎓 Dibuat oleh siswa <strong className="text-white">SMKN 4 Bandung</strong> jurusan RPL
              </div>
            </div>

            {/* Right: Stats visual */}
            <div className="flex-1 grid grid-cols-2 gap-4 max-w-sm">
              {[
                { val: '6', label: 'Anggota Tim', sub: 'RekaEnam', color: 'border-l-red-500' },
                { val: '99.9%', label: 'Akurasi Presensi', sub: 'Terverifikasi', color: 'border-l-blue-500' },
                { val: '1 Tahun', label: 'Pengembangan', sub: 'Aktif', color: 'border-l-green-500' },
                { val: '50+', label: 'Target Sekolah', sub: 'Mitra', color: 'border-l-yellow-500' },
              ].map((s) => (
                <div key={s.label} className={`glass rounded-2xl p-5 border-l-4 ${s.color} space-y-1`}>
                  <p className="text-2xl font-extrabold text-white">{s.val}</p>
                  <p className="text-white/80 text-xs font-medium">{s.label}</p>
                  <p className="text-white/40 text-[10px]">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NILAI / VALUES ──────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="text-center space-y-2">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest">Nilai Kami</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Yang Mendorong Kami Maju</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={`glass rounded-2xl p-6 space-y-3 border ${bg} hover:scale-[1.02] transition-all duration-300`}>
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="text-white font-bold text-sm">{title}</h3>
                <p className="text-white/55 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIM ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="text-center space-y-2">
            <p className="text-red-400 text-xs font-semibold uppercase tracking-widest">Tim Pengembang</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Kenali Tim RekaEnam</h2>
            <p className="text-slate-300/65 text-sm">Enam siswa RPL SMKN 4 Bandung yang membangun Hadirin.co dari nol.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="glass rounded-2xl p-6 space-y-4 hover:bg-white/[0.09] hover:border-white/20 transition-all duration-300 group"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-black text-base shadow-lg flex-shrink-0`}>
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{member.name}</p>
                    <p className="text-white/50 text-xs">{member.role}</p>
                  </div>
                </div>

                {/* Socials */}
                <div className="flex gap-2 pt-1">
                  <a
                    href={member.github}
                    aria-label={`GitHub ${member.name}`}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                  <a
                    href={member.linkedin}
                    aria-label={`LinkedIn ${member.name}`}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/25 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <BriefcaseBusiness className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}