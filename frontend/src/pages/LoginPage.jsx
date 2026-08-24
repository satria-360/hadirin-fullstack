import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <main className="flex-grow flex items-center justify-center py-8 relative z-10 px-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white w-full max-w-[420px] rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1e2d42] border border-white/50 flex items-center justify-center mb-5">
          <User className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold mb-1">Selamat Datang!</h1>
        <p className="text-xs text-slate-200/80 mb-8 text-center">Silahkan Masuk Untuk Mengakses Semua Fitur!</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200 block">Alamat Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-5 h-5 text-slate-300 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200 block">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-5 h-5 text-slate-300 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-gray-900 font-semibold py-3 rounded-full mt-4 hover:bg-gray-100 transition"
          >
            Mulai Sekarang
          </button>
        </form>
      </div>
    </main>
  );
}