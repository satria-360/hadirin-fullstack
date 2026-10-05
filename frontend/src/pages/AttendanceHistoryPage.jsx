import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { ArrowLeft, Eye, Download } from 'lucide-react';

function SimplePieChart({ data }) {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    const colors = {
        Hadir: '#10b981',
        Izin: '#f59e0b',
        Sakit: '#3b82f6',
        Alpha: '#ef4444',
        Alpa: '#ef4444',
    };

    let cumulativeAngle = -90;
    const slices = [];

    Object.entries(data).forEach(([label, count]) => {
        if (count === 0) return;
        const angle = (count / total) * 360;
        const endAngle = cumulativeAngle + angle;

        const x1 = 50 + 50 * Math.cos((cumulativeAngle * Math.PI) / 180);
        const y1 = 50 + 50 * Math.sin((cumulativeAngle * Math.PI) / 180);
        const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
        ].join(' ');

        slices.push(
            <path key={label} d={pathData} fill={colors[label] || '#ccc'} stroke="#fff" strokeWidth="0.5" />
        );

        cumulativeAngle = endAngle;
    });

    const hadirCount = data.Hadir || 0;

    return (
        <div className="relative w-40 h-40 md:w-48 md:h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                {slices}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
                <span className="text-sm font-bold">Hadir</span>
                <span className="text-xs">{hadirCount} Murid</span>
            </div>
        </div>
    );
}

export default function AttendanceHistoryPage({ students, onBack }) {
    const [searchQuery, setSearchQuery] = useState('');
    const currentDate = new Date();

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formattedDate = `${days[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const stats = students.reduce((acc, s) => {
        const st = s.status || '';
        acc[st] = (acc[st] || 0) + 1;
        return acc;
    }, {});

    const filteredStudents = students.filter(s =>
        (s.full_name && s.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.noAbsen && String(s.noAbsen).includes(searchQuery)) ||
        (s.id && String(s.id).includes(searchQuery))
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Hadir': return 'bg-emerald-500 text-white';
            case 'Izin': return 'bg-amber-500 text-white';
            case 'Sakit': return 'bg-blue-600 text-white';
            case 'Alpha': return 'bg-rose-600 text-white';
            case 'Alpa': return 'bg-rose-600 text-white';
            default: return 'bg-gray-300 text-gray-700';
        }
    };

    const handleExportExcel = () => {
        const worksheetData = students.map((s, idx) => ({
            'No Absen': s.noUrut || String(idx + 1).padStart(2, '0'),
            'Nama Siswa': s.full_name || '-',
            'NIS': s.noAbsen || '-',
            'Status Kehadiran': s.status || 'Belum Absen'
        }));

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi');
        XLSX.writeFile(wb, `Riwayat_Absensi_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="min-h-screen bg-[#082052] text-white p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Riwayat Absensi</h1>
                    <p className="text-gray-300 text-sm mt-1">{formattedDate}</p>
                </div>

                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-bold transition cursor-pointer shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali Ke Dashboard
                </button>
            </div>

            {/* STATISTIK PIE CHART */}
            <div className="mb-10">
                <h2 className="text-lg font-bold mb-4">Persentase Kehadiran:</h2>
                <div className="flex justify-end">
                    <SimplePieChart data={stats} />
                </div>
            </div>

            {/* SEARCH BAR */}
            <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                    type="text"
                    placeholder="Cari nama/NIS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#122b68] border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
                />
            </div>

            {/* TABEL DAFTAR SISWA */}
            <div className="bg-[#F8F3ED] text-[#082052] rounded-3xl overflow-hidden shadow-2xl border border-[#E4D8CE] mb-8">
                <div className="grid grid-cols-12 px-6 md:px-8 py-3.5 font-bold text-xs text-gray-700 border-b border-[#D7C7B7]/60">
                    <div className="col-span-2 min-w-0">No Absen</div>
                    <div className="col-span-5 min-w-0">Nama Siswa</div>
                    <div className="col-span-3 text-center">Keterangan</div>
                    <div className="col-span-2 text-right pr-2">Detail</div>
                </div>

                <div className="divide-y divide-[#D7C7B7]/50">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                            <div key={student.id || index} className="grid grid-cols-12 items-center px-6 md:px-8 py-4 text-sm hover:bg-[#efe7dd] transition">
                                <div className="col-span-2 min-w-0 text-base md:text-lg font-bold text-[#082052] tracking-tight truncate whitespace-nowrap">
                                    {student.noUrut || String(index + 1).padStart(2, '0')}
                                </div>

                                <div className="col-span-5 min-w-0">
                                    <h3 className="font-extrabold text-[#082052] text-sm md:text-base leading-snug truncate">{student.full_name || student.name}</h3>
                                    <p className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5 break-all">NIS: {student.noAbsen || '-'}</p>
                                </div>

                                <div className="col-span-3 flex justify-center">
                                    <span className={`px-6 py-2 rounded-full text-xs font-bold ${getStatusColor(student.status)}`}>
                                        {student.status || '—'}
                                    </span>
                                </div>

                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={() => alert(`Detail kehadiran untuk ${student.full_name}: Status=${student.status}, NIS=${student.noAbsen}`)}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#082052]/15 bg-white/90 text-[#082052] text-[11px] font-bold hover:bg-white transition cursor-pointer shadow-sm"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-xs text-gray-500">Tidak ada data siswa ditemukan.</div>
                    )}
                </div>
            </div>

            {/* TOMBOL EKSPOR BAWAH */}
            <button
                onClick={handleExportExcel}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-white/20 bg-[#0d2761]/60 hover:bg-[#0d2761] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
                <Download className="w-4 h-4" />
                Ekspor Rekapan Absen
            </button>
        </div>
    );
}