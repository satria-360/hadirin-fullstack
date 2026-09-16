import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const QUICK_LOGINS = [
  { role: 'Admin', email: 'admin@hadirin.co', color: 'bg-purple-600/80 hover:bg-purple-500' },
  { role: 'Guru', email: 'guru@hadirin.co', color: 'bg-blue-600/80 hover:bg-blue-500' },
  { role: 'Siswa', email: 'siswa@hadirin.co', color: 'bg-green-700/80 hover:bg-green-600' },
];

function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailValid = validateEmail(email);
  const emailError = touched.email && email && !emailValid ? "Format email tidak valid" : null;
  const passError = touched.password && password.length > 0 && password.length < 6 ? "Password minimal 6 karakter" : null;

  const handleQuickLogin = (em) => {
    setEmail(em);
    setPassword("demo123");
    setTouched({ email: true, password: true });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || password.length < 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-4 w-full relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.04]" />
      </div>

      <div className="relative w-full max-w-[420px] space-y-4">
        {/* Card */}
        <div className="w-full bg-[#0a1e4e]/80 backdrop-blur-2xl border border-white/12 rounded-3xl shadow-2xl p-8 space-y-6">

          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/30">
              <span className="text-white font-black text-xl">H</span>
            </div>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Masuk ke akun Hadirin<span className="text-red-400">.co</span> kamu
            </p>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-2">
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest text-center">Login Cepat (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_LOGINS.map((q) => (
                <button
                  key={q.role}
                  id={`login-quick-${q.role.toLowerCase()}`}
                  onClick={() => handleQuickLogin(q.email)}
                  className={`${q.color} text-white text-xs font-semibold py-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {q.role}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">atau masuk manual</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          {success ? (
            <div className="text-center space-y-3 py-4 animate-fade-in">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <p className="text-white font-bold text-lg">Login Berhasil!</p>
              <p className="text-white/50 text-xs">Mengarahkan ke dashboard...</p>
            </div>
          ) : (
            <form id="login-form" onSubmit={handleLogin} className="space-y-4">

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium">Email</label>
                <div className={`relative flex items-center rounded-xl border transition-all ${
                  emailError
                    ? 'border-red-500/60 bg-red-500/5'
                    : touched.email && emailValid
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-white/10 bg-white/[0.05] focus-within:border-blue-400/40 focus-within:bg-white/[0.08]'
                }`}>
                  <Mail className="absolute left-4 w-4 h-4 text-white/35" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    placeholder="contoh@email.com"
                    className="w-full h-[50px] bg-transparent pl-11 pr-10 text-white text-sm placeholder-white/30 focus:outline-none"
                  />
                  {touched.email && email && (
                    <div className="absolute right-4">
                      {emailValid
                        ? <CheckCircle className="w-4 h-4 text-green-400" />
                        : <AlertCircle className="w-4 h-4 text-red-400" />
                      }
                    </div>
                  )}
                </div>
                {emailError && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium">Password</label>
                <div className={`relative flex items-center rounded-xl border transition-all ${
                  passError
                    ? 'border-red-500/60 bg-red-500/5'
                    : 'border-white/10 bg-white/[0.05] focus-within:border-blue-400/40 focus-within:bg-white/[0.08]'
                }`}>
                  <Lock className="absolute left-4 w-4 h-4 text-white/35" />
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-[50px] bg-transparent pl-11 pr-11 text-white text-sm placeholder-white/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    id="login-show-pass"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 text-white/35 hover:text-white/70 transition"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passError && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {passError}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  id="login-remember"
                  onClick={() => setRemember(!remember)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    remember ? 'bg-red-600 border-red-600' : 'border-white/20 bg-white/5'
                  }`}
                >
                  {remember && <CheckCircle className="w-3 h-3 text-white fill-white stroke-0" />}
                </button>
                <label
                  onClick={() => setRemember(!remember)}
                  className="text-white/55 text-xs cursor-pointer select-none hover:text-white/75 transition"
                >
                  Ingat saya di perangkat ini
                </label>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-red-600/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : 'Masuk ke Akun'}
              </button>
            </form>
          )}
        </div>

        {/* Back to landing */}
        <p className="text-center text-white/35 text-xs">
          Belum punya akun?{' '}
          <button
            id="login-back"
            onClick={() => onNavigate && onNavigate('tentang')}
            className="text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            Pelajari lebih lanjut
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;