/**
 * Verix Audio & Neural Speech Sentinel Engine
 * Guaranteed high-audibility alert sirens and regional multilingual voice warnings.
 * Uses real ElevenLabs high-quality MP3 voice files with SpeechSynthesis fallback.
 */

let sharedAudioCtx = null;
let cachedVoices = [];
let currentPlayingAudio = null;

// Pre-warm voices on startup
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  } catch (e) {}
}

export function unlockAudioContext() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (!sharedAudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume();
      }
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  } catch (e) {
    console.warn('[AudioContext Unlock]:', e);
  }
}

// Generate base64 WAV emergency alert beep fallback
function createEmergencyBeepDataUri() {
  const sampleRate = 8000;
  const duration = 0.8;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new Uint8Array(44 + numSamples);

  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) buffer[offset + i] = string.charCodeAt(i);
  };
  writeString(0, 'RIFF');
  const view = new DataView(buffer.buffer);
  view.setUint32(4, 36 + numSamples, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples, true);

  // Generate dual-tone alternating square wave
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = Math.floor(t * 8) % 2 === 0 ? 880 : 587; // A5 / D5 alternating
    const sample = Math.sin(2 * Math.PI * freq * t) > 0 ? 210 : 45;
    buffer[44 + i] = sample;
  }

  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

/**
 * Check if sound alert is allowed by user settings
 */
export function isSoundAlertEnabled() {
  try {
    const soundMode = localStorage.getItem('verix_alert_sound_mode');
    const seniorMode = localStorage.getItem('verix_senior_citizen_mode');
    if (soundMode === 'off' || soundMode === 'none' || soundMode === 'muted' || soundMode === 'disabled') {
      return false;
    }
    if (seniorMode === 'false' && soundMode === 'off') {
      return false;
    }
    return true;
  } catch (e) {
    return true;
  }
}

/**
 * Stop any currently playing audio alert or speech
 */
export function stopAllAlerts() {
  try {
    if (currentPlayingAudio) {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
      currentPlayingAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {}
}

/**
 * Play Guaranteed High-Audibility Scam Alert Siren
 */
export function playThreatSiren() {
  if (!isSoundAlertEnabled()) return;
  unlockAudioContext();

  try {
    const ctx = sharedAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      // Modulated frequency siren (880Hz <-> 440Hz)
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.linearRampToValueAtTime(440, now + 0.2);
      osc1.frequency.linearRampToValueAtTime(880, now + 0.4);
      osc1.frequency.linearRampToValueAtTime(440, now + 0.6);
      osc1.frequency.linearRampToValueAtTime(880, now + 0.8);
      osc1.frequency.linearRampToValueAtTime(440, now + 1.0);

      osc2.frequency.setValueAtTime(1200, now);
      osc2.frequency.linearRampToValueAtTime(600, now + 0.5);
      osc2.frequency.linearRampToValueAtTime(1200, now + 1.0);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.1);
      osc2.stop(now + 1.1);
    }
  } catch (e) {
    console.warn('[WebAudio Siren Error]:', e);
  }

  // Guaranteed Fallback: Play Base64 Audio Beep
  try {
    const beepAudio = new Audio(createEmergencyBeepDataUri());
    beepAudio.volume = 1.0;
    beepAudio.play().catch(() => {});
  } catch (e) {}
}

/**
 * Play Regional Multilingual AI Voice Warning
 * Plays custom ElevenLabs HD voice file from /audio/alert_[lang].mp3.
 * Seamlessly falls back to Web SpeechSynthesis if needed.
 */
export function playRegionalVoiceWarning(category = 'upi', lang = 'en') {
  if (!isSoundAlertEnabled()) return;
  unlockAudioContext();

  const primaryAudioPath = `/audio/alert_${lang}.mp3`;

  try {
    if (currentPlayingAudio) {
      try {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
      } catch (e) {}
    }

    const audio = new Audio(primaryAudioPath);
    audio.volume = 1.0;
    currentPlayingAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // MP3 Audio played successfully!
        return;
      }).catch(() => {
        // Fallback to SpeechSynthesis if MP3 fails or not found
        fallbackToSpeechSynthesis(category, lang);
      });
    } else {
      fallbackToSpeechSynthesis(category, lang);
    }
  } catch (err) {
    fallbackToSpeechSynthesis(category, lang);
  }
}

