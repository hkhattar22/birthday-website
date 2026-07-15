import { useState } from 'react';
import MagneticButton from './MagneticButton';

type MemoryMachineProps = {
    onContinue: () => void;
};

type Polaroid = {
    id: number;
    emoji: string;
    label: string;
    caption: string;
    rotation: number;
    bgColor: string;
    revealType: 'childhood' | 'bowling' | 'friends';
};

const POLAROIDS: Polaroid[] = [
    {
        id: 0,
        emoji: "🧸",
        label: "📼 Memory #001",
        caption: "Friends since our biggest concern was finishing homework before cartoons.",
        rotation: -5,
        bgColor: "linear-gradient(135deg,#6a4c93,#43316b)",
        revealType: 'childhood',
    },
    {
        id: 1,
        emoji: "🎳",
        label: "🎳 Memory #002",
        caption: "Bowling score has been sealed to protect my dignity.",
        rotation: 3,
        bgColor: "linear-gradient(135deg,#6b8ca6,#4a6378)",
        revealType: 'bowling',
    },
    {
        id: 2,
        emoji: "🥂",
        label: "📸 Memory #003",
        caption: "Still somehow putting up with each other.",
        rotation: -2,
        bgColor: "linear-gradient(135deg,#e07856,#b5583c)",
        revealType: 'friends',
    },
];

