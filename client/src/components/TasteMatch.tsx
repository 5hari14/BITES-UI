import { useEffect, useState } from 'react';
import { getTasteMatch, getVenue } from '@/lib/data';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';

interface Props {
  userId: string;
}

export default function TasteMatch({ userId }: Props) {
  const { openVenueDetail } = useApp();
  const { c } = useBiteTheme();
  const [animatedPct, setAnimatedPct] = useState(0);
  const [showShared, setShowShared] = useState(false);

  const match = getTasteMatch('michel', userId);

  useEffect(() => {
    setAnimatedPct(0);
    const timer = setTimeout(() => setAnimatedPct(match.percentage), 100);
    return () => clearTimeout(timer);
  }, [match.percentage]);

  const getMatchLabel = (pct: number) => {
    if (pct >= 85) return { text: 'Taste Twins!', emoji: '🔥', color: c.accent };
    if (pct >= 70) return { text: 'Great Match', emoji: '✨', color: c.gold };
    if (pct >= 50) return { text: 'Good Match', emoji: '👍', color: c.green };
    if (pct >= 30) return { text: 'Some Overlap', emoji: '🤝', color: c.blue };
    return { text: 'Different Tastes', emoji: '🌈', color: c.pink };
  };

  const label = getMatchLabel(match.percentage);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPct / 100) * circumference;

  return (
    <div className="mx-5 mb-4">
      <div className="rounded-xl overflow-hidden"
        style={{ background: c.surface, border: `1px solid ${c.border}` }}>

        <div className="p-4 flex items-center gap-4">
          <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
            <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
              <circle cx="48" cy="48" r={radius} fill="none"
                stroke={c.border} strokeWidth="6" />
              <circle cx="48" cy="48" r={radius} fill="none"
                stroke={label.color} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-extrabold leading-none"
                style={{ color: label.color }}>
                {animatedPct}%
              </span>
              <span className="text-[9px] mt-0.5" style={{ color: c.textDim }}>match</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base">{label.emoji}</span>
              <span className="font-display text-base font-bold" style={{ color: label.color }}>
                {label.text}
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: c.textMuted }}>
              Based on <span className="font-semibold" style={{ color: c.text }}>{match.sharedPlaces.length}</span> shared
              places out of <span className="font-semibold" style={{ color: c.text }}>{match.totalUnion}</span> combined
            </p>
            <button
              onClick={() => setShowShared(!showShared)}
              className="text-[11px] font-semibold transition-colors"
              style={{ color: c.accent }}>
              {showShared ? 'Hide shared places ▴' : 'View shared places ▾'}
            </button>
          </div>
        </div>

        <div className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: showShared ? 300 : 0, opacity: showShared ? 1 : 0 }}>
          <div style={{ borderTop: `1px solid ${c.divider}` }}>
            <div className="px-4 py-2.5">
              <div className="text-[11px] font-semibold mb-2" style={{ color: c.textDim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Places you both logged
              </div>
              <div className="space-y-1.5">
                {match.sharedPlaces.map(placeId => {
                  const venue = getVenue(placeId);
                  if (!venue) return null;
                  return (
                    <div key={placeId}
                      className="flex items-center gap-2.5 py-1.5 cursor-pointer transition-all rounded-lg px-1.5 -mx-1.5"
                      onClick={() => openVenueDetail(placeId)}>
                      <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: venue.gradient }}>
                        {venue.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: c.text }}>
                          {venue.name}
                        </div>
                        <div className="text-[10px]" style={{ color: c.textDim }}>
                          {venue.cuisine} · {venue.price}
                        </div>
                      </div>
                      <div className="font-display text-sm font-extrabold flex-shrink-0"
                        style={{ color: c.gold }}>
                        {venue.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
