import React, { useState } from 'react';
import { ChevronLeft, QrCode, Building2, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PaymentPage({ plan, onBack, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Default plan jika tidak dilempar props
  const currentPlan = plan || {
    name: 'Paket Premium',
    desc: 'Mulai dengan fitur premium Hadirin.co',
    priceTitle: 'Rp. 1.500.000',
    priceSub: 'per semester',
    features: [
      'Akses Kelas Selama 6 Bulan',
      'Unlimited Kelas',
      'Layanan CS melalui WhatsApp',
    ],
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#082052] text-white font-sans pt-6 sm:pt-8 md:pt-10 pb-20 px-4 sm:px-6 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Tombol Back Langganan (Hanya muncul saat belum bayar) */}
        {!isPaid && (
          <div className="flex items-center gap-2 mb-8 sm:mb-12">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-white hover:text-amber-300 font-bold text-xl sm:text-2xl transition cursor-pointer select-none group"
            >
              <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] group-hover:-translate-x-1.5 transition-transform" />
              <span>Langganan</span>
            </button>
          </div>
        )}

        {isPaid ? (
          /* Success State Card - Tepat seperti gambar referensi */
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#082052] overflow-hidden">
            {/* Background Radial Gradient Hijau Terang di Pojok Kiri Bawah & Biru Dongker Gelap */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 10% 90%, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.45) 30%, rgba(8, 32, 82, 0.95) 65%, #082052 100%)'
              }}
            />
            {/* Ambient blur glow ekstra */}
            <div className="absolute -left-32 -bottom-32 w-[650px] h-[650px] bg-emerald-500/60 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-3xl bg-[#F4ECE2] text-[#082052] rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 shadow-2xl border border-white/60 animate-in zoom-in-95 duration-300 relative z-10 text-left">
              {/* Badge Ikon icon-park-solid:success */}
              <div className="w-12 h-12 mb-6 text-[#22c55e] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-12 h-12 fill-current drop-shadow-sm"
                >
                  <defs>
                    <mask id="iconParkSuccessMask">
                      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
                        <path fill="#fff" stroke="#fff" d="m24 4l5.253 3.832l6.503-.012l1.997 6.188l5.268 3.812L41 24l2.021 6.18l-5.268 3.812l-1.997 6.188l-6.503-.012L24 44l-5.253-3.832l-6.503.012l-1.997-6.188l-5.268-3.812L7 24l-2.021-6.18l5.268-3.812l1.997-6.188l6.503.012z" />
                        <path stroke="#000" d="m17 24l5 5l10-10" />
                      </g>
                    </mask>
                  </defs>
                  <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#iconParkSuccessMask)" />
                </svg>
              </div>

              {/* Judul & Deskripsi */}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#082052] mb-3">
                Pembayaran Berhasil!
              </h2>
              <p className="text-sm sm:text-base text-[#28385a] leading-relaxed max-w-2xl mb-8 font-normal">
                Terima kasih telah mempercayai Hadirin.Co, saatnya jadikan absensi manual jadi masa lalu. kelola kehadiran lebih cepat, rapi, dan akurat!{' '}
                <strong className="font-bold text-[#082052]">{currentPlan.name}</strong> kamu akan berakhir pada{' '}
                <strong className="font-bold text-[#082052]">1 Desember 2026</strong>.
              </p>

              {/* Tombol Masuk Ke Dashboard (Krem border style) */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (onSuccess) onSuccess();
                    else if (onBack) onBack();
                  }}
                  className="px-8 py-3.5 sm:py-4 rounded-2xl border border-[#c4ab90] bg-[#eedecf]/40 hover:bg-[#eedecf]/80 text-[#082052] font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Masuk Ke Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main 2-Column Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start justify-center">
            {/* Left Column: Plan Card Preview (Gold / Gradient) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-b from-[#7e6616] via-[#52410a] to-[#241d04] border border-amber-400/25 rounded-[32px] p-7 sm:p-8 text-white shadow-2xl flex flex-col justify-between min-h-[380px] hover:scale-[1.01] transition-transform duration-300">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
                    {currentPlan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-1">
                    {currentPlan.desc}
                  </p>

                  <div className="mt-8 mb-7">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                      {currentPlan.priceTitle}
                    </span>
                    {currentPlan.priceSub && (
                      <span className="text-xs sm:text-sm font-normal text-white/80 ml-2">
                        {currentPlan.priceSub.startsWith('/') ? currentPlan.priceSub.replace('/', 'per ') : currentPlan.priceSub}
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="text-xs sm:text-sm font-semibold text-white/90 mb-3">
                      Dapatkan Fitur:
                    </p>
                    <ul className="space-y-2.5">
                      {currentPlan.features && currentPlan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-white font-medium">
                          <span className="text-amber-300 font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Card */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-xl bg-[#FBF7EE] text-[#082052] rounded-[32px] p-6 sm:p-9 shadow-2xl border border-white/60">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#082052] mb-6">
                  Checkout
                </h2>

                {/* Pilih Metode Pembayaran */}
                <div className="mb-8">
                  <label className="block text-xs sm:text-sm font-bold text-[#082052]/90 mb-3.5">
                    Pilih Metode Pembayaran
                  </label>
                  
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {/* QRIS */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('qris')}
                      className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                        selectedMethod === 'qris'
                          ? 'bg-[#082052] text-white border-[#082052] shadow-lg shadow-[#082052]/25 scale-[1.02]'
                          : 'bg-transparent text-[#082052] border-[#082052]/30 hover:border-[#082052]/60 hover:bg-black/5'
                      }`}
                    >
                      <QrCode className="w-7 h-7 sm:w-8 sm:h-8 mb-2 stroke-[2.2]" />
                      <span className="text-xs sm:text-sm font-bold tracking-tight">QRIS</span>
                    </button>

                    {/* Transfer */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('transfer')}
                      className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                        selectedMethod === 'transfer'
                          ? 'bg-[#082052] text-white border-[#082052] shadow-lg shadow-[#082052]/25 scale-[1.02]'
                          : 'bg-transparent text-[#082052] border-[#082052]/30 hover:border-[#082052]/60 hover:bg-black/5'
                      }`}
                    >
                      <Building2 className="w-7 h-7 sm:w-8 sm:h-8 mb-2 stroke-[2.2]" />
                      <span className="text-xs sm:text-sm font-bold tracking-tight">Transfer</span>
                    </button>

                    {/* E-Wallet */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('ewallet')}
                      className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                        selectedMethod === 'ewallet'
                          ? 'bg-[#082052] text-white border-[#082052] shadow-lg shadow-[#082052]/25 scale-[1.02]'
                          : 'bg-transparent text-[#082052] border-[#082052]/30 hover:border-[#082052]/60 hover:bg-black/5'
                      }`}
                    >
                      <Wallet className="w-7 h-7 sm:w-8 sm:h-8 mb-2 stroke-[2.2]" />
                      <span className="text-xs sm:text-sm font-bold tracking-tight">E-Wallet</span>
                    </button>
                  </div>
                </div>

                {/* Subtotal & Pajak */}
                <div className="space-y-3 pb-5 border-b border-[#082052]/15 text-sm sm:text-base font-semibold text-[#082052]/85">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#082052]">{currentPlan.priceTitle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pajak</span>
                    <span className="font-bold text-[#082052]">Rp. 0</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-5">
                  <span className="text-base sm:text-lg font-bold text-[#082052]">Total</span>
                  <span className="text-xl sm:text-2xl font-black text-[#082052] italic font-sans">
                    {currentPlan.priceTitle}
                  </span>
                </div>

                {/* Tombol Bayar Sekarang */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePay}
                  className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#0d347d] to-[#082052] hover:from-[#114099] hover:to-[#0a2764] active:scale-[0.99] text-white text-sm sm:text-base font-bold shadow-xl shadow-[#082052]/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses Pembayaran...</span>
                    </div>
                  ) : (
                    <span>Bayar Sekarang - {currentPlan.priceTitle}</span>
                  )}
                </button>

                {/* Secure Badge / Footnote */}
                <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#082052]/70 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#082052] shrink-0" />
                  <span>
                    Pembayaran diproses dengan aman oleh <strong className="font-bold text-[#082052]">SoyPay</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