function fallbackToSpeechSynthesis(category, lang) {
  if (!isSoundAlertEnabled()) return;
  const speechMap = {
    upi: {
      hi: 'सावधान! यह यूपीआई आईडी साइबर फ्रॉड के लिए फ्लैग की गई है। कोई भी भुगतान न करें।',
      bn: 'সতর্কতা! এই ইউপিআই আইডি সাইবার জালিয়াতির জন্য চিহ্নিত। টাকা পাঠাবেন না।',
      or: 'ସତର୍କତା! ଏହି ୟୁପିଆଇ ଠକେଇ ପାଇଁ ଚିହ୍ନଟ ହୋଇଛି। ପେମେଣ୍ଟ ବନ୍ଦ କରାଯାଇଛି।',
      te: 'హెచ్చరిక! ఈ యూపీఐ ఐడీ సైబర్ మోసానికి ఫ్లాగ్ చేయబడింది. చెల్లింపు నిలిపివేయబడింది.',
      ta: 'எச்சரிக்கை! இந்த யுபிஐ ஐடி இணைய மோசடிக்கு கொடியிடப்பட்டுள்ளது. பணம் அனுப்ப வேண்டாம்.',
      en: 'Warning! This UPI recipient is flagged for cyber fraud. Payment has been held for your security.'
    },
    call: {
      hi: 'सावधान! यह कॉल एक संदिग्ध डिजिटल अरेस्ट या पुलिस फ्रॉड हो सकती है। तुरंत कॉल काटें।',
      bn: 'সতর্কতা! এই কলটি একটি ভুয়ো পুলিশ বা ডিজিটাল গ্রেফতারি প্রতারণা। এখনই কলটি কাটুন।',
      or: 'ସତର୍କତା! ଏହି କଲ ଏକ ଠକେଇ ହୋଇପারে। ତୁରନ୍ତ କଲ୍ କାଟନ୍ତୁ।',
      te: 'హెచ్చరిక! ఈ కాల్ నకిలీ పోలీసు లేదా సైబర్ మోసం. వెంటనే కాల్ ముగించండి.',
      ta: 'எச்சரிக்கை! இந்த அழைப்பு போலி காவல்துறை மோசடி. உடனே அழைப்பை துண்டிக்கவும்.',
      en: 'Warning! This call is detected as suspected Digital Arrest extortion. Disconnect call immediately.'
    }
  };

  const textToSpeak = (speechMap[category] && speechMap[category][lang]) || speechMap[category]?.en || speechMap.upi.en;
  const langCode = lang === 'hi' ? 'hi-IN' : (lang === 'bn' ? 'bn-IN' : (lang === 'te' ? 'te-IN' : (lang === 'ta' ? 'ta-IN' : (lang === 'or' ? 'or-IN' : 'en-IN'))));

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matchingVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(lang)) ||
                              voices.find(v => v.lang.includes('IN') || v.lang.includes('en')) ||
                              voices[0];
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SpeechSynthesis Fallback Error]:', err);
    }
  }
}

/**
 * Combined Configurable Trigger: Siren Beep vs AI Voice vs Both vs OFF
 */
export function triggerThreatAlarmAndSpeech(category = 'upi', lang = 'en') {
  if (!isSoundAlertEnabled()) {
    stopAllAlerts();
    return;
  }

  const soundMode = localStorage.getItem('verix_alert_sound_mode') || 'both';

  if (soundMode === 'off' || soundMode === 'none' || soundMode === 'muted' || soundMode === 'disabled') {
    stopAllAlerts();
    return;
  }

  if (soundMode === 'beep') {
    playThreatSiren();
  } else if (soundMode === 'voice') {
    playRegionalVoiceWarning(category, lang);
  } else {
    // 'both' (Plays Siren + AI Voice warning)
    playThreatSiren();
    setTimeout(() => {
      playRegionalVoiceWarning(category, lang);
    }, 450);
  }
}
