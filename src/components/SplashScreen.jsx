import React, { useState, useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Hold cinematic animation for 1.9s, then smooth fade out over 450ms
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 450);
    }, 1900);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Inter', sans-serif",
        padding: '24px',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes verixLogoBloom {
          0% {
            transform: scale(0.82);
            opacity: 0;
            filter: drop-shadow(0 0 10px rgba(62, 207, 122, 0.2));
          }
          50% {
            transform: scale(1.03);
            opacity: 1;
            filter: drop-shadow(0 0 35px rgba(62, 207, 122, 0.7)) drop-shadow(0 0 60px rgba(0, 212, 255, 0.35));
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: drop-shadow(0 0 25px rgba(62, 207, 122, 0.5)) drop-shadow(0 0 45px rgba(0, 212, 255, 0.25));
          }
        }

        @keyframes cyberRingRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes radarRippleWave {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }

        @keyframes verixTextReveal {
          0% {
            opacity: 0;
            transform: translateY(14px);
            letter-spacing: 5px;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: 3px;
          }
        }

        @keyframes verixSubtitleReveal {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 0.9;
            transform: translateY(0);
          }
        }

        @keyframes ambientShimmer {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }

        .anim-logo-pod {
          animation: verixLogoBloom 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-ring {
          animation: cyberRingRotate 10s linear infinite;
        }

        .anim-ripple-1 {
          animation: radarRippleWave 2.4s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
        }

        .anim-ripple-2 {
          animation: radarRippleWave 2.4s cubic-bezier(0.2, 0.8, 0.4, 1) 0.8s infinite;
        }

        .anim-title {
          animation: verixTextReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
          opacity: 0;
        }

        .anim-subtitle {
          animation: verixSubtitleReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
          opacity: 0;
        }

        .anim-glow-mesh {
          animation: ambientShimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* Cyber Security Sonar Ripples */}
      <div 
        className="anim-ripple-1"
        style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: '1.5px solid rgba(62, 207, 122, 0.35)',
          pointerEvents: 'none'
        }} 
      />
      <div 
        className="anim-ripple-2"
        style={{
          position: 'absolute',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 212, 255, 0.25)',
          pointerEvents: 'none'
        }} 
      />

      {/* Ambient Deep Radial Halo */}
      <div 
        className="anim-glow-mesh"
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(62, 207, 122, 0.18) 0%, rgba(0, 212, 255, 0.08) 45%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(35px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Central Brand Emblem Container */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '22px'
        }}
      >
        {/* Sleek Blended Logo Pod */}
        <div 
          className="anim-logo-pod"
          style={{
            position: 'relative',
            width: '110px',
            height: '110px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(29, 29, 32, 0.9) 0%, rgba(10, 10, 11, 0.95) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Rotating Cyber Border Highlight */}
          <div 
            className="anim-ring"
            style={{
              position: 'absolute',
              inset: '-50%',
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(62, 207, 122, 0.4) 60deg, transparent 120deg, rgba(0, 212, 255, 0.3) 240deg, transparent 300deg)',
              opacity: 0.6,
              pointerEvents: 'none'
            }}
          />

          {/* Inner Protective Mask */}
          <div 
            style={{
              position: 'absolute',
              inset: '2px',
              borderRadius: '26px',
              background: '#0D0E12',
              zIndex: 1
            }}
          />

          {/* Beautifully Blended Emblem / Shield */}
          <div 
            style={{
              position: 'relative',
              zIndex: 2,
              width: '74px',
              height: '74px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src="/emblem.png" 
              alt="Verix" 
              onError={(e) => {
                // Fallback to high-res SVG Shield if emblem image has any asset issue
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                mixBlendMode: 'screen',
                filter: 'contrast(1.1) brightness(1.15) drop-shadow(0 0 12px rgba(62, 207, 122, 0.6))'
              }}
            />
            {/* Fallback Shield */}
            <div 
              style={{
                display: 'none',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shield className="w-10 h-10 text-[#3ECF7A] stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Brand Typography & Verification Tag */}
        <div style={{ textAlign: 'center' }}>
          <h1 
            className="anim-title"
            style={{
              fontSize: '32px',
              fontWeight: '900',
              textTransform: 'uppercase',
              color: '#F2F2F3',
              margin: '0',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '3px',
              textShadow: '0 2px 20px rgba(255, 255, 255, 0.25)'
            }}
          >
            VERIX
          </h1>

          <p 
            className="anim-subtitle"
            style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '1.2px',
              color: '#8A8F9E',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              margin: '6px 0 0 0'
            }}
          >
            <span style={{ color: '#3ECF7A', marginRight: '6px' }}>●</span>
            Explainable AI Fraud Shield
          </p>

          <div 
            className="anim-subtitle"
            style={{
              marginTop: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: 'rgba(29, 29, 32, 0.8)',
              border: '1px solid rgba(42, 42, 46, 0.8)',
              fontSize: '9.5px',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#8A8F9E'
            }}
          >
            <span>NPCI &bull; I4C SENTINEL v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
