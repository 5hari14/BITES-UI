import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getUser, venues } from '@/lib/data';
import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Generate mock photo data for a user based on their visited places
function generateUserPhotos(userId: string) {
  const user = getUser(userId);
  if (!user) return [];

  const foodPhotos = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop',
  ];

  const photos: { id: string; url: string; venueName: string; venueId: string; date: string; dish: string }[] = [];
  const visitedPlaces = user.visitedPlaces || [];

  let seed = 0;
  for (let i = 0; i < userId.length; i++) seed = ((seed << 5) - seed + userId.charCodeAt(i)) | 0;
  const rng = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed & 0x7fffffff) / 2147483647; };

  const dishes = ['Truffle Pasta', 'Grilled Octopus', 'Tiramisu', 'Margherita Pizza', 'Risotto', 'Bruschetta', 'Espresso', 'Gelato', 'Burrata', 'Lamb Chops', 'Seafood Platter', 'Crème Brûlée', 'Steak Tartare', 'Lobster Roll', 'Sushi Platter', 'Pad Thai', 'Croissant', 'Shakshuka'];

  visitedPlaces.forEach((venueId, idx) => {
    const venue = venues.find((v: any) => v.id === venueId);
    if (!venue) return;

    const photoCount = Math.ceil(rng() * 3);
    for (let p = 0; p < photoCount; p++) {
      const photoIdx = (idx * 3 + p) % foodPhotos.length;
      const dishIdx = Math.floor(rng() * dishes.length);
      const daysAgo = Math.floor(rng() * 60);
      const date = new Date(2026, 2, 6);
      date.setDate(date.getDate() - daysAgo);

      photos.push({
        id: `${userId}-${idx}-${p}`,
        url: foodPhotos[photoIdx],
        venueName: venue.name,
        venueId: venue.id,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dish: dishes[dishIdx],
      });
    }
  });

  return photos;
}

/* ─── Photo Lightbox (rendered via portal into the phone frame) ─── */
function PhotoLightbox({
  photo,
  photos,
  onClose,
  onNavigate,
  onViewRestaurant,
}: {
  photo: { id: string; url: string; venueName: string; venueId: string; date: string; dish: string };
  photos: { id: string; url: string; venueName: string; venueId: string; date: string; dish: string }[];
  onClose: () => void;
  onNavigate: (id: string) => void;
  onViewRestaurant: (venueId: string) => void;
}) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartX = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const currentIdx = photos.findIndex(p => p.id === photo.id);

  useEffect(() => {
    setImageLoaded(false);
  }, [photo.id]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isHorizontalSwipe.current = null;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - (e.touches[0] as any).startY || 0;
    if (isHorizontalSwipe.current === null && Math.abs(dx) > 8) {
      isHorizontalSwipe.current = true;
    }
    if (isHorizontalSwipe.current) {
      e.preventDefault();
      setSwipeOffset(dx);
    }
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;
    setIsSwiping(false);
    const threshold = 60;
    if (swipeOffset > threshold && currentIdx > 0) {
      onNavigate(photos[currentIdx - 1].id);
    } else if (swipeOffset < -threshold && currentIdx < photos.length - 1) {
      onNavigate(photos[currentIdx + 1].id);
    }
    setSwipeOffset(0);
    isHorizontalSwipe.current = null;
  }, [isSwiping, swipeOffset, currentIdx, photos, onNavigate]);

  // Get the phone frame element for portal
  const portalTarget = (window as any).__phoneFrame as HTMLElement | null;
  if (!portalTarget) return null;

  const lightboxContent = (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#000', zIndex: 100, borderRadius: 'inherit' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 flex-shrink-0">
        <button onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
          <ChevronLeft size={20} color="#fff" />
        </button>
        <div className="text-center">
          <div className="text-xs font-medium text-white">{photo.venueName}</div>
          <div className="text-[10px] text-white/50">{photo.date}</div>
        </div>
        <div className="w-9" />
      </div>

      {/* Photo area with swipe */}
      <div
        className="flex-1 flex items-center justify-center px-3 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        )}

        <img
          src={photo.url}
          alt={photo.dish}
          className="w-full max-h-[60vh] object-contain rounded-lg select-none"
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
            opacity: imageLoaded ? (1 - Math.abs(swipeOffset) / 600) : 0,
            pointerEvents: 'none',
          }}
          draggable={false}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Nav arrows */}
        {currentIdx > 0 && (
          <button onClick={() => onNavigate(photos[currentIdx - 1].id)}
            className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
            <ChevronLeft size={16} color="#fff" />
          </button>
        )}
        {currentIdx < photos.length - 1 && (
          <button onClick={() => onNavigate(photos[currentIdx + 1].id)}
            className="absolute right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
            <ChevronRight size={16} color="#fff" />
          </button>
        )}
      </div>

      {/* Photo info + View Restaurant */}
      <div className="px-5 py-4 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">{photo.dish}</div>
            <div className="text-xs text-white/60 mt-0.5">{photo.venueName}</div>
            <div className="text-[10px] text-white/30 mt-1">
              {photo.date} · {currentIdx + 1} of {photos.length}
            </div>
          </div>
          <button
            onClick={() => onViewRestaurant(photo.venueId)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold transition-all active:scale-95 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF8F5E)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(255,107,53,0.4)',
            }}
          >
            <ExternalLink size={12} />
            View Restaurant
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(lightboxContent, portalTarget);
}

/* ─── Main Photos Screen ─── */
export default function UserPhotosScreen() {
  const { profileSubUserId, goBack, openVenueDetail } = useApp();
  const { c } = useBiteTheme();
  const user = getUser(profileSubUserId || 'michel');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const photos = user ? generateUserPhotos(user.id) : [];
  const selectedPhoto = photos.find(p => p.id === selectedPhotoId) || null;

  if (!user) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>Photos</h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>{user.name}'s food photos</p>
        </div>
        <div className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: `${c.accent}18`, color: c.accent, border: `1px solid ${c.accent}30` }}>
          {photos.length}
        </div>
      </div>

      {/* Photo grid */}
      {photos.length > 0 ? (
        <div className="px-3 pb-6">
          <div className="grid grid-cols-3 gap-1">
            {photos.map((photo) => (
              <button key={photo.id}
                onClick={() => setSelectedPhotoId(photo.id)}
                className="relative aspect-square overflow-hidden rounded-md group">
                <img src={photo.url} alt={photo.dish}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[9px] font-medium text-white truncate">{photo.dish}</div>
                  <div className="text-[8px] text-white/60 truncate">{photo.venueName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="text-4xl mb-3">📷</div>
          <div className="text-sm font-medium text-center" style={{ color: c.textMuted }}>No photos yet</div>
          <div className="text-xs text-center mt-1" style={{ color: c.textDim }}>
            Photos shared with reviews will appear here
          </div>
        </div>
      )}

      {/* Lightbox — rendered via portal into the phone frame */}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhotoId(null)}
          onNavigate={(id) => setSelectedPhotoId(id)}
          onViewRestaurant={(venueId) => {
            setSelectedPhotoId(null);
            openVenueDetail(venueId);
          }}
        />
      )}
    </div>
  );
}
