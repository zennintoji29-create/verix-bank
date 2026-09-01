import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { QrCode, Camera, Upload, ArrowLeft, X, AlertTriangle, CheckCircle2, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { translations } from '../translations';

export default function QrScannerModal({ onClose, onScanSuccess, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [decodingStatus, setDecodingStatus] = useState(null);
  const [isDecodingFile, setIsDecodingFile] = useState(false);
  const streamRef = useRef(null);

  // Start real Android / Web camera stream with progressive fallbacks
  useEffect(() => {
    let isMounted = true;
    let animationFrameId = null;
    let fallbackInterval = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        let stream = null;

        // Try environment camera first
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
          });
        } catch (e1) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'environment' }
            });
          } catch (e2) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          }
        }
        
        if (!isMounted || !stream) {
          if (stream) stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play().catch(() => {});
          if (isMounted) setCameraActive(true);
        }

        // Real-time video frame QR scanning loop
        const scanVideoFrame = () => {
          if (!isMounted || !videoRef.current || !canvasRef.current) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert'
              });

              if (code && code.data) {
                parseAndComplete(code.data);
                return;
              }
            } catch (qrErr) {}
          }
          animationFrameId = requestAnimationFrame(scanVideoFrame);
        };

        animationFrameId = requestAnimationFrame(scanVideoFrame);
      } catch (err) {
        console.warn('[Camera Access]:', err);
        if (isMounted) {
          setCameraError('Camera stream unavailable. Please upload a QR screenshot from your gallery below.');
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (fallbackInterval) clearInterval(fallbackInterval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const parseAndComplete = (rawText) => {
    if (!rawText) return;
    try {
      // Decode standard NPCI UPI URI Scheme: upi://pay?pa=...&am=...&tn=...
      if (rawText.startsWith('upi://pay') || rawText.includes('pa=')) {
        const queryStr = rawText.includes('?') ? rawText.split('?')[1] : rawText;
        const urlParams = new URLSearchParams(queryStr);
        const vpa = urlParams.get('pa') || rawText;
        const amount = urlParams.get('am') || '';
        const note = urlParams.get('tn') || '';
        const payeeName = urlParams.get('pn') || '';

        onScanSuccess({
          vpa: vpa.trim(),
          amount: amount ? amount.toString() : '',
          note: note ? decodeURIComponent(note) : (payeeName ? `Payment to ${decodeURIComponent(payeeName)}` : 'Scanned from QR Code'),
          isOnCall: false
        });
      } else {
        // Plain text, phone number, or URL QR
        onScanSuccess({
          vpa: rawText.trim(),
          amount: '',
          note: 'Scanned from QR Code',
          isOnCall: false
        });
      }
      onClose();
    } catch (e) {
      onScanSuccess({
        vpa: rawText.trim(),
        amount: '',
        note: 'QR Code',
        isOnCall: false
      });
      onClose();
    }
  };

  // High-Performance Multi-Scale QR Decoder for Gallery Photos
  const handleGalleryUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsDecodingFile(true);
    setDecodingStatus('Scanning QR image from gallery...');

    // 1. Try Native Browser Hardware BarcodeDetector if supported
    if ('BarcodeDetector' in window) {
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const bitmap = await createImageBitmap(file);
        const barcodes = await detector.detect(bitmap);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          setIsDecodingFile(false);
          setDecodingStatus(null);
          parseAndComplete(barcodes[0].rawValue);
          return;
        }
      } catch (err) {
        console.warn('[BarcodeDetector fallback]:', err);
      }
    }

    // 2. Multi-Pass jsQR with Dynamic Downscaling (handles 12MP-50MP camera photos without lag)
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const tryDecodeAtScale = (maxDim) => {
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

        // Pass 1: Scaled to 1000px (optimal for jsQR)
        let code = tryDecodeAtScale(1000);

        // Pass 2: Scaled to 600px (optimal for zoomed/cropped screenshots)
        if (!code || !code.data) {
          code = tryDecodeAtScale(600);
        }

        // Pass 3: Original size if under 1500px
        if ((!code || !code.data) && img.width <= 1500) {
          code = tryDecodeAtScale(img.width);
        }

        setIsDecodingFile(false);

        if (code && code.data) {
          setDecodingStatus('QR Code Detected!');
          parseAndComplete(code.data);
        } else {
          setDecodingStatus('No QR code detected. Please ensure the QR code is clearly visible and well-lit.');
          setTimeout(() => setDecodingStatus(null), 4000);
        }
      };

      img.onerror = () => {
        setIsDecodingFile(false);
        setDecodingStatus('Could not load image. Please select another picture.');
        setTimeout(() => setDecodingStatus(null), 3000);
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setIsDecodingFile(false);
      setDecodingStatus('Failed to read selected file.');
      setTimeout(() => setDecodingStatus(null), 3000);
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input so same image can be re-selected
  };

  return (
    <div className="fixed inset-0 max-w-[480px] mx-auto z-50 bg-[#000000] flex flex-col justify-between text-[#F2F2F3] font-sans animate-fade-in overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 py-3 w-full fixed top-0 left-0 right-0 max-w-[480px] mx-auto z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#2A2A2E]">
        <button 
          onClick={onClose}
          aria-label="Go back" 
          className="text-[#F2F2F3] p-2 hover:bg-[#1D1D20] rounded-full transition-colors active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-base text-[#F2F2F3] font-mono">Scan / Upload UPI QR</h1>
        <button 
          onClick={onClose}
          aria-label="Close" 
          className="text-[#8A8F9E] p-2 hover:bg-[#1D1D20] hover:text-[#F2F2F3] rounded-full transition-colors active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Camera Viewfinder */}
      <main className="flex-grow relative flex flex-col items-center justify-center pt-14 pb-[240px]">
        {/* Camera Video / Viewfinder */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 z-10 flex flex-col items-center justify-center">
          {/* Targeting Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#3ECF7A] rounded-tl-lg pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#3ECF7A] rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#3ECF7A] rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#3ECF7A] rounded-br-lg pointer-events-none" />

          {/* Central Scanning Area */}
          <div className="relative w-[calc(100%-20px)] h-[calc(100%-20px)] border border-[#2A2A2E] rounded-xl overflow-hidden bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            {/* Live Video Element */}
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning Laser Beam */}
            {cameraActive && <div className="laser-beam" />}

            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 bg-[#000000]/80 flex flex-col items-center justify-center p-4 text-center">
                <Camera className="w-8 h-8 text-[#3ECF7A] mb-2 animate-pulse" />
                <p className="text-xs font-semibold text-[#8A8F9E]">Initializing camera sensor...</p>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 bg-[#000000]/90 flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                <Camera className="w-6 h-6 text-[#FF4B4B]" />
                <p className="text-[11px] text-[#8A8F9E] leading-tight">{cameraError}</p>
              </div>
            )}
          </div>
        </div>

        <p className={`mt-5 text-xs z-10 text-center font-mono px-4 ${decodingStatus ? 'text-[#3ECF7A] animate-pulse font-bold' : 'text-[#8A8F9E]'}`}>
          {decodingStatus || 'Align QR code in viewfinder or upload from gallery'}
        </p>
      </main>

      {/* Bottom Elevated Sheet */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-40 bg-[#131315] border-t border-[#2A2A2E] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
        <div className="w-full flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 bg-[#2A2A2E] rounded-full" />
        </div>

        <div className="px-5 pb-6 pt-2 flex flex-col gap-3">
          {/* Intelligence Badge */}
          <div className="flex justify-center -mt-6 relative z-50">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#0A0A0B] border border-[#2A2A2E] rounded-full shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ECF7A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3ECF7A]" />
              </span>
              <span className="text-[10.5px] font-medium text-[#F2F2F3] font-mono tracking-wide">
                Connected to I4C Cybercrime Database
              </span>
            </div>
          </div>

          {/* Hidden File Input styled for 100% Guaranteed Android WebView Trigger */}
          <input 
            type="file" 
            id="qr-modal-gallery-input"
            ref={fileInputRef}
            accept="image/*" 
            onChange={handleGalleryUpload} 
            style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none', zIndex: -1 }}
          />

          {/* Upload UPI QR from Gallery Button / Label */}
          <label
            htmlFor="qr-modal-gallery-input"
            onClick={() => fileInputRef.current?.click()}
            className="btn-tier-1 w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            {isDecodingFile ? (
              <RefreshCw className="w-4 h-4 text-black animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-black" />
            )}
            <span>{isDecodingFile ? 'Decoding QR Code...' : 'Upload UPI QR from Gallery'}</span>
          </label>

          {/* Demo Scenario Test Buttons */}
          <div className="flex gap-2.5 pt-1 border-t border-[#2A2A2E]">
            <button
              onClick={() => parseAndComplete('upi://pay?pa=scammer.cybercell@oksbi&am=15000&tn=CBI%20Arrest%20Bail%20Penalty&pn=Fake%20Cyber%20Cell')}
              className="btn-tier-3 flex-1 py-2 px-3 text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer border-[#FF4B4B]/30 text-[#FF4B4B] bg-[#FF4B4B]/10"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF4B4B]" />
              <span>Test Scammer QR</span>
            </button>
            <button
              onClick={() => parseAndComplete('upi://pay?pa=verified.merchant@icici&am=250&tn=Grocery%20Store&pn=Fresh%20Mart')}
              className="btn-tier-2 flex-1 py-2 px-3 text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-[#3ECF7A]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3ECF7A]" />
              <span>Clean QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
