import React, { useState } from 'react';
import {
  Shield, Search, QrCode, Lock, CheckCircle2,
  ArrowRight, ShieldCheck, Zap, UserCheck, ChevronRight
} from 'lucide-react';
import { translations } from '../translations';

export default function PaymentProtectionScreen({ user, onNavigate, currentLang = 'en', backendUrl }) {
  const t = translations[currentLang] || translations.en;
  const [vpaInput, setVpaInput] = useState('');

  const handleVerifyVpa = (e) => {
    e.preventDefault();
    if (!vpaInput.trim()) return;
    onNavigate('upi-check', { vpa: vpaInput.trim() });
  };

  const getProtectedLabel = () => {
    switch (currentLang) {
      case 'hi': return 'सुरक्षित';
      case 'bn': return 'সুরক্ষিত';
      case 'or': return 'ସୁରକ୍ଷିତ';
      case 'te': return 'సురక్షితం';
      case 'ta': return 'பாதுகாப்பானது';
      default: return 'Protected';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col font-sans select-none overflow-y-auto pb-28">
      {/* ── 1. TopAppBar ── */}
      <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#2A2A2E] flex justify-between items-center w-full px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white stroke-[2.5]" />
          <h1 className="text-[20px] font-bold text-[#F2F2F3] tracking-tight">{t.navPayments || 'Payments Sentinel'}</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3ECF7A]/40 bg-[#3ECF7A]/10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF7A] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3ECF7A] font-mono">
            {getProtectedLabel()}
          </span>
        </div>
      </header>

      {/* ── 2. Main Content ── */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Protected Balance Card */}
        <section className="bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex flex-col gap-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.60)]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono text-[#8A8F9E] uppercase tracking-wider">
                {currentLang === 'hi' ? 'संरक्षित खाता शेष' : (currentLang === 'bn' ? 'সুরক্ষিত অ্যাকাউন্ট ব্যালেন্স' : 'Protected Account Balance')}
              </span>
              <h2 className="text-[26px] font-extrabold text-[#F2F2F3] mt-0.5">₹0.00</h2>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#3ECF7A]" />
            </div>
          </div>
          <div className="bg-[#0A0A0B] border border-[#2A2A2E] rounded-lg p-2.5 flex items-center gap-2 text-[12px] text-[#8A8F9E]">
            <ShieldCheck className="w-4 h-4 text-[#3ECF7A] shrink-0" />
            <span>
              {currentLang === 'hi' 
                ? 'सक्रिय NPCI और I4C जबरन वसूली रोकथाम सक्रिय है' 
                : (currentLang === 'bn' 
                    ? 'সক্রিয় NPCI এবং I4C জোরপূর্বক তহবিল সুরক্ষা চালু' 
                    : 'Active NPCI & I4C Coercion Interception Active')}
            </span>
          </div>
        </section>

        {/* Instant UPI ID / QR Scanner Box */}
        <section className="bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex flex-col gap-3">
          <h3 className="text-[13px] font-semibold text-[#F2F2F3]">
            {t.manualVpaCheck || 'Pre-Check Any Recipient'}
          </h3>
          <form onSubmit={handleVerifyVpa} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A8F9E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={vpaInput}
                onChange={(e) => setVpaInput(e.target.value)}
                placeholder="Enter UPI ID (e.g. rahul@oksbi)"
                className="w-full bg-[#0A0A0B] border border-[#2A2A2E] rounded-lg pl-9 pr-3 py-2.5 text-[13px] text-[#F2F2F3] placeholder-[#4A4A4F] focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>
            <button 
              type="button"
              onClick={() => onNavigate('home', { openQr: true })}
              className="px-3.5 bg-[#1D1D20] border border-[#2A2A2E] rounded-lg flex items-center justify-center hover:border-white transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-white" />
            </button>
          </form>
          <button 
            type="button"
            onClick={() => onNavigate('upi-check')}
            className="btn-tier-1 w-full py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 mt-1 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current text-black" />
            <span>{t.runPreCheck || 'Open Threat Pre-Checker'}</span>
          </button>
        </section>

        {/* UPI Apps Bento */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            {currentLang === 'hi' ? 'समर्थित UPI ऐप्स' : (currentLang === 'bn' ? 'সমর্থিত UPI অ্যাপস' : 'Supported UPI Apps')}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: 'GPay', tag: 'Direct' },
              { name: 'PhonePe', tag: 'Direct' },
              { name: 'Paytm', tag: 'Direct' },
              { name: 'BHIM', tag: 'NPCI' },
            ].map((app, i) => (
              <div 
                key={i} 
                className="bg-[#131315] border border-[#2A2A2E] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
              >
                <div className="w-8 h-8 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center text-[11px] font-bold text-white font-mono">
                  {app.name[0]}
                </div>
                <span className="text-[11px] font-medium text-[#F2F2F3]">{app.name}</span>
                <span className="text-[9px] font-mono text-[#3ECF7A]">{app.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Beneficiaries */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            {currentLang === 'hi' ? 'सत्यापित प्राप्तकर्ता' : (currentLang === 'bn' ? 'যাচাইকৃত প্রাপক' : 'Verified Beneficiaries')}
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { name: 'Rajesh Kumar', vpa: 'rajesh@okhdfcbank', status: 'Clean Record' },
              { name: 'Electricity Board', vpa: 'bescom@sbi', status: 'Official Bill' },
              { name: 'Zomato India', vpa: 'zomato@icici', status: 'Merchant Verified' },
            ].map((beneficiary, i) => (
              <div 
                key={i}
                className="bg-[#131315] border border-[#2A2A2E] rounded-[16px] p-3.5 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-[#F2F2F3]">{beneficiary.name}</h4>
                    <p className="text-[11px] text-[#8A8F9E] font-mono">{beneficiary.vpa}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#3ECF7A]/30 bg-[#3ECF7A]/10">
                  <CheckCircle2 className="w-3 h-3 text-[#3ECF7A]" />
                  <span className="text-[10px] font-bold text-[#3ECF7A] font-mono uppercase">{beneficiary.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
