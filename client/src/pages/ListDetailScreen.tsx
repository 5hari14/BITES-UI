import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, Bookmark, Star, MapPin, Share2, Lock } from 'lucide-react';
import { getListById, getVenue, getUser, type Venue } from '@/lib/data';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ListDetailScreen() {
  const { selectedListId, goBack, openVenueDetail, openUserProfile, toggleBookmark, bookmarkedVenues } = useApp();
  const { c, isDark } = useBiteTheme();
  const [saved, setSaved] = useState(false);

  const list = selectedListId ? getListById(selectedListId) : undefined;
  if (!list) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: c.textMuted }}>
        <p className="text-sm">List not found</p>
      </div>
    );
  }

  const listVenues = list.venueIds.map(id => getVenue(id)).filter(Boolean) as Venue[];
  const author = list.by !== 'editors' ? getUser(list.by) : null;

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved lists' : 'List saved to your collection');
  };

  const handleShare = () => {
    toast.info('Share', { description: 'Share link copied to clipboard' });
  };

  // Generate a gradient from the list emoji theme
  const headerGrad = isDark
    ? 'linear-gradient(180deg, rgba(255,107,53,0.15) 0%, transparent 100%)'
    : 'linear-gradient(180deg, rgba(255,107,53,0.08) 0%, transparent 100%)';

  return (
    <div className="h-full overflow-y-auto" style={{ background: c.bg }}>
      {/* Header area */}
      <div className="relative px-5 pt-14 pb-5" style={{ background: headerGrad }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <ChevronLeft size={18} style={{ color: c.text }} />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <Share2 size={16} style={{ color: c.text }} />
            </button>
          </div>
        </div>

        {/* List icon & title */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: c.surface, border: `1.5px solid ${c.border}`, boxShadow: `0 4px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}` }}>
            {list.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-xl font-bold leading-tight" style={{ color: c.text }}>
                {list.name}
              </h1>
              {list.isPrivate && <Lock size={14} style={{ color: c.textDim }} />}
            </div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: c.textMuted }}>
              {list.description}
            </p>
            <div className="flex items-center gap-3">
              {/* Author */}
              {author ? (
                <button onClick={() => openUserProfile(author.id)} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: author.avatarGrad }}>
                    {author.avatar}
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: c.accent }}>{list.byName}</span>
                </button>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${c.accent}15`, color: c.accent }}>
                  {list.byName}
                </span>
              )}
              <span className="text-[11px]" style={{ color: c.textDim }}>
                {listVenues.length} places
              </span>
              {list.saves !== '—' && (
                <span className="text-[11px]" style={{ color: c.textDim }}>
                  {list.saves} saves
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Save button */}
        {list.by !== 'michel' && (
          <button onClick={handleSave}
            className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: saved ? c.accent : 'transparent',
              border: `1.5px solid ${saved ? c.accent : c.border}`,
              color: saved ? '#fff' : c.text,
            }}>
            <Bookmark size={15} fill={saved ? '#fff' : 'none'} />
            {saved ? 'Saved' : 'Save List'}
          </button>
        )}
      </div>

      {/* Venue list */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.textDim }}>
            Places in this list
          </span>
        </div>

        <div className="space-y-2.5">
          {listVenues.map((venue, i) => {
            const isBookmarked = bookmarkedVenues.has(venue.id);
            return (
              <div key={venue.id}
                onClick={() => openVenueDetail(venue.id)}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all active:scale-[0.98] cursor-pointer"
                style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                {/* Rank number */}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: i < 3 ? `${c.accent}15` : c.surfaceAlt, color: i < 3 ? c.accent : c.textDim }}>
                  {i + 1}
                </div>

                {/* Venue image / emoji */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: venue.gradient }}>
                  {venue.image ? (
                    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{venue.emoji}</span>
                  )}
                </div>

                {/* Venue info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-tight mb-0.5" style={{ color: c.text }}>
                    {venue.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ color: c.textMuted }}>
                    <span className="font-semibold" style={{ color: c.green }}>{venue.price}</span>
                    <span>·</span>
                    <span>{venue.cuisine}</span>
                    <span>·</span>
                    <MapPin size={10} />
                    <span>{venue.area ? `${venue.area}, ${venue.city}` : venue.city}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star size={11} fill={c.gold} stroke={c.gold} />
                    <span className="font-display text-sm font-bold" style={{ color: c.gold }}>{venue.score}</span>
                  </div>
                  <div
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(venue.id); }}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer"
                    style={{ background: isBookmarked ? `${c.accent}20` : 'transparent' }}>
                    <Bookmark size={12} style={{ color: isBookmarked ? c.accent : c.textDim }} fill={isBookmarked ? c.accent : 'none'} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {listVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">{list.emoji}</div>
            <p className="text-sm font-medium mb-1" style={{ color: c.text }}>No places yet</p>
            <p className="text-xs" style={{ color: c.textDim }}>Places added to this list will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
