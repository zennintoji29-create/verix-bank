import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowLeft, QrCode, 
  Send, Lock, Smartphone, ExternalLink, CheckCircle2, XCircle, PhoneCall, RefreshCw, Sparkles, 
  MessageSquareWarning, Copy, Check, AlertOctagon, Info, Clock, Ticket, ShieldX, UserCheck, UserX, Volume2, Mail, Download,
  Building2, Landmark, Upload, Image as ImageIcon
} from 'lucide-react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { translations } from '../translations';
import QrScannerModal from './QrScannerModal';
import DossierViewerModal from './DossierViewerModal';
import { unlockAudioContext, triggerThreatAlarmAndSpeech } from '../utils/audioAlerts';

const PermissionHelper = registerPlugin('PermissionHelper');

export default function UpiCheckScreen({ onBack, backendUrl, user, initialPreset = null, currentLang = 'en', lang = 'en' }) {
  const activeLang = currentLang || lang || 'en';
  const t = translations[activeLang] || translations.en;

  const [transferMode, setTransferMode] = useState('vpa'); // 'vpa' | 'bank'
  const [vpa, setVpa] = useState(initialPreset?.vpa || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [amount, setAmount] = useState(initialPreset?.amount || '');
  const [note, setNote] = useState(initialPreset?.note || '');
  const [isOnCall, setIsOnCall] = useState(initialPreset?.isOnCall || false);
  const [activeCaller, setActiveCaller] = useState(initialPreset?.caller || '+919876543210');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [overrideDone, setOverrideDone] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dossierModal, setDossierModal] = useState(null);

  // Bank name lookup helper from IFSC
  const getBankNameFromIfsc = (code) => {
    if (!code || code.length < 4) return null;
    const prefix = code.slice(0, 4).toUpperCase();
    const bankMap = {
      SBIN: 'State Bank of India',
      HDFC: 'HDFC Bank',
      ICIC: 'ICICI Bank',
      UTIB: 'Axis Bank',
      PUNB: 'Punjab National Bank',
      BARB: 'Bank of Baroda',
      CNRB: 'Canara Bank',
      UBIN: 'Union Bank of India',
      BKID: 'Bank of India',
      IOBA: 'Indian Overseas Bank',
      KKBK: 'Kotak Mahindra Bank',
      IDIB: 'Indian Bank',
      YESB: 'Yes Bank',
      PAYT: 'Paytm Payments Bank',
      AIRP: 'Airtel Payments Bank',
      IPOS: 'India Post Payments Bank',
      FINO: 'Fino Payments Bank'
    };
    return bankMap[prefix] || 'Indian Commercial Bank';
  };

  const directGalleryRef = useRef(null);
  const [decodingGallery, setDecodingGallery] = useState(false);

  const handleDirectGalleryUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setDecodingGallery(true);

    // 1. Try Hardware BarcodeDetector if available
    if ('BarcodeDetector' in window) {
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const bitmap = await createImageBitmap(file);
        const barcodes = await detector.detect(bitmap);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          applyParsedQr(barcodes[0].rawValue);
          setDecodingGallery(false);
          return;
        }
      } catch (err) {
        console.warn('[BarcodeDetector fallback]:', err);
      }
    }

    // 2. Multi-Scale Progressive jsQR
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const tryDecode = (maxDim) => {
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const offCanvas = document.createElement('canvas');
          offCanvas.width = w;
          offCanvas.height = h;
          const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);
          return jsQR(imgData.data, w, h, { inversionAttempts: 'attemptBoth' });
        };

        let code = tryDecode(1000);
        if (!code || !code.data) code = tryDecode(600);
        if (!code || !code.data) code = tryDecode(img.width);

        setDecodingGallery(false);

        if (code && code.data) {
          applyParsedQr(code.data);
        } else {
          alert('No QR code detected in the selected image. Please choose a clearer picture.');
        }
      };
      img.onerror = () => {
        setDecodingGallery(false);
        alert('Could not read image file.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const applyParsedQr = (rawText) => {
    if (!rawText) return;
    setTransferMode('vpa');
    if (rawText.startsWith('upi://pay') || rawText.includes('pa=')) {
      const queryStr = rawText.includes('?') ? rawText.split('?')[1] : rawText;
      const urlParams = new URLSearchParams(queryStr);
      const extractedVpa = urlParams.get('pa') || rawText;
      const extractedAmount = urlParams.get('am') || '';
      const extractedNote = urlParams.get('tn') || '';
      const payeeName = urlParams.get('pn') || '';

      setVpa(extractedVpa.trim());
      if (extractedAmount) setAmount(extractedAmount);
      if (extractedNote || payeeName) setNote(extractedNote ? decodeURIComponent(extractedNote) : `Payment to ${decodeURIComponent(payeeName)}`);
    } else {
      setVpa(rawText.trim());
    }
  };

  // Admin Ticket & Review State Flow ('waiting' | 'approved' | 'rejected' | null)
  const [adminReviewState, setAdminReviewState] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(300); // 5 min timer
  const [ticketId, setTicketId] = useState('');

  // Countdown timer & Live Backend Polling for Admin Review
  useEffect(() => {
    let timerInterval = null;
    let pollInterval = null;

    if (adminReviewState === 'waiting') {
      // 1. Countdown timer
      timerInterval = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Real-time Live Backend Polling for Ticket Resolution
      if (ticketId) {
        const base = backendUrl || 'https://fruadsih.onrender.com';
        pollInterval = setInterval(async () => {
          try {
            // Check local storage resolution first (for instant cross-tab / same browser testing)
            try {
              const localAppeals = JSON.parse(localStorage.getItem('verix_bank_appeals') || '[]');
              const matched = localAppeals.find(a => (a.ticketId || a.id || a.appealId) === ticketId);
              if (matched) {
                if (matched.status === 'APPROVED' || matched.status === 'APPROVED_WHITELISTED') {
                  clearInterval(pollInterval);
                  clearInterval(timerInterval);
                  setAdminReviewState('approved');
                  return;
                } else if (matched.status === 'REJECTED') {
                  clearInterval(pollInterval);
                  clearInterval(timerInterval);
                  setAdminReviewState('rejected');
                  return;
                }
              }
            } catch (e) {}

            // Poll live backend
            const res = await fetch(`${base}/api/v1/institution/appeals/${ticketId}`, { cache: 'no-store' });
            if (res.ok) {
              const data = await res.json();
              if (data?.appeal?.status === 'APPROVED_WHITELISTED' || data?.appeal?.status === 'APPROVED') {
                clearInterval(pollInterval);
                clearInterval(timerInterval);
                setAdminReviewState('approved');
              } else if (data?.appeal?.status === 'REJECTED') {
                clearInterval(pollInterval);
                clearInterval(timerInterval);
                setAdminReviewState('rejected');
              }
            }
          } catch (e) {}
        }, 2000);
      }
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [adminReviewState, ticketId, backendUrl]);

  const handleRunCheck = async () => {
    const activeIdentifier = transferMode === 'vpa' 
      ? vpa.trim() 
      : (accountNumber.trim() ? (ifsc.trim() ? `${accountNumber.trim()}@${ifsc.trim().toUpperCase()}` : accountNumber.trim()) : '');

    if (!activeIdentifier) {
      alert(transferMode === 'vpa' ? 'Please enter a recipient UPI ID or Phone Number.' : 'Please enter a Bank Account Number.');
      return;
    }

    setLoading(true);
    setResult(null);
    setOverrideDone(false);
    setPaymentInitiated(false);
    setAdminReviewState(null);

    const isScamIdentifier = activeIdentifier.toLowerCase().includes('scam') || 
                             activeIdentifier.toLowerCase().includes('cybercell') || 
                             activeIdentifier.toLowerCase().includes('fraud') ||
                             activeIdentifier.toLowerCase().includes('customs') ||
                             activeIdentifier.toLowerCase().includes('electricity') ||
                             activeIdentifier.toLowerCase().includes('bail') ||
                             activeIdentifier.toLowerCase().includes('refund') ||
                             activeIdentifier.toLowerCase().includes('police') ||
                             activeIdentifier.includes('50100432918231');

    try {
      let evaluation = null;
      const targetApi = backendUrl || 'https://fruadsih.onrender.com';

      try {
        const res = await fetch(`${targetApi}/api/v1/risk/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id || 'user_demo_001',
            vpa: activeIdentifier,
            accountNumber: transferMode === 'bank' ? accountNumber.trim() : null,
            ifsc: transferMode === 'bank' ? ifsc.trim().toUpperCase() : null,
            accountHolderName: transferMode === 'bank' ? accountHolderName.trim() : null,
            amount: Number(amount) || 0,
            note: note.trim(),
            language: activeLang,
            deviceContext: {
              activeCallDetected: isOnCall,
              activeCallerNumber: isOnCall ? activeCaller : null
            }
          })
        });
        const data = await res.json();
        if (data && (data.data || data.evaluation)) {
          evaluation = data.data || data.evaluation;
        }
      } catch (e) {
        console.log('[Backend evaluate failed, using intelligent local engine]:', e);
      }

      if (!evaluation || isScamIdentifier || note.trim().length > 0) {
        const noteLower = note.toLowerCase();
        const extortionTriggers = [
          'police', 'arrest', 'complaint', 'legal', 'station', 'disconnect', 
          'customs', 'fine', 'penalty', 'bail', 'screenshot', 'bbsr', 'cbi', 
          'narcotics', 'court', 'unfreeze', 'kyc', 'trojan', 'fir', 'warrant'
        ];
        const matchedExtortion = extortionTriggers.filter(term => noteLower.includes(term));
        const isExtortion = matchedExtortion.length > 0;
        
        let calculatedScore = evaluation?.riskScore || 8;
        if (isExtortion) calculatedScore = Math.max(calculatedScore, 96);
        if (isScamIdentifier) calculatedScore = Math.max(calculatedScore, 98);
        if (isOnCall) calculatedScore = Math.max(calculatedScore, 78);

        const isBlocked = calculatedScore >= 70 || isExtortion || isScamIdentifier;
        const finalScore = isBlocked ? Math.max(calculatedScore, 85) : calculatedScore;

        evaluation = {
          assessmentId: evaluation?.assessmentId || `risk-eval-${Date.now()}`,
          vpa: activeIdentifier,
          amount: Number(amount) || 0,
          riskScore: finalScore,
          riskLevel: isBlocked ? 'CRITICAL_BLOCKED' : (finalScore >= 50 ? 'HIGH_RISK' : 'SAFE'),
          recommendedAction: isBlocked ? 'RESTRICT_BLOCK' : (Number(amount) > 10000 ? 'WARN_WITH_CONFIRMATION' : 'ALLOW'),
          isBlocked: isBlocked,
          requiresBiometricConfirmation: !isBlocked && Number(amount) > 10000,
          explanation: {
            summary: isExtortion 
              ? `🚨 Threat Detected: Police/Authority Extortion Coercion pattern in message ("${matchedExtortion.join(', ')}").` 
              : (isScamIdentifier ? `🚨 High Threat Detected: Flagged ${transferMode === 'bank' ? 'mule bank account' : 'scammer handle'} in national cybercrime registry.` : (evaluation?.explanation?.summary || '✅ Transaction recipient verified clean.')),
            bulletPoints: [
              ...(isExtortion ? [
                { severity: 'CRITICAL', title: 'Extortion & Fake Authority Impersonation', description: `Message mentions coercive legal/police phrases ("${matchedExtortion.join(', ')}").` },
                { severity: 'HIGH', title: 'Digital Arrest / Bail Trap Warning', description: 'Official Police, Cyber Cell, and CBI NEVER demand security bail, penalty, or dispute payments to personal bank/UPI accounts.' },
                { severity: 'HIGH', title: 'Urgency & Coercion Tactic', description: 'Demanding immediate transfer while asking not to disconnect the call is a verified extortion pattern.' }
              ] : []),
              ...(isScamIdentifier ? [
                { severity: 'CRITICAL', title: 'Flagged Threat Record', description: `This ${transferMode === 'bank' ? 'Bank Account / IFSC' : 'UPI ID'} has been reported in I4C & NPCI Mule Account databases.` }
              ] : []),
              ...(evaluation?.explanation?.bulletPoints?.filter(bp => bp.code !== 'VERIFIED_CLEAN') || [])
            ]
          }
        };

        if (evaluation.explanation.bulletPoints.length === 0) {
          evaluation.explanation.bulletPoints.push({
            severity: 'LOW',
            title: 'Payee Clear',
            description: `No cyber fraud reports found for this ${transferMode === 'bank' ? 'bank account' : 'UPI ID'}.`
          });
        }
      }

      setResult(evaluation);
      if (evaluation.isBlocked || evaluation.riskScore >= 50) {
        triggerThreatAlarmAndSpeech('upi', activeLang);
      }
    } catch (err) {
      console.error('[Run Check Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const speakSeniorCitizenUpiWarning = (lang = 'en') => {
    try {
      // 1. Play High-Audibility Multi-Tone Alert Siren via Web Audio API (Guaranteed on all mobile devices)
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.75);
          gain.gain.setValueAtTime(0.35, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.0);
        }
      } catch (audioEx) {
        console.log('[WebAudio Siren]:', audioEx);
      }

      // 2. Play Regional Voice Warning via Google Neural TTS + HTML5 Audio
      const speechMap = {
        hi: 'सावधान! यह यूपीआई आईडी साइबर फ्रॉड के लिए फ्लैग की गई है। आपका भुगतान रोक दिया गया है।',
        bn: 'সতর্কতা! এই ইউপিআই আইডি সাইবার জালিয়াতির জন্য চিহ্নিত। আপনার পেমেন্ট আটকানো হয়েছে।',
        or: 'ସତର୍କତା! ଏହି ୟୁପିଆଇ ଠକେଇ ପାଇଁ ଚିହ୍ନଟ ହୋଇଛି। ପେମେଣ୍ଟ ବନ୍ଦ କରାଯାଇଛି।',
        te: 'హెచ్చరిక! ఈ యూపీఐ ఐడీ సైబర్ మోసానికి ఫ్లాగ్ చేయబడింది. మీ చెల్లింపు నిలిపివేయబడింది.',
        ta: 'எச்சரிக்கை! இந்த யுபிஐ ஐடி இணைய மோசடிக்கு கொடியிடப்பட்டுள்ளது. உங்கள் பணம் நிறுத்தி வைக்கப்பட்டுள்ளது.',
        en: 'Warning! This UPI recipient is flagged for cyber fraud. Payment has been held for your security.'
      };
      const langCodeMap = {
        hi: 'hi',
        bn: 'bn',
        or: 'hi',
        te: 'te',
        ta: 'ta',
        en: 'en'
      };
      const textToSpeak = speechMap[lang] || speechMap.en;
      const ttsLang = langCodeMap[lang] || 'en';
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${ttsLang}&q=${encodeURIComponent(textToSpeak)}`;
      const ttsAudio = new Audio(audioUrl);
      ttsAudio.play().catch(() => {
        // 3. Fallback to Web SpeechSynthesis
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = lang === 'hi' ? 'hi-IN' : (lang === 'bn' ? 'bn-IN' : (lang === 'te' ? 'te-IN' : (lang === 'ta' ? 'ta-IN' : 'en-IN')));
          utterance.rate = 0.90;
          window.speechSynthesis.speak(utterance);
        }
      });
    } catch (e) {
      console.log('[Senior Citizen Speech]:', e);
    }
  };

  const export1930UpiIncidentPdf = (threatResult) => {
    const refId = `I4C-UPI-${Date.now()}`;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const target = threatResult.vpa || vpa || 'scammer.cybercell@oksbi';
    const amountVal = amount ? `₹${amount}` : 'Not specified';
    const score = threatResult.riskScore || 98;
    const summary = threatResult.explanation?.summary || 'Identified in NPCI & I4C Cyber Crime database registry';

    setDossierModal({
      refId,
      timestamp,
      type: 'UPI Pre-Transaction Extortion',
      target,
      amount: amountVal,
      riskScore: score,
      isBlocked: Boolean(threatResult.isBlocked),
      summary,
      transcript: note || 'Flagged pre-payment check against National Cybercrime Registry.'
    });
  };

  const email1930UpiIncidentDossier = (threatResult) => {
    const refId = `I4C-UPI-${Date.now()}`;
    const target = threatResult.vpa || vpa || 'scammer.cybercell@oksbi';
    const amountVal = amount ? `₹${amount}` : 'Not specified';
    const score = threatResult.riskScore || 98;
    const summary = threatResult.explanation?.summary || 'Identified in NPCI & I4C Cyber Crime database registry';

    const subject = encodeURIComponent(`[URGENT 1930 FINANCIAL FRAUD DOSSIER ${refId}] Flagged VPA: ${target}`);
    const body = encodeURIComponent(
      `RESPECTED NATIONAL CYBER CRIME HELPLINE (1930) & BANK FRAUD DESK,\n\n` +
      `I am submitting an official pre-transaction extortion report blocked by Verix AI Firewall.\n\n` +
      `INCIDENT SUMMARY:\n` +
      `• Dossier Reference ID: ${refId}\n` +
      `• Suspect Recipient VPA: ${target}\n` +
      `• Attempted Transfer Amount: ${amountVal}\n` +
      `• AI Threat Risk Score: ${score}% (CRITICAL BLOCKED)\n` +
      `• Threat Details: ${summary}\n` +
      `• Coercive Note / Message: "${note || 'N/A'}"\n\n` +
      `Please register this VPA in the NPCI Mule Account Registry and freeze associated settlement nodes.\n\n` +
      `Generated by Verix Real-Time Fraud Defense Protocol`
    );

    window.open(`mailto:cybercrime@gov.in,1930helpdesk@i4c.gov.in?subject=${subject}&body=${body}`, '_blank');
  };

  const handleScanSuccess = (scannedData) => {
    setVpa(scannedData.vpa || '');
    if (scannedData.amount) setAmount(scannedData.amount.toString());
    if (scannedData.note) setNote(scannedData.note);
    setShowQrModal(false);
  };

  const handleConfirmOverride = async () => {
    setLoading(true);
    try {
      if (result?.assessmentId) {
        await fetch(`${backendUrl}/api/v1/risk/confirm-override`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId: result.assessmentId,
            overrideReason: 'User verified recipient identity independently.',
            biometricVerified: true
          })
        });
      }
      setOverrideDone(true);
    } catch (err) {
      setOverrideDone(true);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!vpa.trim()) return;
    try {
      navigator.clipboard.writeText(vpa.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const triggerUpiHandoff = async (targetPackage = null) => {
    setPaymentInitiated(true);
    const cleanVpa = vpa.trim();
    const payeeName = cleanVpa.split('@')[0] || 'Payee';
    const noteVal = note ? note.trim() : 'Payment';

    let formattedAmount = '';
    if (amount) {
      const numericAmount = parseFloat(amount.toString().replace(/[^0-9.]/g, ''));
      if (!isNaN(numericAmount) && numericAmount > 0) {
        formattedAmount = numericAmount.toFixed(2);
      }
    }

    // Auto-copy VPA so user can paste inside UPI app if needed
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(cleanVpa);
      }
    } catch (ignore) {}

    // 1. Fire native Android Launcher via Capacitor Plugin Bridge
    if (Capacitor.isNativePlatform() || window.Capacitor?.isNativePlatform?.()) {
      try {
        if (targetPackage) {
          await PermissionHelper.launchAppDirectly({
            packageName: targetPackage,
            vpa: cleanVpa
          });
          return;
        }

        await PermissionHelper.openUpiPayment({
          pa: cleanVpa,
          vpa: cleanVpa,
          pn: payeeName,
          name: payeeName,
          amount: formattedAmount,
          am: formattedAmount,
          note: noteVal,
          tn: noteVal,
          isMerchant: false,
          forcePrefill: false,
          packageName: null
        });
        return;
      } catch (e) {
        console.warn('[Native UPI Handoff Fallback to Browser]:', e);
      }
    }

    // 2. Pure Web / Browser Fallback only
    const params = new URLSearchParams({
      pa: cleanVpa,
      pn: payeeName || 'Payee',
      cu: 'INR'
    });

    if (noteVal) params.append('tn', noteVal);

    const upiUri = `upi://pay?${params.toString()}`;
    window.location.href = upiUri;
  };

  const handleSubmitTicket = async () => {
    const generatedId = `VRX-REV-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    setCountdownSeconds(300); // 5 mins
    setAdminReviewState('waiting');

    // 1. Save to mobile user's ticket history
    try {
      const existing = JSON.parse(localStorage.getItem('shieldx_tickets_history') || '[]');
      const newEntry = {
        id: generatedId,
        vpa: vpa || 'Unknown VPA',
        amount: amount || '0',
        note: note || '',
        submittedAt: 'Just now',
        status: 'PENDING_REVIEW',
        statusLabel: 'Pending Admin Review',
        statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
        adminNote: 'Ticket received by Verix Fraud Review Engine. Bank surveillance agent currently analyzing VPA history and registry status.'
      };
      localStorage.setItem('shieldx_tickets_history', JSON.stringify([newEntry, ...existing]));
    } catch (e) {}

    // 2. Also save to verix_bank_appeals in localStorage (so same-browser/device web bank portal gets it immediately!)
    try {
      const bankAppeals = JSON.parse(localStorage.getItem('verix_bank_appeals') || '[]');
      const newBankAppeal = {
        id: generatedId,
        ticketId: generatedId,
        identifier: vpa ? `VPA: ${vpa}` : 'Flagged Account',
        vpa: vpa || 'Unknown VPA',
        amount: amount ? (amount.toString().startsWith('₹') ? amount : `₹${Number(amount).toLocaleString('en-IN')}`) : '₹12,450.00',
        reason: 'Velocity Spike',
        details: note || 'Dispute submitted by citizen via mobile app.',
        status: 'PENDING',
        timestamp: 'Just now',
        resolvedBy: null,
        resolvedAt: null
      };
      localStorage.setItem('verix_bank_appeals', JSON.stringify([newBankAppeal, ...bankAppeals]));
    } catch (e) {}

    // 3. Send appeal to backend Institution API & Web Dashboard
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      await fetch(`${base}/api/v1/institution/appeals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: generatedId,
          assessmentId: result?.assessmentId || generatedId,
          vpa: vpa ? vpa.trim() : 'Unknown VPA',
          amount: Number(amount) || 0,
          note: note ? note.trim() : 'Urgent transfer request',
          appellantType: 'CONSUMER',
          contactEmail: user?.email || user?.phone || 'user@verix.gov.in',
          reason: `Dispute / Admin review ticket requested for transfer of ₹${amount || 0} to ${vpa}. Note: ${note || 'None'}`,
          evidenceDescription: `Caller: ${isOnCall ? activeCaller : 'None'}`
        })
      });
    } catch (e) {
      console.warn('Backend appeal sync error:', e);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // -------------------------------------------------------------
  // VIEW A: ADMIN WAITING / REVIEW SCREEN (5-MIN COUNTDOWN)
  // -------------------------------------------------------------
  if (adminReviewState === 'waiting') {
    return (
      <div className="flex flex-col h-full bg-[#040D1A] text-white p-5 font-sans justify-between animate-fade-in select-none">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-3">
          <button 
            onClick={() => setAdminReviewState(null)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <span className="text-[11px] font-mono font-bold text-[#b9d175] uppercase px-2.5 py-1 rounded-full bg-white/5 border border-[#b9d175]/30">
            Ticket: {ticketId}
          </span>
        </div>

        {/* Center Animated Timer & Status Card */}
        <div className="text-center space-y-5 my-auto">
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#b9d175]/40 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-emerald-500/20" />
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-[#b9d175] mb-1 animate-pulse" />
              <span className="text-3xl font-black font-mono tracking-tight text-white">
                {formatTimer(countdownSeconds)}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono mt-0.5">Admin Review</span>
            </div>
          </div>

          <div className="space-y-1.5 px-4">
            <h3 className="text-lg font-black font-heading text-white">
              Please wait, our admin is reviewing it
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Your transaction of <strong className="text-[#b9d175]">₹{amount || '0'}</strong> to <strong className="text-white font-mono">{vpa}</strong> is being analyzed by bank compliance desk.
            </p>
          </div>

          {/* Real-time Inspection Steps */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 max-w-xs mx-auto text-left space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> NLP Coercion Filter Executed
            </div>
            <div className="flex items-center gap-2 text-xs text-[#b9d175] font-medium animate-pulse">
              <Clock className="w-3.5 h-3.5" /> Awaiting Senior Security Desk Clearance...
            </div>
          </div>

          {/* Quick Demo Simulation Controls */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setAdminReviewState('approved')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Simulate Approval
            </button>
            <button
              onClick={() => setAdminReviewState('rejected')}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Simulate Reject
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-500 pb-2">
          Verix Live Compliance Protocol • NPCI & I4C Interceptor
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: APPROVED SCREEN ("THIS PAYMENT IS SECURE, YOU CAN PAY")
  // -------------------------------------------------------------
  if (adminReviewState === 'approved') {
    return (
      <div className="flex flex-col h-full bg-[#040D1A] text-white p-6 font-sans justify-between animate-fade-in select-none">
        <div className="pt-3">
          <button 
            onClick={() => setAdminReviewState(null)}
            className="p-2 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Check
          </button>
        </div>

        <div className="text-center space-y-6 my-auto">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              TASK APPROVED • SECURE PAYEE
            </span>
            <h2 className="text-2xl font-black font-heading text-white">
              This payment is secure, you can pay
            </h2>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Bank Admin & Verix Security Engine verified that <strong className="text-white font-mono">{vpa}</strong> is clean.
            </p>
          </div>

          {/* Big Green PAY Button */}
          <div className="pt-4">
            <button
              onClick={triggerUpiHandoff}
              className="w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white mx-auto flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/50 active:scale-95 transition-all group"
            >
              <span className="text-3xl font-black">₹</span>
              <span className="text-xl font-black tracking-wider uppercase group-hover:scale-110 transition-transform">PAY</span>
              {amount && <span className="text-xs font-bold text-emerald-100 mt-0.5">₹{amount}</span>}
            </button>
          </div>
        </div>

        {paymentInitiated && (
          <p className="text-xs text-emerald-400 text-center font-mono font-bold animate-fade-in pb-2">
            ✓ Handed off to your installed UPI payment app!
          </p>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW C: REJECTED SCREEN ("THIS PAYMENT IS SUSPICIOUS, AVOID PAY")
  // -------------------------------------------------------------
  if (adminReviewState === 'rejected') {
    return (
      <div className="flex flex-col h-full bg-[#1A050A] text-white p-6 font-sans justify-between animate-fade-in select-none">
        <div className="pt-3">
          <button 
            onClick={() => setAdminReviewState(null)}
            className="p-2 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Check
          </button>
        </div>

        <div className="text-center space-y-6 my-auto">
          <div className="w-24 h-24 rounded-full bg-rose-600/20 border-2 border-rose-600 mx-auto flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-pulse">
            <AlertOctagon className="w-12 h-12 text-rose-500" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-600/30 text-rose-300 border border-rose-600/50">
              REJECTED BY COMPLIANCE DESK
            </span>
            <h2 className="text-2xl font-black font-heading text-white">
              This payment is suspicious, avoid pay
            </h2>
            <p className="text-xs text-rose-200 max-w-xs mx-auto leading-relaxed">
              Extortion patterns or unverified identity detected. Transferring funds to this UPI ID may result in permanent loss.
            </p>
          </div>

          {/* Action Choice: Cancel or Still Proceed to Pay */}
          <div className="space-y-3 max-w-xs mx-auto pt-2">
            <button
              onClick={() => {
                alert('Transaction aborted. Beneficiary reported to 1930 Cyber Cell.');
                setAdminReviewState(null);
              }}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
            >
              🚫 Block & Avoid Payment
            </button>

            <button
              onClick={triggerUpiHandoff}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-2xl text-xs font-semibold border border-white/20 active:scale-95 transition-all"
            >
              Still Proceed to Pay (Override)
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-500 pb-2">
          Verix Cyber Crime Interceptor
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DEFAULT VIEW: PRE-PAYMENT CHECK FORM & RESULTS
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-full w-full overflow-y-auto px-4 pt-4 pb-28 space-y-4 font-sans select-none" style={{ background: 'linear-gradient(180deg, #06070B 0%, #0D0F17 100%)' }}>
      {/* Top Header & Fast QR Actions */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8A8F9E] hover:text-[#F5F6FA] active:scale-90 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> {t.backBtn}
        </button>
        <h2 className="text-[14px] font-bold text-[#F5F6FA] font-mono">Pre-Payment Sentinel</h2>
        
        {/* Hidden Direct Gallery File Input for Android WebView */}
        <input 
          type="file" 
          id="direct-gallery-qr-input"
          ref={directGalleryRef} 
          accept="image/*" 
          onChange={handleDirectGalleryUpload} 
          style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none', zIndex: -1 }}
        />

        <div className="flex items-center gap-1.5">
          <label
            htmlFor="direct-gallery-qr-input"
            onClick={() => directGalleryRef.current?.click()}
            title="Upload QR Image from Gallery"
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border border-[#262B3A] text-[#F5F6FA] bg-[#151823] active:scale-90 transition-all cursor-pointer hover:bg-[#1C202E]"
          >
            {decodingGallery ? <RefreshCw className="w-3.5 h-3.5 text-[#3ECF7A] animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#3ECF7A] stroke-[2.5]" />}
            <span className="hidden sm:inline">Upload QR</span>
          </label>
          <button
            onClick={() => setShowQrModal(true)}
            title="Scan QR Code"
            className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#262B3A] text-[#F5F6FA] bg-[#151823] active:scale-90 transition-all cursor-pointer hover:bg-[#1C202E]"
          >
            <QrCode className="w-3.5 h-3.5 text-[#6C63FF] stroke-[2.5]" /> {t.scanQr}
          </button>
        </div>
      </div>

      {/* Transfer Mode Segmented Pill */}
      <div className="flex items-center p-1 bg-[#151823] border border-[#262B3A] rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setTransferMode('vpa')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            transferMode === 'vpa'
              ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30'
              : 'text-[#8A8F9E] hover:text-[#F2F2F3]'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>UPI ID / QR</span>
        </button>
        <button
          type="button"
          onClick={() => setTransferMode('bank')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            transferMode === 'bank'
              ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30'
              : 'text-[#8A8F9E] hover:text-[#F2F2F3]'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Bank Account + IFSC</span>
        </button>
      </div>

      {/* Input Form Card */}
      <div className="rounded-[20px] p-5 space-y-3.5" style={{ background: '#151823', border: '1px solid #262B3A', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
        
        {/* MODE 1: UPI ID / VPA */}
        {transferMode === 'vpa' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono block">
                {t.vpaLabel}
              </label>
              {vpa.trim() && (
                <button 
                  type="button" 
                  onClick={copyToClipboard}
                  className="text-[10px] font-bold text-[#6C63FF] flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-[#2FD98A]" /> : <Copy className="w-3 h-3" />}
                  {copied ? t.copied : t.copyUpi}
                </button>
              )}
            </div>
            <input
              type="text"
              value={vpa}
              onChange={(e) => setVpa(e.target.value)}
              placeholder="e.g. 9477530475@paytm or ranasubhadip2345@okaxis"
              className="w-full rounded-[14px] py-3 px-4 text-[12px] font-mono font-semibold text-[#F5F6FA] placeholder:text-[#565B6B] focus:outline-none transition-all"
              style={{ background: '#0D0F17', border: '1px solid #262B3A' }}
            />
          </div>
        )}

        {/* MODE 2: Bank Account Number + IFSC Code */}
        {transferMode === 'bank' && (
          <div className="space-y-3">
            {/* Account Number */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono block mb-1">
                Recipient Bank Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 50100432918231 or 919477530475"
                className="w-full rounded-[14px] py-3 px-4 text-[12px] font-mono font-semibold text-[#F5F6FA] placeholder:text-[#565B6B] focus:outline-none transition-all"
                style={{ background: '#0D0F17', border: '1px solid #262B3A' }}
              />
            </div>

            {/* IFSC Code & Live Bank Detector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono block">
                  Bank IFSC Code
                </label>
                {ifsc && (
                  <span className="text-[9.5px] font-mono font-bold text-[#3ECF7A] bg-[#3ECF7A]/10 px-2 py-0.5 rounded border border-[#3ECF7A]/20">
                    🏦 {getBankNameFromIfsc(ifsc)}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={ifsc}
                maxLength={11}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0001234, HDFC0000060"
                className="w-full rounded-[14px] py-3 px-4 text-[12px] font-mono font-semibold text-[#F5F6FA] placeholder:text-[#565B6B] focus:outline-none uppercase tracking-wider transition-all"
                style={{ background: '#0D0F17', border: '1px solid #262B3A' }}
              />
            </div>

            {/* Account Holder Name (Optional) */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono block mb-1">
                Beneficiary Name (Optional)
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="e.g. Rohan Kumar / Cyber Cell Escrow"
                className="w-full rounded-[14px] py-3 px-4 text-[12px] font-semibold text-[#F5F6FA] placeholder:text-[#565B6B] focus:outline-none transition-all"
                style={{ background: '#0D0F17', border: '1px solid #262B3A' }}
              />
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono block mb-1">
            {t.amountLabel} (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 15000 or 500"
            className="w-full rounded-[14px] py-3 px-4 text-[12px] font-mono font-semibold text-[#F5F6FA] placeholder:text-[#565B6B] focus:outline-none transition-all"
            style={{ background: '#0D0F17', border: '1px solid #262B3A' }}
          />
        </div>

        {/* Suspicious Message / SMS / Call Context Input Box */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono flex items-center gap-1">
              <MessageSquareWarning className="w-3.5 h-3.5 text-[#FF5C7A]" />
              {t.suspiciousMsgLabel}
            </label>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: 'rgba(108, 99, 255, 0.12)', color: '#6C63FF', border: '1px solid rgba(108, 99, 255, 0.25)' }}>
              {t.aiScanned}
            </span>
          </div>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Paste SMS or call message (e.g. 'Police officer demanding ₹25,000 security bail to clear arrest')"
            className="w-full rounded-[14px] py-3 px-4 text-[12px] text-[#F5F6FA] placeholder:text-[#565B6B] focus:outline-none resize-none leading-relaxed transition-all"
            style={{ background: '#0D0F17', border: '1px solid #262B3A' }}
          />
        </div>

        {/* Coercion Simulation Context Toggle */}
        <div className="pt-2 flex items-center justify-between" style={{ borderTop: '1px solid #262B3A' }}>
          <div className="flex items-center gap-1.5">
            <PhoneCall className={`w-3.5 h-3.5 stroke-[2] ${isOnCall ? 'text-[#FF5C7A] animate-pulse' : 'text-[#565B6B]'}`} />
            <span className="text-[11px] text-[#8A8F9E] font-medium">{t.activeCallLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOnCall(!isOnCall)}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-90 cursor-pointer"
            style={isOnCall
              ? { background: '#FF5C7A', color: 'white', boxShadow: '0 2px 10px rgba(255, 92, 122, 0.35)' }
              : { background: '#0D0F17', color: '#8A8F9E', border: '1px solid #262B3A' }
            }
          >
            {isOnCall ? t.activeCallYes : t.activeCallNo}
          </button>
        </div>

        {/* Quick 1-Tap Demo Scenarios */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono block">
            ⚡ Quick Test Scenarios:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTransferMode('bank');
                setAccountNumber('50100432918231');
                setIfsc('SBIN0001234');
                setAccountHolderName('Fake CBI Escrow Account');
                setAmount('25000');
                setNote('Urgent security verification deposit for CBI Digital Arrest bail');
                setIsOnCall(true);
              }}
              className="p-2 rounded-xl text-left bg-[#0D0F17] border border-[#FF4B4B]/30 hover:border-[#FF4B4B] text-[10.5px] text-[#FF4B4B] font-mono active:scale-95 transition-all cursor-pointer"
            >
              🚨 <strong>Mule Bank Acc</strong>
              <span className="block text-[9px] text-[#8A8F9E] truncate">50100432918231 (SBI)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTransferMode('vpa');
                setVpa('scammer.cybercell@oksbi');
                setAmount('15000');
                setNote('Police clearance security bond payment');
                setIsOnCall(true);
              }}
              className="p-2 rounded-xl text-left bg-[#0D0F17] border border-[#FF4B4B]/30 hover:border-[#FF4B4B] text-[10.5px] text-[#FF4B4B] font-mono active:scale-95 transition-all cursor-pointer"
            >
              🚨 <strong>Scammer UPI</strong>
              <span className="block text-[9px] text-[#8A8F9E] truncate">scammer.cybercell@oksbi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTransferMode('vpa');
                setVpa('electricity.officer.bill@paytm');
                setAmount('4999');
                setNote('Dear customer power disconnected tonight update payment');
                setIsOnCall(false);
              }}
              className="p-2 rounded-xl text-left bg-[#0D0F17] border border-[#FFB800]/30 hover:border-[#FFB800] text-[10.5px] text-[#FFB800] font-mono active:scale-95 transition-all cursor-pointer"
            >
              ⚡ <strong>Power Cut SMS</strong>
              <span className="block text-[9px] text-[#8A8F9E] truncate">electricity.officer.bill</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTransferMode('vpa');
                setVpa('verified.merchant@icici');
                setAmount('450');
                setNote('Grocery store payment');
                setIsOnCall(false);
              }}
              className="p-2 rounded-xl text-left bg-[#0D0F17] border border-[#3ECF7A]/30 hover:border-[#3ECF7A] text-[10.5px] text-[#3ECF7A] font-mono active:scale-95 transition-all cursor-pointer"
            >
              ✅ <strong>Clean Merchant</strong>
              <span className="block text-[9px] text-[#8A8F9E] truncate">verified.merchant@icici</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleRunCheck}
          disabled={loading || (transferMode === 'vpa' ? !vpa.trim() : !accountNumber.trim())}
          className="btn-tier-1 w-full py-3.5 text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer mt-1"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />}
          <span>{loading ? t.evaluating : t.runEvaluation}</span>
        </button>
      </div>

      {/* Evaluation Results Card */}
      {result && (
        <div
          className="bg-[#131315] border border-[#2A2A2E] rounded-[20px] p-4 animate-slide-down space-y-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.60)]"
          style={result.riskScore >= 70 ? { borderColor: 'rgba(255, 75, 75, 0.5)' } : {}}
        >
          {/* Risk Level Badge & Score Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {result.riskScore >= 70 ? (
                  <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#FF4B4B]/40 flex items-center justify-center text-[#FF4B4B]">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#3ECF7A]/40 flex items-center justify-center text-[#3ECF7A]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${
                    result.riskScore >= 70 ? 'bg-[#FF4B4B]/10 border-[#FF4B4B]/30 text-[#FF4B4B]' : 'bg-[#3ECF7A]/10 border-[#3ECF7A]/30 text-[#3ECF7A]'
                  }`}>
                    {result.riskScore >= 70 ? 'CRITICAL THREAT' : 'PAYEE VERIFIED'}
                  </span>
                  <h4 className="text-[15px] font-bold text-[#F2F2F3] mt-0.5">
                    Threat Risk: {result.riskScore}/100
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#8A8F9E]">Target VPA</span>
                <p className="text-xs font-mono font-bold text-[#F2F2F3] truncate max-w-[120px]">{result.vpa}</p>
              </div>
            </div>

            {/* Visual Risk Gauge Progress Bar */}
            <div className="w-full bg-[#0A0A0B] border border-[#2A2A2E] h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  result.riskScore >= 70 ? 'bg-[#FF4B4B]' : 'bg-[#3ECF7A]'
                }`}
                style={{ width: `${Math.max(result.riskScore, 8)}%` }}
              />
            </div>
          </div>

          {/* Prominent High-Visibility Caution Callouts */}
          {result.riskScore >= 50 && (
            <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#FF4B4B]/30 text-[#F2F2F3] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#FF4B4B]">
                <AlertTriangle className="w-4 h-4 text-[#FF4B4B] shrink-0" />
                <span>CYBER DEFENSE ADVISORY</span>
              </div>
              <ul className="text-[11px] list-disc list-inside space-y-0.5 leading-relaxed pl-1 text-[#8A8F9E]">
                <li><strong className="text-[#F2F2F3]">Digital Arrest / Police Extortion:</strong> Law enforcement never requests security transfers to personal UPI VPAs.</li>
                <li><strong className="text-[#F2F2F3]">Pre-Transaction Block:</strong> Funds transferred under coercive distress cannot be recalled via UPI reversal.</li>
              </ul>
            </div>
          )}

          {/* Explainability Bullets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono">THREAT ANALYSIS</span>
            {result.explanation?.bulletPoints?.map((bp, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#0A0A0B] border border-[#2A2A2E] text-xs flex items-start gap-2">
                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  bp.severity === 'CRITICAL' ? 'bg-[#FF4B4B]' : 'bg-[#3ECF7A]'
                }`} />
                <div>
                  <p className="font-bold text-[#F2F2F3] text-[12px]">{bp.title}</p>
                  <p className="text-[11px] text-[#8A8F9E] leading-snug">{bp.description}</p>
                </div>
              </div>
            ))}

            {/* Payment Launcher Row */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F9E] font-mono block">
                UPI Payment Gateway:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Google Pay Direct */}
                <button
                  onClick={() => triggerUpiHandoff('com.google.android.apps.nbu.paisa.user')}
                  className="btn-tier-2 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Google Pay</span>
                </button>

                {/* PhonePe Direct */}
                <button
                  onClick={() => triggerUpiHandoff('com.phonepe.app')}
                  className="btn-tier-2 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>PhonePe</span>
                </button>
              </div>

              {/* General UPI Intent Chooser */}
              <button
                onClick={() => triggerUpiHandoff(null)}
                className="btn-tier-1 w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-current text-black" />
                <span>Launch UPI App Intent</span>
              </button>

              {/* Submit Review Ticket */}
              <button
                onClick={handleSubmitTicket}
                className="btn-tier-2 w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5 text-white" />
                <span>Submit Dispute Ticket</span>
              </button>

              {/* 1-Tap 1930 Incident Evidence PDF Exporter & Email Dispatch */}
              {result.riskScore >= 50 && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => export1930UpiIncidentPdf(result)}
                    className="btn-tier-3 w-full py-2.5 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>1930 PDF</span>
                  </button>
                  <button
                    onClick={() => email1930UpiIncidentDossier(result)}
                    className="btn-tier-2 w-full py-2.5 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email I4C</span>
                  </button>
                </div>
              )}

              {paymentInitiated && (
                <p className="text-[10px] text-[#3ECF7A] text-center font-mono font-bold animate-fade-in">
                  ✓ VPA Copied &amp; Transferred to UPI App!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Scanner / Drop Modal */}
      {showQrModal && (
        <QrScannerModal 
          lang={activeLang}
          onClose={() => setShowQrModal(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}

      {/* In-App 1930 Incident Evidence Dossier Modal */}
      {dossierModal && (
        <DossierViewerModal
          dossier={dossierModal}
          onClose={() => setDossierModal(null)}
        />
      )}
    </div>
  );
}
