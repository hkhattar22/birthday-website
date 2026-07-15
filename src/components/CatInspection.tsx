import { useState, useEffect } from 'react';
import PixelCat, { type PixelCatMode } from './PixelCat';
import MagneticButton from './MagneticButton';

type CatInspectionProps = {
  onContinue: () => void;
};

type Phase = 'intro' | 'walking' | 'ignoring' | 'following' | 'petting' | 'complete';

export default function CatInspection({ onContinue }: CatInspectionProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [petCount, setPetCount] = useState(0);
  const [catMode, setCatMode] = useState<PixelCatMode>('walk-in');

  // Phase progression
  useEffect(() => {
    if (phase === 'intro') {
      const t = setTimeout(() => setPhase('walking'), 1000);
      return () => clearTimeout(t);
    }
    if (phase === 'walking') {
      const t = setTimeout(() => {
        setPhase('ignoring');
        setCatMode('idle');
      }, 4200);
      return () => clearTimeout(t);
    }
    if (phase === 'ignoring') {
      const t = setTimeout(() => {
        setPhase('following');
        setCatMode('follow');
      }, 3600);
      return () => clearTimeout(t);
    }
    if (phase === 'following') {
      const t = setTimeout(() => {
        setPhase('petting');
        setCatMode('petted');
      }, 1400);
      return () => clearTimeout(t);
    }
    if (phase === 'petting' && petCount >= 5) {
      setPhase('complete');
      setCatMode('walk-away');
      const t = setTimeout(() => {
        // cat walks away, show completion
      }, 100);
      return () => clearTimeout(t);
    }
  }, [phase, petCount]);

  const handlePet = () => {
    if (phase !== 'petting') return;
    setPetCount((c) => Math.min(5, c + 1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      {/* Cat */}
      {phase !== 'intro' && (
        <PixelCat
          mode={catMode}
          onPet={handlePet}
          petCount={petCount}
        />
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {phase === 'intro' && (
          <div className="animate-fade-in">
            <div className="text-5xl mb-4">🐾</div>
            <h2 className="font-display text-2xl font-semibold text-cream mb-2">Section 2: Cat Inspection</h2>
            <p className="text-cream/50 text-sm">A representative of the Cat Council is on the way...</p>
          </div>
        )}

        {phase === 'walking' && (
          <div className="animate-fade-in">
            <p className="text-cream/50 text-sm animate-pulse">A wild cat approaches...</p>
          </div>
        )}

        {phase === 'ignoring' && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-2xl font-semibold text-cream mb-3">Cat Inspection</h2>
            <p className="text-cream/60 text-base mb-2">The cat is evaluating you.</p>
            <p className="text-cream/40 text-sm italic">It's pretending not to notice you exist.</p>
          </div>
        )}

        {phase === 'following' && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-2xl font-semibold text-cream mb-3">Cat Inspection</h2>
            <p className="text-cream/60 text-base mb-2">The cat has decided you're worth investigating.</p>
            <p className="text-cream/40 text-sm">It's following your cursor now...</p>
          </div>
        )}

        {phase === 'petting' && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-2xl font-semibold text-cream mb-3">Pet the Cat</h2>
            <p className="text-cream/60 text-base mb-2">
              {petCount === 0 && 'Click the cat to pet it! It needs 5 pets to approve you.'}
              {petCount > 0 && petCount < 5 && `Keep petting! ${5 - petCount} more to go...`}
              {petCount >= 5 && 'The cat is thoroughly loved.'}
            </p>
            {petCount > 0 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < petCount ? 'bg-coral scale-110' : 'bg-cream/20'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'complete' && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-4xl mb-4">🐾</div>
            <h2 className="font-display text-2xl font-semibold text-cream mb-3">Inspection Complete</h2>
            <p className="text-cream/70 text-base mb-1">Human approved by Cat Council.</p>
            <p className="text-cream/40 text-sm italic mb-8">The cat has left tiny paw prints of approval.</p>
            <div className="flex justify-center">
              <MagneticButton onClick={onContinue} variant="primary">
                Continue
              </MagneticButton>
            </div>
          </div>
        )}
      </div>

      {/* Paw prints trail when cat leaves */}
      {phase === 'complete' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute text-sm"
              style={{
                left: `${20 + i * 12}%`,
                top: `${60 + Math.sin(i) * 10}%`,
                opacity: 0,
                transform: `rotate(${i * 15 - 30}deg)`,
                ['--rot' as string]: `${i * 15 - 30}deg`,
                animation: `paw-fade 3s ease-out forwards`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              🐾
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
