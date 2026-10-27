import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function AddStudentToPiketModal({ student, onClose, onConfirm }) {
    const [selectedDay, setSelectedDay] = useState('Senin');
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    if (!student) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(selectedDay);
            setShowSuccess(true);
        } catch (err) {
            alert('Gagal menyimpan jadwal piket: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── NOTIFIKASI SUKSES ──────────────────────────────────────────────────────
    if (showSuccess) {
        return createPortal(
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                <div style={{ background: '#fff', width: '100%', maxWidth: '320px', borderRadius: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    {/* Icon centang */}
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(to bottom, #0e3b91, #082052)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 20px rgba(8,32,82,0.3)' }}>
                        <div style={{ width: 32, height: 32, background: '#fbf5eb', borderRadius: 8, transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 32, height: 32, background: '#fbf5eb', borderRadius: 8, transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#082052" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#111', margin: '0 0 6px' }}>Berhasil Dipindahkan!</h3>
                    <p style={{ fontSize: 12, color: '#555', margin: '0 0 4px' }}>
                        <strong style={{ color: '#082052' }}>{student.full_name}</strong> dijadwalkan piket hari{' '}
                        <strong style={{ color: '#D6A143' }}>{selectedDay}</strong>.
                    </p>
                    <p style={{ fontSize: 11, color: '#999', marginBottom: 24 }}>Kembali ke pengaturan jika ada data yang salah.</p>

                    <button
                        onClick={() => { setShowSuccess(false); onClose(); }}
                        style={{ width: '100%', padding: '12px', background: 'linear-gradient(to bottom, #0e3b91, #082052)', color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(8,32,82,0.3)' }}
                    >
                        Oke
                    </button>
                </div>
            </div>,
            document.body
        );
    }

    // ── FORM PILIH HARI — dirender ke document.body via Portal ────────────────
    return createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '360px', borderRadius: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#082052' }}>Atur Jadwal Piket</h3>
                    <button
                        onClick={onClose}
                        style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
                    >
                        <X size={14} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Info siswa */}
                    <div style={{ background: '#F8F3ED', borderRadius: 16, padding: '12px 16px', border: '1px solid #E4D8CE' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 10, color: '#9ca3af' }}>Siswa Dipilih:</p>
                        <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#082052' }}>{student.full_name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>NIS: {student.noAbsen || student.employee_code || '-'}</p>
                    </div>

                    {/* Pilih hari */}
                    <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 700, color: '#082052', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pilih Hari Piket:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                            {days.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => setSelectedDay(day)}
                                    style={{
                                        padding: '8px 4px',
                                        borderRadius: 12,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        border: selectedDay === day ? '1px solid #082052' : '1px solid #e5e7eb',
                                        background: selectedDay === day ? '#082052' : '#fff',
                                        color: selectedDay === day ? '#fff' : '#6b7280',
                                        transition: 'all 0.15s',
                                        boxShadow: selectedDay === day ? '0 2px 8px rgba(8,32,82,0.2)' : 'none',
                                    }}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Konfirmasi */}
                    <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 11, color: '#4b5563', lineHeight: 1.6 }}>
                            Pindahkan <strong style={{ color: '#082052' }}>'{student.full_name}'</strong> ke jadwal piket hari <strong style={{ color: '#D6A143' }}>{selectedDay}</strong>?
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '12px', borderRadius: 12, border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{ padding: '12px', borderRadius: 12, border: 'none', background: '#082052', color: '#fff', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 8px rgba(8,32,82,0.3)' }}
                    >
                        {loading ? (
                            <>
                                <svg style={{ animation: 'spin 1s linear infinite', width: 14, height: 14 }} fill="none" viewBox="0 0 24 24">
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Menyimpan...
                            </>
                        ) : 'Ya, Pindahkan'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}