import { useEffect, useRef, useState } from 'react';

export type PixelCatMode = 'walk-in' | 'idle' | 'follow' | 'petted' | 'walk-away';

type PixelCatProps = {
  mode: PixelCatMode;
  onPet?: () => void;
  petCount?: number;
  birthdayHat?: boolean;
  className?: string;
  initialPos?: { x: number; y: number };
  staticPosition?: boolean;
};

type Heart = { id: number; x: number; y: number };

export default function PixelCat({
  mode,
  onPet,
  petCount = 0,
  birthdayHat = false,
  className = '',
  initialPos,
  staticPosition = false,
}: PixelCatProps) {
  const [pos, setPos] = useState(initialPos || { x: -10, y: 65 });
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPurring, setIsPurring] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [meowBubble, setMeowBubble] = useState(false);
  const [walkStep, setWalkStep] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hasWalkedIn = useRef(false);

  // Track mouse globally
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Walk-in animation
  useEffect(() => {
    if (mode === 'walk-in' && !hasWalkedIn.current) {
      hasWalkedIn.current = true;
      let x = -10;
      setDirection(1);
      const interval = setInterval(() => {
        x += 1.5;
        setPos({ x, y: 65 });
        setWalkStep((s) => s + 1);
        if (x >= 42) {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Follow mouse
  useEffect(() => {
    if (mode === 'follow' || mode === 'petted') {
      const interval = setInterval(() => {
        const mouse = mouseRef.current;
        const windowW = window.innerWidth;
        const targetX = (mouse.x / windowW) * 100;
        setPos((prev) => {
          const dx = targetX - prev.x;
          const newX = prev.x + dx * 0.04;
          if (dx > 1) setDirection(1);
          else if (dx < -1) setDirection(-1);
          return { ...prev, x: Math.max(5, Math.min(85, newX)) };
        });
        setWalkStep((s) => s + 1);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Walk away
  useEffect(() => {
    if (mode === 'walk-away') {
      let x = pos.x;
      const dir = x < 50 ? -1 : 1;
      setDirection(dir);
      const interval = setInterval(() => {
        x += 2 * dir;
        setPos((prev) => ({ ...prev, x }));
        setWalkStep((s) => s + 1);
        if (x > 115 || x < -15) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const handlePet = () => {
    if (mode !== 'follow' && mode !== 'petted') return;
    setIsPurring(true);
    setMeowBubble(true);
    setTimeout(() => setIsPurring(false), 600);
    setTimeout(() => setMeowBubble(false), 1500);

    const newHearts: Heart[] = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 50,
      y: -20 - Math.random() * 20,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 1500);

    onPet?.();
  };

  const isMoving = mode === 'walk-in' || mode === 'follow' || mode === 'petted' || mode === 'walk-away';
  const bounceY = isMoving ? Math.sin(walkStep * 0.3) * 3 : 0;

  const positionStyle = staticPosition
    ? {
        transform: `translateY(${bounceY}px) scaleX(${direction})`,
        transition: 'transform 0.3s ease',
      }
    : {
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translateX(-50%) translateY(${bounceY}px) scaleX(${direction})`,
        transition: 'top 0.3s ease',
        zIndex: 50,
      };

  return (
    <div
      className={`${staticPosition ? 'relative' : 'absolute'} pointer-events-auto cursor-pointer no-select ${isPurring ? 'animate-purr' : ''} ${className}`}
      style={positionStyle}
      onClick={handlePet}
    >
      {/* Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '0',
            transform: `translateX(${h.x}px)`,
            animation: 'float-up 1.5s ease-out forwards',
            fontSize: '16px',
          }}
        >
          💗
        </div>
      ))}

      {/* Meow bubble */}
      {meowBubble && (
        <div
          className="absolute left-1/2 -translate-x-1/2 glass-strong px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap text-cream"
          style={{ top: '-32px', animation: 'meow-bubble 1.5s ease-out forwards' }}
        >
          meow~
        </div>
      )}

      {/* Birthday hat */}
      {birthdayHat && (
        <div
          className="absolute left-1/2"
          style={{
            top: '-18px',
            transform: `translateX(-50%) scaleX(${direction}) rotate(${direction * -12}deg)`,
            fontSize: '20px',
          }}
        >
          🎩
        </div>
      )}

      {/* Pixel cat SVG */}
      <svg
        width="56"
        height="48"
        viewBox="0 0 32 28"
        className="pixel-cat"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Ears */}
        <rect x="6" y="2" width="4" height="4" fill="#3a3a3a" />
        <rect x="22" y="2" width="4" height="4" fill="#3a3a3a" />
        <rect x="7" y="3" width="2" height="2" fill="#ff8fa3" />
        <rect x="23" y="3" width="2" height="2" fill="#ff8fa3" />
        {/* Head */}
        <rect x="6" y="6" width="20" height="12" fill="#4a4a4a" />
        <rect x="8" y="8" width="16" height="8" fill="#5a5a5a" />
        {/* Eyes */}
        <rect x="9" y="10" width="3" height="3" fill="#7fb3d5" />
        <rect x="20" y="10" width="3" height="3" fill="#7fb3d5" />
        <rect x="10" y="11" width="1" height="1" fill="#fff" />
        <rect x="21" y="11" width="1" height="1" fill="#fff" />
        {/* Nose */}
        <rect x="15" y="13" width="2" height="1" fill="#ff8fa3" />
        {/* Mouth */}
        <rect x="14" y="14" width="1" height="1" fill="#3a3a3a" />
        <rect x="17" y="14" width="1" height="1" fill="#3a3a3a" />
        {/* Whiskers */}
        <rect x="3" y="12" width="3" height="1" fill="#4a4a4a" />
        <rect x="26" y="12" width="3" height="1" fill="#4a4a4a" />
        <rect x="3" y="14" width="3" height="1" fill="#4a4a4a" />
        <rect x="26" y="14" width="3" height="1" fill="#4a4a4a" />
        {/* Body */}
        <rect x="8" y="18" width="16" height="6" fill="#4a4a4a" />
        <rect x="10" y="20" width="12" height="2" fill="#5a5a5a" />
        {/* Legs */}
        <rect x="9" y="24" width="3" height="3" fill="#3a3a3a" />
        <rect x="20" y="24" width="3" height="3" fill="#3a3a3a" />
        {/* Tail */}
        <rect x="26" y="16" width="3" height="2" fill="#4a4a4a" />
        <rect x="28" y="14" width="2" height="3" fill="#4a4a4a" />
      </svg>

      {/* Pet count badge */}
      {petCount > 0 && (mode === 'petted' || mode === 'follow') && (
        <div className="absolute left-1/2 -translate-x-1/2 glass px-2 py-0.5 rounded-full text-[10px] font-bold text-cream" style={{ top: '52px' }}>
          {petCount}/5 pets
        </div>
      )}
    </div>
  );
}
