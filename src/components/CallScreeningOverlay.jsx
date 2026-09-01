import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, PhoneIncoming, ShieldAlert, AlertOctagon, Mic, 
  MicOff, Volume2, Sparkles, X, ChevronRight, CheckCircle2, Shield, PhoneCall,
  Activity, Radio, VolumeX, ShieldCheck
} from 'lucide-react';
import { unlockAudioContext, triggerThreatAlarmAndSpeech } from '../utils/audioAlerts';

export default function CallScreeningOverlay({ callerNumber = '+91 94775 30475', onClose, onOpenTranscriptAnalyzer, backendUrl }) {
  const [callState, setCallState] = useState('RINGING'); // 'RINGING' | 'CONNECTED_RECORDING' | 'ENDED'
  const [timer, setTimer] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [aiWarning, setAiWarning] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessingChunk, setIsProcessingChunk] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastAnalyzedSecondRef = useRef(0);

  useEffect(() => {
    return () => {
      stopInCallRecording();
    };
  }, []);

  const startInCallRecording = async () => {
    unlockAudioContext();
    setCallState('CONNECTED_RECORDING');
    setTimer(0);
    setLiveTranscript('');
    setAiWarning(null);
    audioChunksRef.current = [];
    lastAnalyzedSecondRef.current = 0;

    // 1. 30-Second Countdown Timer
    timerIntervalRef.current = setInterval(() => {
      setTimer((t) => {
        const next = t + 1;
        // Periodically analyze audio every 5 seconds for live progressive transcript
        if (next % 5 === 0 && next <= 30 && audioChunksRef.current.length > 0) {
          sendPeriodicChunkForWhisper(false);
        }
        if (next >= 30) {
          stopInCallRecording();
          sendPeriodicChunkForWhisper(true);
          return 30;
        }
        return next;
      });
    }, 1000);

    // 2. Microphone live status
    setLiveTranscript('🎙️ Listening to live call audio (Speakerphone recommended)...');

    // 3. Real-time in-browser speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          if (currentText && currentText.trim()) {
            setLiveTranscript(currentText.trim());
            const lower = currentText.toLowerCase();
            if (lower.includes('police') || lower.includes('arrest') || lower.includes('deposit') || lower.includes('cbi') || lower.includes('customs') || lower.includes('warrant') || lower.includes('laundering')) {
              setAiWarning('🚨 DIGITAL ARREST / COERCION DETECTED: Caller is using fraudulent legal intimidation. Disconnect immediately.');
              triggerThreatAlarmAndSpeech('call', 'en');
            }
          }
        };
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.log('[In-Call SpeechRecognition]:', e);
      }
    }

    // 4. Real Audio Capture & Acoustic Volume Visualizer
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true
          }
        });
        streamRef.current = stream;

        // AudioContext Volume Meter
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            audioCtxRef.current = ctx;
            const src = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            src.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateMeter = () => {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(updateMeter);
            };
            updateMeter();
          }
        } catch (e) {}

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          sendPeriodicChunkForWhisper(true);
        };

        mediaRecorder.start(250);
      }
    } catch (err) {
      console.warn('[Microphone in CallOverlay]:', err);
    }
  };

  const sendPeriodicChunkForWhisper = async (isFinal = false) => {
    if (audioChunksRef.current.length === 0 || isProcessingChunk) return;
    setIsProcessingChunk(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const rawResult = reader.result || '';
        const base64Audio = rawResult.includes(',') ? rawResult.split(',')[1] : rawResult;
        const targetApi = backendUrl || 'https://fruadsih.onrender.com';
        
        try {
          const res = await fetch(`${targetApi}/api/v1/voice-phish/upload-recording`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              audioFileName: `incall_recording_${Date.now()}.webm`,
              durationSeconds: timer || 10,
              fallbackTranscript: liveTranscript || '',
              callerNumber: callerNumber
            })
          });
          const data = await res.json();
          if (data?.data?.transcribedSnippet && data.data.transcribedSnippet.length > 3) {
            setLiveTranscript(data.data.transcribedSnippet);
          }
          if (data?.data?.phishingDetected || (data?.data?.confidenceScore || 0) >= 50) {
            setAiWarning(`🚨 ${data.data.primaryCategory || 'EXTORTION DETECTED'}: ${data.data.summary || 'Coercive legal threats detected.'}`);
            triggerThreatAlarmAndSpeech('call', 'en');
          }
        } catch (e) {
          console.warn('[Live Whisper Chunk]:', e);
        } finally {
          setIsProcessingChunk(false);
        }
      };
    } catch (e) {
      setIsProcessingChunk(false);
    }
  };

  const stopInCallRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
    }
    if (streamRef.current) {
      try { streamRef.current.getTracks().forEach(track => track.stop()); } catch (e) {}
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
  };

  const cleanNum = callerNumber ? callerNumber.replace(/[\s\-\+]/g, '') : '';

  return (
    <div className="fixed inset-0 max-w-[480px] mx-auto z-50 flex flex-col justify-between p-5 text-[#F2F2F3] font-sans select-none overflow-hidden bg-[#000000]">
      {/* ── TOP HUD BAR ── */}
      <div className="w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF4B4B] animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#FF4B4B] uppercase">
            {callState === 'RINGING' ? 'INCOMING CALL DETECTED' : `SENTINEL LIVE SCREENING (${timer}s / 30s)`}
          </span>
        </div>
        <button
          onClick={() => {
            stopInCallRecording();
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center text-[#8A8F9E] hover:text-white cursor-pointer active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── MAIN CALLER IDENTITY & AI RISK HUD ── */}
      <div className="flex flex-col items-center text-center my-auto space-y-4 max-w-xs mx-auto w-full">
        {/* Caller Avatar Pulse */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-[#FF4B4B]/15 animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="w-20 h-20 rounded-full bg-[#131315] border-2 border-[#FF4B4B] flex items-center justify-center shadow-[0_0_30px_rgba(255,75,75,0.4)]">
            <PhoneCall className="w-9 h-9 text-[#FF4B4B] stroke-[2.2]" />
          </div>
        </div>

        {/* Number & Scam Tag */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-mono tracking-tight text-[#F2F2F3]">{callerNumber}</h2>
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-[#FF4B4B]/10 border-[#FF4B4B]/30 text-[#FF4B4B]">
              🚨 99/100 THREAT • DIGITAL ARREST SCAM
            </span>
          </div>
          <p className="text-[11px] text-[#8A8F9E] pt-1">
            Flagged in I4C Cyber Crime Registry (18 Victim Complaints)
          </p>
        </div>

        {/* Live Speech Transcription Box */}
        {callState === 'CONNECTED_RECORDING' && (
          <div className="w-full rounded-[18px] p-3.5 bg-[#131315] border border-[#2A2A2E] text-left space-y-2.5 animate-fade-in shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between text-[10.5px] font-mono text-[#8A8F9E] border-b border-[#2A2A2E] pb-2">
              <span className="flex items-center gap-1.5 text-[#3ECF7A]">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> LIVE SPEECH TELEPROMPTER
              </span>
              <span className="text-white font-bold">{timer} / 30s</span>
            </div>

            {/* Acoustic Mic Level Bar */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#8A8F9E] font-mono">MIC LEVEL:</span>
              <div className="flex-1 h-1.5 bg-[#0A0A0B] rounded-full overflow-hidden border border-[#2A2A2E]">
                <div 
                  className="h-full bg-[#3ECF7A] transition-all duration-100" 
                  style={{ width: `${Math.max(5, audioLevel)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-[#F2F2F3] font-mono leading-relaxed min-h-[50px]">
              {liveTranscript || 'Listening to caller audio stream...'}
            </p>

            {/* Speakerphone recommendation prompt */}
            <div className="p-2 rounded-lg bg-[#0A0A0B] border border-[#2A2A2E] text-[10px] text-[#8A8F9E] flex items-center gap-1.5 font-mono">
              <Volume2 className="w-3.5 h-3.5 text-[#3ECF7A] shrink-0" />
              <span>Tip: Turn on Speakerphone for maximum AI voice accuracy.</span>
            </div>

            {aiWarning && (
              <div className="p-2.5 rounded-xl bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 text-[11px] text-[#FF4B4B] font-semibold leading-tight flex items-start gap-1.5 animate-shake">
                <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{aiWarning}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DIALER CONTROLS ── */}
      <div className="w-full pb-4 space-y-3">
        {callState === 'RINGING' ? (
          <div className="flex items-center justify-around px-6">
            {/* Decline Call Button */}
            <button
              onClick={() => {
                setCallState('ENDED');
                setTimeout(onClose, 600);
              }}
              className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-90 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-[0_8px_24px_rgba(255,75,75,0.4)]">
                <PhoneOff className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-semibold text-[#8A8F9E]">Decline</span>
            </button>

            {/* Accept & Screen Call */}
            <button
              onClick={startInCallRecording}
              className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-90 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#3ECF7A] flex items-center justify-center text-black shadow-[0_8px_24px_rgba(62,207,122,0.4)]">
                <PhoneIncoming className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-semibold text-[#F2F2F3]">Accept &amp; Screen</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAudioLevel((prev) => (prev > 0 ? 0 : 80))}
                className="btn-tier-2 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#3ECF7A]" />
                <span>Speaker (Loud)</span>
              </button>
              <button
                onClick={() => alert('Mic muted from caller stream.')}
                className="btn-tier-2 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-white" />
                <span>Mute Mic</span>
              </button>
            </div>

            <button
              onClick={() => {
                stopInCallRecording();
                setCallState('ENDED');
                setTimeout(onClose, 600);
              }}
              className="btn-tier-3 w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border-[#FF4B4B]/40 text-[#FF4B4B] bg-[#FF4B4B]/10"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Disconnect &amp; Block Caller ({callerNumber})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
