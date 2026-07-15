import { useEffect, useRef, useState, useCallback } from 'react';

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkle: boolean;
  isCat: boolean;
  twinkleDelay: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
};

type PawPrint = {
  id: number;
  x: number;
  y: number;
  rotation: number;
};

type StarFieldProps = {
  brightness?: number;
  confettiMode?: boolean;
  onStarClick?: () => void;
};

export default function StarField({ brightness = 0, confettiMode = false, onStarClick }: StarFieldProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [paws, setPaws] = useState<PawPrint[]>([]);
  const frameRef = useRef<number>(0);

  // Generate stars once
  useEffect(() => {
    const count = window.innerWidth < 768 ? 50 : 90;
    const newStars: Star[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      twinkle: Math.random() > 0.4,
      isCat: false,
      twinkleDelay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  // Floating particles - spawn periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length >= 25) return prev;
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: 105,
            size: Math.random() * 4 + 2,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -(Math.random() * 0.4 + 0.2),
            life: 1,
            color: confettiMode
              ? `hsl(${Math.random() * 360}, 80%, 65%)`
              : 'rgba(232, 169, 60, 0.5)',
          },
        ];
      });
    }, 500);
    return () => clearInterval(interval);
  }, [confettiMode]);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.0025,
          }))
          .filter((p) => p.life > 0 && p.y > -10)
      );
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Occasional paw prints
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const paw: PawPrint = {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: Math.random() * 80 + 10,
          rotation: Math.random() * 60 - 30,
        };
        setPaws((prev) => [...prev, paw]);
        setTimeout(() => {
          setPaws((prev) => prev.filter((p) => p.id !== paw.id));
        }, 3500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStarClick = useCallback(
    (star: Star) => {
      // 15% chance to turn a star into a tiny cat
      if (!star.isCat && Math.random() < 0.15) {
        setStars((prev) => prev.map((s) => (s.id === star.id ? { ...s, isCat: true } : s)));
        setTimeout(() => {
          setStars((prev) => prev.map((s) => (s.id === star.id ? { ...s, isCat: false } : s)));
        }, 2500);
      }
      onStarClick?.();
    },
    [onStarClick]
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        transition: 'background 2.5s ease',
        background: `linear-gradient(180deg,
          rgba(18, 22, 31, ${Math.max(0, 1 - brightness * 0.75)}) 0%,
          rgba(26, 31, 46, ${Math.max(0, 1 - brightness * 0.55)}) 50%,
          rgba(18, 22, 31, ${Math.max(0, 1 - brightness * 0.75)}) 100%)`,
      }}
    >
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.isCat ? '20px' : `${star.size * 4}px`,
            height: star.isCat ? '20px' : `${star.size * 4}px`,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => handleStarClick(star)}
        >
          {star.isCat ? (
            <span style={{ fontSize: '18px', lineHeight: 1 }}>🐱</span>
          ) : (
            <div
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: '50%',
                backgroundColor: confettiMode
                  ? `hsl(${(star.id * 40) % 360}, 80%, 65%)`
                  : 'rgba(250, 243, 231, 0.9)',
                boxShadow: star.twinkle ? `0 0 ${star.size * 3}px rgba(250, 243, 231, 0.5)` : 'none',
                animation: star.twinkle ? `pulse-glow ${2 + star.twinkleDelay}s ease-in-out infinite` : 'none',
                animationDelay: `${star.twinkleDelay}s`,
              }}
            />
          )}
        </div>
      ))}

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: '0 0 6px rgba(232, 169, 60, 0.3)',
          }}
        />
      ))}

      {/* Paw prints */}
      {paws.map((paw) => (
        <div
          key={paw.id}
          className="absolute"
          style={{
            left: `${paw.x}%`,
            top: `${paw.y}%`,
            fontSize: '14px',
            opacity: 0,
            transform: `rotate(${paw.rotation}deg)`,
            ['--rot' as string]: `${paw.rotation}deg`,
            animation: 'paw-fade 3.5s ease-out forwards',
          }}
        >
          🐾
        </div>
      ))}
    </div>
  );
}
