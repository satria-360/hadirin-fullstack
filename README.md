# 🚀 Hadirin.co - Sistem Manajemen Presensi & Kehadiran Sekolah

<p align="center">
  <img src="frontend/public/images/Logo_RekaEnam.svg" alt="Hadirin.co Logo" width="120" />
</p>

<p align="center">
  <strong>Solusi modern, cepat, dan cerdas untuk pencatatan serta rekapitulasi kehadiran siswa dan guru secara terintegrasi.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

---

## 📌 Tentang Proyek

**Hadirin.co** adalah aplikasi web presensi sekolah fullstack yang dirancang untuk menggantikan pencatatan absensi konvensional (kertas) menjadi sistem digital interaktif yang efisien. Aplikasi ini mendukung peran guru dan murid, pencatatan jadwal harian, rekap piket kelas, laporan berbasis spreadsheet Excel, hingga sistem langganan paket premium.

---

## ✨ Fitur Utama

- 🔐 **Autentikasi & Otorisasi:**
  - Login dan Registrasi terpisah untuk peran **Guru** dan **Murid**.
  - Reset password melalui tautan verifikasi email (Nodemailer / Ethereal Fallback).
  - Keamanan password menggunakan hashing **Bcrypt** dan token **JWT (JSON Web Token)**.
- 📋 **Presensi & Pencatatan Siswa:**
  - Pencatatan kehadiran real-time (Hadir, Sakit, Izin, Alpa).
  - Jadwal mata pelajaran dan piket kelas terstruktur.
  - Upload dan rekap foto/identitas siswa.
- 📊 **Rekapitulasi & Ekspor Laporan:**
  - Export rekap absensi kelas otomatis ke dalam format file **Excel (.xlsx)** menggunakan `exceljs` dan `xlsx`.
- 💳 **Sistem Paket & Checkout:**
  - Pilihan paket (Starter / Free, Paket Premium, dan Paket Platinum).
  - Tampilan simulasi pembayaran multi-metode (QRIS, Transfer Bank, E-Wallet).
  - Notifikasi konfirmasi pembayaran berhasil yang interaktif dan responsif.
- 🎨 **Modern UI/UX & Animasi:**
  - Desain antarmuka bersih, glassmorphism, dan responsif dengan **Tailwind CSS v4**.
  - Transisi halaman dan efek interaksi yang halus menggunakan **GSAP (GreenSock)**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite 5
- **Styling:** Tailwind CSS v4
- **Animasi:** GSAP & ScrollTrigger
- **Icon:** Lucide React
- **Ekspor Dokumen:** XLSX

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Database:** MySQL (mysql2 dengan Connection Pool)
- **Keamanan:** JWT (`jsonwebtoken`) & `bcryptjs`
- **Layanan Email:** `nodemailer`
- **Spreadsheet:** `exceljs`

---

## 📁 Struktur Direktori

```text
hadirin-fullstack/
├── backend/                  # Server REST API Express.js
│   ├── index.js              # Endpoint routing, autentikasi, dan logika database
│   ├── package.json          # Dependensi server
│   └── ...
├── frontend/                 # Client React Vite
│   ├── public/               # Asset statis publik (gambar, logo, icons)
│   ├── src/
│   │   ├── components/       # Komponen UI (Navbar, Hero, Modal, dll)
│   │   ├── pages/            # Halaman utama (Landing, Login, Dashboard, Pricing, Payment, dll)
│   │   ├── App.jsx           # Root komponen dan navigasi halaman
│   │   ├── main.jsx          # Titik masuk React DOM
│   │   └── index.css         # Styling global Tailwind
│   ├── package.json          # Dependensi client
│   └── vite.config.js        # Konfigurasi Vite
├── package.json              # Script root untuk menjalankan frontend & backend bersamaan
└── README.md
```

---

## 🚀 Panduan Memulai (Instalasi & Menjalankan)

### 1. Prasyarat Sistem
- **Node.js** (Versi 18+ disarankan)
- **MySQL / XAMPP** (Untuk menjalankan database lokal)

### 2. Konfigurasi Database
1. Nyalakan layanan MySQL (misal melalui XAMPP atau MySQL Server).
2. Buat database baru bernama `db_hadirin`:
   ```sql
   CREATE DATABASE db_hadirin;
   ```
*(Tabel akan dibuat/disesuaikan otomatis oleh script backend saat pertama kali dijalankan).*

### 3. Clone Repository
```bash
git clone https://github.com/satria-360/hadirin-fullstack.git
cd hadirin-fullstack
```

### 4. Instalasi Dependensi
Jalankan perintah ini di root folder untuk menginstal seluruh dependensi backend dan frontend:
```bash
npm run install:all
```
*Atau lakukan instalasi manual di masing-masing folder (`cd backend && npm install` lalu `cd ../frontend && npm install`).*

### 5. Menjalankan Server & Client

#### Menjalankan Keduanya Bersamaan (Rekomendasi):
```bash
npm run dev
```

#### Menjalankan Secara Terpisah:
- **Jalankan Backend:**
  ```bash
  cd backend
  npm run triyono   # atau: npm start
  ```
  *Server backend aktif di: `http://localhost:5000`*

- **Jalankan Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
  *Aplikasi web aktif di: `http://localhost:5173`*

---

## 👨‍💻 Kontribusi

Kontribusi selalu disambut! Silakan fork repository ini, buat branch fitur baru, dan ajukan pull request.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **ISC**. Lihat file lisensi untuk detail selengkapnya.
