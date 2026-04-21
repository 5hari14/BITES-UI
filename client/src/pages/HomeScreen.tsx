import { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Search } from 'lucide-react';
import VenueCard from '@/components/VenueCard';
import { venues, IMAGES } from '@/lib/data';
import { countries } from '@/lib/locations';
import LocationSelector from '@/components/LocationSelector';

const categories = [
  { id: 'trending', label: '🔥 Trending' },
  { id: 'new', label: '🆕 New' },
  { id: 'coffee', label: '☕ Coffee' },
  { id: 'brunch', label: '🥐 Brunch' },
  { id: 'datenight', label: '🕯️ Date Night' },
  { id: 'bars', label: '🌅 Golden Hour' },
  { id: 'favourites', label: '🍰 Favourites' },
];

export default function HomeScreen() {
  const { navigate, selectedCountry, selectedCity, selectedNeighborhood } = useApp();
  const { c } = useBiteTheme();
  const [activeCat, setActiveCat] = useState('trending');

  // Transition state
  const [contentVisible, setContentVisible] = useState(true);
  const [displayedCountry, setDisplayedCountry] = useState(selectedCountry);
  const [displayedCity, setDisplayedCity] = useState(selectedCity);
  const [displayedNeighborhood, setDisplayedNeighborhood] = useState(selectedNeighborhood);
  const prevLocationRef = useRef(`${selectedCountry}|${selectedCity}|${selectedNeighborhood}`);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect location changes and trigger transition
  useEffect(() => {
    const currentKey = `${selectedCountry}|${selectedCity}|${selectedNeighborhood}`;
    if (currentKey !== prevLocationRef.current) {
      prevLocationRef.current = currentKey;

      // Phase 1: fade out
      setContentVisible(false);

      // Phase 2: after fade-out, swap content and fade in
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDisplayedCountry(selectedCountry);
        setDisplayedCity(selectedCity);
        setDisplayedNeighborhood(selectedNeighborhood);
        // Small delay to let React render new content before fading in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setContentVisible(true);
          });
        });
      }, 280);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [selectedCountry, selectedCity, selectedNeighborhood]);

  // Sync on mount
  useEffect(() => {
    setDisplayedCountry(selectedCountry);
    setDisplayedCity(selectedCity);
    setDisplayedNeighborhood(selectedNeighborhood);
  }, []);

  const currentCountry = countries.find(co => co.name === displayedCountry);

  // Filter venues by displayed location (the one currently rendered)
  const filteredVenues = useMemo(() => {
    if (displayedCountry !== 'Cyprus') return [];
    let result = venues;
    if (displayedCity !== 'All Cities') result = result.filter(v => v.city === displayedCity);
    if (displayedNeighborhood && displayedNeighborhood !== 'All Areas') result = result.filter(v => v.area === displayedNeighborhood);
    return result;
  }, [displayedCountry, displayedCity, displayedNeighborhood]);

  const isOtherCountry = displayedCountry !== 'Cyprus';

  // Dynamic curated card title based on displayed city
  const curatedTitle = useMemo(() => {
    if (isOtherCountry) return `Top 10 Hottest Burgers in ${displayedCountry}`;
    if (displayedCity === 'All Cities') return 'Top 10 Hottest Burgers in Cyprus';
    return `Top 10 Hottest Burgers in ${displayedCity}`;
  }, [isOtherCountry, displayedCountry, displayedCity]);

  const sections = [
    { id: 'trending', title: 'Trending Now', venues: filteredVenues.filter(v => v.category.includes('trending')) },
    { id: 'new', title: 'New Openings', venues: filteredVenues.filter(v => v.category.includes('new')) },
    { id: 'datenight', title: 'Date Night', venues: filteredVenues.filter(v => v.category.includes('datenight')) },
    { id: 'brunch', title: 'Brilliant Brunch', venues: filteredVenues.filter(v => v.category.includes('brunch')) },
    { id: 'coffee', title: 'Trending Coffee', venues: filteredVenues.filter(v => v.category.includes('coffee')) },
    { id: 'bars', title: 'Unique Bars', venues: filteredVenues.filter(v => v.category.includes('bars')) },
  ].filter(s => s.venues.length > 0);

  // Transition styles
  const contentStyle: React.CSSProperties = {
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? 'translateY(0)' : 'translateY(12px)',
  };

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-[13px] mb-0.5" style={{ color: c.textMuted }}>Good evening, Michel 👋</div>
          <LocationSelector />
        </div>
        <div className="font-display text-[26px] font-bold tracking-tight" style={{ color: c.text }}>
          Where are we <span style={{ color: c.accent }}>eating</span> tonight?
        </div>
      </div>

      {/* Search bar */}
      <div className="mx-5 mb-4 flex items-center gap-2.5 px-4 py-3.5 rounded-xl cursor-pointer"
        style={{ background: c.surface, border: `1px solid ${c.border}` }}
        onClick={() => navigate('search')}>
        <Search size={18} style={{ color: c.textDim }} />
        <span className="text-sm" style={{ color: c.textDim }}>Search restaurants, cuisines, vibes...</span>
      </div>

      {/* Category pills — also animated */}
      <div style={contentStyle}>
        <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => {
                setActiveCat(cat.id);
                document.getElementById(`sec-${cat.id}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all"
              style={{
                background: activeCat === cat.id ? c.accent : c.surface,
                color: activeCat === cat.id ? '#fff' : c.textMuted,
                border: `1px solid ${activeCat === cat.id ? c.accent : c.border}`,
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured card */}
        <div className="mx-5 mb-5 rounded-2xl overflow-hidden relative cursor-pointer" style={{ height: 200 }}
          onClick={() => navigate('curated-list')}>
          <img src={IMAGES.burger} alt="Featured" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${c.overlayFrom}, transparent 60%)` }} />
          <div className="absolute top-5 right-5 text-7xl opacity-15">🔥</div>
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <div className="text-[11px] font-semibold mb-1" style={{ color: c.gold, textTransform: 'uppercase' }}>
              Curated Collection
            </div>
            <div className="font-display text-lg font-bold" style={{ color: '#F5F0EB' }}>
              {curatedTitle}
            </div>
            <div className="text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Our editors' picks for 2026
            </div>
          </div>
        </div>

        {/* Venue sections */}
        {isOtherCountry ? (
          <div className="mx-5 mb-5 py-12 rounded-2xl flex flex-col items-center justify-center gap-3 text-center"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <div className="text-5xl">{currentCountry?.flag || '🌍'}</div>
            <div className="text-base font-bold font-display" style={{ color: c.text }}>
              {displayedCountry} is Coming Soon!
            </div>
            <div className="text-xs px-8 leading-relaxed" style={{ color: c.textDim }}>
              We're working hard to bring you the best restaurants, cafes, bars, and bakeries in {displayedCountry}.
              Change your location to explore Cyprus.
            </div>
            <button
              onClick={() => navigate('search')}
              className="mt-2 px-5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ background: c.accent, color: '#fff', boxShadow: `0 4px 14px ${c.accent}40` }}>
              Explore Cyprus
            </button>
          </div>
        ) : (
          <>
            {sections.map((section, sIdx) => (
              <div key={section.id} id={`sec-${section.id}`}
                style={{
                  transition: `opacity 0.3s ease ${sIdx * 0.06}s, transform 0.3s ease ${sIdx * 0.06}s`,
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
                }}>
                <div className="flex justify-between items-center px-5 pt-1.5 pb-3">
                  <h3 className="font-display text-lg font-bold" style={{ color: c.text }}>
                    {section.title}
                  </h3>
                  <span className="text-[13px] font-medium cursor-pointer" style={{ color: c.accent }}>
                    See all →
                  </span>
                </div>
                <div className="flex gap-3.5 px-5 pb-6 overflow-x-auto scrollbar-hide">
                  {section.venues.map(v => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                </div>
              </div>
            ))}

            {/* Favourites section */}
            {filteredVenues.filter(v => v.category.includes('favourites')).length > 0 && (
              <div id="sec-favourites"
                style={{
                  transition: `opacity 0.3s ease ${sections.length * 0.06}s, transform 0.3s ease ${sections.length * 0.06}s`,
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
                }}>
                <div className="flex justify-between items-center px-5 pt-1.5 pb-3">
                  <h3 className="font-display text-lg font-bold" style={{ color: c.text }}>Your Favourites</h3>
                  <span className="text-[13px] font-medium cursor-pointer" style={{ color: c.accent }}>See all →</span>
                </div>
                <div className="flex gap-3.5 px-5 pb-6 overflow-x-auto scrollbar-hide">
                  {filteredVenues.filter(v => v.category.includes('favourites')).map(v => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
