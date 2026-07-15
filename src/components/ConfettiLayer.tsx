import { useEffect, useState, useCallback } from 'react';

type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  color: string;
  size: number;
  shape: 'rect' | 'circle' | 'star';
};

type Balloon = {
  id: number;
  x: number;
  color: string;
  delay: number;
  drift: number;
};

type FireworkParticle = {
  id: number;
  x: number;
  y: number;
  fx: number;
  fy: number;
  color: string;
  delay: number;
};

const COLORS = ['#e8a93c', '#e07856', '#7fb3d5', '#3d5a4a', '#faf3e7', '#ff8fa3', '#f0c75e'];

export function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [fireworks, setFireworks] = useState<FireworkParticle[]>([]);

  const burst = useCallback((count = 60, originX = 50, originY = 50) => {
    const newPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: originX + (Math.random() - 0.5) * 20,
      y: originY,
      vx: (Math.random() - 0.5) * 15,
      vy: -(Math.random() * 12 + 5),
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      shape: ['rect', 'circle', 'star'][Math.floor(Math.random() * 3)] as 'rect' | 'circle' | 'star',
    }));
    setPieces((prev) => [...prev, ...newPieces]);
    const ids = new Set(newPieces.map((p) => p.id));
    setTimeout(() => setPieces((prev) => prev.filter((p) => !ids.has(p.id))), 3000);
  }, []);

  const launchBalloons = useCallback((count = 8) => {
    const newBalloons: Balloon[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: Math.random() * 90 + 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
      drift: (Math.random() - 0.5) * 100,
    }));
    setBalloons((prev) => [...prev, ...newBalloons]);
    const ids = new Set(newBalloons.map((b) => b.id));
    setTimeout(() => setBalloons((prev) => prev.filter((b) => !ids.has(b.id))), 7000);
  }, []);

  const launchFireworks = useCallback((count = 5) => {
    const newFireworks: FireworkParticle[] = [];
    for (let i = 0; i < count; i++) {
      const cx = Math.random() * 70 + 15;
      const cy = Math.random() * 40 + 15;
      for (let j = 0; j < 24; j++) {
        const angle = (j / 24) * Math.PI * 2;
        newFireworks.push({
          id: Date.now() + i * 1000 + j + Math.random(),
          x: cx,
          y: cy,
          fx: Math.cos(angle) * (Math.random() * 50 + 30),
          fy: Math.sin(angle) * (Math.random() * 50 + 30),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: i * 0.4 + Math.random() * 0.2,
        });
      }
    }
    setFireworks((prev) => [...prev, ...newFireworks]);
    const ids = new Set(newFireworks.map((f) => f.id));
    setTimeout(() => setFireworks((prev) => prev.filter((f) => !ids.has(f.id))), 3500);
  }, []);

  return { pieces, balloons, fireworks, burst, launchBalloons, launchFireworks };
}

export default function ConfettiLayer({
  pieces,
  balloons,
  fireworks,
}: {
  pieces: ConfettiPiece[];
  balloons: Balloon[];
  fireworks: FireworkParticle[];
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (pieces.length === 0 && balloons.length === 0 && fireworks.length === 0) return;
    const interval = setInterval(() => setTick((t) => t + 1), 16);
    return () => clearInterval(interval);
  }, [pieces.length, balloons.length, fireworks.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Confetti */}
      {pieces.map((p) => {
        const elapsed = (Date.now() - p.id) / 1000;
        const x = p.x + p.vx * elapsed * 8;
        const y = p.y + p.vy * elapsed * 8 + 40 * elapsed * elapsed;
        const rotation = p.rotation + p.vr * elapsed * 8;
        const opacity = Math.max(0, 1 - elapsed / 3);

        return (
          <div
            key={p.id}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, width: `${p.size}px`, height: `${p.size}px`, transform: `rotate(${rotation}deg)`, opacity }}
          >
            {p.shape === 'rect' && <div className="w-full h-full" style={{ backgroundColor: p.color, borderRadius: '2px' }} />}
            {p.shape === 'circle' && <div className="w-full h-full rounded-full" style={{ backgroundColor: p.color }} />}
            {p.shape === 'star' && <div className="w-full h-full flex items-center justify-center" style={{ color: p.color, fontSize: `${p.size}px` }}>★</div>}
          </div>
        );
      })}

      {/* Balloons */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0"
          style={{
            left: `${b.x}%`,
            animation: `balloon-float 7s ease-out forwards`,
            animationDelay: `${b.delay}s`,
            ['--drift' as string]: `${b.drift}px`,
          }}
        >
          <div className="relative">
            <div
              className="rounded-full"
              style={{ width: '40px', height: '52px', backgroundColor: b.color, boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.15)' }}
            />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-3 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-16" style={{ top: '52px', backgroundColor: 'rgba(250,243,231,0.4)' }} />
          </div>
        </div>
      ))}

      {/* Fireworks */}
      {fireworks.map((f) => (
        <div
          key={f.id}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: f.color,
            boxShadow: `0 0 10px ${f.color}, 0 0 20px ${f.color}`,
            animation: 'firework 1s ease-out forwards',
            animationDelay: `${f.delay}s`,
            ['--fx' as string]: `${f.fx}px`,
            ['--fy' as string]: `${f.fy}px`,
          }}
        />
      ))}
    </div>
  );
}
