import { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';
import PixelCat from './PixelCat';

type FinaleProps = {
  brightness: number;
  onGrandFinale: () => void;
  showGrandFinale: boolean;
  showAchievement: boolean;
  titleClickCount: number;
  onTitleClick: () => void;
  mischiefMessage: string | null;
};

export default function Finale({
  brightness,
  onGrandFinale,
  showGrandFinale,
  showAchievement,
  titleClickCount,
  onTitleClick,
  mischiefMessage,
}: FinaleProps) {
  const [showHeartfelt, setShowHeartfelt] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Reveal sequence
  useEffect(() => {
    const t1 = setTimeout(() => setShowHeartfelt(true), 1000);
    const t2 = setTimeout(() => setShowButton(true), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* Happy Birthday title */}
        {!showAchievement && (
          <h1
            onClick={onTitleClick}
            className="font-display text-4xl sm:text-6xl font-bold text-cream mb-8 animate-title-shimmer cursor-pointer no-select select-none"
            style={{ textShadow: '0 0 40px rgba(232,169,60,0.4)' }}
          >
            Happy Birthday!
          </h1>
        )}

        {/* Mischief easter egg */}
        {mischiefMessage && (
          <div className="animate-fade-in-up mb-6">
            <p className="font-display text-lg text-amber-300/80 italic">{mischiefMessage}</p>
          </div>
        )}

        {/* Heartfelt message */}
        {showHeartfelt && !showAchievement && (
          <div className="animate-fade-in-up space-y-4 mb-10" style={{ animationDuration: '1s' }}>
            <p className="text-cream/80 text-base sm:text-lg leading-relaxed">
              Thanks for existing.
            </p>
            <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
              You somehow manage to be both incredibly responsible and incredibly questionable at the same time.
            </p>
            <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
              Here's to another year of bad jokes, random adventures, and making life a little less boring.
            </p>
            <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
              Hope this year treats you as well as every cat secretly believes they deserve to be treated.
            </p>
            <p className="font-display text-xl sm:text-2xl text-amber-300 font-semibold pt-2">
              Happy Birthday.
            </p>
          </div>
        )}

        {/* One Last Thing button */}
        {showButton && !showGrandFinale && !showAchievement && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <MagneticButton onClick={onGrandFinale} variant="primary">
              One Last Thing
            </MagneticButton>
          </div>
        )}

        {/* Grand finale running cat */}
        {showGrandFinale && !showAchievement && (
          <div className="fixed inset-0 pointer-events-none z-[60]">
            <div
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '-80px',
                animation: 'cat-run 4s ease-in-out forwards',
              }}
            >
              <PixelCat
                mode="idle"
                birthdayHat
                staticPosition
                initialPos={{ x: 0, y: 0 }}
                className="!relative"
              />
            </div>
          </div>
        )}

        {/* Achievement Unlocked */}
        {showAchievement && (
          <div className="animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
            {/* Achievement badge */}
            <div className="inline-block mb-8">
              <div
                className="relative rounded-3xl p-8 glass-strong shadow-glow"
                style={{ minWidth: '320px' }}
              >
                {/* Trophy */}
                <div className="text-6xl mb-4 animate-float-rotate">🏆</div>

                {/* Achievement label */}
                <p className="text-amber-300 text-xs tracking-[0.3em] uppercase font-bold mb-2">
                  Achievement Unlocked
                </p>

                {/* Achievement title */}
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream mb-4">
                  Successfully survived another trip around the sun.
                </h2>

                {/* Decoration */}
                <div className="flex justify-center gap-2 mt-4">
                  {['⭐', '🎂', '🎉', '🐈', '✨'].map((emoji, i) => (
                    <span
                      key={i}
                      className="text-lg animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>

                {/* Glow ring */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(232,169,60,0.15)',
                    border: '1px solid rgba(232,169,60,0.2)',
                  }}
                />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-cream/50 text-sm italic max-w-md mx-auto">
              You did it. Another lap around the sun. The cats are proud. Probably.
            </p>

            {/* Replay */}
            <div className="mt-8">
              <MagneticButton
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Replay bcz my friend worked so hard on this and I want to see it again
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
