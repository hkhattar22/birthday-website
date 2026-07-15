import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

type MagneticButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

export default function MagneticButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.25, y: y * 0.25 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-br from-amber-400 to-amber-500 text-dark-navy hover:from-amber-300 hover:to-amber-400 shadow-glow font-bold',
    secondary: 'glass-strong text-cream hover:bg-cream/10',
    ghost: 'text-cream/70 hover:text-cream hover:bg-cream/5',
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`magnetic-btn relative px-8 py-4 rounded-2xl font-semibold text-base no-select transition-all duration-300 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
