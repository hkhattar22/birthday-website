import { useState } from 'react';
import MagneticButton from './MagneticButton';

type Phase = 'closed' | 'hovering' | 'opening' | 'opened';

type OpeningScreenProps = {
  onContinue: () => void;
};

export default function OpeningScreen({ onContinue }: OpeningScreenProps) {
  const [phase, setPhase] = useState<Phase>('closed');
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleHover = () => {
    if (phase !== 'closed') return;
    setPhase('hovering');
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 140,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1500);
  };

  const handleClick = () => {
    if (phase !== 'closed' && phase !== 'hovering') return;
    setPhase('opening');
    setTimeout(() => setPhase('opened'), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      {/* Subtitle */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-cream/40 text-xs sm:text-sm tracking-[0.3em] uppercase font-medium">
          A Birthday Experience
        </p>
      </div>

      {/* Envelope container */}
      <div className="relative" style={{ perspective: '1000px' }}>
        {/* Sparkles */}
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute pointer-events-none text-amber-300"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(${s.x}px, ${s.y}px)`,
              animation: 'sparkle-pop 1.5s ease-out forwards',
              fontSize: '20px',
            }}
          >
            ✨
          </div>
        ))}

        {/* Envelope */}
        <div
          className={`relative cursor-pointer no-select transition-all duration-500 ${phase === 'hovering' ? 'animate-wiggle' : ''}`}
          onMouseEnter={handleHover}
          onMouseLeave={() => phase === 'hovering' && setPhase('closed')}
          onClick={handleClick}
          style={{
            width: '300px',
            height: '200px',
            transform: phase === 'opening' || phase === 'opened' ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {/* Envelope back */}
          <div
            className="absolute inset-0 rounded-xl shadow-float"
            style={{ background: 'linear-gradient(135deg, #2a3142 0%, #1a1f2e 100%)', border: '1px solid rgba(250, 243, 231, 0.1)' }}
          />

          {/* Envelope flap (top triangle) */}
          <div
            className="absolute top-0 left-0 right-0 origin-top transition-all duration-700"
            style={{
              width: 0,
              height: 0,
              borderLeft: '150px solid transparent',
              borderRight: '150px solid transparent',
              borderTop: '100px solid #232a38',
              transform: phase === 'opening' || phase === 'opened' ? 'rotateX(180deg) translateY(-2px)' : 'rotateX(0deg)',
              transformOrigin: 'top',
              zIndex: 3,
              filter: phase === 'opening' || phase === 'opened' ? 'brightness(0.7)' : 'none',
            }}
          />

          {/* Letter */}
          <div
            className="absolute left-4 right-4 rounded-lg overflow-hidden transition-all duration-700 ease-out"
            style={{
              top: phase === 'opened' ? '-20px' : '16px',
              bottom: phase === 'opened' ? '-200px' : '16px',
              background: 'linear-gradient(180deg, #faf3e7 0%, #f0e6d2 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              zIndex: phase === 'opened' ? 5 : 1,
              opacity: phase === 'opened' ? 1 : 0,
              padding: '28px 24px',
            }}
          >
            {/* Wax seal on letter */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-cream"
              style={{
                top: '-24px',
                background: 'linear-gradient(135deg, #c0392b 0%, #922b21 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                transform: phase === 'opening' || phase === 'opened' ? 'scale(0.5) rotate(20deg)' : 'scale(1)',
                opacity: phase === 'opened' ? 0 : phase === 'opening' ? 0.4 : 1,
                transition: 'all 0.4s ease',
              }}
            >
              ✦
            </div>

            <div className="text-center h-full w-full flex flex-col justify-center">
              <div className="text-2xl mb-3">✉️</div>
              <p className="font-display text-lg text-dark-navy font-semibold leading-snug">
                A highly classified birthday transmission has arrived.
              </p>
              <p className="text-[10px] text-dark-navy/40 mt-4 tracking-widest font-mono">
                CLASSIFIED · LEVEL 7 · DO NOT FORWARD
              </p>
            </div>
          </div>

          {/* Envelope front (bottom triangle) */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              width: 0,
              height: 0,
              borderLeft: '150px solid transparent',
              borderRight: '150px solid transparent',
              borderBottom: '100px solid #2a3142',
              zIndex: 2,
            }}
          />

          {/* Wax seal (closed) */}
          {phase === 'closed' && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-cream z-10"
              style={{
                background: 'linear-gradient(135deg, #c0392b 0%, #922b21 100%)',
                boxShadow: '0 4px 16px rgba(192, 57, 43, 0.4), inset 0 -2px 4px rgba(0,0,0,0.3)',
              }}
            >
              ✦
            </div>
          )}

          {/* Crack flash */}
          {phase === 'opening' && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 z-20"
              style={{ animation: 'shake 0.4s ease-in-out' }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(232,169,60,0.6) 0%, transparent 70%)',
                  animation: 'sparkle-pop 0.6s ease-out',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Open Anyway button */}
      {phase === 'opened' && (
        <div
          className="mt-44 animate-fade-in-up"
          style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards', transform: 'translateY(-50px)' }}
        >
          <MagneticButton onClick={onContinue} variant="primary">
            Open Anyway
          </MagneticButton>
        </div>
      )}

      {/* Hint */}
      {phase === 'closed' && (
        <p className="text-cream/30 text-sm mt-8 animate-pulse">hover the envelope...</p>
      )}
    </div>
  );
}
