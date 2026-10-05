import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import AddStudentToPiketModal from '../components/AddStudentToPiketModal';

export default function AddPiketStudentPage({ currentUser, onBack, onPiketAssigned }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // State untuk Modal Overlay Kanan
    const [showAddModal, setShowAddModal] = useState(false);
    const [targetStudent, setTargetStudent] = useState(null);

    useEffect(() => {
        fetchClassStudents();
    }, []);

    const fetchClassStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/picket/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStudents(Array.isArray(data) ? data : []);
            } else {
                setStudents([]);
            }
        } catch (err) {
            console.error('Gagal ambil data siswa:', err);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = (student) => {
        setTargetStudent(student);
        setShowAddModal(true);
    };

    const handleConfirmAddToPiket = async (day) => {
        if (!targetStudent) return;

        try {
            const token = localStorage.getItem('token');
            // Panggil endpoint backend untuk update picket_day siswa
            const response = await fetch(`http://localhost:5000/api/students/${targetStudent.id}/update-piket-day`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ picket_day: day })
            });

            if (response.ok) {
                // Update local state agar UI langsung reflektif
                setStudents(prev => prev.map(s =>
                    s.id === targetStudent.id ? { ...s, picket_day: day } : s
                ));

                // Callback ke parent (DashboardPage) jika perlu sinkronisasi
                if (onPiketAssigned) {
                    onPiketAssigned({ ...targetStudent, picketDay: day });
                }
                return true;
            } else {
                throw new Error('Gagal update ke server.');
            }
        } catch (err) {
            console.error('Gagal update jadwal piket:', err);
            throw err;
        }
    };

    const filteredStudents = students.filter(s =>
        (s.full_name && s.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.noAbsen && String(s.noAbsen).includes(searchQuery)) ||
        (s.id && String(s.id).includes(searchQuery))
    );

    return (
        <div className="min-h-screen bg-[#082052] text-white font-sans relative">

            {/* HEADER HALAMAN */}
            <div className="sticky top-0 z-40 bg-[#082052]/95 backdrop-blur-md border-b border-white/10 px-6 md:px-10 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                        title="Kembali ke Pengaturan"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Tambah Daftar Siswa Piket</h1>
                        <p className="text-xs text-gray-300 mt-0.5">XII RPL 2</p>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari nama/NIS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-[#122b68] border border-white/20 rounded-full text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white/50 w-56"
                    />
                </div>
            </div>

            {/* KONTEN UTAMA */}
            <main className="p-6 md:p-10 max-w-5xl mx-auto">

                {/* TABEL DAFTAR SISWA */}
                <div className="bg-[#F8F3ED] text-[#082052] rounded-3xl overflow-hidden shadow-2xl border border-[#E4D8CE]">
                    <div className="grid grid-cols-12 px-6 md:px-8 py-3.5 font-bold text-xs text-gray-700 border-b border-[#D7C7B7]/60">
                        <div className="col-span-2 min-w-0">No Absen</div>
                        <div className="col-span-6 min-w-0">Nama Siswa</div>
                        <div className="col-span-4 text-right pr-2">Keterangan</div>
                    </div>

                    <div className="divide-y divide-[#D7C7B7]/50">
                        {loading ? (
                            <div className="p-8 text-center text-xs text-gray-500">Memuat data siswa...</div>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                                <div key={student.id || index} className="grid grid-cols-12 items-center px-6 md:px-8 py-4 text-sm hover:bg-[#efe7dd] transition">
                                    <div className="col-span-2 min-w-0 text-base md:text-lg font-bold text-[#082052] tracking-tight truncate whitespace-nowrap">
                                        {student.noUrut || String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="col-span-6 min-w-0">
                                        <h3 className="font-extrabold text-[#082052] text-sm md:text-base leading-snug truncate">{student.full_name}</h3>
                                        <p className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5 break-all">NIS: {student.noAbsen || '-'}</p>
                                    </div>

                                    <div className="col-span-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => openAddModal(student)}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#082052]/15 bg-white/90 text-[#082052] text-[11px] font-bold hover:bg-white transition cursor-pointer shadow-sm"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Tambah Siswa Ke Jadwal Piket
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-gray-500">Belum ada siswa terdaftar.</div>
                        )}
                    </div>
                </div>
            </main>

            {/* OVERLAY MODAL TAMBAH KE JADWAL PIKET (KANAN) */}
            {showAddModal && (
                <AddStudentToPiketModal
                    student={targetStudent}
                    onClose={() => { setShowAddModal(false); setTargetStudent(null); }}
                    onConfirm={handleConfirmAddToPiket}
                />
            )}
        </div>
    );
}