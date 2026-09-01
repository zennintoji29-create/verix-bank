import React, { useState } from 'react';
import { 
  Shield, PhoneCall, Mic, Camera, Lock, Check, ArrowRight, Fingerprint, Layers
} from 'lucide-react';
import { translations } from '../translations';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const PermissionHelper = registerPlugin('PermissionHelper');

export default function PermissionsOnboarding({ onComplete, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [step, setStep] = useState(1); // 1: System Permissions, 2: Setup 4-digit MPIN
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState(null);
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);

  const [permissions, setPermissions] = useState([
    { id: 'call', name: 'Phone & Call State', desc: 'Read phone state to detect active extortion calls', icon: <PhoneCall className="w-5 h-5 text-white" />, granted: true },
    { id: 'mic', name: 'Microphone Sensor', desc: 'Real-time speech screening for digital arrest triggers', icon: <Mic className="w-5 h-5 text-white" />, granted: true },
    { id: 'cam', name: 'Camera Scanner', desc: 'Scan and verify merchant UPI QR payment payloads', icon: <Camera className="w-5 h-5 text-white" />, granted: true },
    { id: 'overlay', name: 'System Alert HUD', desc: 'Floating real-time warning HUD over suspicious calls', icon: <Layers className="w-5 h-5 text-white" />, granted: true }
  ]);

  const toggle = (id) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, granted: !p.granted } : p));
  };

  const handleGrantPermissions = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await PermissionHelper.requestAllPermissions().catch(() => {});
      }
    } catch (e) {}

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
          stream.getTracks().forEach(track => track.stop());
        }).catch(() => {});
      }
    } catch (e) {}

    try {
      if (Capacitor.isPluginAvailable('LocalNotifications')) {
        await LocalNotifications.requestPermissions().catch(() => {});
      }
    } catch (e) {}

    setStep(2);
  };

  const handleEnrollBiometric = async () => {
    try {
      const bioInfo = await BiometricAuth.checkBiometry();
      if (bioInfo && bioInfo.isAvailable) {
        await BiometricAuth.authenticate({
          reason: 'Confirm Fingerprint for Verix Lock',
          cancelTitle: 'Cancel',
          allowDeviceCredential: true
        });
        setBiometricEnrolled(true);
        localStorage.setItem('shieldx_biometric_enabled', 'true');
      } else {
        setBiometricEnrolled(true);
        localStorage.setItem('shieldx_biometric_enabled', 'true');
      }
    } catch (e) {
      setBiometricEnrolled(true);
      localStorage.setItem('shieldx_biometric_enabled', 'true');
    }
  };

  const handleFinishSetup = (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setPinError('PINs do not match.');
      return;
    }

    try {
      localStorage.setItem('shieldx_app_pin', pin.trim());
      localStorage.setItem('shieldx_app_lock_enabled', 'true');
      localStorage.setItem('shieldx_biometric_enabled', biometricEnrolled ? 'true' : 'false');
      localStorage.setItem('shieldx_permissions_onboarded', 'true');
    } catch (err) {}

    if (onComplete) onComplete();
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between p-5 font-sans select-none overflow-y-auto bg-[#000000] text-[#F2F2F3]">
      {/* Top Header */}
      <div className="flex flex-col items-center text-center pt-3 pb-2">
        <div className="w-14 h-14 rounded-2xl bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center mb-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
          {step === 1 ? (
            <Shield className="w-7 h-7 text-white stroke-[2.5]" />
          ) : (
            <Lock className="w-7 h-7 text-white stroke-[2.5]" />
          )}
        </div>

        <h1 className="font-bold text-xl tracking-tight text-[#F2F2F3]">
          {step === 1 ? 'Enable Device Sentinel' : 'Set 4-Digit Security MPIN'}
        </h1>
        <p className="text-xs text-[#8A8F9E] mt-1 max-w-xs leading-relaxed">
          {step === 1 
            ? 'Verix operates strictly on-device to screen fraud without storing personal data.' 
            : 'Create a 4-digit MPIN to lock and protect your Verix dashboard.'}
        </p>
      </div>

      {step === 1 ? (
        /* STEP 1: Permissions List */
        <>
          <div className="space-y-2.5 my-auto py-2">
            {permissions.map((p) => (
              <div 
                key={p.id} 
                onClick={() => toggle(p.id)}
                className="flex items-center justify-between p-3.5 rounded-[18px] cursor-pointer active:scale-[0.99] transition-all bg-[#131315] border border-[#2A2A2E] hover:border-[#4A4A4F] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1D1D20] border border-[#2A2A2E] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
                    {p.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="text-[13px] font-semibold text-[#F2F2F3]">{p.name}</h4>
                    <p className="text-[11px] text-[#8A8F9E] leading-tight mt-0.5">{p.desc}</p>
                  </div>
                </div>

                <input 
                  type="checkbox"
                  checked={p.granted}
                  onChange={() => toggle(p.id)}
                  className="checkbox-custom"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2 pb-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F9E] font-mono bg-[#131315] border border-[#2A2A2E] py-2 px-3 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF7A]" />
              <span>DPDP Act 2023 Compliant • Zero Cloud Audio Storage</span>
            </div>

            <button
              onClick={handleGrantPermissions}
              className="btn-tier-1 w-full py-3.5 text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Activate Verix Sentinel</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>
        </>
      ) : (
        /* STEP 2: Set 4-Digit Security MPIN & Biometrics */
        <div className="w-full max-w-sm mx-auto my-auto space-y-4 animate-slide-down">
          <form onSubmit={handleFinishSetup} className="bg-[#131315] border border-[#2A2A2E] rounded-[24px] p-5 shadow-2xl space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#8A8F9E] block mb-1">
                Enter 4-Digit Security PIN:
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full rounded-xl py-3 px-4 text-center text-xl tracking-widest font-mono text-[#F2F2F3] font-bold focus:outline-none bg-[#0A0A0B] border border-[#2A2A2E] focus:border-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8A8F9E] block mb-1">
                Confirm 4-Digit PIN:
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full rounded-xl py-3 px-4 text-center text-xl tracking-widest font-mono text-[#F2F2F3] font-bold focus:outline-none bg-[#0A0A0B] border border-[#2A2A2E] focus:border-white"
                required
              />
            </div>

            {/* Biometric toggle */}
            <div 
              onClick={handleEnrollBiometric}
              className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all bg-[#0A0A0B] border border-[#2A2A2E]"
            >
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-5 h-5 text-white" />
                <div className="text-left">
                  <h4 className="text-xs font-semibold text-[#F2F2F3]">Enable Biometric Unlock</h4>
                  <p className="text-[10px] text-[#8A8F9E]">Unlock with Fingerprint</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                biometricEnrolled ? 'bg-[#3ECF7A]/20 text-[#3ECF7A] border border-[#3ECF7A]/40' : 'bg-[#1D1D20] text-[#8A8F9E] border border-[#2A2A2E]'
              }`}>
                {biometricEnrolled ? '✓ Enrolled' : 'Tap to Enable'}
              </span>
            </div>

            {pinError && (
              <p className="text-xs text-[#FF4B4B] font-semibold text-center font-mono">{pinError}</p>
            )}

            <button
              type="submit"
              className="btn-tier-1 w-full py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Save MPIN &amp; Enter Dashboard
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
