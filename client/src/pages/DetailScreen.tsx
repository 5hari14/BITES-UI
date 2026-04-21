import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, Bookmark, Share2, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { getVenue, reviews, getUser, getDishesForVenue } from '@/lib/data';
import FrequentlyOrdered from '@/components/FrequentlyOrdered';

export default function DetailScreen() {
  const { selectedVenueId, goBack, toggleBookmark, bookmarkedVenues, navigate, setLogSelectedVenue, setLogStep } = useApp();
  const { c, isDark } = useBiteTheme();
  const venue = getVenue(selectedVenueId || '');
  const [showHours, setShowHours] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'menu'>('overview');

  if (!venue) return null;
  const isBookmarked = bookmarkedVenues.has(venue.id);
  const venueReviews = reviews.filter(r => r.venueId === venue.id);

  const ratingBars = [
    { label: 'Food', value: venue.food, max: 5, color: c.accent, emoji: '🍽️' },
    { label: 'Service', value: venue.service, max: 5, color: c.blue, emoji: '👤' },
    { label: 'Vibe', value: venue.vibe, max: 5, color: c.pink, emoji: '✨' },
    { label: 'Value', value: venue.value, max: 5, color: c.green, emoji: '💰' },
  ];

  const handleLogReview = () => {
    setLogSelectedVenue(venue.id);
    setLogStep(2);
    navigate('log');
  };

  const heroOverlay = isDark
    ? 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(13,13,13,0.95) 100%)'
    : 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(250,250,248,0.95) 100%)';

  return (
    <div>
      {/* Hero */}
      <div className="relative" style={{ height: 280 }}>
        {venue.image ? (
          <img src={venue.image} alt={venue.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl" style={{ background: venue.gradient }}>
            {venue.emoji}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: heroOverlay }} />

        <div className="absolute top-12 left-5 right-5 flex justify-between items-center z-10">
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <ChevronLeft size={20} color="#F5F0EB" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => toggleBookmark(venue.id)} className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: isBookmarked ? `${c.accent}cc` : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <Bookmark size={16} fill={isBookmarked ? '#fff' : 'none'} color="#F5F0EB" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <Share2 size={16} color="#F5F0EB" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold mb-1" style={{ color: isDark ? '#F5F0EB' : c.text }}>{venue.name}</h1>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {venue.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                    style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backdropFilter: 'blur(4px)', color: c.textMuted }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="font-display text-4xl font-extrabold" style={{ color: c.gold }}>{venue.score}</div>
              <div className="text-[10px] font-medium" style={{ color: c.textMuted }}>{venue.reviewCount} reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-2 mb-4">
        {(['overview', 'reviews', 'menu'] as const).map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 text-center py-2.5 text-sm font-medium transition-all capitalize"
            style={{
              color: activeTab === tab ? c.text : c.textDim,
              borderBottom: `2px solid ${activeTab === tab ? c.accent : 'transparent'}`,
            }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="mx-5 mb-5 p-4 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            {ratingBars.map(bar => (
              <div key={bar.label} className="flex items-center gap-3 mb-3 last:mb-0">
                <span className="text-sm w-5">{bar.emoji}</span>
                <span className="text-xs w-14" style={{ color: c.textMuted }}>{bar.label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: c.surfaceAlt }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(bar.value / bar.max) * 100}%`, background: bar.color }} />
                </div>
                <span className="text-xs font-bold w-7 text-right" style={{ color: bar.color }}>{bar.value}</span>
              </div>
            ))}
          </div>

          {/* Frequently Ordered — above contact info */}
          <FrequentlyOrdered venueId={venue.id} c={c} />

          <div className="mx-5 mb-5 p-4 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            {venue.info.map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs" style={{ color: item.link ? c.blue : c.textMuted }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mx-5 mb-5 p-4 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <button className="flex items-center justify-between w-full" onClick={() => setShowHours(!showHours)}>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: c.textMuted }} />
                <span className="text-xs font-medium" style={{ color: c.text }}>Opening Hours</span>
                {venue.hours.find(h => h.today) && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${c.green}20`, color: c.green }}>
                    Open now
                  </span>
                )}
              </div>
              {showHours ? <ChevronUp size={14} style={{ color: c.textDim }} /> : <ChevronDown size={14} style={{ color: c.textDim }} />}
            </button>
            {showHours && (
              <div className="mt-3 space-y-2">
                {venue.hours.map(h => (
                  <div key={h.day} className="flex justify-between text-xs"
                    style={{ color: h.today ? c.text : h.closed ? c.textDim : c.textMuted }}>
                    <span className="font-medium">{h.day} {h.today && '(Today)'}</span>
                    <span style={{ color: h.closed ? c.accent : undefined }}>{h.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="px-5 pb-4">
          {venueReviews.length > 0 ? venueReviews.map(r => {
            const user = getUser(r.userId);
            if (!user) return null;
            return (
              <div key={r.id} className="mb-4 p-3.5 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: user.avatarGrad }}>{user.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: c.text }}>{user.name}</div>
                    <div className="text-[10px]" style={{ color: c.textDim }}>{r.time}</div>
                  </div>
                  <div className="font-display text-xl font-extrabold" style={{ color: c.gold }}>{r.overall}</div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>{r.text}</p>
              </div>
            );
          }) : (
            <div className="py-10 text-center">
              <div className="text-4xl mb-3">📝</div>
              <div className="text-sm font-medium mb-1" style={{ color: c.textMuted }}>No reviews yet</div>
              <div className="text-xs" style={{ color: c.textDim }}>Be the first to review!</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="px-5 pb-4">
          <div className="py-10 text-center">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-sm font-medium mb-1" style={{ color: c.textMuted }}>Menu coming soon</div>
            <div className="text-xs" style={{ color: c.textDim }}>Digital menus will be available here</div>
          </div>
        </div>
      )}

      {/* Sticky CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-5 z-40"
        style={{ background: `linear-gradient(to top, ${c.bg} 70%, transparent)` }}>
        <button onClick={handleLogReview}
          className="w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: c.accent, color: '#fff', boxShadow: `0 4px 20px ${c.accent}50` }}>
          <Star size={18} />
          Rate This Place
        </button>
      </div>
    </div>
  );
}
