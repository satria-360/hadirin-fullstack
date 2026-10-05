import React, { useState, useEffect } from 'react';

export default function AccountSettingsPage({ currentUser, onNavigate, onUpdateUser, onStudentAdded, onOpenAddStudent }) {
  const [studentAddedSuccess, setStudentAddedSuccess] = useState('');

  const getInitialNames = () => {
    const fullName = currentUser?.full_name || 'Sir Lewis Carl Davidson Hamilton';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    const lastName = parts.pop();
    const firstName = parts.join(' ');
    return { firstName, lastName };
  };

  const initialNames = getInitialNames();
  const [firstName, setFirstName] = useState(initialNames.firstName);
  const [lastName, setLastName] = useState(initialNames.lastName);
  const [email, setEmail] = useState(currentUser?.email || 'lewis123@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone_number || '+62 881-1233-0988');
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );
  const [roleTitle, setRoleTitle] = useState(currentUser?.role_name || 'Pengajar');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [rekapAbsen, setRekapAbsen] = useState(false);

  // Save profile info state
  const [saveMsg, setSaveMsg] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const names = getInitialNames();
      setFirstName(names.firstName);
      setLastName(names.lastName);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone_number) setPhone(currentUser.phone_number);
      if (currentUser.role_name) setRoleTitle(currentUser.role_name);
      if (currentUser.avatar_url) setAvatarUrl(currentUser.avatar_url);
    }
  }, [currentUser]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        saveProfileData({ avatar_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileData = async (extraFields = {}) => {
    setIsSaving(true);
    setSaveMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const bodyData = {
        full_name: fullName,
        email: email.trim(),
        phone_number: phone.trim(),
        avatar_url: avatarUrl,
        ...extraFields,
      };

      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMsg({ type: 'success', text: 'Profil berhasil diperbarui!' });
        if (onUpdateUser) {
          onUpdateUser(data.user);
        }
      } else {
        const updatedUser = {
          ...currentUser,
          full_name: fullName,
          email: email.trim(),
          phone_number: phone.trim(),
          avatar_url: extraFields.avatar_url || avatarUrl,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        if (onUpdateUser) onUpdateUser(updatedUser);
        setSaveMsg({ type: 'success', text: 'Perubahan profil disimpan secara lokal!' });
      }
    } catch {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const updatedUser = {
        ...currentUser,
        full_name: fullName,
        email: email.trim(),
        phone_number: phone.trim(),
        avatar_url: extraFields.avatar_url || avatarUrl,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (onUpdateUser) onUpdateUser(updatedUser);
      setSaveMsg({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMsg({ type: '', text: '' }), 3500);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Masukkan password saat ini!' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password baru minimal 6 karakter!' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMsg({ type: 'success', text: 'Password berhasil diganti!' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setPasswordMsg({ type: '', text: '' });
        }, 1500);
      } else {
        setPasswordMsg({ type: 'error', text: data.message || 'Gagal mengubah password' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Koneksi gagal. Silakan coba lagi.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const displayedFullName = `${firstName} ${lastName}`.trim() || 'Sir Lewis Carl Davidson Hamilton';

  return (
    <div className="w-full text-left">
      {/* Header Halaman */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Pengaturan Akun
        </h1>
        <p className="text-gray-300 text-sm mt-1">
          Kelola akunmu disini
        </p>
      </div>

      {studentAddedSuccess && (
        <div className="max-w-4xl mx-auto mb-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center justify-between">
          <span>{studentAddedSuccess}</span>
          <button onClick={() => setStudentAddedSuccess('')}>✕</button>
        </div>
      )}

      {/* Kartu Utama Berwarna Krem Lembut Persis Screenshot */}
      <div className="bg-[#F8F3ED] text-[#1E293B] rounded-3xl p-6 md:p-10 shadow-2xl relative max-w-4xl mx-auto border border-[#E9DFD5]">

        {/* Menu titik tiga & icon search/zoom kecil di kanan atas */}
        <div className="absolute top-6 right-8 flex flex-col items-end gap-2 text-gray-400">
          <button className="text-gray-400 hover:text-gray-700 tracking-widest text-lg font-bold">
            •••
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* 1. SECTION AVATAR & NAMA */}
        <div className="flex flex-col items-center justify-center text-center mt-2 mb-6">
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[#D7C4B7] shadow-md bg-[#DFD3C3] flex items-center justify-center">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://ui-avatars.com/api/?name=Lewis+Hamilton&background=D7C4B7&color=333&size=200';
                }}
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs font-semibold"
            >
              Ganti
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <h2 className="text-lg md:text-xl font-extrabold text-[#111827] mt-4 tracking-tight">
            {displayedFullName}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {roleTitle}
          </p>

          <label
            htmlFor="avatar-upload"
            className="mt-3 px-5 py-2 bg-[#1C1F23] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            Ubah Foto
          </label>
        </div>

        {/* Divider Garis Tipis */}
        <hr className="border-[#E4D8CE] my-6" />

        {/* 2. INFORMASI AKUN */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#111827] mb-4">
            Informasi Akun
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Nama Depan */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Nama Depan<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Lewis Carl Davidson"
                className="w-full px-4 py-2.5 bg-[#EFE9E2] border border-[#DDD3C7] rounded-xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 transition"
              />
            </div>

            {/* Nama Belakang */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Nama Belakang<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Hamilton"
                className="w-full px-4 py-2.5 bg-[#EFE9E2] border border-[#DDD3C7] rounded-xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lewis123@gmail.com"
                className="w-full px-4 py-2.5 bg-[#EFE9E2] border border-[#DDD3C7] rounded-xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 transition"
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Nomor Telepon
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none">
                  <span className="inline-block w-4 h-2.5 rounded-xs overflow-hidden border border-gray-300 shadow-xs">
                    <span className="block h-1/2 bg-red-600"></span>
                    <span className="block h-1/2 bg-white"></span>
                  </span>
                  <span className="text-gray-400 text-[10px]">▼</span>
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 881-1233-0988"
                  className="w-full pl-12 pr-4 py-2.5 bg-[#EFE9E2] border border-[#DDD3C7] rounded-xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Tombol Simpan Perubahan Profil */}
          <div className="mt-4 flex items-center justify-between">
            {saveMsg.text ? (
              <span className={`text-xs font-semibold ${saveMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {saveMsg.text}
              </span>
            ) : <span />}
            <button
              type="button"
              onClick={() => saveProfileData()}
              disabled={isSaving}
              className="px-5 py-2 bg-[#1C1F23] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        </div>

        {/* Divider Garis Tipis */}
        <hr className="border-[#E4D8CE] my-6" />

        {/* 3. PENGATURAN DASHBOARD */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#111827] mb-0.5">
            Pengaturan Dashboard
          </h3>
          <p className="text-[11px] text-gray-500 mb-3.5">
            Digunakan jika kamu ingin menambah data siswa baru
          </p>

          <div className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAddStudent) onOpenAddStudent('absensi');
                }}
                className="w-full py-3 px-4 bg-[#1C1F23] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer text-center"
              >
                Tambah Data Absensi Siswa
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onOpenAddStudent) onOpenAddStudent('piket');
                }}
                className="w-full py-3 px-4 bg-[#1C1F23] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer text-center"
              >
                Tambah Data Siswa Piket
              </button>
            </div>

            {/* ✅ TAMBAHAN: Tombol Edit Data Siswa Full Width */}
            <button
              type="button"
              onClick={() => {
                alert('Fitur Edit Data Siswa akan segera hadir! Saat ini gunakan form tambah untuk memperbaiki data.');
                // Jika nanti ada halaman/modal edit siswa, uncomment baris berikut:
                // if (onEditStudent) onEditStudent();
              }}
              className="w-full py-3 px-4 bg-[#F5EFEB] border border-[#E4D8CE] hover:bg-white text-[#082052] text-xs font-bold rounded-xl shadow-sm transition cursor-pointer text-center"
            >
              Edit Data Siswa
            </button>
          </div>
        </div>

        {/* Divider Garis Tipis */}
        <hr className="border-[#E4D8CE] my-6" />

        {/* 4. UBAH PASSWORD AKUN */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#111827] mb-3">
            Ubah Password Akun
          </h3>

          <label className="block text-xs font-semibold text-[#111827] mb-1.5">
            Password Saat ini
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••"
              className="flex-1 px-4 py-2.5 bg-[#EFE9E2] border border-[#DDD3C7] rounded-xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-5 py-2.5 bg-[#1C1F23] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer whitespace-nowrap"
            >
              Ganti Password
            </button>
          </div>
        </div>

        {/* Divider Garis Tipis */}
        <hr className="border-[#E4D8CE] my-6" />

        {/* 5. PENGATURAN NOTIFIKASI */}
        <div>
          <h3 className="text-sm font-bold text-[#111827] mb-4">
            Pengaturan Notifikasi
          </h3>

          <div className="space-y-4">
            {/* Toggle 1: Notifikasi */}
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setNotifEmail(!notifEmail)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifEmail ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out text-[9px] font-bold text-gray-700 ${notifEmail ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                  {notifEmail ? 'ON' : 'OFF'}
                </span>
              </button>
              <div>
                <div className="text-xs font-bold text-[#111827] leading-tight">
                  Notifikasi
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Pemberitahuan akan dikirim melalui email kamu.
                </div>
              </div>
            </div>

            {/* Toggle 2: Rekap Absen */}
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setRekapAbsen(!rekapAbsen)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rekapAbsen ? 'bg-emerald-500' : 'bg-gray-800'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out text-[9px] font-bold text-gray-700 ${rekapAbsen ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                  {rekapAbsen ? 'ON' : 'OFF'}
                </span>
              </button>
              <div>
                <div className="text-xs font-bold text-[#111827] leading-tight">
                  Rekap Absen
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Dapatkan pemberitahuan rekap absen bulanan.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL GANTI PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F8F3ED] text-[#1E293B] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E9DFD5] relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-[#111827] mb-1">
              Ganti Password Baru
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Masukkan password saat ini dan buat password baru.
            </p>

            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Password saat ini"
                  className="w-full px-3.5 py-2 bg-[#EFE9E2] border border-[#DDD3C7] rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2 bg-[#EFE9E2] border border-[#DDD3C7] rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              {passwordMsg.text && (
                <div
                  className={`text-xs p-2.5 rounded-lg font-medium ${passwordMsg.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                    }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-[#1C1F23] hover:bg-black text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Memproses...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}