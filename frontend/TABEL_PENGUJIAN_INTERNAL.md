# Laporan & Tabel Pengujian Internal Kelompok (Hadirin.co)

Dokumen ini berisi pencatatan hasil uji coba internal kelompok untuk platform **Hadirin.co**, yang mencakup fitur yang diuji, temuan masalah/bug, serta saran perbaikan dari anggota kelompok / calon pengguna.

---

## Tabel Pengujian Sederhana

| No | Fitur yang Diuji | Masalah / Bug yang Ditemukan | Saran Perbaikan dari Pengguna | Status / Catatan |
|---|---|---|---|---|
| **1** | **Halaman Utama (Landing Page) & Navigasi** | Tombol navigasi di header terkadang kurang kontras pada tampilan layar HP/Mobile. | Tambahkan backdrop blur atau perjelas warna tombol menu pada tampilan *mobile responsif*. | ⚠️ Perlu Perbaikan UX |
| **2** | **Sistem Autentikasi / Form Login** | Belum ada validasi *real-time* saat email yang dimasukkan formatnya tidak sesuai sebelum tombol submit ditekan. | Tambahkan validasi format email (*real-time feedback*) dan opsi *"Ingat Saya"* (*Remember Me*). | 🛠️ Perlu Peningkatan |
| **3** | **Manajemen Presensi / Absensi QR Code** | Kamera scanner QR Code pada sebagian browser mobile membutuhkan waktu cukup lama untuk memuat (*delay initialization*). | Berikan indikator *loading/spinner* saat kamera sedang diproses dan opsi *input manual* jika kamera bermasalah. | ⚠️ Kendala Kamera |
| **4** | **Daftar Fitur (FiturPage)** | Detail deskripsi tiap fitur masih berupa teks statis dan belum ada fitur pencarian/filter fitur. | Tambahkan fitur *Search Bar* atau *Filter Kategori* agar pengguna cepat menemukan fitur yang dicari. | 💡 Fitur Tambahan |
| **5** | **Rekap Data & Ekspor Laporan (Excel/PDF)** | Format judul header file Excel hasil download masih standar dan belum rapi secara tata letak. | Sesuaikan lebar kolom otomatis (*auto-fit width*) dan tambahkan logo instansi di bagian atas laporan. | 🛠️ Perlu Penyesuaian |
| **6** | **Tampilan Halaman "Tentang Kami"** | Informasi profil tim/pengembang belum dilengkapi dengan tautan kontak atau sosial media. | Tambahkan ikon sosial media (LinkedIn/GitHub) dan foto profil anggota tim yang seragam. | 🎨 Peningkatan Estetika |

---

## Ringkasan Evaluasi Kelompok

1. **Fungsionalitas Utama**: Aplikasi telah dapat berjalan dengan baik pada fungsi dasar absensi dan navigasi antarmuka.
2. **Prioritas Perbaikan**:
   - Optimalisasi Scanner QR Code pada perangkat seluler.
   - Penambahan validasi input di formulir login.
   - Peningkatan kerapihan tata letak (responsivitas) pada layar kecil.
