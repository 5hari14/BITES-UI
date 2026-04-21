import { useMemo } from 'react';
import { getVenue, getDishesForVenue } from '@/lib/data';
import { Flame } from 'lucide-react';

interface Props {
  venueId: string;
  c: any;
}

export default function FrequentlyOrdered({ venueId, c }: Props) {
  const venue = getVenue(venueId);

  const frequentDishes = useMemo(() => {
    if (!venue) return [];
    const { suggested, catalog } = getDishesForVenue(venueId);
    const venueDishes = venue.dishes.map((d, i) => ({
      name: d.name,
      emoji: d.emoji,
      rank: i + 1,
    }));

    const venueNames = new Set(venueDishes.map(d => d.name));
    const extras = [...suggested, ...catalog]
      .filter(d => !venueNames.has(d.name))
      .slice(0, 2)
      .map((d, i) => ({
        name: d.name,
        emoji: d.emoji,
        rank: venueDishes.length + i + 1,
      }));

    return [...venueDishes, ...extras].slice(0, 6);
  }, [venueId, venue]);

  if (!venue || frequentDishes.length === 0) return null;

  const topDish = frequentDishes[0];

  return (
    <div className="mx-5 mb-5">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Flame size={16} style={{ color: c.accent }} />
        <h3 className="text-sm font-semibold" style={{ color: c.text }}>Frequently Ordered</h3>
      </div>

      {/* Top dish highlight */}
      <div className="p-3 rounded-xl mb-2 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${c.accent}12, ${c.accent}05)`, border: `1px solid ${c.accent}25` }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${c.accent}18` }}>
          {topDish.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold" style={{ color: c.text }}>{topDish.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: c.gold, color: '#1a1a1a' }}>#1</span>
          </div>
          <span className="text-[10px]" style={{ color: c.textDim }}>Most popular dish</span>
        </div>
      </div>

      {/* Remaining dishes */}
      <div className="rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        {frequentDishes.slice(1).map((dish, i) => (
          <div key={dish.name}
            className="flex items-center gap-3 px-3 py-2.5"
            style={{ borderBottom: i < frequentDishes.length - 2 ? `1px solid ${c.border}` : 'none' }}>
            <span className="text-xs font-bold w-5 text-center" style={{ color: c.textDim }}>
              #{dish.rank}
            </span>
            <span className="text-base">{dish.emoji}</span>
            <span className="text-xs font-medium" style={{ color: c.text }}>{dish.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
