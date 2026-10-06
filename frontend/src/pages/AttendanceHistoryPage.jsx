import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ArrowLeft, Eye, Download, X } from 'lucide-react';

function PieChartWithLabels({ data, totalStudents = 0 }) {
    const validStatuses = ['Hadir', 'Izin', 'Sakit', 'Alpha', 'Alpa'];
    const validData = Object.fromEntries(
        Object.entries(data || {}).filter(([key, count]) => validStatuses.includes(key) && count > 0)
    );
    const totalAbsen = Object.values(validData).reduce((a, b) => a + b, 0);

    const colors = {
        Hadir: '#22c55e',
        Izin: '#f59e0b',
        Sakit: '#3b82f6',
        Alpha: '#ef4444',
        Alpa: '#ef4444',
    };

    // Jika tidak ada murid yang diabsen atau tanggal tersebut libur/kosong
    if (totalAbsen === 0) {
        return (
            <div className="relative w-44 h-44 md:w-52 md:h-52">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                    <circle cx="50" cy="50" r="48" fill="#9ca3af" stroke="#ffffff" strokeWidth="1" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                    <span className="text-base md:text-lg font-extrabold text-white drop-shadow-md leading-tight">
                        Libur / Kosong
                    </span>
                    <span className="text-xs md:text-sm font-bold text-white/90 drop-shadow-md mt-0.5">
                        Tidak Ada Absen
                    </span>
                </div>
            </div>
        );
    }

    const activeEntries = Object.entries(validData);

    // Jika semua siswa memiliki 1 status yang sama (misalnya 100% Hadir)
    if (activeEntries.length === 1) {
        const [singleLabel, singleCount] = activeEntries[0];
        const circleColor = colors[singleLabel] || '#22c55e';

        return (
            <div className="relative w-44 h-44 md:w-52 md:h-52">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                    <circle cx="50" cy="50" r="48" fill={circleColor} stroke="#ffffff" strokeWidth="1" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-base md:text-lg font-extrabold text-white drop-shadow-md leading-tight">{singleLabel}</span>
                    <span className="text-xs md:text-sm font-bold text-white drop-shadow-md mt-0.5">{singleCount} Murid</span>
                </div>
            </div>
        );
    }

    let cumulativeAngle = -90;
    const slices = [];
    const labels = [];

    activeEntries.forEach(([label, count]) => {
        const angle = (count / totalAbsen) * 360;
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

        const midAngle = cumulativeAngle + angle / 2;
        const labelRadius = 33;
        const lx = 50 + labelRadius * Math.cos((midAngle * Math.PI) / 180);
        const ly = 50 + labelRadius * Math.sin((midAngle * Math.PI) / 180);

        labels.push(
            <g key={`lbl-${label}`}>
                <text x={lx} y={ly - 1} textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#fff">
                    {label}
                </text>
                <text x={lx} y={ly + 3.5} textAnchor="middle" fontSize="3.8" fontWeight="bold" fill="#fff">
                    {count}
                </text>
            </g>
        );

        cumulativeAngle = endAngle;
    });

    return (
        <div className="relative w-44 h-44 md:w-52 md:h-52">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                {slices}
                {labels}
            </svg>
        </div>
    );
}

