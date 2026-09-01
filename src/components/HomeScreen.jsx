import React from 'react';
import { 
  Shield, QrCode, Mic, PhoneCall, ChevronRight, CheckCircle2, Phone, Cast, ClipboardCheck, Zap
} from 'lucide-react';
import { translations } from '../translations';

export default function HomeScreen({ user, onNavigate, currentLang = 'en', onTriggerCallSimulation }) {
  const t = translations[currentLang] || translations.en;

  const getSafeLabel = () => {
    switch (currentLang) {
      case 'hi': return 'सुरक्षित';
      case 'bn': return 'নিরাপদ';
      case 'or': return 'ସୁରକ୍ଷିତ';
      case 'te': return 'సురక్షితం';
      case 'ta': return 'பாதுகாப்பானது';
      default: return 'Safe';
    }
  };

  const getActiveLabel = () => {
    switch (currentLang) {
      case 'hi': return 'सक्रिय';
      case 'bn': return 'সক্রিয়';
      case 'or': return 'ସକ୍ରିୟ';
      case 'te': return 'యాక్టివ్';
      case 'ta': return 'செயலில்';
      default: return 'Active';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col font-sans select-none overflow-y-auto pb-28">
      {/* ── 1. TopAppBar ── */}
      <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#2A2A2E] flex justify-between items-center w-full px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white stroke-[2.5]" />
          <h1 className="text-[20px] font-bold text-[#F2F2F3] tracking-tight">{t.appName || 'Verix'}</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3ECF7A]/40 bg-[#3ECF7A]/10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF7A] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3ECF7A] font-mono">
            {getActiveLabel()}
          </span>
        </div>
      </header>

      {/* ── 2. Main Content Canvas ── */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Hero Card */}
        <section className="bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex flex-col gap-3.5 relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.60)]">
          <div className="flex flex-col gap-1 z-10">
            <h2 className="text-[18px] font-bold text-white tracking-tight">
              {t.activeProtection || 'Pre-Payment Threat Shield Active'}
            </h2>
            <p className="text-[13px] text-[#8A8F9E] leading-snug">
              {t.scoreSubtitle || 'Monitoring local and remote attack vectors in real-time.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 z-10">
            {/* Status Pill 1 */}
            <div className="bg-[#0A0A0B] border border-[#2A2A2E] rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#8A8F9E]" />
                <span className="text-[13px] text-[#F2F2F3] font-medium">
                  {currentLang === 'hi' ? 'कॉल स्थिति' : (currentLang === 'bn' ? 'কল স্থিতি' : (currentLang === 'or' ? 'କଲ୍ ସ୍ଥିତି' : 'Call Status'))}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#3ECF7A]/30 bg-[#3ECF7A]/10">
                <CheckCircle2 className="w-3 h-3 text-[#3ECF7A]" />
                <span className="text-[11px] font-bold text-[#3ECF7A] uppercase font-mono">{getSafeLabel()}</span>
              </div>
            </div>

            {/* Status Pill 2 */}
            <div className="bg-[#0A0A0B] border border-[#2A2A2E] rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Cast className="w-4 h-4 text-[#8A8F9E]" />
                <span className="text-[13px] text-[#F2F2F3] font-medium">
                  {currentLang === 'hi' ? 'रिमोट ऐप्स' : (currentLang === 'bn' ? 'রিমোট অ্যাপস' : (currentLang === 'or' ? 'ରିମୋଟ୍ ଆପ୍ସ' : 'Remote Apps'))}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#3ECF7A]/30 bg-[#3ECF7A]/10">
                <CheckCircle2 className="w-3 h-3 text-[#3ECF7A]" />
                <span className="text-[11px] font-bold text-[#3ECF7A] uppercase font-mono">{getSafeLabel()}</span>
              </div>
            </div>

            {/* Status Pill 3 */}
            <div className="bg-[#0A0A0B] border border-[#2A2A2E] rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-4 h-4 text-[#8A8F9E]" />
                <span className="text-[13px] text-[#F2F2F3] font-medium">
                  {currentLang === 'hi' ? 'क्लिपबोर्ड' : (currentLang === 'bn' ? 'ক্লিপবোর্ড' : (currentLang === 'or' ? 'କ୍ଲିପବୋର୍ଡ' : 'Clipboard'))}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#3ECF7A]/30 bg-[#3ECF7A]/10">
                <CheckCircle2 className="w-3 h-3 text-[#3ECF7A]" />
                <span className="text-[11px] font-bold text-[#3ECF7A] uppercase font-mono">{getSafeLabel()}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('upi-check')}
            className="btn-tier-1 w-full py-3 rounded-lg flex items-center justify-center gap-2 text-[14px] font-semibold mt-1 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current text-black" />
            <span>{t.runPreCheck || 'Run Pre-Payment Threat Check'}</span>
          </button>
        </section>

        {/* ── 3. Active Defenses Bento ── */}
        <section className="flex flex-col gap-2.5">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            {t.monitorsTitle || 'Active Defenses'}
          </h3>

          {/* Feature Card 1: Scan UPI QR */}
          <button 
            onClick={() => onNavigate('upi-check', { openQr: true })}
            className="w-full bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex items-center justify-between text-left transition-colors hover:border-[#4A4A4F] active:scale-[0.98] cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#F2F2F3]">{t.scanQr || 'Scan UPI QR'}</h4>
                <p className="text-[13px] text-[#8A8F9E] mt-0.5 leading-tight">{t.scanQrSub || 'Verify recipient before payment'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4A4A4F]" />
          </button>

          {/* Feature Card 2: AI Voice Sentinel */}
          <button 
            onClick={() => onNavigate('audio-analyzer')}
            className="w-full bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex items-center justify-between text-left transition-colors hover:border-[#4A4A4F] active:scale-[0.98] cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#F2F2F3]">{t.audioScan || 'AI Voice Sentinel'}</h4>
                <p className="text-[13px] text-[#8A8F9E] mt-0.5 leading-tight">{t.audioScanSub || 'Deepfake & digital arrest analysis'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4A4A4F]" />
          </button>

          {/* Feature Card 3: Call Sentinel HUD */}
          <button 
            onClick={() => onTriggerCallSimulation && onTriggerCallSimulation()}
            className="w-full bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex items-center justify-between text-left transition-colors hover:border-[#4A4A4F] active:scale-[0.98] cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#F2F2F3]">{t.callHudTitle || 'Test Call HUD'}</h4>
                <p className="text-[13px] text-[#8A8F9E] mt-0.5 leading-tight">{t.callHudDesc || 'Simulate scam call & floating HUD'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4A4A4F]" />
          </button>
        </section>
      </main>
    </div>
  );
}
