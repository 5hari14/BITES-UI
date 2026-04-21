import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Bookmark } from 'lucide-react';
import type { Venue } from '@/lib/data';

interface Props {
  venue: Venue;
  compact?: boolean;
}

export default function VenueCard({ venue, compact }: Props) {
  const { openVenueDetail, toggleBookmark, bookmarkedVenues } = useApp();
  const { c } = useBiteTheme();
  const isBookmarked = bookmarkedVenues.has(venue.id);

  return (
    <div className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ width: compact ? 170 : 200, background: c.surface, border: `1px solid ${c.border}` }}
      onClick={() => openVenueDetail(venue.id)}>
      {/* Image area */}
      <div className="relative flex items-center justify-center text-4xl"
        style={{ height: compact ? 110 : 130, background: venue.gradient }}>
        {venue.image ? (
          <img src={venue.image} alt={venue.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span>{venue.emoji}</span>
        )}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: c.gold }}>
          {venue.badge || `⭐ ${venue.score}`}
        </div>
        <button className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-full transition-all"
          style={{
            width: 30, height: 30,
            background: isBookmarked ? `${c.accent}CC` : 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)'
          }}
          onClick={(e) => { e.stopPropagation(); toggleBookmark(venue.id); }}>
          <Bookmark size={14} color="#fff" fill={isBookmarked ? '#fff' : 'none'} strokeWidth={2} />
        </button>
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold mb-1 leading-tight" style={{ color: c.text }}>
          {venue.name}
        </div>
        <div className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: c.textMuted }}>
          <span className="font-semibold" style={{ color: c.green }}>{venue.price}</span>
          <span>•</span>
          <span>{venue.cuisine}</span>
          {venue.city && <><span>•</span><span>{venue.area ? `${venue.area}, ${venue.city}` : venue.city}</span></>}
        </div>
      </div>
    </div>
  );
}
