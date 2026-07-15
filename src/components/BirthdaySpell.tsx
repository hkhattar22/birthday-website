import { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

type BirthdaySpellProps = {
  onContinue: () => void;
};

type Spell = {
  name: string;
  emoji: string;
  effect: string;
  works: boolean;
};

const SPELLS = [
  {
    name: 'Interviewus Crackium',
    emoji: '💼',
    effect: 'interview',
    works: false,
  },
  {
    name: 'Fortunus Maxima',
    emoji: '🍀',
    effect: 'luck',
    works: false,
  },
  {
    name: 'Dreamus Fulfillio',
    emoji: '✨',
    effect: 'dream',
    works: false,
  },
  {
    name: 'Happinessus Infinite',
    emoji: '🌟',
    effect: 'happiness',
    works: false,
  },
  {
    name: 'Birthdayus Celebrio',
    emoji: '🎂',
    effect: 'birthday',
    works: true,
  },
];

export default function BirthdaySpell({ onContinue }: BirthdaySpellProps) {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [castSpells, setCastSpells] = useState<Set<number>>(new Set());
  const [unlocked, setUnlocked] = useState(false);
  const [effectKey, setEffectKey] = useState(0);

  const handleSpellClick = (spell: Spell, index: number) => {
    if (unlocked) return;
    setSelectedSpell(spell);
    setCastSpells((prev) => new Set(prev).add(index));
    setEffectKey((k) => k + 1);
    if (spell.works) {
      setTimeout(() => setUnlocked(true), 6000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* Title */}
        {!unlocked && (
          <div className="mb-8 animate-fade-in-up">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-cream mb-2">Section 3: Birthday Spell</h2>
            <p className="text-cream/50 text-sm">An ancient spellbook floats before you. Cast spells by clicking the pages.</p>
          </div>
        )}

        {/* Spellbook */}
        {!unlocked && (
          <div className="relative mx-auto mb-6 w-full max-w-md">
            {/* Floating book */}
            <div className="relative animate-book-float" style={{ animationDuration: '5s' }}>
              {/* Book cover */}
              <div
                className="relative rounded-lg shadow-float mx-auto overflow-hidden"
                style={{
                  width: '100%',
                  maxWidth: '340px',
                  minHeight: '320px',
                  background: 'linear-gradient(135deg, #3d5a4a 0%, #2a3f33 100%)',
                  border: '2px solid rgba(232, 169, 60, 0.3)',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.4), 0 0 40px rgba(232,169,60,0.15)',
                }}
              >
                {/* Book spine */}
                <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-lg" style={{ background: 'rgba(0,0,0,0.3)' }} />
                {/* Book title */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center w-full px-4">
                  <p className="font-display text-amber-300/80 text-sm font-semibold tracking-wide">Spellbook</p>
                  <p className="text-amber-300/40 text-[10px] mt-1">of Questionable Magic</p>
                </div>
                {/* Pages */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-1.5 w-[230px]">
                  {SPELLS.map((spell, i) => {
                    const isCast = castSpells.has(i);
                    return (
                      <button
                        key={i}
                        onClick={() => handleSpellClick(spell, i)}
                        disabled={isCast}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs font-mono transition-all duration-300 no-select ${
                          isCast
                            ? 'bg-cream/5 text-cream/30 cursor-not-allowed'
                            : 'bg-cream/10 text-cream/80 hover:bg-amber-400/20 hover:text-amber-300 cursor-pointer hover:scale-105'
                        }`}
                      >
                        <span className="text-sm">{spell.emoji}</span>
                        <span className="flex-1 truncate">{spell.name}</span>
                        {isCast && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
                {/* Decorative corners */}
                <div className="absolute top-2 right-2 text-amber-300/30 text-xs">✦</div>
                <div className="absolute bottom-2 right-2 text-amber-300/30 text-xs">✦</div>
              </div>
            </div>

            {/* Spell effect area */}
            {selectedSpell && !unlocked && (
              <div
                key={effectKey}
                className="mt-6 glass-strong rounded-2xl p-6 animate-fade-in-up min-h-[200px] mx-auto max-w-xl"
                style={{ animationDuration: '0.4s' }}
              >
                <SpellEffect spell={selectedSpell} />
              </div>
            )}

            {!selectedSpell && (
              <p className="text-cream/30 text-sm mt-4 animate-pulse">Click a spell to cast it...</p>
            )}
          </div>
        )}

        {/* Unlocked state */}
        {unlocked && (
          <div className="animate-fade-in-up" style={{ animationDuration: '0.6s' }}>
            <div className="text-6xl mb-4 animate-float-rotate">🎂</div>
            <h2 className="font-display text-3xl font-semibold text-amber-300 mb-4 animate-title-shimmer">Birthday Unlocked!</h2>
            <p className="text-cream/60 text-base mb-8 italic">
              After several questionable attempts at magic, the birthday has been successfully unlocked.
              The spellbook closes itself, satisfied.
            </p>
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

function SpellEffect({ spell }: { spell: Spell }) {
  switch (spell.effect) {
    case 'interview':
      return <InterviewEffect />;

    case 'luck':
      return <LuckEffect />;

    case 'dream':
      return <DreamEffect />;

    case 'happiness':
      return <HappinessEffect />;

    case 'birthday':
      return <BirthdayEffect />;

    default:
      return null;
  }
}

function DreamEffect() {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="text-5xl mb-3">🌠</div>

      <h3 className="font-display text-xl text-amber-300 mb-4">
        Dreamus Fulfillio
      </h3>

      <p className="text-cream/80">
        Your wish has been submitted to the universe...
      </p>

      <div className="mt-4 animate-pulse text-cream/50">
        Processing...
      </div>

      <p className="mt-5 italic text-cream/60">
        Until then,
        keep believing in yourself.
      </p>
    </div>
  );
}

function HappinessEffect() {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="text-5xl mb-3">✨</div>

      <h3 className="font-display text-xl text-amber-300 mb-4">
        Happinessus Infinite
      </h3>

      <div className="w-full bg-cream/10 rounded-full h-3 overflow-hidden mb-4">
        <div
          className="h-full rounded-full"
          style={{
            width: "100%",
            background:
              "linear-gradient(90deg,#e8a93c,#ffd86b)"
          }}
        />
      </div>

      <p className="text-cream/80">
        Happiness meter successfully maxed out.
      </p>

      <p className="mt-3 text-cream/60 italic">
        Side effects may include
        random laughter,
        good memories,
        and unnecessary cake.
      </p>
    </div>
  );
}

function BirthdayEffect() {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="text-6xl mb-3 animate-pulse">
        🎂
      </div>

      <h3 className="font-display text-2xl text-amber-300 mb-4">
        Birthdayus Celebrio
      </h3>

      <p className="text-cream/80">
        The ancient spellbook recognizes
        a birthday...
      </p>

      <div className="mt-5 text-amber-300 font-semibold">
        ✨ Birthday Mode Activated ✨
      </div>

      <div className="mt-6 text-sm text-cream/60 space-y-1">
        <p>+365 new adventures</p>
        <p>+Infinite good memories</p>
        <p>+One extra slice of cake</p>
      </div>
    </div>
  );
}

function LuckEffect() {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="text-5xl mb-3">🍀</div>

      <h3 className="font-display text-xl text-amber-300 mb-4">
        Fortunus Maxima
      </h3>

      <p className="text-cream/80">
        ✨ Luck has been increased by 100%.
      </p>

      <p className="text-cream/60 mt-3 italic">
        May traffic lights stay green,
        HRs reply,
        and your phone never die at 1%.
      </p>
    </div>
  );
}

function InterviewEffect() {
  const [phase, setPhase] = useState<'flying' | 'reviewing' | 'result'>('flying');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reviewing'), 1500);
    const t2 = setTimeout(() => setPhase('result'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div>
      <div className="text-2xl mb-2">💼</div>
      <p className="font-display text-lg text-amber-300 font-semibold mb-3">Interviewus Crackium!</p>
      <div className="relative h-20 flex items-center justify-center">
        {phase === 'flying' && (
          <div
            className="text-4xl"
            style={{ animation: 'resume-fly 1.5s ease-out forwards' }}
          >
            📄
          </div>
        )}
        {phase === 'reviewing' && (
          <div className="flex items-center gap-3 animate-fade-in">
            <span className="text-3xl">📄</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-400"
                  style={{ animation: `pulse-glow 0.6s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <span className="text-xs text-cream/50 font-mono">HR reviewing...</span>
          </div>
        )}
        {phase === 'result' && (
          <div className="animate-fade-in-up">
            <p className="text-cream/80 text-sm font-mono">
              "Congratulations! You've got the job of your dreams."
            </p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes resume-fly {
          0% { transform: translateY(60px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function GhostEffect() {
  const [phase, setPhase] = useState<'notification' | 'opening' | 'ghosted'>('notification');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('opening'), 1500);
    const t2 = setTimeout(() => setPhase('ghosted'), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div>
      <div className="text-2xl mb-2">📧</div>
      <p className="font-display text-lg text-amber-300 font-semibold mb-3">HRus Ghostium!</p>
      <div className="relative h-20 flex items-center justify-center">
        {phase === 'notification' && (
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in" style={{ animationDuration: '0.3s' }}>
            <span className="text-xl">🔔</span>
            <div className="text-left">
              <p className="text-xs text-cream/80 font-semibold">New Email</p>
              <p className="text-[10px] text-cream/40">talent@company.com</p>
            </div>
          </div>
        )}
        {phase === 'opening' && (
          <div className="glass rounded-xl px-4 py-3 animate-fade-in" style={{ animationDuration: '0.3s' }}>
            <p className="text-xs text-cream/70 font-mono text-left">
              "Thank you for your interest..."
            </p>
            <div className="flex justify-center mt-2">
              <div className="text-xs text-cream/30 animate-pulse">opening...</div>
            </div>
          </div>
        )}
        {phase === 'ghosted' && (
          <div className="animate-fade-in-up">
            <p className="text-cream/80 text-sm font-mono mb-1">
              "Thank you for your interest..."
            </p>
            <p className="text-coral text-sm font-mono italic mt-2">
              No further communication received.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DeployEffect() {
  const [progress, setProgress] = useState(0);
  const [onFire, setOnFire] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setOnFire(true);
          return 100;
        }
        return p + 4;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="text-2xl mb-2">💻</div>
      <p className="font-display text-lg text-amber-300 font-semibold mb-3">Deployus Fridayium!</p>
      <div className="relative h-20 flex flex-col items-center justify-center gap-3">
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-[10px] text-cream/40 mb-1 font-mono">
            <span>Deploying to production...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-cream/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-50"
              style={{
                width: `${progress}%`,
                background: onFire
                  ? 'linear-gradient(90deg, #e07856 0%, #c0392b 100%)'
                  : 'linear-gradient(90deg, #3d5a4a 0%, #7fb3d5 100%)',
              }}
            />
          </div>
        </div>
        {onFire && (
          <div className="animate-fade-in-up flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <p className="text-coral text-sm font-mono font-bold">
              Production has entered the chat.
            </p>
            <span className="text-2xl">🔥</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CoffeeEffect() {
  const [phase, setPhase] = useState<'pouring' | 'filled' | 'notification' | 'drained'>('pouring');
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('filled'), 1500);
    const t2 = setTimeout(() => {
      setPhase('notification');
      setEnergy(100);
    }, 2500);
    const t3 = setTimeout(() => {
      setPhase('drained');
      setEnergy(15);
    }, 4000);

    const energyInterval = setInterval(() => {
      setEnergy((e) => {
        if (phase === 'pouring') return Math.min(100, e + 3);
        return e;
      });
    }, 40);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(energyInterval);
    };
  }, []);

  return (
    <div>
      <div className="text-2xl mb-2">☕</div>
      <p className="font-display text-lg text-amber-300 font-semibold mb-3">Cafeterius Revivio!</p>
      <div className="relative h-24 flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-4">
          {/* Coffee mug */}
          <div className="relative">
            <div
              className="w-10 h-12 rounded-b-lg rounded-t-sm border-2 border-cream/30 overflow-hidden relative"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                style={{
                  height: phase === 'pouring' ? `${energy}%` : '100%',
                  background: 'linear-gradient(180deg, #6b4423 0%, #4a2d18 100%)',
                }}
              />
            </div>
            {/* Steam */}
            {phase === 'pouring' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-cream/30 animate-pulse">☕</div>
            )}
          </div>

          {/* Energy bar */}
          <div>
            <p className="text-[10px] text-cream/40 mb-1 font-mono">Energy</p>
            <div className="w-24 h-3 bg-cream/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${energy}%`,
                  background:
                    energy > 50
                      ? 'linear-gradient(90deg, #3d5a4a 0%, #7fb3d5 100%)'
                      : 'linear-gradient(90deg, #c0392b 0%, #e07856 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {phase === 'notification' && (
          <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2 animate-fade-in" style={{ animationDuration: '0.3s' }}>
            <span className="text-sm">🔔</span>
            <span className="text-[10px] text-cream/70 font-mono">Teams: You have a new message</span>
          </div>
        )}

        {phase === 'drained' && (
          <p className="text-coral text-xs font-mono italic animate-fade-in">
            Energy drained. The cycle continues.
          </p>
        )}
      </div>
    </div>
  );
}

function LinkedInEffect() {
  const [phase, setPhase] = useState<'posting' | 'scrolling' | 'result'>('posting');
  const [scrollCount, setScrollCount] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('scrolling'), 2000);
    const t2 = setTimeout(() => setPhase('result'), 5500);

    const scrollInterval = setInterval(() => {
      if (phase === 'scrolling') {
        setScrollCount((c) => c + 1);
      }
    }, 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(scrollInterval);
    };
  }, [phase]);

  return (
    <div>
      <div className="text-2xl mb-2">🚀</div>
      <p className="font-display text-lg text-amber-300 font-semibold mb-3">LinkedInus Flexio!</p>
      <div className="relative h-28 flex flex-col items-center justify-center">
        {(phase === 'posting' || phase === 'scrolling') && (
          <div className="glass rounded-xl p-3 max-w-xs w-full text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-sky/30 flex items-center justify-center text-[10px] font-bold">N</div>
              <span className="text-[10px] text-cream/60 font-mono">2nd connections</span>
            </div>
            <p className="text-xs text-cream/80 leading-relaxed">
              "I'm humbled and excited to announce..."
            </p>
            {phase === 'scrolling' && (
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 bg-cream/10 rounded animate-pulse" style={{ width: '90%' }} />
                <div className="h-1.5 bg-cream/10 rounded animate-pulse" style={{ width: '75%', animationDelay: '0.1s' }} />
                <div className="h-1.5 bg-cream/10 rounded animate-pulse" style={{ width: '85%', animationDelay: '0.2s' }} />
                <div className="h-1.5 bg-cream/10 rounded animate-pulse" style={{ width: '60%', animationDelay: '0.3s' }} />
                <p className="text-[10px] text-cream/30 font-mono mt-2">
                  Still scrolling... ({scrollCount} paragraphs)
                </p>
              </div>
            )}
          </div>
        )}

        {phase === 'result' && (
          <div className="animate-fade-in-up text-center">
            <div className="text-3xl mb-2">🎂</div>
            <p className="text-cream/80 text-sm font-mono italic">
              "...I wished you Happy Birthday."
            </p>
            <p className="text-amber-300 text-sm font-semibold mt-3 animate-pulse">
              Birthday unlocked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
