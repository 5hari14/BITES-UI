import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, MapPin } from 'lucide-react';
import { getUser, venues } from '@/lib/data';

export default function UserPlacesScreen() {
  const { profileSubUserId, goBack, openVenueDetail } = useApp();
  const { c } = useBiteTheme();
  const userId = profileSubUserId || 'michel';
  const user = getUser(userId);
  if (!user) return null;

  const visitedVenues = user.visitedPlaces
    .map(id => venues.find(v => v.id === id))
    .filter(Boolean) as typeof venues;

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
            {user.name}'s Places
          </h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>
            {visitedVenues.length} places visited
          </p>
        </div>
      </div>

      <div className="px-5 pb-6">
        {visitedVenues.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📍</div>
            <div className="text-sm font-medium mb-1" style={{ color: c.textMuted }}>No places yet</div>
            <div className="text-xs" style={{ color: c.textDim }}>Places will appear here once visited</div>
          </div>
        ) : (
          <div className="space-y-2">
            {visitedVenues.map((v) => (
              <div key={v.id}
                onClick={() => openVenueDetail(v.id)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: v.gradient }}>
                  {v.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: c.text }}>{v.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} style={{ color: c.textDim }} />
                    <span className="text-[11px]" style={{ color: c.textDim }}>
                      {v.cuisine} · {v.price} · {v.city}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-lg font-extrabold" style={{ color: c.gold }}>{v.score}</div>
                  <div className="text-[10px]" style={{ color: c.textDim }}>score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
