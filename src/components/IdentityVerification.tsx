import { useEffect, useState } from 'react';
import MagneticButton from './MagneticButton';

type IdentityVerificationProps = {
  onContinue: () => void;
};

const STEPS = [
  { label: 'Checking human status...', duration: 1200 },
  { label: 'Checking birthday eligibility...', duration: 1400 },
  { label: "Confirming sleep schedule is permanently broken...", duration: 1800 },
  { label: 'Verdict: Inconclusive.', duration: 800 },
];

export default function IdentityVerification({ onContinue }: IdentityVerificationProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let stepIndex = 0;
    let progressVal = 0;
    let cancelled = false;

    const runStep = () => {
      if (cancelled) return;
      if (stepIndex >= STEPS.length) {
        setDone(true);
        return;
      }
      setCurrentStep(stepIndex);
      const stepDuration = STEPS[stepIndex].duration;
      const startProgress = progressVal;
      const targetProgress = ((stepIndex + 1) / STEPS.length) * 100;
      const startTime = Date.now();

      const tick = setInterval(() => {
        if (cancelled) { clearInterval(tick); return; }
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(1, elapsed / stepDuration);
        progressVal = startProgress + (targetProgress - startProgress) * ratio;
        setProgress(progressVal);

        if (ratio >= 1) {
          clearInterval(tick);
          stepIndex++;
          setTimeout(runStep, 200);
        }
      }, 30);
    };

    const timer = setTimeout(runStep, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="glass-strong rounded-3xl p-6 sm:p-10 w-full max-w-lg shadow-float">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🔍</span>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-cream">Identity Verification</h2>
            <p className="text-[10px] text-cream/40 tracking-widest font-mono">DEPT. OF BIRTHDAY AFFAIRS</p>
          </div>
        </div>

        {/* Terminal output */}
        <div className="space-y-3 mb-6 min-h-[160px]">
          {STEPS.slice(0, currentStep + 1).map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 animate-fade-in-up"
              style={{ animationDuration: '0.4s' }}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                  i < currentStep
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-amber-400/20 text-amber-300 animate-pulse'
                }`}
              >
                {i < currentStep ? '✓' : '•'}
              </div>
              <span className={`text-sm font-mono ${i < currentStep ? 'text-cream/50 line-through' : 'text-cream/90'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-cream/40 mb-2 font-mono">
            <span>SCANNING...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-cream/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #e8a93c 0%, #e07856 100%)' }}
            >
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  animation: 'progress-shine 1s linear infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* Continue button */}
        {done && (
          <div className="animate-fade-in-up" style={{ animationDuration: '0.5s' }}>
            <div className="text-center mb-4">
              <p className="text-cream/60 text-sm italic">
                The system couldn't confirm or deny your existence. Close enough.
              </p>
            </div>
            <div className="flex justify-center">
              <MagneticButton onClick={onContinue} variant="primary">
                Continue
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