export default function AttendanceHistoryPage({ students: initialStudents, historyDate, onBack }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState(initialStudents || []);
    const [loading, setLoading] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const currentDate = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const displayDateObj = historyDate ? new Date(historyDate) : currentDate;
    const formattedDate = `${days[displayDateObj.getDay()]}, ${displayDateObj.getDate()} ${months[displayDateObj.getMonth()]} ${displayDateObj.getFullYear()}`;

    useEffect(() => {
        if (!historyDate) {
            setStudents(initialStudents || []);
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/attendance/history/${historyDate}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudents(Array.isArray(data) ? data : []);
                } else {
                    setStudents([]);
                }
            } catch (err) {
                console.error('Gagal ambil riwayat absensi:', err);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [historyDate, initialStudents]);

    const stats = students.reduce((acc, s) => {
        const st = s.status || '';
        acc[st] = (acc[st] || 0) + 1;
        return acc;
    }, {});

    const filteredStudents = [...students]
        .sort((a, b) => (a.full_name || a.name || '').localeCompare(b.full_name || b.name || '', 'id', { sensitivity: 'base' }))
        .map((s, idx) => ({
            ...s,
            noUrut: String(idx + 1).padStart(2, '0')
        }))
        .filter(s =>
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
            'Tanggal': formattedDate,
            'No Absen': s.noUrut || String(idx + 1).padStart(2, '0'),
            'Nama Siswa': s.full_name || '-',
            'NIS': s.noAbsen || '-',
            'Status Kehadiran': s.status || 'Belum Absen'
        }));

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi');
        XLSX.writeFile(wb, `Riwayat_Absensi_${historyDate || new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const openDetailModal = (student) => {
        setSelectedStudent(student);
        setShowDetailModal(true);
    };

    return (
        <div className="min-h-screen bg-[#082052] text-white p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto relative">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
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

            {/* STATISTIK PIE CHART DENGAN LABEL */}
            <div className="mb-10">
                <h2 className="text-lg font-bold mb-4">Persentase Kehadiran:</h2>
                <div className="flex justify-end">
                    {loading ? (
                        <div className="w-44 h-44 md:w-52 md:h-52 flex items-center justify-center text-xs text-gray-300">Memuat...</div>
                    ) : (
                        <PieChartWithLabels data={stats} />
                    )}
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
            <div className="bg-[#F8F3ED] text-[#082052] rounded-3xl overflow-hidden shadow-2xl border border-[#E4D8CE] mb-6">
                <div className="grid grid-cols-12 px-6 md:px-8 py-3.5 font-bold text-xs text-gray-700 border-b border-[#D7C7B7]/60">
                    <div className="col-span-2 min-w-0">No Absen</div>
                    <div className="col-span-5 min-w-0">Nama Siswa</div>
                    <div className="col-span-3 text-center">Keterangan</div>
                    <div className="col-span-2 text-right pr-2">Detail</div>
                </div>

                <div className="divide-y divide-[#D7C7B7]/50">
                    {loading ? (
                        <div className="p-8 text-center text-xs text-gray-500">Memuat data riwayat...</div>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                            <div key={student.id || index} className="grid grid-cols-12 items-center px-6 md:px-8 py-4 text-sm hover:bg-[#efe7dd] transition">
                                <div className="col-span-2 min-w-0 text-base md:text-lg font-bold text-[#082052] tracking-tight truncate whitespace-nowrap">
                                    {student.noUrut || String(index + 1).padStart(2, '0')}
                                </div>

                                <div className="col-span-5 min-w-0">
                                    <h3 className="font-extrabold text-[#082052] text-sm md:text-base leading-snug truncate">{student.full_name || student.name}</h3>
                                    <p className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5 break-all">NIS: {student.noAbsen || '-'}</p>
                                </div>

                                {/* Badge Status Berwarna Sesuai Mockup */}
                                <div className="col-span-3 flex justify-center">
                                    <span className={`px-8 py-2 rounded-full text-xs font-bold min-w-[120px] text-center ${getStatusColor(student.status)}`}>
                                        {student.status || '—'}
                                    </span>
                                </div>

                                {/* Tombol Lihat Detail Surat */}
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={() => openDetailModal(student)}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#082052]/15 bg-white/90 text-[#082052] hover:bg-white text-[11px] font-bold transition cursor-pointer shadow-sm active:scale-95"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-xs text-gray-500">Tidak ada data siswa pada tanggal ini.</div>
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

            {/* MODAL DETAIL SURAT IZIN/SAKIT */}
            {showDetailModal && selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#F8F3ED] text-[#082052] w-full max-w-md rounded-3xl shadow-2xl relative border border-[#E4D8CE] overflow-hidden">

                        {/* Header Modal */}
                        <div className="p-6 border-b border-[#D7C7B7]/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-extrabold tracking-tight">Detail Kehadiran</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedStudent.full_name}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-8 h-8 rounded-full bg-[#082052] text-white flex items-center justify-center hover:bg-[#0c2e73] transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 space-y-4">
                            {/* Info Dasar */}
                            <div className="grid grid-cols-2 gap-3 text-xs bg-white/70 p-3.5 rounded-2xl border border-[#E4D8CE]">
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">Status Kehadiran:</span>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white font-bold text-xs ${getStatusColor(selectedStudent.status)}`}>
                                        {selectedStudent.status || 'Belum Absen'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-semibold mb-1">No Absen / NIS:</span>
                                    <span className="block font-bold text-sm text-[#082052]">{selectedStudent.noAbsen || '-'}</span>
                                </div>
                            </div>

                            {/* Catatan / Keterangan tambahan jika ada */}
                            {selectedStudent.notes && (
                                <div className="text-xs bg-white/70 p-3 rounded-2xl border border-[#E4D8CE]">
                                    <span className="block text-gray-500 font-semibold mb-0.5">Keterangan:</span>
                                    <p className="font-semibold text-[#082052]">{selectedStudent.notes}</p>
                                </div>
                            )}

                            {/* Bukti Foto (Surat Keterangan) */}
                            <div>
                                <span className="block text-xs font-bold text-[#082052] uppercase tracking-wide mb-2">
                                    Bukti Surat Keterangan:
                                </span>
                                {selectedStudent.proof_url ? (
                                    <div className="rounded-2xl overflow-hidden border border-[#DDD3C7] bg-white shadow-inner p-2 flex flex-col items-center justify-center min-h-[140px]">
                                        <img
                                            src={selectedStudent.proof_url}
                                            alt="Surat Keterangan"
                                            className="w-full max-h-[300px] object-contain rounded-xl"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const fallback = e.target.parentElement.querySelector('.broken-img-alert');
                                                if (fallback) fallback.style.display = 'block';
                                            }}
                                        />
                                        <div style={{ display: 'none' }} className="broken-img-alert p-4 text-center text-xs text-amber-800 bg-amber-50 rounded-xl border border-amber-200">
                                            ⚠️ Berkas surat ini diunggah sebelum upgrade tipe kolom database (terpotong oleh batas 64KB MySQL). Silakan unggah ulang surat keterangan di absensi hari ini.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white/60 border border-dashed border-gray-300 rounded-2xl p-6 text-center">
                                        <p className="text-xs text-gray-500 italic">
                                            Tidak ada bukti surat untuk siswa ini.<br />
                                            (Bukti surat biasanya diunggah untuk status <strong>Izin</strong> atau <strong>Sakit</strong>)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-6 pt-0">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full py-3 rounded-xl bg-[#082052] text-white text-xs font-bold hover:bg-[#0c2e73] transition cursor-pointer active:scale-98"
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