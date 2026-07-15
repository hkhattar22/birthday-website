import { useState, useRef, type MouseEvent } from 'react';
import MagneticButton from './MagneticButton';

type BirthdayBuffProps = {
  onContinue: () => void;
  onConfetti?: () => void;
};

type BuffCard = {
  id: number;
  emoji: string;
  title: string;
  blessing: string;
  color: string;
  glow: string;
};

const CARDS: BuffCard[] = [
  {
    id: 0,
    emoji: '🐈',
    title: 'Cat Luck',
    blessing: 'You will be chosen by at least one random cat this year. It will stare at you like it owes you money, then sit on your lap. It will be cute and fluffy ofcourse.',
    color: 'linear-gradient(135deg, #6b8ca6 0%, #4a6378 100%)',
    glow: 'rgba(107, 140, 166, 0.4)',
  },
  {
    id: 1,
    emoji: '🍕',
    title: 'Infinite Snack Probability',
    blessing: 'Snacks will appear exactly when you\'re about to give up. The universe has your back. Specifically, the snack part of the universe.',
    color: 'linear-gradient(135deg, #e07856 0%, #b5583c 100%)',
    glow: 'rgba(224, 120, 86, 0.4)',
  },
  {
    id: 2,
    emoji: '🧙',
    title: 'Main Character Energy',
    blessing: 'Your life soundtrack becomes significantly cooler. You\'ll feel like the protagonist of a story, even if it\'s just a story about you trying to find your keys.',
    color: 'linear-gradient(135deg, #3d5a4a 0%, #2a3f33 100%)',
    glow: 'rgba(61, 90, 74, 0.4)',
  },
];

export default function BirthdayBuff({ onContinue, onConfetti }: BirthdayBuffProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardClick = (id: number) => {
    if (selected !== null) return;
    setSelected(id);
    onConfetti?.();
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, index: number) => {
    if (selected !== null) return;
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) scale(1.05)`;
  };

  const handleMouseLeave = (index: number) => {
    if (selected !== null) return;
    const card = cardRefs.current[index];
    if (card) card.style.transform = '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="relative z-10 text-center max-w-3xl w-full">
        {/* Title */}
        <div className="mb-10 animate-fade-in-up">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-cream mb-2">Section 5: Choose Your Birthday Buff</h2>
          <p className="text-cream/50 text-sm">
            {selected === null ? 'Pick one. No take-backs. (Okay, maybe take-backs.)' : 'Your blessing has been bestowed.'}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10">
          {CARDS.map((card, i) => {
            const isSelected = selected === card.id;
            const isDimmed = selected !== null && !isSelected;
            return (
              <div
                key={card.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                onClick={() => handleCardClick(card.id)}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => handleMouseLeave(i)}
                className="cursor-pointer no-select tilt-card"
                style={{
                  opacity: isDimmed ? 0.3 : 1,
                  transform: isSelected ? 'scale(1.1)' : undefined,
                  transition: 'opacity 0.4s ease, transform 0.3s ease',
                  pointerEvents: isDimmed ? 'none' : 'auto',
                }}
              >
                {/* Card */}
                <div
                  className="rounded-2xl p-6 relative"
                  style={{
                    width: '260px',
                    minHeight: '360px',
                    background: card.color,
                    boxShadow: isSelected
                      ? `0 20px 60px rgba(0,0,0,0.4), 0 0 50px ${card.glow}`
                      : '0 8px 32px rgba(0,0,0,0.25)',
                    border: isSelected ? '2px solid rgba(232,169,60,0.5)' : '1px solid rgba(250,243,231,0.1)',
                  }}
                >
                  {/* Emoji */}
                  <div className="text-6xl mb-4 mt-4" style={{ filter: isSelected ? 'none' : 'grayscale(0.2)' }}>
                    {card.emoji}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-semibold text-cream mb-3">{card.title}</h3>

                  {/* Blessing */}
                  {isSelected ? (
                    <p className="text-cream/80 text-sm leading-relaxed animate-fade-in-up" style={{ animationDuration: '0.5s' }}>
                      {card.blessing}
                    </p>
                  ) : (
                    <p className="text-cream/40 text-sm italic">Click to reveal blessing</p>
                  )}

                  {/* Decorative sparkles */}
                  {isSelected && (
                    <>
                      <div className="absolute top-2 right-3 text-amber-300/40 text-xs animate-pulse">✦</div>
                      <div className="absolute bottom-2 left-3 text-amber-300/40 text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue */}
        {selected !== null && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-cream/50 text-sm italic mb-6">
              May your {CARDS[selected].title.toLowerCase()} serve you well this year.
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
