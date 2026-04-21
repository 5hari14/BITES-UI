import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Search, MapPin, X, Star, Clock, TrendingUp, SlidersHorizontal, ArrowUpDown, ChevronDown, MapPinned, Check } from 'lucide-react';
import { venues, users, getPublicLists } from '@/lib/data';
import VenueCard from '@/components/VenueCard';
import LocationSelector from '@/components/LocationSelector';
import FilterPanel, { FilterState, defaultFilters, countActiveFilters, SORT_OPTIONS } from '@/components/FilterPanel';
import { getNeighborhoods } from '@/lib/locations';

const searchTabs = [
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'map', label: 'Map' },
  { key: 'foodies', label: 'Foodies' },
  { key: 'lists', label: 'Lists' },
] as const;

const recentSearches = ['Italian near me', 'Brunch spots', 'Best sushi', 'Coffee shops'];
const trendingSearches = ['Rooftop bars', 'New openings', 'Date night', 'Halloumi'];

const quickCategories = [
  { icon: '🍽️', label: 'Fine Dining', sub: '24 places', bg: 'rgba(255,107,53,0.1)', searchTerm: 'Fine Dining' },
  { icon: '☕', label: 'Coffee & Bakeries', sub: '38 places', bg: 'rgba(96,165,250,0.1)', searchTerm: 'Coffee Bakery Cafe' },
  { icon: '🍸', label: 'Bars & Nightlife', sub: '16 places', bg: 'rgba(244,114,182,0.1)', searchTerm: 'Bar Cocktails' },
  { icon: '🥗', label: 'Healthy & Vegan', sub: '12 places', bg: 'rgba(74,222,128,0.1)', searchTerm: 'Vegan Healthy' },
];

/* ─── Filtering logic ─── */
function applyFiltersToVenues(allVenues: typeof venues, filters: FilterState, country: string, city: string, neighborhood?: string) {
  let result = [...allVenues];

  // Location filter
  if (country !== 'Cyprus') return [];
  if (city !== 'All Cities') result = result.filter(v => v.city === city);
  if (neighborhood && neighborhood !== 'All Areas') result = result.filter(v => v.area === neighborhood);

  // Distance filter (simulated with the distance field)
  if (filters.distance) {
    const distMap: Record<string, number> = { near: 0.5, '1km': 1, '3km': 3, '5km': 5 };
    const maxDist = distMap[filters.distance] || 999;
    result = result.filter(v => {
      if (!v.distance) return filters.distance === '5km'; // no distance = far
      const d = parseFloat(v.distance);
      return d <= maxDist;
    });
  }

  // Price filter
  if (filters.price.length > 0) {
    result = result.filter(v => filters.price.includes(v.price));
  }

  // Venue type filter
  if (filters.venueType.length > 0) {
    result = result.filter(v => v.venueType.some(t => filters.venueType.includes(t)));
  }

  // Cuisine type filter
  if (filters.cuisineType.length > 0) {
    result = result.filter(v => v.cuisineType.some(t => filters.cuisineType.includes(t)));
  }

  // Occasion filter
  if (filters.occasion.length > 0) {
    result = result.filter(v => v.occasion.some(o => filters.occasion.includes(o)));
  }

  // Dietary filter
  if (filters.dietary.length > 0) {
    result = result.filter(v => v.dietary.some(d => filters.dietary.includes(d)));
  }

  // Sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'most_reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'least_reviews':
        result.sort((a, b) => a.reviewCount - b.reviewCount);
        break;
      case 'highest_rated':
        result.sort((a, b) => b.score - a.score);
        break;
      case 'lowest_rated':
        result.sort((a, b) => a.score - b.score);
        break;
    }
  }

  return result;
}

