import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft } from 'lucide-react';
import { getUser, venues, reviews } from '@/lib/data';

export default function UserReviewsScreen() {
  const { profileSubUserId, goBack, openVenueDetail, userReviews: dynamicReviews } = useApp();
  const { c } = useBiteTheme();
  const userId = profileSubUserId || 'michel';
  const user = getUser(userId);
  if (!user) return null;

  const staticReviews = reviews.filter(r => r.userId === userId);
  // Merge dynamic (session) reviews with static reviews for Michel
  const isOwnProfile = userId === 'michel';
  const dynamicMapped = isOwnProfile ? dynamicReviews.map(r => ({
    ...r,
    photos: r.photos || [],
    friends: r.friends || [],
  })) : [];
  const userReviews = [...dynamicMapped, ...staticReviews];

  return (
    <div>
      <div className="sticky top-0 z-20 px-5 pt-14 pb-3 flex items-center gap-3"
        style={{ background: `linear-gradient(to bottom, ${c.bg} 80%, transparent)` }}>
        <button onClick={goBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>
            {user.name}'s Reviews
          </h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>
            {userReviews.length} reviews · Chronological
          </p>
        </div>
      </div>

      <div className="px-5 pb-6">
        {userReviews.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-sm font-medium mb-1" style={{ color: c.textMuted }}>No reviews yet</div>
            <div className="text-xs" style={{ color: c.textDim }}>Reviews will appear here</div>
          </div>
        ) : (
          <div className="space-y-3">
            {userReviews.map((r) => {
              const venue = venues.find(v => v.id === r.venueId);
              if (!venue) return null;
              return (
                <div key={r.id}
                  onClick={() => openVenueDetail(venue.id)}
                  className="p-3.5 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
                  style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: venue.gradient }}>
                      {venue.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: c.text }}>{venue.name}</div>
                      <div className="text-[11px]" style={{ color: c.textDim }}>
                        {venue.cuisine} · {venue.price} · {r.time}
                      </div>
                    </div>
                    <div className="font-display text-xl font-extrabold" style={{ color: c.gold }}>
                      {r.overall}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-2.5">
                    {[
                      { label: 'Food', val: r.food, icon: '🍽️' },
                      { label: 'Service', val: r.service, icon: '👤' },
                      { label: 'Vibe', val: r.vibe, icon: '✨' },
                      { label: 'Value', val: r.value, icon: '💰' },
                    ].filter(x => x.val !== null).map(x => (
                      <div key={x.label} className="flex items-center gap-1 px-2 py-1 rounded-md"
                        style={{ background: c.surfaceAlt }}>
                        <span className="text-[10px]">{x.icon}</span>
                        <span className="text-[10px] font-semibold" style={{ color: c.textMuted }}>{x.val}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>{r.text}</p>

                  {r.dishes.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {r.dishes.map(d => (
                        <span key={d} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: `${c.accent}15`, color: c.accent }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