export default function MemoryMachine({ onContinue }: MemoryMachineProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [viewed, setViewed] = useState<Set<number>>(new Set());

    const handlePolaroidClick = (id: number) => {
        if (selected === id) {
            setSelected(null);
        } else {
            setSelected(id);
            setViewed((prev) => new Set(prev).add(id));
        }
    };

    const allViewed = viewed.size === POLAROIDS.length;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative py-12">
            <div className="relative z-10 text-center max-w-3xl w-full">
                {/* Title */}
                <div className="mb-10 animate-fade-in-up">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-cream mb-2">Section 4: Classified Evidence</h2>
                    <p className="text-cream/50 text-sm sm:text-base italic">
                        The investigation against you has been ongoing for years.
                    </p>
                </div>

                {/* Polaroids */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
                    {POLAROIDS.map((p, i) => {
                        const isSelected = selected === p.id;
                        return (
                            <div
                                key={p.id}
                                onClick={() => handlePolaroidClick(p.id)}
                                className="cursor-pointer no-select"
                                style={{
                                    animation: 'polaroid-drop 0.6s ease-out forwards',
                                    animationDelay: `${i * 0.2}s`,
                                    opacity: 0,
                                    ['--rot' as string]: `${p.rotation}deg`,
                                    transform: isSelected ? 'scale(1.15) rotate(0deg)' : `rotate(${p.rotation}deg)`,
                                    zIndex: isSelected ? 20 : 10,
                                    transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            >
                                {/* Polaroid frame */}
                                <div
                                    className="rounded-lg shadow-float p-3 pb-14 relative"
                                    style={{
                                        background: '#faf3e7',
                                        width: '170px',
                                        boxShadow: isSelected
                                            ? '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(232,169,60,0.2)'
                                            : '0 8px 32px rgba(0,0,0,0.25)',
                                    }}
                                >
                                    {/* Photo area */}
                                    <div
                                        className="rounded-md w-full flex items-center justify-center text-5xl"
                                        style={{ background: p.bgColor, height: '130px' }}
                                    >
                                        <span className="animate-float-rotate" style={{ animationDuration: `${4 + i}s` }}>
                                            {p.emoji}
                                        </span>
                                    </div>
                                    {/* Label */}
                                    <p className="text-[10px] text-dark-navy/50 font-mono mt-2 text-center tracking-wide">
                                        {p.label}
                                    </p>
                                    {/* Caption */}
                                    <p className="text-[10px] text-dark-navy/70 font-medium text-center leading-tight mt-1">
                                        {p.caption}
                                    </p>
                                    {/* Tape decoration */}
                                    <div
                                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 rounded-sm opacity-60"
                                        style={{ background: 'rgba(232, 169, 60, 0.3)' }}
                                    />
                                    {/* Viewed checkmark */}
                                    {viewed.has(p.id) && !isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center text-[10px] text-green-400">
                                            ✓
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Reveal panel */}
                {selected !== null && (
                    <div className="animate-fade-in-up mb-8" style={{ animationDuration: '0.4s' }}>
                        <RevealPanel polaroid={POLAROIDS[selected]} />
                    </div>
                )}

                {/* Continue button */}
                {allViewed && (
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <p className="text-cream/40 text-sm italic mb-6">
                            All evidence has been reviewed. The dossier is... thorough.
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

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="glass-strong rounded-2xl p-6 max-w-md mx-auto text-left">
            <h3 className="text-amber-300 font-display text-lg mb-4">{title}</h3>
            {children}
        </div>
    );
}

function ChildhoodReveal() {
    return (
        <Card title="🧸 Childhood Friendship">
            <p><strong>Friendship Started:</strong> Somewhere between sharpened pencils and unfinished homework.</p>

            <p className="mt-3">
                <strong>Survived:</strong> School, watching tv after school,cringe phases, exams and somehow adulthood.
            </p>


            <div className="mt-5 rounded-xl bg-white/5 p-4 italic text-cream/70">
                We grew up... but somehow our sense of humour didn't.
            </div>
        </Card>
    );
}

// 5. BowlingReveal

function BowlingReveal() {
    return (
        <Card title="🎳 Official Match Report">
            <p><strong>Winner:</strong> You</p>
            <p className="mt-3"><strong>Runner Up:</strong> Me</p>
            <p className="mt-3"><strong>Cause of Defeat:</strong> Skill issue.</p>

            <div className="mt-5 rounded-xl bg-white/5 p-4 italic text-cream/70">
                My lawyer has advised me not to reveal the final score.
                <br /><br />
                A rematch is definitely happening.
            </div>
        </Card>
    );
}

// 6. FriendsReveal

function FriendsReveal() {
    return (
        <Card title="🥂 Friendship Stats">
            <p><strong>Friendship:</strong> 17+ years</p>
            <p className="mt-3"><strong>Random Roasts:</strong> Unlimited</p>
            <p className="mt-3"><strong>Shared Braincells:</strong> Still under investigation.</p>

            <div className="mt-5 rounded-xl bg-white/5 p-4 italic text-cream/70">
                Here's to another year of terrible jokes, random plans,
                and pretending we're responsible adults.
                <br /><br />
                Happy Birthday ❤️
            </div>
        </Card>
    );
}

function RevealPanel({ polaroid }: { polaroid: Polaroid }) {
    switch (polaroid.revealType) {
        case 'childhood':
            return <ChildhoodReveal />;
        case 'bowling':
            return <BowlingReveal />;
        case 'friends':
            return <FriendsReveal />;
    }
}

function DossierReveal() {
    const crimes = [
        'Stealing fries',
        'Replying "5 mins" after 40 mins',
        'Making terrible financial decisions',
    ];

    return (
        <div className="glass-strong rounded-2xl p-6 max-w-md mx-auto text-left">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cream/10">
                <span className="text-lg">🗂️</span>
                <p className="text-amber-300 text-xs tracking-[0.2em] uppercase font-bold">STATUS</p>
            </div>

            {/* Threat level */}
            <div className="mb-5">
                <p className="text-cream/50 text-xs font-mono mb-1">Threat Level:</p>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-4 h-4 rounded-sm"
                                style={{
                                    backgroundColor: i < 2 ? '#3d5a4a' : 'rgba(250,243,231,0.1)',
                                    boxShadow: i < 2 ? '0 0 8px rgba(61,90,74,0.5)' : 'none',
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-cream/80 text-sm font-semibold">Mostly Harmless</p>
                </div>
            </div>

            {/* Known crimes */}
            <div>
                <p className="text-cream/50 text-xs font-mono mb-2">Known Crimes:</p>
                <ul className="space-y-2">
                    {crimes.map((crime, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-2 text-cream/80 text-sm animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.4s' }}
                        >
                            <span className="text-coral mt-0.5">•</span>
                            <span>{crime}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Stamp */}
            <div className="mt-5 flex justify-end">
                <div
                    className="px-3 py-1 rounded border-2 border-coral/40 text-coral/60 text-[10px] font-bold tracking-widest rotate-[-8deg]"
                    style={{ borderStyle: 'double' }}
                >
                    CLASSIFIED
                </div>
            </div>
        </div>
    );
}

function LinkedInReveal() {
    return (
        <div className="glass-strong rounded-2xl p-6 max-w-md mx-auto text-left">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cream/10">
                <div className="w-7 h-7 rounded-md bg-sky/30 flex items-center justify-center text-xs font-bold text-cream">in</div>
                <p className="text-sky text-xs tracking-[0.15em] uppercase font-bold">Achievement Unlocked</p>
            </div>

            {/* Achievement */}
            <p className="text-cream/80 text-sm font-semibold mb-4">Joined meeting.</p>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-base">📷</span>
                    <span className="text-cream/60 text-sm">Camera Off.</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base">🎤</span>
                    <span className="text-cream/60 text-sm">Mic Muted.</span>
                </div>
                <div className="pt-2 border-t border-cream/10">
                    <p className="text-cream/50 text-xs font-mono mb-1">Contributed:</p>
                    <p className="text-cream/80 text-sm italic">"Yeah, I agree."</p>
                </div>
            </div>

            {/* LinkedIn-style engagement */}
            <div className="mt-4 flex items-center gap-4 text-[10px] text-cream/30 font-mono">
                <span>👍 1,247</span>
                <span>💬 89</span>
                <span>🔄 12</span>
            </div>
        </div>
    );
}

function SteamReveal() {
    const skills = [
        { text: 'Paying bills', passed: true },
        { text: 'Making coffee', passed: true },
        { text: 'Fixing sleep schedule', passed: false },
        { text: 'Folding clothes immediately', passed: false },
    ];

    return (
        <div className="glass-strong rounded-2xl p-6 max-w-md mx-auto text-left">
            {/* Steam-style header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cream/10">
                <div className="w-7 h-7 rounded-full bg-cream/10 flex items-center justify-center">
                    <span className="text-xs">⚙️</span>
                </div>
                <p className="text-cream/60 text-xs tracking-[0.15em] uppercase font-bold">Certified Adult</p>
            </div>

            {/* Skills */}
            <p className="text-cream/50 text-xs font-mono mb-3">Skills</p>
            <ul className="space-y-2.5">
                {skills.map((skill, i) => (
                    <li
                        key={i}
                        className="flex items-center gap-2 text-sm animate-fade-in-up"
                        style={{ animationDelay: `${i * 0.12}s`, animationDuration: '0.3s' }}
                    >
                        <span className={`text-base ${skill.passed ? 'text-green-400' : 'text-coral'}`}>
                            {skill.passed ? '✓' : '✗'}
                        </span>
                        <span className={skill.passed ? 'text-cream/80' : 'text-cream/50 line-through'}>
                            {skill.text}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Progress bar */}
            <div className="mt-5">
                <div className="flex justify-between text-[10px] text-cream/40 mb-1 font-mono">
                    <span>Adulthood Progress</span>
                    <span>50%</span>
                </div>
                <div className="h-2 bg-cream/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{ width: '50%', background: 'linear-gradient(90deg, #3d5a4a 0%, #7fb3d5 100%)' }}
                    />
                </div>
            </div>
        </div>
    );
}