export default function SearchScreen() {
  const { searchTab, setSearchTab, searchQuery, setSearchQuery, openVenueDetail, selectedCountry, selectedCity, selectedNeighborhood, setLocation } = useApp();
  const { c, isDark } = useBiteTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const neighborhoods = getNeighborhoods(selectedCountry, selectedCity);
  const hasNeighborhood = selectedNeighborhood && selectedNeighborhood !== 'All Areas';
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (searchQuery && inputRef.current) {
      inputRef.current.focus();
      setIsSearchFocused(true);
    }
  }, []);



  // Search results with filters applied
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const words = q.split(/\s+/);

    let results = venues
      .map(v => {
        let score = 0;
        const nameL = v.name.toLowerCase();
        const cuisineL = v.cuisine.toLowerCase();
        const cityL = v.city.toLowerCase();
        const tagsL = v.tags.map(t => t.toLowerCase());

        if (nameL === q) score += 100;
        else if (nameL.startsWith(q)) score += 80;
        else if (nameL.includes(q)) score += 60;

        for (const word of words) {
          if (word.length < 2) continue;
          if (nameL.includes(word)) score += 30;
          if (cuisineL.includes(word)) score += 25;
          if (cityL.includes(word)) score += 15;
          for (const tag of tagsL) {
            if (tag.includes(word)) score += 20;
          }
          // Also search in occasion and venueType
          for (const occ of v.occasion) {
            if (occ.toLowerCase().includes(word)) score += 15;
          }
          for (const vt of v.venueType) {
            if (vt.toLowerCase().includes(word)) score += 15;
          }
          for (const ct of v.cuisineType) {
            if (ct.toLowerCase().includes(word)) score += 20;
          }
        }

        if (selectedCountry === 'Cyprus' && selectedCity !== 'All Cities') {
          if (v.city !== selectedCity) score = Math.floor(score * 0.3);
          if (selectedNeighborhood && selectedNeighborhood !== 'All Areas' && v.area !== selectedNeighborhood) score = Math.floor(score * 0.5);
        }

        return { venue: v, score };
      })
      .filter(r => r.score > 0);

    // Apply filters to search results
    const filteredVenueIds = new Set(
      applyFiltersToVenues(
        results.map(r => r.venue),
        filters,
        selectedCountry,
        selectedCity,
        selectedNeighborhood
      ).map(v => v.id)
    );

    results = results.filter(r => filteredVenueIds.has(r.venue.id));

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'most_reviews':
          results.sort((a, b) => b.venue.reviewCount - a.venue.reviewCount);
          break;
        case 'least_reviews':
          results.sort((a, b) => a.venue.reviewCount - b.venue.reviewCount);
          break;
        case 'highest_rated':
          results.sort((a, b) => b.venue.score - a.venue.score);
          break;
        case 'lowest_rated':
          results.sort((a, b) => a.venue.score - b.venue.score);
          break;
      }
    } else {
      results.sort((a, b) => b.score - a.score);
    }

    return results.slice(0, 20);
  }, [searchQuery, selectedCountry, selectedCity, selectedNeighborhood, filters]);

  // Count for the filter panel preview
  const previewFilteredCount = useMemo(() => {
    if (searchQuery.trim()) return searchResults.length;
    return applyFiltersToVenues(venues, filters, selectedCountry, selectedCity, selectedNeighborhood).length;
  }, [searchQuery, filters, selectedCountry, selectedCity, selectedNeighborhood, searchResults]);

  const activeFilterCount = countActiveFilters(filters);

  // Animation state for search results transitions
  const [resultsAnimState, setResultsAnimState] = useState<'visible' | 'fading' | 'entering'>('visible');
  const [displayedResults, setDisplayedResults] = useState<{ venue: typeof venues[0]; score: number }[]>([]);
  const prevFilterRef = useRef(JSON.stringify(defaultFilters) + '');

  // Animate results when filters or search query change
  useEffect(() => {
    const currentFilterStr = JSON.stringify(filters) + searchQuery;
    if (prevFilterRef.current !== currentFilterStr && displayedResults.length > 0) {
      setResultsAnimState('fading');
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setDisplayedResults(searchResults);
        setResultsAnimState('entering');
        animTimeoutRef.current = setTimeout(() => {
          setResultsAnimState('visible');
        }, 350);
      }, 200);
    } else {
      setDisplayedResults(searchResults);
      if (searchResults.length > 0 && displayedResults.length === 0) {
        setResultsAnimState('entering');
        animTimeoutRef.current = setTimeout(() => {
          setResultsAnimState('visible');
        }, 350);
      }
    }
    prevFilterRef.current = currentFilterStr;
    return () => { if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current); };
  }, [searchResults, filters, searchQuery]);

  const clearFilters = () => setFilters(defaultFilters);

  const hasQuery = searchQuery.trim().length > 0;
  const showSearchOverlay = isSearchFocused || hasQuery;

  const handleChipSearch = (term: string) => {
    setSearchQuery(term);
    setIsSearchFocused(true);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
    inputRef.current?.blur();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    if (words.length === 0) return text;
    const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      words.some(w => part.toLowerCase() === w)
        ? <span key={i} style={{ color: c.accent, fontWeight: 700 }}>{part}</span>
        : part
    );
  };

  // Active filter summary chips
  const filterSummaryChips = useMemo(() => {
    const chips: { label: string; key: string; onRemove: () => void }[] = [];
    if (filters.distance) {
      const labels: Record<string, string> = { near: 'Near Me', '1km': '< 1km', '3km': '< 3km', '5km': '< 5km' };
      chips.push({ label: `📍 ${labels[filters.distance]}`, key: 'dist', onRemove: () => setFilters(f => ({ ...f, distance: null })) });
    }
    filters.price.forEach(p => chips.push({ label: p, key: `p-${p}`, onRemove: () => setFilters(f => ({ ...f, price: f.price.filter(x => x !== p) })) }));
    filters.venueType.forEach(t => chips.push({ label: t.charAt(0).toUpperCase() + t.slice(1), key: `t-${t}`, onRemove: () => setFilters(f => ({ ...f, venueType: f.venueType.filter(x => x !== t) })) }));
    filters.cuisineType.slice(0, 2).forEach(ct => chips.push({ label: ct, key: `c-${ct}`, onRemove: () => setFilters(f => ({ ...f, cuisineType: f.cuisineType.filter(x => x !== ct) })) }));
    if (filters.cuisineType.length > 2) chips.push({ label: `+${filters.cuisineType.length - 2} more`, key: 'c-more', onRemove: () => setFilters(f => ({ ...f, cuisineType: [] })) });
    filters.occasion.slice(0, 2).forEach(o => chips.push({ label: o.charAt(0).toUpperCase() + o.slice(1), key: `o-${o}`, onRemove: () => setFilters(f => ({ ...f, occasion: f.occasion.filter(x => x !== o) })) }));
    if (filters.occasion.length > 2) chips.push({ label: `+${filters.occasion.length - 2} more`, key: 'o-more', onRemove: () => setFilters(f => ({ ...f, occasion: [] })) });
    filters.dietary.forEach(d => chips.push({ label: d.charAt(0).toUpperCase() + d.slice(1), key: `d-${d}`, onRemove: () => setFilters(f => ({ ...f, dietary: f.dietary.filter(x => x !== d) })) }));
    return chips;
  }, [filters]);

  return (
    <div>
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-[22px] font-bold" style={{ color: c.text }}>Discover</h2>
          <LocationSelector />
        </div>
        {/* Search input */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl transition-all"
          style={{
            background: c.surface,
            border: `1px solid ${isSearchFocused ? c.accent : `${c.accent}50`}`,
            boxShadow: isSearchFocused ? `0 0 0 3px ${c.accent}15` : 'none',
          }}>
          <Search size={18} style={{ color: c.accent }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search restaurants, cuisines, vibes..."
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {hasQuery && (
            <button onClick={clearSearch}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
              style={{ background: c.surfaceAlt }}>
              <X size={14} style={{ color: c.textMuted }} />
            </button>
          )}
        </div>

        {/* Filter bar — always visible */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setShowFilterPanel(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: activeFilterCount > 0 ? `${c.accent}20` : c.surface,
              border: `1.5px solid ${activeFilterCount > 0 ? c.accent : c.border}`,
              color: activeFilterCount > 0 ? c.accent : c.textMuted,
            }}>
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: c.accent, color: '#fff' }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Neighborhood / Area button — always visible */}
          <button
            onClick={() => setShowNeighborhoodDropdown(!showNeighborhoodDropdown)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: hasNeighborhood ? `${c.accent}20` : c.surface,
              border: `1.5px solid ${hasNeighborhood ? c.accent : c.border}`,
              color: hasNeighborhood ? c.accent : c.textMuted,
            }}>
            <MapPinned size={14} />
            {hasNeighborhood ? selectedNeighborhood : 'Area'}
            <ChevronDown size={12} style={{ transform: showNeighborhoodDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {/* Neighborhood dropdown via portal */}
          {showNeighborhoodDropdown && (() => {
            const frame = document.querySelector('[data-phone-frame]') || document.getElementById('phone-frame');
            if (!frame) return null;
            const showCityPrompt = selectedCity === 'All Cities' || neighborhoods.length === 0;
            return createPortal(
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 9998 }}
                onClick={() => setShowNeighborhoodDropdown(false)}
              >
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                <div
                  className="relative w-[80%] rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: c.surface,
                    border: `1px solid ${c.border}`,
                    maxHeight: 400,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="px-4 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${c.divider}` }}>
                    <div className="flex items-center gap-2">
                      <MapPinned size={16} style={{ color: c.accent }} />
                      <span className="text-sm font-bold" style={{ color: c.text }}>
                        {showCityPrompt ? 'Select Area' : `Select Area in ${selectedCity}`}
                      </span>
                    </div>
                    <button onClick={() => setShowNeighborhoodDropdown(false)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: c.surfaceAlt }}>
                      <X size={14} style={{ color: c.textMuted }} />
                    </button>
                  </div>
                  {showCityPrompt ? (
                    <div className="px-4 py-8 text-center">
                      <MapPin size={28} style={{ color: c.textDim }} className="mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1" style={{ color: c.text }}>Select a city first</p>
                      <p className="text-xs" style={{ color: c.textDim }}>Choose a specific city from the location selector to browse neighborhoods</p>
                    </div>
                  ) : (
                    <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
                      {/* All Areas option */}
                      <button
                        onClick={() => {
                          setLocation(selectedCountry, selectedCity, 'All Areas');
                          setShowNeighborhoodDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors active:scale-[0.98]"
                        style={{
                          background: !hasNeighborhood ? `${c.accent}12` : 'transparent',
                          borderBottom: `1px solid ${c.divider}`,
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c.accent}20` }}>
                          <MapPinned size={14} style={{ color: c.accent }} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-[13px] font-semibold" style={{ color: c.text }}>All Areas</div>
                          <div className="text-[11px]" style={{ color: c.textDim }}>All of {selectedCity}</div>
                        </div>
                        {!hasNeighborhood && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: c.accent }}>
                            <Check size={12} color="#fff" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                      {/* Neighborhood options */}
                      {neighborhoods.map(hood => {
                        const isSelected = selectedNeighborhood === hood.name;
                        return (
                          <button
                            key={hood.name}
                            onClick={() => {
                              setLocation(selectedCountry, selectedCity, hood.name);
                              setShowNeighborhoodDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 transition-colors active:scale-[0.98]"
                            style={{
                              background: isSelected ? `${c.accent}12` : 'transparent',
                              borderBottom: `1px solid ${c.divider}`,
                            }}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c.textDim}12` }}>
                              <MapPin size={14} style={{ color: c.textMuted }} />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-[13px] font-semibold" style={{ color: c.text }}>{hood.name}</div>
                              <div className="text-[11px]" style={{ color: c.textDim }}>{hood.venueCount} places</div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: c.accent }}>
                                <Check size={12} color="#fff" strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>,
              frame
            );
          })()}

          {/* Sort By button */}
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: filters.sortBy ? `${c.accent}20` : c.surface,
              border: `1.5px solid ${filters.sortBy ? c.accent : c.border}`,
              color: filters.sortBy ? c.accent : c.textMuted,
            }}>
            <ArrowUpDown size={14} />
            {filters.sortBy
              ? SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label || 'Sort'
              : 'Sort'}
            <ChevronDown size={12} style={{ transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {/* Sort dropdown rendered via portal */}
          {showSortDropdown && (() => {
            const frame = document.querySelector('[data-phone-frame]') || document.getElementById('phone-frame');
            if (!frame) return null;
            return createPortal(
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 9998 }}
                onClick={() => setShowSortDropdown(false)}
              >
                {/* Backdrop */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                {/* Dropdown card */}
                <div
                  className="relative w-[75%] rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: c.surface,
                    border: `1px solid ${c.border}`,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: c.text }}>Sort By</span>
                    <button onClick={() => setShowSortDropdown(false)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: c.surfaceAlt }}>
                      <X size={14} style={{ color: c.textMuted }} />
                    </button>
                  </div>
                  <div className="px-2 pb-2">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setFilters(f => ({ ...f, sortBy: f.sortBy === opt.value ? null : opt.value }));
                          setShowSortDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background: filters.sortBy === opt.value ? `${c.accent}15` : 'transparent',
                          color: filters.sortBy === opt.value ? c.accent : c.textMuted,
                        }}>
                        <span className="text-base">{opt.icon}</span>
                        <span className="flex-1 text-left">{opt.label}</span>
                        {filters.sortBy === opt.value && (
                          <span className="text-sm font-bold" style={{ color: c.accent }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {filters.sortBy && (
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => {
                          setFilters(f => ({ ...f, sortBy: null }));
                          setShowSortDropdown(false);
                        }}
                        className="w-full py-2.5 rounded-xl text-xs font-medium transition-all"
                        style={{ background: c.surfaceAlt, color: c.textDim, border: `1px solid ${c.border}` }}>
                        Clear sort
                      </button>
                    </div>
                  )}
                </div>
              </div>,
              frame
            );
          })()}

          {/* Active filter chips */}
          {filterSummaryChips.map((chip, i) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
              style={{
                background: `${c.accent}12`,
                border: `1px solid ${c.accent}35`,
                color: c.accent,
                animation: `filterChipPop 0.3s ease ${i * 40}ms both`,
              }}>
              {chip.label}
              <X size={10} />
            </button>
          ))}

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex-shrink-0 text-[11px] font-medium px-2" style={{ color: c.textDim }}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Search results overlay */}
      {showSearchOverlay ? (
        <div className="px-5 pb-4" style={{ minHeight: 200 }}>
          {hasQuery ? (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: c.textDim }}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}{activeFilterCount > 0 ? ' (filtered)' : ''}
                </span>
                <button onClick={clearSearch} className="text-xs font-medium" style={{ color: c.accent }}>Clear</button>
              </div>

              {/* Results list */}
              {displayedResults.length > 0 ? (
                <div
                  className="flex flex-col gap-1"
                  style={{
                    opacity: resultsAnimState === 'fading' ? 0 : 1,
                    transform: resultsAnimState === 'fading' ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
                    transition: resultsAnimState === 'fading' ? 'opacity 0.2s ease, transform 0.2s ease' : 'opacity 0.3s ease, transform 0.3s ease',
                  }}
                >
                  {displayedResults.map(({ venue: v }, i) => (
                    <div key={v.id}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        opacity: resultsAnimState === 'entering' ? 1 : undefined,
                        transform: resultsAnimState === 'entering' ? 'translateY(0)' : undefined,
                        animation: resultsAnimState === 'entering' ? `searchResultSlideIn 0.35s ease ${i * 50}ms both` : 'none',
                      }}
                      onClick={() => openVenueDetail(v.id)}>
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative"
                        style={{ background: v.gradient }}>
                        {v.image ? (
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">{v.emoji}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold leading-tight mb-0.5" style={{ color: c.text }}>
                          {highlightMatch(v.name, searchQuery)}
                        </div>
                        <div className="text-xs mb-1" style={{ color: c.textMuted }}>
                          {highlightMatch(v.cuisine, searchQuery)} · {v.price} · {v.area ? `${highlightMatch(v.area, searchQuery)}, ` : ''}{highlightMatch(v.city, searchQuery)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={11} fill={c.gold} stroke={c.gold} />
                          <span className="text-[11px] font-bold" style={{ color: c.gold }}>{v.score}</span>
                          <span className="text-[10px]" style={{ color: c.textDim }}>({v.reviewCount})</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-display text-xl font-extrabold" style={{ color: c.accent }}>{v.score}</div>
                        <div className="text-[10px]" style={{ color: c.textDim }}>{v.reviewCount} reviews</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center gap-3 text-center"
                  style={{
                    animation: 'emptyStateFadeIn 0.4s ease both',
                  }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{ background: c.surfaceAlt, animation: 'emptyStateBounce 0.6s ease 0.2s both' }}>
                    🔍
                  </div>
                  <div className="text-sm font-semibold" style={{ color: c.text }}>No results found</div>
                  <div className="text-xs px-8" style={{ color: c.textDim }}>
                    Try adjusting your filters or search for a different term
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters}
                      className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: `${c.accent}15`, color: c.accent, border: `1px solid ${c.accent}30` }}>
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent searches */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} style={{ color: c.textDim }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.textDim }}>Recent</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button key={term}
                      onClick={() => handleChipSearch(term)}
                      className="px-3.5 py-2 rounded-full text-xs font-medium transition-all"
                      style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.textMuted }}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending searches */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} style={{ color: c.accent }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.textDim }}>Trending</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map(term => (
                    <button key={term}
                      onClick={() => handleChipSearch(term)}
                      className="px-3.5 py-2 rounded-full text-xs font-medium transition-all"
                      style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30`, color: c.accent }}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick category chips */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider mb-3 block" style={{ color: c.textDim }}>Categories</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickCategories.map((chip, i) => (
                    <div key={i}
                      className="flex items-center gap-2.5 p-3.5 rounded-lg cursor-pointer transition-all"
                      style={{ background: c.surface, border: `1px solid ${c.border}` }}
                      onClick={() => handleChipSearch(chip.searchTerm)}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: chip.bg }}>
                        {chip.icon}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium" style={{ color: c.text }}>{chip.label}</div>
                        <div className="text-[11px]" style={{ color: c.textDim }}>{chip.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex px-5 pb-4">
            {searchTabs.map(tab => (
              <button key={tab.key}
                onClick={() => setSearchTab(tab.key)}
                className="flex-1 text-center py-2.5 text-sm font-medium transition-all"
                style={{
                  color: searchTab === tab.key ? c.text : c.textDim,
                  borderBottom: `2px solid ${searchTab === tab.key ? c.accent : 'transparent'}`,
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {searchTab === 'restaurants' && <RestaurantsTab filters={filters} />}
          {searchTab === 'map' && <MapTab />}
          {searchTab === 'foodies' && <FoodiesTab />}
          {searchTab === 'lists' && <ListsTab />}
        </>
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={previewFilteredCount}
      />
    </div>
  );
}

function RestaurantsTab({ filters }: { filters: FilterState }) {
  const { c, isDark } = useBiteTheme();
  const { selectedCountry, selectedCity, selectedNeighborhood, openVenueDetail } = useApp();

  const filteredVenues = useMemo(() => {
    return applyFiltersToVenues(venues, filters, selectedCountry, selectedCity, selectedNeighborhood);
  }, [selectedCountry, selectedCity, selectedNeighborhood, filters]);

  const isOtherCountry = selectedCountry !== 'Cyprus';
  const hasActiveFilters = countActiveFilters(filters) > 0;

  // Animate venue cards when filter results change
  const [venueAnimState, setVenueAnimState] = useState<'visible' | 'fading' | 'entering'>('visible');
  const [displayedVenues, setDisplayedVenues] = useState(filteredVenues);
  const prevVenueKeyRef = useRef(filteredVenues.map(v => v.id).join(','));
  const venueAnimRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const currentKey = filteredVenues.map(v => v.id).join(',');
    if (prevVenueKeyRef.current !== currentKey && displayedVenues.length > 0) {
      setVenueAnimState('fading');
      if (venueAnimRef.current) clearTimeout(venueAnimRef.current);
      venueAnimRef.current = setTimeout(() => {
        setDisplayedVenues(filteredVenues);
        setVenueAnimState('entering');
        venueAnimRef.current = setTimeout(() => {
          setVenueAnimState('visible');
        }, 400);
      }, 200);
    } else {
      setDisplayedVenues(filteredVenues);
      if (filteredVenues.length > 0 && displayedVenues.length === 0) {
        setVenueAnimState('entering');
        venueAnimRef.current = setTimeout(() => {
          setVenueAnimState('visible');
        }, 400);
      }
    }
    prevVenueKeyRef.current = currentKey;
    return () => { if (venueAnimRef.current) clearTimeout(venueAnimRef.current); };
  }, [filteredVenues]);

  return (
    <div>
      {/* Map preview */}
      <div className="mx-5 mb-5 h-44 rounded-2xl flex items-center justify-center flex-col gap-2 cursor-pointer relative overflow-hidden"
        style={{ background: isDark ? 'linear-gradient(135deg, #1a2a1a, #0f1a0f)' : 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', border: `1px solid ${c.border}` }}>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at 30% 40%, ${c.accent}20 0%, transparent 50%), radial-gradient(circle at 70% 60%, ${c.blue}15 0%, transparent 50%)`
        }} />
        <div className="flex gap-4 z-10">
          {[{ color: c.accent, delay: '0s' }, { color: c.blue, delay: '0.5s' }, { color: c.green, delay: '1s' }].map((dot, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: dot.color, boxShadow: `0 0 10px ${dot.color}40`, animationDelay: dot.delay }} />
          ))}
        </div>
        <span className="text-[13px] font-medium z-10" style={{ color: c.textMuted }}>
          <MapPin size={14} className="inline mr-1" />Explore nearby
        </span>
      </div>

      {isOtherCountry ? (
        <div className="mx-5 mb-5 py-10 rounded-2xl flex flex-col items-center justify-center gap-3 text-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <div className="text-4xl">🌍</div>
          <div className="text-sm font-semibold" style={{ color: c.text }}>Coming Soon to {selectedCountry}</div>
          <div className="text-xs px-6" style={{ color: c.textDim }}>
            We're expanding! Venue data for {selectedCountry} is on the way. Switch back to Cyprus to explore.
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-5 pb-3">
            <h3 className="font-display text-lg font-bold" style={{ color: c.text }}>
              {hasActiveFilters ? 'Filtered Results' : selectedCity === 'All Cities' ? 'All Restaurants' : `Restaurants in ${selectedCity}`}
            </h3>
            <span className="text-[13px] font-medium" style={{ color: c.accent }}>{filteredVenues.length} places</span>
          </div>
          {displayedVenues.length > 0 ? (
            <div
              className="flex gap-3.5 px-5 pb-6 overflow-x-auto scrollbar-hide"
              style={{
                opacity: venueAnimState === 'fading' ? 0 : 1,
                transform: venueAnimState === 'fading' ? 'translateX(-12px) scale(0.97)' : 'translateX(0) scale(1)',
                transition: venueAnimState === 'fading'
                  ? 'opacity 0.2s ease, transform 0.2s ease'
                  : 'opacity 0.3s ease, transform 0.3s ease',
              }}
            >
              {displayedVenues.slice(0, 8).map((v, i) => (
                <div
                  key={v.id}
                  style={{
                    animation: venueAnimState === 'entering'
                      ? `venueCardSlideIn 0.35s ease ${i * 60}ms both`
                      : 'none',
                  }}
                >
                  <VenueCard venue={v} compact />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-5 mb-5 py-8 rounded-xl flex flex-col items-center gap-2 text-center"
              style={{ background: c.surface, border: `1px solid ${c.border}`, animation: 'emptyStateFadeIn 0.4s ease both' }}>
              <div className="text-3xl" style={{ animation: 'emptyStateBounce 0.6s ease 0.2s both' }}>🔍</div>
              <div className="text-sm font-medium" style={{ color: c.textDim }}>
                {hasActiveFilters ? 'No restaurants match your filters' : `No restaurants found in ${selectedCity}`}
              </div>
              {hasActiveFilters && (
                <div className="text-xs" style={{ color: c.textDim }}>Try adjusting your filter criteria</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MapTab() {
  const { openVenueDetail } = useApp();
  const { c, isDark } = useBiteTheme();
  const mapVenues = venues.filter(v => v.distance);
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', '🍽️ Dining', '☕ Coffee', '🍸 Bars', '🥐 Bakeries'];

  const pinPositions = [
    { top: '22%', left: '28%', venue: venues[0] },
    { top: '38%', left: '58%', venue: venues[1] },
    { top: '52%', left: '22%', venue: venues[2] },
    { top: '18%', left: '72%', venue: venues[4] },
    { top: '65%', left: '45%', venue: venues[9] },
    { top: '42%', left: '80%', venue: venues[7] },
    { top: '75%', left: '70%', venue: venues[5] },
  ];

  const pinColors: Record<string, string> = {
    'bottega-amaro': '#FF6B35', 'koi-sushi': '#60A5FA', 'istorja-cafe': '#4ADE80',
    'aigion': '#F472B6', 'meze-republic': '#F5C542', 'noir-bar': '#FF6B35', 'seaside-lounge': '#60A5FA',
  };

  const mapBg = isDark
    ? 'linear-gradient(145deg, #0f1a12 0%, #111a16 30%, #0f1610 60%, #121a14 100%)'
    : 'linear-gradient(145deg, #E8F5E9 0%, #F1F8E9 30%, #E0F2F1 60%, #E8F5E9 100%)';
  const gridLine = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)';
  const roadLine = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  const tooltipBg = isDark ? 'rgba(13,13,13,0.85)' : 'rgba(255,255,255,0.92)';

  return (
    <div>
      <div className="mx-5 mb-0 rounded-2xl relative overflow-hidden" style={{ height: 380, border: `1px solid ${c.border}` }}>
        <div className="w-full h-full relative" style={{ background: mapBg }}>
          {[25, 50, 75].map(p => (
            <div key={`h${p}`} className="absolute left-0 right-0" style={{ top: `${p}%`, height: 1, background: gridLine }} />
          ))}
          {[25, 50, 75].map(p => (
            <div key={`v${p}`} className="absolute top-0 bottom-0" style={{ left: `${p}%`, width: 1, background: gridLine }} />
          ))}
          <div className="absolute" style={{ top: '30%', left: '10%', width: '80%', height: 3, background: roadLine, borderRadius: 2, transform: 'rotate(-2deg)' }} />
          <div className="absolute" style={{ top: '55%', left: '5%', width: '60%', height: 3, background: roadLine, borderRadius: 2, transform: 'rotate(3deg)' }} />
          <div className="absolute" style={{ left: '35%', top: '10%', width: 3, height: '80%', background: roadLine, borderRadius: 2, transform: 'rotate(1deg)' }} />
          <div className="absolute bottom-0 right-0" style={{ width: '40%', height: '30%', background: isDark ? 'linear-gradient(135deg, rgba(96,165,250,0.06), rgba(96,165,250,0.02))' : 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.05))', borderRadius: '60% 0 0 0' }} />
          {pinPositions.map((pin, i) => (
            <div key={i} className="absolute z-10 cursor-pointer group" style={{ top: pin.top, left: pin.left }}
              onClick={() => openVenueDetail(pin.venue.id)}>
              <div className="w-3.5 h-3.5 rounded-full animate-pulse"
                style={{ background: pinColors[pin.venue.id] || c.accent, boxShadow: `0 0 10px ${pinColors[pin.venue.id] || c.accent}40`, border: '2px solid rgba(0,0,0,0.3)' }} />
              <div className="absolute -top-2 left-5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none"
                style={{ background: tooltipBg, backdropFilter: 'blur(8px)', border: `1px solid ${c.border}` }}>
                <span className="text-xs font-extrabold font-display" style={{ color: pinColors[pin.venue.id] || c.accent }}>{pin.venue.score}</span>
                <span className="text-[11px] font-medium" style={{ color: c.textMuted }}>{pin.venue.name.split(' ')[0]}</span>
              </div>
            </div>
          ))}
          <div className="absolute z-20" style={{ top: '45%', left: '42%' }}>
            <div className="w-3 h-3 rounded-full relative z-10" style={{ background: '#4F8EF7', border: '2.5px solid #fff', boxShadow: '0 0 8px rgba(79,142,247,0.5)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full animate-pulse"
              style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.15)' }} />
          </div>
        </div>
        <div className="absolute top-3 left-3 right-3 z-30 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium"
                style={{
                  background: activeFilter === f ? c.accent : tooltipBg,
                  color: activeFilter === f ? '#fff' : c.textMuted,
                  border: `1px solid ${activeFilter === f ? c.accent : c.border}`,
                  backdropFilter: 'blur(8px)'
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
          style={{ background: tooltipBg, backdropFilter: 'blur(8px)', border: `1px solid ${c.border}`, color: c.textMuted }}>
          <MapPin size={14} style={{ color: c.accent }} />
          Limassol Old Town
        </div>
      </div>

      <div className="flex justify-between items-center px-5 pt-4 pb-3">
        <h3 className="font-display text-lg font-bold" style={{ color: c.text }}>Nearby</h3>
        <span className="text-[13px] font-medium" style={{ color: c.accent }}>{mapVenues.length} places</span>
      </div>
      <div className="px-5 pb-4">
        {mapVenues.map((v, i) => (
          <div key={v.id} className="flex items-center gap-3 py-3 cursor-pointer transition-all"
            style={{ borderBottom: i < mapVenues.length - 1 ? `1px solid ${c.divider}` : 'none' }}
            onClick={() => openVenueDetail(v.id)}>
            <div className="w-5 text-[13px] font-bold text-center flex-shrink-0" style={{ color: c.textDim }}>{i + 1}</div>
            <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0"
              style={{ background: v.gradient }}>
              {v.image ? (
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">{v.emoji}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: c.text }}>{v.name}</div>
              <div className="text-xs" style={{ color: c.textMuted }}>{v.cuisine} · {v.price} · {v.area ? `${v.area}, ${v.city}` : v.city}</div>
            </div>
            <div className="font-display text-lg font-extrabold flex-shrink-0"
              style={{ color: pinColors[v.id] || c.accent }}>{v.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const pinColors: Record<string, string> = {
  'bottega-amaro': '#FF6B35', 'koi-sushi': '#60A5FA', 'istorja-cafe': '#4ADE80',
  'aigion': '#F472B6', 'meze-republic': '#F5C542', 'noir-bar': '#FF6B35', 'seaside-lounge': '#60A5FA',
};

function FoodiesTab() {
  const { openUserProfile, toggleFollow, followedUsers } = useApp();
  const { c } = useBiteTheme();
  const foodies = users.filter(u => u.id !== 'michel');

  return (
    <div>
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <Search size={16} style={{ color: c.textDim }} />
          <input type="text" placeholder="Search foodies by name..." readOnly
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }} />
        </div>
      </div>

      <div className="flex justify-between items-center px-5 pb-3">
        <h3 className="font-display text-lg font-bold" style={{ color: c.text }}>Top Foodies</h3>
        <span className="text-[13px] font-medium" style={{ color: c.accent }}>This month</span>
      </div>

      <div className="px-5">
        {foodies.map((user, i) => (
          <div key={user.id} className="flex items-center gap-3 py-3 cursor-pointer transition-all"
            style={{ borderBottom: i < foodies.length - 1 ? `1px solid ${c.divider}` : 'none' }}
            onClick={() => openUserProfile(user.id)}>
            <div className="w-5 text-sm font-extrabold text-center flex-shrink-0 font-display" style={{ color: c.textDim }}>{i + 1}</div>
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ background: user.avatarGrad }}>{user.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: c.text }}>{user.name}</div>
              <div className="text-[11px] mb-1" style={{ color: c.textDim }}>{user.handle} · Level {user.level}</div>
              {user.tags && (
                <div className="flex gap-1 overflow-hidden">
                  {user.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.textMuted }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button className="px-4 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all"
              style={{
                background: followedUsers.has(user.id) ? c.surface : c.accent,
                color: followedUsers.has(user.id) ? c.textMuted : '#fff',
                border: followedUsers.has(user.id) ? `1px solid ${c.border}` : 'none',
              }}
              onClick={(e) => { e.stopPropagation(); toggleFollow(user.id); }}>
              {followedUsers.has(user.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListsTab() {
  const { c } = useBiteTheme();
  const { openListDetail } = useApp();
  const publicLists = getPublicLists();

  return (
    <div className="px-5">
      <div className="flex justify-between items-center pb-3">
        <h3 className="font-display text-lg font-bold" style={{ color: c.text }}>Popular Lists</h3>
      </div>
      {publicLists.map((list, i) => (
        <div key={list.id}
          onClick={() => openListDetail(list.id)}
          className="flex items-center gap-3 py-3 cursor-pointer transition-press active:scale-[0.98]"
          style={{ borderBottom: i < publicLists.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            {list.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: c.text }}>{list.name}</div>
            <div className="text-[11px]" style={{ color: c.textDim }}>by {list.byName} · {list.venueIds.length} places</div>
          </div>
          <div className="text-[11px] font-medium flex-shrink-0" style={{ color: c.textMuted }}>
            {list.saves} saves
          </div>
        </div>
      ))}
    </div>
  );
}
