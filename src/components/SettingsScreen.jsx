import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, ArrowLeft, Globe, Volume2, 
  Fingerprint, KeyRound, Building2, Bell, AlertTriangle, Radio, Sparkles
} from 'lucide-react';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { translations } from '../translations';
import { triggerThreatAlarmAndSpeech, unlockAudioContext } from '../utils/audioAlerts';

export default function SettingsScreen({ onBack, user, onLanguageChange, currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;

  const [biometricEnabled, setBiometricEnabled] = useState(() => {
    return localStorage.getItem('shieldx_biometric_enabled') === 'true';
  });
  const [seniorCitizenMode, setSeniorCitizenMode] = useState(() => {
    const val = localStorage.getItem('verix_senior_citizen_mode');
    return val === null ? true : val === 'true';
  });
  const [soundAlertMode, setSoundAlertMode] = useState(() => {
    return localStorage.getItem('verix_alert_sound_mode') || 'both'; // 'voice' | 'beep' | 'both'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'हिंदी', native: 'Hindi' },
    { code: 'bn', label: 'বাংলা', native: 'Bengali' },
    { code: 'or', label: 'ଓଡ଼ିଆ', native: 'Odia' },
    { code: 'te', label: 'తెలుగు', native: 'Telugu' },
    { code: 'ta', label: 'தமிழ்', native: 'Tamil' },
  ];

  const handleSelectSoundMode = (mode) => {
    unlockAudioContext();
    setSoundAlertMode(mode);
    try {
      localStorage.setItem('verix_alert_sound_mode', mode);
    } catch (e) {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestSoundAlert = () => {
    unlockAudioContext();
    triggerThreatAlarmAndSpeech('upi', currentLang);
  };

  const handleToggleSeniorCitizen = () => {
    unlockAudioContext();
    const next = !seniorCitizenMode;
    setSeniorCitizenMode(next);
    try {
      localStorage.setItem('verix_senior_citizen_mode', next ? 'true' : 'false');
    } catch (e) {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggleBiometric = async () => {
    const nextState = !biometricEnabled;
    if (nextState) {
      try {
        const bioInfo = await BiometricAuth.checkBiometry();
        if (bioInfo && bioInfo.isAvailable) {
          await BiometricAuth.authenticate({
            reason: 'Verify Fingerprint to Enable Biometric Lock',
            cancelTitle: 'Cancel',
            allowDeviceCredential: true
          });
        }
      } catch (e) {}
    }
    setBiometricEnabled(nextState);
    try {
      localStorage.setItem('shieldx_biometric_enabled', nextState ? 'true' : 'false');
    } catch (e) {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length !== 4) {
      setPasswordMsg({ type: 'error', text: 'PIN must be exactly 4 digits.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'PINs do not match.' });
      return;
    }
    try {
      localStorage.setItem('shieldx_app_pin', newPassword.trim());
      localStorage.setItem('shieldx_app_lock_enabled', 'true');
    } catch (e) {}
    setPasswordMsg({ type: 'success', text: '4-Digit PIN saved successfully!' });
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordMsg(null);
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="w-full flex-1 flex flex-col font-sans select-none overflow-y-auto pb-28">
      {/* ── 1. TopAppBar ── */}
      <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#2A2A2E] flex justify-between items-center w-full px-5 py-3.5">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8A8F9E] hover:text-[#F2F2F3] active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> {t.backBtn || 'Back'}
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-white" />
          <h1 className="font-bold text-sm text-[#F2F2F3]">{t.settingsTitle || 'Settings & Controls'}</h1>
        </div>
        <div className="w-7 h-7 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center font-bold text-xs text-white">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
      </header>

      {/* ── 2. Main Content Canvas ── */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Profile Card */}
        <section className="bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.60)]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center text-lg font-bold text-white">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#F2F2F3]">{user?.name || 'Verified Citizen'}</h2>
              <p className="text-[11px] font-mono text-[#8A8F9E]">{user?.phone || '+91 98765 43210'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#3ECF7A]/30 bg-[#3ECF7A]/10">
            <CheckCircle2 className="w-3 h-3 text-[#3ECF7A]" />
            <span className="text-[10px] font-bold text-[#3ECF7A] font-mono uppercase">{t.protected || 'Protected'}</span>
          </div>
        </section>

        {/* 6-Language Grid */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            {t.languageTitle || 'Language Preference'}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((l) => {
              const isActive = currentLang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    if (onLanguageChange) onLanguageChange(l.code);
                    localStorage.setItem('shieldx_lang', l.code);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    isActive ? 'tier-5-chip-active' : 'tier-5-chip-inactive'
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Senior Citizen Defense & Alert Sound Selector */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            {currentLang === 'hi' ? 'सीनियर सिटीजन और अलर्ट सेटिंग्स' : (currentLang === 'bn' ? 'সিনিয়র সিটিজেন ও সতর্কতা সেটিংস' : 'Senior Citizen & Threat Alerts')}
          </h3>

          <div className="bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 flex flex-col gap-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            {/* Main Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F2F2F3]">
                    {currentLang === 'hi' ? 'सीनियर सिटीजन वॉयस डिफेंस' : (currentLang === 'bn' ? 'সিনিয়র সিটিজেন ভয়েস শিল্ড' : 'Senior Citizen Shield')}
                  </h4>
                  <p className="text-[11px] text-[#8A8F9E]">
                    {currentLang === 'hi' ? 'स्कैम और फ्रॉड पर तुरंत अलर्ट' : (currentLang === 'bn' ? 'স্ক্যাম কলে তাৎক্ষণিক সতর্কবার্তা' : 'Loud spoken warnings on extortion')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleSeniorCitizen}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                  seniorCitizenMode ? 'bg-[#FFFFFF]' : 'bg-[#1D1D20] border border-[#2A2A2E]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  seniorCitizenMode ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'
                }`} />
              </button>
            </div>

            {/* Alert Mode Choice Selector */}
            <div className="pt-2 border-t border-[#2A2A2E] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#8A8F9E]">
                  {currentLang === 'hi' ? 'अलर्ट साउंड का प्रकार चुनें:' : (currentLang === 'bn' ? 'সতর্কতা শব্দের ধরণ:' : 'Select Threat Alert Mode:')}
                </label>
                <button
                  onClick={handleTestSoundAlert}
                  className="px-2.5 py-1 rounded-lg bg-[#0A0A0B] border border-[#2A2A2E] text-[10.5px] font-mono text-[#3ECF7A] hover:border-[#3ECF7A] cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{currentLang === 'hi' ? 'टेस्ट करें' : (currentLang === 'bn' ? 'পরীক্ষা' : 'Test Sound')}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'voice', label: currentLang === 'hi' ? 'AI वॉयस' : (currentLang === 'bn' ? 'AI ভয়েস' : 'AI Voice') },
                  { id: 'beep', label: currentLang === 'hi' ? 'सायरन बीप' : (currentLang === 'bn' ? 'সাইরেন' : 'Siren Beep') },
                  { id: 'both', label: currentLang === 'hi' ? 'दोनों' : (currentLang === 'bn' ? 'উভয়ই' : 'Both (Voice+Beep)') }
                ].map((opt) => {
                  const isActive = soundAlertMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectSoundMode(opt.id)}
                      className={`py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        isActive ? 'tier-5-chip-active' : 'tier-5-chip-inactive'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#8A8F9E] leading-tight px-1 font-mono">
                {soundAlertMode === 'voice' 
                  ? `✓ AI will speak in ${languages.find(l => l.code === currentLang)?.label || 'English'}.` 
                  : (soundAlertMode === 'beep' 
                      ? '✓ Multi-tone emergency siren alarm will sound on scams.' 
                      : `✓ Siren alarm + Spoken warning in ${languages.find(l => l.code === currentLang)?.label || 'English'}.`)}
              </p>
            </div>
          </div>
        </section>

        {/* Defense Sentinel Controls */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            {t.monitorsTitle || 'Defense Sentinel Controls'}
          </h3>

          {/* Biometric Fingerprint Toggle */}
          <div className="bg-[#131315] border border-[#2A2A2E] rounded-[18px] p-4 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
                <Fingerprint className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F2F2F3]">{t.biometricLock || 'Biometric Lock'}</h4>
                <p className="text-[11px] text-[#8A8F9E]">Require fingerprint before transactions</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleBiometric}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                biometricEnabled ? 'bg-[#FFFFFF]' : 'bg-[#1D1D20] border border-[#2A2A2E]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                biometricEnabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
              }`} />
            </button>
          </div>

          {/* Change PIN */}
          <div className="bg-[#131315] border border-[#2A2A2E] rounded-[18px] p-4 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F2F2F3]">{t.appPin || '4-Digit App MPIN'}</h4>
                <p className="text-[11px] text-[#8A8F9E]">Security passcode for app lock</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-tier-2 px-3 py-1.5 text-xs font-semibold cursor-pointer"
            >
              {t.changePassword || 'Set PIN'}
            </button>
          </div>
        </section>

        {/* Institutional Sync & Compliance */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            Institutional Defense Network
          </h3>
          <a
            href="https://verix-bank.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#131315] border border-[#2A2A2E] rounded-[18px] p-3.5 flex items-center justify-between transition-colors hover:border-[#4A4A4F] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F2F2F3]">Bank Nodal Defense Portal</h4>
                <p className="text-[11px] text-[#8A8F9E]">I4C &amp; NPCI live incident sync</p>
              </div>
            </div>
            <span className="text-[11px] text-[#8A8F9E] font-mono">↗</span>
          </a>
        </section>

        {savedSuccess && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white text-black font-semibold text-xs py-2 px-4 rounded-full shadow-2xl animate-fade-in flex items-center gap-2 z-50">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{t.settingsSaved || 'Preferences Saved!'}</span>
          </div>
        )}
      </main>

      {/* Set PIN Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-[#2A2A2E] rounded-[24px] p-5 w-full max-w-xs space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Set 4-Digit PIN</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-[#8A8F9E] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePassword} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4 digits"
                className="w-full bg-[#0A0A0B] border border-[#2A2A2E] rounded-xl py-2 px-3 text-center text-lg font-mono text-white tracking-widest focus:outline-none focus:border-white"
              />
              <input
                type="password"
                maxLength={4}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
                placeholder="Confirm 4 digits"
                className="w-full bg-[#0A0A0B] border border-[#2A2A2E] rounded-xl py-2 px-3 text-center text-lg font-mono text-white tracking-widest focus:outline-none focus:border-white"
              />
              {passwordMsg && (
                <p className={`text-xs text-center font-semibold ${passwordMsg.type === 'error' ? 'text-[#FF4B4B]' : 'text-[#3ECF7A]'}`}>
                  {passwordMsg.text}
                </p>
              )}
              <button type="submit" className="btn-tier-1 w-full py-2.5 text-xs font-semibold cursor-pointer">
                Save PIN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
