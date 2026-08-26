import { useState } from "react";

// Import semua komponen
import Logo from "../components/Logo";
import AvatarIcon from "../components/AvatarIcon";
import InputField from "../components/InputField";
import LoginButton from "../components/LoginButton";

function LoginPage() {
  // State untuk menyimpan nilai form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fungsi saat form di-submit
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center py-6 px-4 w-full">
      {/* Kartu utama */}
      <div className="w-full max-w-[420px] bg-slate-900/70 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-8 flex flex-col items-center">

        {/* Ikon avatar */}
        <AvatarIcon />

        {/* Judul */}
        <h1 className="text-white text-2xl font-bold tracking-tight text-center">
          Selamat Datang
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300/80 text-xs mt-1.5 text-center leading-relaxed">
          Silahkan masukkan email dan password anda
        </p>

        {/* Form login */}
        <form onSubmit={handleLogin} className="w-full space-y-4 mt-6">

          {/* Input Email */}
          <InputField
            type="email"
            placeholder="Masukkan email anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />

          {/* Input Password */}
          <InputField
            type="password"
            placeholder="Masukkan password anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
              </svg>
            }
          />

          {/* Tombol Masuk */}
          <LoginButton />
        </form>
      </div>
    </div>
  );
}

export default LoginPage;