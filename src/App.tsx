import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import StarField from './components/StarField';
import MagneticButton from './components/MagneticButton';
import OpeningScreen from './components/OpeningScreen';
import IdentityVerification from './components/IdentityVerification';
import CatInspection from './components/CatInspection';
import BirthdaySpell from './components/BirthdaySpell';
import MemoryMachine from './components/MemoryMachine';
import BirthdayBuff from './components/BirthdayBuff';
import Finale from './components/Finale';
import PixelCat from './components/PixelCat';
import ConfettiLayer, { useConfetti } from './components/ConfettiLayer';

type Section =
  | 'opening'
  | 'identity'
  | 'cat'
  | 'spell'
  | 'memory'
  | 'buff'
  | 'finale';

export default function App() {
  const [section, setSection] = useState<Section>('opening');
  const [transitioning, setTransitioning] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [confettiMode, setConfettiMode] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [mischiefMessage, setMischiefMessage] = useState<string | null>(null);
  const [meowCat, setMeowCat] = useState(false);
  const [meowBuffer, setMeowBuffer] = useState('');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const confetti = useConfetti();

  // Transition between sections with GSAP
  const transitionTo = useCallback((next: Section) => {
    if (transitioning) return;
    setTransitioning(true);

    const tl = gsap.timeline();
    tl.to(sectionRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        setSection(next);
        // Brighten as we approach finale
        if (next === 'finale') {
          setBrightness(0.3);
        }
      },
    });
    tl.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => setTransitioning(false),
      }
    );
  }, [transitioning]);

  // Brighten background during finale
  useEffect(() => {
    if (section === 'finale') {
      const timer = setTimeout(() => setBrightness(0.6), 1500);
      const timer2 = setTimeout(() => {
        setConfettiMode(true);
        setBrightness(0.8);
      }, 3000);
      return () => { clearTimeout(timer); clearTimeout(timer2); };
    }
  }, [section]);

  // Audio: simple synth for background music swell
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      return ctx;
    } catch {
      return null;
    }
  }, []);

  const playNote = useCallback((freq: number, duration: number, delay: number = 0, volume: number = 0.1) => {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const startTime = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }, [initAudio]);

  const playClickSound = useCallback(() => {
    playNote(800, 0.08, 0, 0.05);
  }, [playNote]);

  const playMusicSwell = useCallback(() => {
    // Simple ascending melody
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      playNote(freq, 0.8, i * 0.15, 0.08);
    });
    // Final chord
    setTimeout(() => {
      playNote(523.25, 2, 0, 0.06);
      playNote(659.25, 2, 0, 0.06);
      playNote(783.99, 2, 0, 0.06);
    }, notes.length * 150 + 200);
  }, [playNote]);

  // Grand finale sequence
  const handleGrandFinale = useCallback(() => {
    setShowGrandFinale(true);
    playClickSound();

    // Confetti burst
    confetti.burst(80);
    confetti.launchBalloons(10);

    // Fireworks after a beat
    setTimeout(() => confetti.launchFireworks(6), 500);
    setTimeout(() => confetti.launchFireworks(4), 1500);
    setTimeout(() => confetti.burst(50), 2000);

    // Music swell
    playMusicSwell();

    // Show achievement after the show
    setTimeout(() => {
      setShowAchievement(true);
      confetti.burst(60, 50, 40);
    }, 3500);
  }, [confetti, playClickSound, playMusicSwell]);

  // Easter egg: type "meow" to summon cat
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      const newBuffer = (meowBuffer + key).slice(-4);
      setMeowBuffer(newBuffer);

      if (newBuffer === 'meow') {
        setMeowCat(true);
        setMeowBuffer('');
        setTimeout(() => setMeowCat(false), 4000);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [meowBuffer]);

  // Easter egg: title click 7 times
  const handleTitleClick = useCallback(() => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    if (newCount === 7) {
      setMischiefMessage('Mischief... probably managed.');
      setTitleClickCount(0);
      confetti.burst(30, 50, 30);
      setTimeout(() => setMischiefMessage(null), 5000);
    }
  }, [titleClickCount, confetti]);

  // Click feedback on star clicks
  const handleStarClick = useCallback(() => {
    playClickSound();
  }, [playClickSound]);

  // Section content
  const renderSection = () => {
    switch (section) {
      case 'opening':
        return <OpeningScreen onContinue={() => transitionTo('identity')} />;
      case 'identity':
        return <IdentityVerification onContinue={() => transitionTo('cat')} />;
      case 'cat':
        return <CatInspection onContinue={() => transitionTo('spell')} />;
      case 'spell':
        return <BirthdaySpell onContinue={() => transitionTo('memory')} />;
      case 'memory':
        return <MemoryMachine onContinue={() => transitionTo('buff')} />;
      case 'buff':
        return (
          <BirthdayBuff
            onContinue={() => transitionTo('finale')}
            onConfetti={() => confetti.burst(40)}
          />
        );
      case 'finale':
        return (
          <Finale
            brightness={brightness}
            onGrandFinale={handleGrandFinale}
            showGrandFinale={showGrandFinale}
            showAchievement={showAchievement}
            titleClickCount={titleClickCount}
            onTitleClick={handleTitleClick}
            mischiefMessage={mischiefMessage}
          />
        );
    }
  };

  return (
    <>
      {/* Background */}
      <StarField
        brightness={brightness}
        confettiMode={confettiMode}
        onStarClick={handleStarClick}
      />

      {/* Meow cat easter egg */}
      {meowCat && (
        <div className="fixed bottom-10 left-10 z-[200] pointer-events-none">
          <PixelCat mode="idle" birthdayHat staticPosition initialPos={{ x: 0, y: 0 }} className="!relative" />
        </div>
      )}

      {/* Section content with GSAP transition */}
      <div ref={sectionRef} className="relative z-10">
        {renderSection()}
      </div>

      {/* Progress indicator (subtle) */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-1.5">
        {(['opening', 'identity', 'cat', 'spell', 'memory', 'buff', 'finale'] as Section[]).map((s, i) => {
          const sectionIndex = (['opening', 'identity', 'cat', 'spell', 'memory', 'buff', 'finale'] as Section[]).indexOf(section);
          return (
            <div
              key={s}
              className="w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i <= sectionIndex ? 'rgba(232,169,60,0.6)' : 'rgba(250,243,231,0.15)',
                transform: i === sectionIndex ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>

      {/* Confetti layer */}
      <ConfettiLayer
        pieces={confetti.pieces}
        balloons={confetti.balloons}
        fireworks={confetti.fireworks}
      />

      {/* Click feedback ripples */}
      <ClickRipples />
    </>
  );
}

// Click ripple effect component
function ClickRipples() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 800);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[90]">
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: '10px',
            height: '10px',
            border: '2px solid rgba(232,169,60,0.4)',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple-expand 0.8s ease-out forwards',
          }}
        />
      ))}
      <style>{`
        @keyframes ripple-expand {
          0% { width: 10px; height: 10px; opacity: 0.8; }
          100% { width: 60px; height: 60px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
