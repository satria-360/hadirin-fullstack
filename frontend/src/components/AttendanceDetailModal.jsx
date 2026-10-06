import React, { useState, useRef } from 'react';
import { X, Upload, Eye, Edit3, Save } from 'lucide-react';

const STATUS_STYLE = {
    Hadir: 'bg-emerald-500 text-white',
    Izin: 'bg-amber-500 text-white',
    Sakit: 'bg-blue-600 text-white',
    Alpha: 'bg-rose-600 text-white',
};

export default function AttendanceDetailModal({ student, onClose, onSave }) {
    const [status, setStatus] = useState(student?.status || '');
    const [proofUrl, setProofUrl] = useState(student?.proof_url || '');
    const [viewingProof, setViewingProof] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef(null);

    const needsProof = ['Izin', 'Sakit'].includes(status);
    const isNoProofStatus = ['Hadir', 'Alpha', 'Alpa'].includes(status);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            setProofUrl(result);
            if (isNoProofStatus) {
                onSave({ ...student, status, proof_url: result });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({ ...student, status, proof_url: needsProof ? proofUrl : (proofUrl || '') });
        } finally {
            setSaving(false);
        }
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#F8F3ED] text-[#082052] w-full max-w-md rounded-3xl shadow-2xl border border-[#E4D8CE] relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#082052] text-white flex items-center justify-center hover:bg-[#0c2e73] transition cursor-pointer z-10"
                    aria-label="Tutup"
                >
                    <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                {viewingProof && proofUrl ? (
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-extrabold">Keterangan</h3>
                        <div className="rounded-2xl overflow-hidden border border-[#DDD3C7] bg-white shadow-inner max-h-[320px] flex items-center justify-center">
                            <img src={proofUrl} alt="Surat Keterangan" className="max-w-full max-h-[320px] object-contain" />
                        </div>
                        <button
                            onClick={() => setViewingProof(false)}
                            className="w-full py-2.5 rounded-xl border border-[#082052]/20 text-[#082052] text-xs font-bold hover:bg-white transition cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                ) : (
                    <div className="p-6 md:p-7 space-y-5">
                        <h3 className="text-lg font-extrabold tracking-tight">Detail Kehadiran</h3>

                        <div className="space-y-1.5">
                            <p className="text-sm"><span className="font-semibold">Nama :</span> {student.full_name}</p>
                            <p className="text-sm"><span className="font-semibold">Absen :</span> {String(student.noUrut || student.id || '').padStart(2, '0')}</p>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <span className="text-sm font-semibold">Status Kehadiran:</span>
                            {needsProof || isNoProofStatus || status ? (
                                <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[status] || 'bg-gray-300 text-gray-700'}`}>
                                    {status || '—'}
                                </span>
                            ) : (
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="appearance-none px-4 py-2 rounded-xl bg-white border border-[#DDD3C7] text-xs font-bold focus:outline-none cursor-pointer"
                                >
                                    <option value="">Pilih Aksi</option>
                                    <option value="Hadir">Hadir</option>
                                    <option value="Izin">Izin</option>
                                    <option value="Sakit">Sakit</option>
                                    <option value="Alpha">Alpha</option>
                                </select>
                            )}
                        </div>

                        {/* Hadir dan Alpha disamakan: tidak ada upload bukti keterangan langsung */}
                        {isNoProofStatus && (
                            <div className="pt-2 space-y-2.5">
                                <button
                                    type="button"
                                    disabled={!proofUrl}
                                    onClick={() => setViewingProof(true)}
                                    className="w-full py-2.5 rounded-xl border border-[#082052]/15 text-[#082052] text-xs font-bold flex items-center justify-center gap-2 hover:bg-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Eye className="w-4 h-4" /> Lihat Keterangan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="w-full py-2.5 rounded-xl border border-[#082052]/15 text-[#082052] text-xs font-bold flex items-center justify-center gap-2 hover:bg-white transition cursor-pointer"
                                >
                                    <Edit3 className="w-4 h-4" /> Edit Keterangan
                                </button>
                                <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
                            </div>
                        )}

                        {needsProof && (
                            <div className="pt-1 space-y-3">
                                <label className="block text-xs font-semibold text-[#111827]">Upload Bukti Ketidakhadiran:</label>
                                <div className="flex items-stretch gap-3">
                                    <div className="flex-1 rounded-xl border border-dashed border-[#082052]/25 bg-white/60 p-3 flex items-center justify-center min-h-[90px] overflow-hidden">
                                        {proofUrl ? (
                                            <img src={proofUrl} alt="Preview" className="max-h-[120px] object-contain rounded-lg" />
                                        ) : (
                                            <span className="text-[11px] text-gray-400">Belum ada berkas dipilih</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="w-[42%] rounded-xl border border-[#082052]/20 bg-white text-[#082052] text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Upload Keterangan</span>
                                    </button>
                                </div>
                                <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full py-3 rounded-xl bg-[#D6A143] hover:bg-[#c4923b] text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        )}

                        {!status && (
                            <p className="text-[11px] text-gray-500 pt-1">Pilih status kehadiran terlebih dahulu untuk melanjutkan.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}