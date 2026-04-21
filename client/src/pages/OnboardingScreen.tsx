import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { IMAGES } from '@/lib/data';

const steps = [
  {
    emoji: '🍽️',
    title: 'Discover Amazing Food',
    subtitle: 'Find the best restaurants, cafes, and bars near you — curated by real foodies.',
    image: IMAGES.burger,
  },
  {
    emoji: '⭐',
    title: 'Rate & Review',
    subtitle: 'Share your honest ratings on food, service, vibe, and value. Help others discover hidden gems.',
    image: IMAGES.pasta,
  },
  {
    emoji: '👥',
    title: 'Join the Community',
    subtitle: 'Follow friends, compete on leaderboards, earn badges, and build your foodie reputation.',
    image: IMAGES.coffee,
  },
];

export default function OnboardingScreen() {
  const { navigate, login } = useApp();
  const { c, isDark } = useBiteTheme();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else login();
  };

  const current = steps[step];
  const overlayGrad = isDark
    ? `linear-gradient(to bottom, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.85) 50%, ${c.bg} 70%)`
    : `linear-gradient(to bottom, rgba(250,250,248,0.2) 0%, rgba(250,250,248,0.8) 50%, ${c.bg} 70%)`;

  return (
    <div className="flex flex-col min-h-[760px] relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={current.image} alt="" className="w-full h-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0" style={{ background: overlayGrad }} />
      </div>

      <div className="relative z-10 flex justify-end px-5 pt-14">
        <button onClick={login} className="text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ color: c.textMuted, background: c.surfaceAlt }}>
          Skip
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end px-5 pb-12">
        <div className="text-5xl mb-4">{current.emoji}</div>
        <h2 className="font-display text-3xl font-bold mb-3" style={{ color: c.text }}>
          {current.title}
        </h2>
        <p className="text-base leading-relaxed mb-8" style={{ color: c.textMuted }}>
          {current.subtitle}
        </p>

        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 32 : 8,
                background: i === step ? c.accent : c.surfaceAlt,
              }} />
          ))}
        </div>

        <button onClick={handleNext}
          className="w-full py-4 rounded-xl text-base font-semibold transition-all hover:opacity-90"
          style={{ background: c.accent, color: '#fff', boxShadow: `0 4px 20px ${c.accent}50` }}>
          {step === steps.length - 1 ? 'Get Started' : 'Next'}
        </button>

        {step === steps.length - 1 && (
          <button onClick={() => navigate('login')}
            className="w-full py-3 mt-3 rounded-xl text-sm font-medium transition-all"
            style={{ color: c.textMuted }}>
            Already have an account? Sign In
          </button>
        )}
      </div>
    </div>
  );
}
