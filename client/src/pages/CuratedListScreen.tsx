import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, Bookmark } from 'lucide-react';
import { venues } from '@/lib/data';

const curatedLists: Record<string, { title: string; emoji: string; by: string; desc: string; venueIds: string[]; gradient: string }> = {
  'top-burgers': {
    title: 'Top 10 Hottest Burgers in Limassol',
    emoji: '🔥',
    by: 'Bites Editors',
    desc: 'Our editors\' picks for the best burger joints in Limassol — from gourmet smash burgers to classic American-style stacks.',
    venueIds: ['bottega-amaro', 'grill-house', 'meze-republic', 'brunch-club'],
    gradient: 'linear-gradient(135deg, #FF6B35, #C74B1A)',
  },
  'best-italian': {
    title: 'Best Italian CY',
    emoji: '🇮🇹',
    by: 'Sofia K.',
    desc: 'The finest Italian restaurants across Cyprus — from authentic Neapolitan pizza to handmade pasta and fine dining.',
    venueIds: ['bottega-amaro', 'la-terrazza', 'napoli-express'],
    gradient: 'linear-gradient(135deg, #4ADE80, #22C55E)',
  },
  'best-coffee': {
    title: 'Best Flat Whites',
    emoji: '☕',
    by: 'Andreas M.',
    desc: 'The ultimate guide to the best flat whites on the island. Specialty coffee lovers, this one\'s for you.',
    venueIds: ['istorja-cafe', 'kboo-bakery'],
    gradient: 'linear-gradient(135deg, #F5C542, #D4A72C)',
  },
};

export default function CuratedListScreen() {
  const { goBack, openVenueDetail, toggleBookmark, bookmarkedVenues } = useApp();
  const { c, isDark } = useBiteTheme();
  const list = curatedLists['top-burgers'];
  const listVenues = list.venueIds.map(id => venues.find(v => v.id === id)).filter(Boolean) as typeof venues;

  const heroOverlay = isDark
    ? 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(13,13,13,0.95))'
    : 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(250,250,248,0.95))';

  return (
    <div>
      <div className="relative" style={{ height: 220 }}>
        <div className="absolute inset-0" style={{ background: list.gradient }} />
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
          {list.emoji}
        </div>
        <div className="absolute inset-0" style={{ background: heroOverlay }} />

        <div className="absolute top-12 left-5 z-10">
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <ChevronLeft size={20} color="#F5F0EB" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
          <div className="text-[11px] font-semibold mb-1" style={{ color: c.gold, textTransform: 'uppercase' }}>
            Curated Collection
          </div>
          <h1 className="font-display text-xl font-bold mb-1" style={{ color: isDark ? '#F5F0EB' : c.text }}>{list.title}</h1>
          <div className="text-xs" style={{ color: c.textMuted }}>by {list.by} · {listVenues.length} places</div>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{list.desc}</p>
      </div>

      <div className="px-5 pb-8">
        {listVenues.map((v, i) => (
          <div key={v.id} className="flex items-center gap-3 py-3.5 cursor-pointer transition-press"
            style={{ borderBottom: i < listVenues.length - 1 ? `1px solid ${c.divider}` : 'none' }}
            onClick={() => openVenueDetail(v.id)}>
            <div className="w-6 text-center flex-shrink-0">
              <span className="font-display text-lg font-extrabold" style={{ color: i < 3 ? c.gold : c.textDim }}>
                {i + 1}
              </span>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
              style={{ background: v.gradient }}>
              {v.image ? (
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
              ) : (
                <span>{v.emoji}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold mb-0.5" style={{ color: c.text }}>{v.name}</div>
              <div className="text-xs" style={{ color: c.textMuted }}>{v.cuisine} · {v.price} · {v.city}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="font-display text-xl font-extrabold" style={{ color: c.gold }}>{v.score}</div>
              <button onClick={(e) => { e.stopPropagation(); toggleBookmark(v.id); }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: bookmarkedVenues.has(v.id) ? `${c.accent}25` : c.surfaceAlt }}>
                <Bookmark size={14} fill={bookmarkedVenues.has(v.id) ? c.accent : 'none'}
                  style={{ color: bookmarkedVenues.has(v.id) ? c.accent : c.textDim }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
