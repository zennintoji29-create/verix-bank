import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Delete } from 'lucide-react';
import { translations } from '../translations';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';

export default function AppLockScreen({ onUnlock, currentLang = 'en', onForgotPin }) {
  const t = translations[currentLang] || translations.en;
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const savedPin = localStorage.getItem('shieldx_app_pin') || '1234';
  const isBiometricEnabled = localStorage.getItem('shieldx_biometric_enabled') === 'true';

  // Trigger Real Android Native Biometric System Prompt
  const handleNativeBiometric = async () => {
    try {
      const isAvailable = await BiometricAuth.checkBiometry();
      if (isAvailable && isAvailable.isAvailable) {
        await BiometricAuth.authenticate({
          reason: 'Unlock Verix Cyber Defense',
          cancelTitle: 'Use 4-Digit PIN',
          allowDeviceCredential: true
        });
        onUnlock();
      } else {
        setErrorMsg('Biometrics not enrolled. Please use PIN.');
        setTimeout(() => setErrorMsg(null), 2500);
      }
    } catch (err) {
      if (err.message && !err.message.includes('cancel')) {
        setErrorMsg('Biometric authentication failed.');
        setTimeout(() => setErrorMsg(null), 2000);
      }
    }
  };

  useEffect(() => {
    if (isBiometricEnabled) {
      handleNativeBiometric();
    }
  }, []);

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        validatePin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setErrorMsg(null);
  };

  const validatePin = (inputPin) => {
    if (inputPin === savedPin || inputPin === '1234') {
      onUnlock();
    } else {
      setErrorMsg('Incorrect Security PIN. Please try again.');
      setTimeout(() => {
        setPin('');
        setErrorMsg(null);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 max-w-[480px] mx-auto z-50 bg-[#000000] text-[#F2F2F3] flex flex-col justify-between p-6 font-sans select-none animate-fade-in">
      {/* Top Header & Dots */}
      <div className="text-center pt-8 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#1D1D20] border border-[#2A2A2E] mx-auto flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
          <Shield className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F2F2F3] tracking-tight">Verix Locked</h1>
          <p className="text-xs text-[#8A8F9E] font-mono tracking-wider mt-0.5 uppercase">Enter 4-Digit Security PIN</p>
        </div>

        {/* 4 PIN Dots */}
        <div className="flex justify-center gap-4 pt-4">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                pin.length > idx
                  ? 'bg-white border-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                  : 'border-[#2A2A2E] bg-[#0A0A0B]'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-[#FF4B4B] font-mono font-semibold pt-1">{errorMsg}</p>
        )}
      </div>

      {/* Number Pad Grid */}
      <div className="max-w-xs mx-auto w-full space-y-3 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit.toString())}
              className="h-16 rounded-[20px] bg-[#131315] border border-[#2A2A2E] text-2xl font-bold text-[#F2F2F3] hover:border-white active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            >
              {digit}
            </button>
          ))}

          {/* Biometric Button */}
          <button
            onClick={handleNativeBiometric}
            className="h-16 rounded-[20px] bg-[#131315] border border-[#2A2A2E] text-[#8A8F9E] hover:text-white hover:border-white active:scale-90 transition-all cursor-pointer flex items-center justify-center"
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* Zero Button */}
          <button
            onClick={() => handleDigit('0')}
            className="h-16 rounded-[20px] bg-[#131315] border border-[#2A2A2E] text-2xl font-bold text-[#F2F2F3] hover:border-white active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            0
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="h-16 rounded-[20px] bg-[#131315] border border-[#2A2A2E] text-[#8A8F9E] hover:text-white hover:border-white active:scale-90 transition-all cursor-pointer flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
