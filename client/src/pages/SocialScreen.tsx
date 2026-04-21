import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import ReviewCard from '@/components/ReviewCard';
import { reviews, leaderboard, getUser, venues, users } from '@/lib/data';
import { Star, MapPin, Sparkles, Lock, ChevronRight, RefreshCw, Trophy, Utensils, MessageSquare, Award, Flame, TrendingUp, Crown, Calendar, Timer } from 'lucide-react';

export default function SocialScreen() {
  const { socialTab, setSocialTab } = useApp();
  const { c } = useBiteTheme();

  const tabs = [
    { key: 'following' as const, label: 'Following' },
    { key: 'leaderboard' as const, label: 'Leaderboard' },
    { key: 'yourtaste' as const, label: 'Your Taste' },
  ];

  return (
    <div>
      <div className="px-5 pt-2 pb-4">
        <h2 className="font-display text-[22px] font-bold mb-3" style={{ color: c.text }}>Social</h2>
        <div className="flex">
          {tabs.map(tab => (
            <button key={tab.key}
              onClick={() => setSocialTab(tab.key)}
              className="flex-1 text-center py-2.5 text-xs font-medium transition-all"
              style={{
                color: socialTab === tab.key ? c.text : c.textDim,
                borderBottom: `2px solid ${socialTab === tab.key ? c.accent : 'transparent'}`,
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {socialTab === 'following' && <FollowingFeed />}
      {socialTab === 'leaderboard' && <LeaderboardView />}
      {socialTab === 'yourtaste' && <YourTasteView />}
    </div>
  );
}

function FollowingFeed() {
  return (
    <div className="pb-4">
      {reviews.map(r => (
        <ReviewCard key={r.id} review={r} showFollow />
      ))}
    </div>
  );
}

/* ─── Deterministic hash for stable "random" values ─── */
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return Math.abs(hash);
}

/* ─── Recommendation generator ─── */
const cuisineMap: Record<string, string[]> = {
  restaurant: ['Italian', 'Japanese', 'Mediterranean', 'Steakhouse', 'Cypriot', 'Seafood', 'Vegan', 'Pizza'],
  cafe: ['Cafe', 'Brunch'],
  bar: ['Cocktails', 'Rooftop Bar', 'Bar'],
  bakery: ['Bakery', 'Bakery & Coffee'],
};

const matchReasons: Record<string, string[]> = {
  restaurant: [
    'Matches your love for Italian cuisine',
    'Similar vibe to places you enjoy',
    'Popular with foodies like you',
    'Highly rated by your taste twins',
    'Based on your dining history',
    'Recommended for your palate',
  ],
  cafe: [
    'Perfect for your coffee ritual',
    'Matches your brunch preferences',
    'Loved by people with similar taste',
    'Great atmosphere you\'d enjoy',
  ],
  bar: [
    'Cocktails you\'d love based on your taste',
    'Similar ambiance to your favorites',
    'Recommended by your taste twins',
    'Matches your evening vibe',
  ],
  bakery: [
    'Fresh pastries matching your taste',
    'Similar to bakeries you\'ve loved',
    'Popular with your taste twins',
    'Perfect for your sweet tooth',
  ],
};

function generateRecommendations(seed: number) {
  const result: Record<string, Array<typeof venues[0] & { matchReason: string; matchScore: number }>> = {};

  for (const cat of Object.keys(cuisineMap)) {
    const keywords = cuisineMap[cat];
    const filtered = venues.filter(v => {
      const cuisine = (v.cuisine || '').toLowerCase();
      const name = v.name.toLowerCase();
      return keywords.some(k => cuisine.includes(k.toLowerCase()) || name.includes(k.toLowerCase()));
    });

    // Shuffle using seed to get different orderings on refresh
    const shuffled = [...filtered].sort((a, b) => {
      const ha = stableHash(a.id + cat + seed);
      const hb = stableHash(b.id + cat + seed);
      return ha - hb;
    });

    result[cat] = shuffled.slice(0, 4).map(v => {
      const h = stableHash(v.id + cat + seed);
      const reasons = matchReasons[cat] || matchReasons.restaurant;
      return {
        ...v,
        matchScore: 82 + (h % 16), // 82–97%
        matchReason: reasons[h % reasons.length],
      };
    });
  }

  return result;
}

/* ─── Pull-to-Refresh hook ─── */
function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 70;
  const MAX_PULL = 110;
  const RESISTANCE = 0.45;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    // Only activate when scrolled to top — walk up to find the scroll container
    let el: HTMLElement | null = containerRef.current;
    while (el) {
      if (el.scrollTop > 2) return; // not at top
      if (el.classList.contains('overflow-y-auto')) break;
      el = el.parentElement;
    }
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || isRefreshing) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY < 0) {
      setPullDistance(0);
      return;
    }
    const dampened = Math.min(deltaY * RESISTANCE, MAX_PULL);
    setPullDistance(dampened);
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current || isRefreshing) return;
    isDragging.current = false;

    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD * 0.6); // Snap to spinner position
      await onRefresh();
      setShowComplete(true);
      // Brief "done" flash
      await new Promise(r => setTimeout(r, 400));
      setShowComplete(false);
      setIsRefreshing(false);
    }
    setPullDistance(0);
  }, [pullDistance, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return {
    containerRef,
    pullDistance,
    isRefreshing,
    showComplete,
    progress,
    THRESHOLD,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/* ─── Your Taste ─── */
function YourTasteView() {
  const { openVenueDetail } = useApp();
  const { c } = useBiteTheme();
  const user = users[0]; // Michel is the current user
  const placesLogged = user.visitedPlaces?.length || 0;
  const minPlaces = 10;
  const isUnlocked = placesLogged >= minPlaces;

  // Category definitions
  const categories = [
    { key: 'restaurant', label: 'Restaurants', emoji: '🍽️' },
    { key: 'cafe', label: 'Cafes', emoji: '☕' },
    { key: 'bar', label: 'Bars', emoji: '🍸' },
    { key: 'bakery', label: 'Bakeries', emoji: '🥐' },
  ];

  // Seed-based recommendations that change on refresh
  const [seed, setSeed] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  const recommendations = useMemo(() => generateRecommendations(seed), [seed]);

  // Taste tags derived from user's visited places
  const tasteTags = useMemo(() => {
    const visited = user.visitedPlaces || [];
    const cuisineCounts: Record<string, number> = {};
    for (const pid of visited) {
      const v = venues.find(x => x.id === pid);
      if (v) cuisineCounts[v.cuisine] = (cuisineCounts[v.cuisine] || 0) + 1;
    }
    const sorted = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]);
    const tagMap: Record<string, string> = {
      Italian: 'Italian lover',
      Cafe: 'Coffee enthusiast',
      Mediterranean: 'Fine dining',
      Cocktails: 'Cocktail explorer',
      Japanese: 'Sushi aficionado',
      Cypriot: 'Local cuisine fan',
      Brunch: 'Brunch regular',
      'Bakery & Coffee': 'Pastry connoisseur',
      Seafood: 'Seafood lover',
      Steakhouse: 'Steak connoisseur',
    };
    return sorted.slice(0, 4).map(([cuisine]) => tagMap[cuisine] || `${cuisine} fan`);
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    setFadeIn(true);
    setSeed(prev => prev + 1);
    // Reset fade after animation
    setTimeout(() => setFadeIn(false), 500);
  }, []);

  const ptr = usePullToRefresh(handleRefresh);

  // Locked state — no pull-to-refresh
  if (!isUnlocked) {
    return (
      <div className="px-5 py-8">
        <div className="rounded-2xl p-6 text-center" style={{ background: c.surface, border: `1px solid ${c.divider}` }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: `${c.accent}15` }}>
            <Lock size={28} style={{ color: c.accent }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: c.text }}>Unlock Your Taste Profile</h3>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: c.textDim }}>
            Log {minPlaces} different places to unlock personalized recommendations for restaurants, bars, cafes, and bakeries tailored to your taste.
          </p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: c.textDim }}>Progress</span>
              <span className="font-semibold" style={{ color: c.accent }}>{placesLogged}/{minPlaces} places</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: c.surfaceAlt }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(placesLogged / minPlaces) * 100}%`,
                  background: `linear-gradient(90deg, ${c.accent}, ${c.gold})`,
                }} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: c.textDim }}>
            <Sparkles size={14} style={{ color: c.gold }} />
            <span>{minPlaces - placesLogged} more places to go</span>
          </div>
        </div>

        {/* What you'll get */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: c.textDim }}>
            What you'll unlock
          </h4>
          {categories.map(cat => (
            <div key={cat.key} className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: `1px solid ${c.divider}` }}>
              <span className="text-lg">{cat.emoji}</span>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: c.text }}>{cat.label}</div>
                <div className="text-[11px]" style={{ color: c.textDim }}>
                  Personalized {cat.label.toLowerCase()} picks
                </div>
              </div>
              <Lock size={14} style={{ color: c.textDim }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Unlocked state — with pull-to-refresh
  return (
    <div
      ref={ptr.containerRef}
      {...ptr.handlers}
      style={{ touchAction: ptr.pullDistance > 0 ? 'none' : 'auto' }}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="flex flex-col items-center justify-end overflow-hidden"
        style={{
          height: ptr.pullDistance,
          transition: ptr.isRefreshing ? 'none' : (ptr.pullDistance === 0 ? 'height 0.3s cubic-bezier(0.2, 0, 0, 1)' : 'none'),
        }}
      >
        <div className="pb-2 flex flex-col items-center gap-1">
          {/* Spinner / arrow */}
          <div
            className="flex items-center justify-center"
            style={{
              opacity: Math.max(ptr.progress * 1.2, ptr.isRefreshing ? 1 : 0),
              transition: 'opacity 0.15s',
            }}
          >
            <RefreshCw
              size={20}
              style={{
                color: ptr.showComplete ? c.green : c.accent,
                transform: ptr.isRefreshing
                  ? undefined
                  : `rotate(${ptr.progress * 270}deg)`,
                transition: ptr.isRefreshing ? 'none' : 'color 0.2s',
                animation: ptr.isRefreshing && !ptr.showComplete ? 'ptr-spin 0.7s linear infinite' : 'none',
              }}
            />
          </div>
          {/* Status text */}
          <span
            className="text-[10px] font-medium"
            style={{
              color: ptr.showComplete ? c.green : (ptr.progress >= 1 ? c.accent : c.textDim),
              opacity: ptr.progress > 0.3 || ptr.isRefreshing ? 1 : 0,
              transition: 'opacity 0.15s, color 0.2s',
            }}
          >
            {ptr.showComplete
              ? 'Updated!'
              : ptr.isRefreshing
                ? 'Refreshing...'
                : ptr.progress >= 1
                  ? 'Release to refresh'
                  : 'Pull to refresh'}
          </span>
        </div>
      </div>

      <div
        className="px-5 py-3 pb-6"
        style={{
          opacity: fadeIn ? 0 : 1,
          transform: fadeIn ? 'translateY(6px)' : 'translateY(0)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {/* Taste profile header */}
        <div className="rounded-2xl p-4 mb-5" style={{
          background: `linear-gradient(135deg, ${c.accent}18, ${c.gold}10)`,
          border: `1px solid ${c.accent}25`,
        }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `${c.accent}20` }}>
              <Sparkles size={20} style={{ color: c.accent }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: c.text }}>Your Taste Profile</div>
              <div className="text-[11px]" style={{ color: c.textDim }}>
                Based on {placesLogged} places you've logged
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tasteTags.map(tag => (
              <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${c.accent}15`, color: c.accent }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Category sections */}
        {categories.map(cat => {
          const recs = recommendations[cat.key] || [];
          if (recs.length === 0) return null;

          return (
            <div key={cat.key} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{cat.emoji}</span>
                <h3 className="text-sm font-bold" style={{ color: c.text }}>{cat.label} for You</h3>
              </div>

              <div className="space-y-2.5">
                {recs.map(venue => (
                  <div key={venue.id}
                    className="rounded-xl p-3 cursor-pointer transition-all active:scale-[0.98]"
                    style={{ background: c.surface, border: `1px solid ${c.divider}` }}
                    onClick={() => openVenueDetail(venue.id)}>
                    <div className="flex gap-3">
                      {/* Venue image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        {venue.image ? (
                          <img src={venue.image} alt={venue.name}
                            className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl"
                            style={{ background: venue.gradient || c.surfaceAlt }}>
                            {venue.emoji}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate" style={{ color: c.text }}>
                              {venue.name}
                            </div>
                            <div className="text-[11px] mt-0.5" style={{ color: c.textDim }}>
                              {venue.cuisine} · {venue.price}
                            </div>
                          </div>
                          {/* Match score */}
                          <div className="flex-shrink-0 text-right">
                            <div className="text-xs font-bold" style={{ color: c.accent }}>
                              {venue.matchScore}%
                            </div>
                            <div className="text-[9px]" style={{ color: c.textDim }}>match</div>
                          </div>
                        </div>

                        {/* Match reason */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <Sparkles size={10} style={{ color: c.gold }} />
                          <span className="text-[10px] italic" style={{ color: c.gold }}>
                            {venue.matchReason}
                          </span>
                        </div>

                        {/* Rating + location */}
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1">
                            <Star size={11} fill={c.gold} stroke={c.gold} />
                            <span className="text-[11px] font-semibold" style={{ color: c.text }}>
                              {venue.score}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={10} style={{ color: c.textDim }} />
                            <span className="text-[10px]" style={{ color: c.textDim }}>
                              {venue.area || venue.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={16} className="flex-shrink-0 mt-4" style={{ color: c.textDim }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Tip */}
        <div className="rounded-xl p-3 mt-2 text-center" style={{ background: `${c.accent}08`, border: `1px dashed ${c.accent}30` }}>
          <p className="text-[11px]" style={{ color: c.textDim }}>
            <Sparkles size={12} className="inline mr-1" style={{ color: c.accent }} />
            Log more places to improve your recommendations
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Leaderboard dimension types ─── */
type LeaderboardDimension = 'xp' | 'places' | 'reviews' | 'badges' | 'streak' | 'monthly';

interface DimensionConfig {
  key: LeaderboardDimension;
  label: string;
  shortLabel: string;
  icon: typeof Trophy;
  color: string;
  unit: string;
  getValue: (userId: string) => number;
  getDisplay: (val: number) => string;
  getSublabel: (userId: string) => string;
}

/* ─── Leaderboard ─── */
function LeaderboardView() {
  const { openUserProfile } = useApp();
  const { c } = useBiteTheme();
  const [activeDim, setActiveDim] = useState<LeaderboardDimension>('xp');

  // Monthly reset countdown
  const resetInfo = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    // Next 1st of the month
    const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffMs = nextReset.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const nextMonth = nextReset.toLocaleString('default', { month: 'long' });
    // Progress through the month (0 to 1)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const progress = (now.getTime() - monthStart.getTime()) / (monthEnd.getTime() - monthStart.getTime());
    return { currentMonth, currentYear, diffDays, diffHours, nextMonth, progress };
  }, []);

  // All user IDs from leaderboard + known users
  const allUserIds = useMemo(() => {
    const ids = new Set(leaderboard.map(e => e.userId));
    users.forEach(u => ids.add(u.id));
    return Array.from(ids);
  }, []);

  // Dimension configurations
  const dimensions: DimensionConfig[] = useMemo(() => [
    {
      key: 'xp', label: 'Total XP', shortLabel: 'XP', icon: Trophy, color: c.gold,
      unit: 'XP',
      getValue: (uid) => {
        const entry = leaderboard.find(e => e.userId === uid);
        const user = getUser(uid);
        return entry?.xp || user?.xp || 0;
      },
      getDisplay: (v) => v.toLocaleString(),
      getSublabel: (uid) => {
        const user = getUser(uid);
        return `Level ${user?.level || 1}`;
      },
    },
    {
      key: 'places', label: 'Places Visited', shortLabel: 'Places', icon: Utensils, color: c.accent,
      unit: 'places',
      getValue: (uid) => {
        const user = getUser(uid);
        return user ? parseInt(user.places) || user.visitedPlaces.length : stableHash(uid + 'places') % 120 + 30;
      },
      getDisplay: (v) => v.toString(),
      getSublabel: (uid) => {
        const user = getUser(uid);
        if (!user) return 'Explorer';
        const count = user.visitedPlaces.length;
        if (count > 10) return 'Seasoned explorer';
        if (count > 5) return 'Getting around';
        return 'Just starting';
      },
    },
    {
      key: 'reviews', label: 'Reviews Written', shortLabel: 'Reviews', icon: MessageSquare, color: c.blue,
      unit: 'reviews',
      getValue: (uid) => {
        const user = getUser(uid);
        return user ? parseInt(user.reviewCount) || 0 : stableHash(uid + 'reviews') % 80 + 10;
      },
      getDisplay: (v) => v.toString(),
      getSublabel: (uid) => {
        const user = getUser(uid);
        const count = user ? parseInt(user.reviewCount) || 0 : 0;
        if (count > 100) return 'Top critic';
        if (count > 50) return 'Prolific reviewer';
        return 'Active reviewer';
      },
    },
    {
      key: 'badges', label: 'Badges Earned', shortLabel: 'Badges', icon: Award, color: c.pink,
      unit: 'badges',
      getValue: (uid) => {
        const user = getUser(uid);
        return user ? user.badges.length + stableHash(uid + 'badges') % 5 : stableHash(uid + 'b') % 8 + 2;
      },
      getDisplay: (v) => v.toString(),
      getSublabel: (uid) => {
        const user = getUser(uid);
        if (!user) return 'Collector';
        const latest = user.badges[user.badges.length - 1];
        return latest ? `Latest: ${latest.icon} ${latest.name}` : 'Collector';
      },
    },
    {
      key: 'streak', label: 'Current Streak', shortLabel: 'Streak', icon: Flame, color: '#EF4444',
      unit: 'days',
      getValue: (uid) => {
        // Deterministic streaks based on user
        const streaks: Record<string, number> = {
          sofia: 94, elena: 42, andreas: 28, michel: 33,
          nikos: 18, maria: 55, kostas: 67,
        };
        return streaks[uid] || stableHash(uid + 'streak') % 60 + 3;
      },
      getDisplay: (v) => `${v}d`,
      getSublabel: (uid) => {
        const val = dimensions[4].getValue(uid);
        if (val > 60) return '🔥 On fire!';
        if (val > 30) return '💪 Consistent';
        return '📈 Building momentum';
      },
    },
    {
      key: 'monthly', label: 'This Month', shortLabel: 'Monthly', icon: TrendingUp, color: c.green,
      unit: 'pts',
      getValue: (uid) => {
        // Monthly points — a subset of XP earned recently
        const monthlyPts: Record<string, number> = {
          sofia: 840, elena: 720, andreas: 560, michel: 480,
          nikos: 390, maria: 650, kostas: 510,
        };
        return monthlyPts[uid] || stableHash(uid + 'monthly') % 400 + 100;
      },
      getDisplay: (v) => v.toLocaleString(),
      getSublabel: (uid) => {
        const user = getUser(uid);
        // Show how many new badges this month
        const badgeCount = user ? user.badges.filter(b => b.date.includes('Mar 2026') || b.date.includes('Feb 2026')).length : 0;
        return badgeCount > 0 ? `${badgeCount} new badge${badgeCount > 1 ? 's' : ''} this month` : 'Active this month';
      },
    },
  ], [c]);

  const currentDim = dimensions.find(d => d.key === activeDim)!;

  // Compute rankings for the active dimension
  const ranked = useMemo(() => {
    return allUserIds
      .map(uid => ({ userId: uid, value: currentDim.getValue(uid) }))
      .sort((a, b) => b.value - a.value)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));
  }, [allUserIds, activeDim, currentDim]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const podiumColors = [c.gold, '#C0C0C0', '#CD7F32'];
  const podiumLabels = ['🥇', '🥈', '🥉'];

  // Find current user's rank
  const myRank = ranked.find(r => r.userId === 'michel');

  return (
    <div>
      {/* Dimension pills — horizontally scrollable */}
      <div className="px-4 pt-3 pb-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {dimensions.map(dim => {
            const isActive = activeDim === dim.key;
            const Icon = dim.icon;
            return (
              <button key={dim.key}
                onClick={() => setActiveDim(dim.key)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap"
                style={{
                  background: isActive ? `${dim.color}18` : c.surface,
                  border: `1.5px solid ${isActive ? dim.color : c.border}`,
                  color: isActive ? dim.color : c.textDim,
                  boxShadow: isActive ? `0 2px 10px ${dim.color}15` : 'none',
                }}>
                <Icon size={13} />
                {dim.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active dimension header */}
      <div className="px-5 pt-2 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <currentDim.icon size={16} style={{ color: currentDim.color }} />
          <span className="text-sm font-bold" style={{ color: c.text }}>{currentDim.label}</span>
        </div>
        {myRank && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: `${c.accent}12`, border: `1px solid ${c.accent}20` }}>
            <span className="text-[10px]" style={{ color: c.textDim }}>You:</span>
            <span className="text-[11px] font-bold" style={{ color: c.accent }}>#{myRank.rank}</span>
            <span className="text-[10px]" style={{ color: c.textMuted }}>
              {currentDim.getDisplay(myRank.value)} {currentDim.unit}
            </span>
          </div>
        )}
      </div>

      {/* Podium — top 3 */}
      <div className="flex items-end justify-center gap-3 px-5 pt-3 pb-5">
        {[1, 0, 2].map(idx => {
          const entry = top3[idx];
          if (!entry) return null;
          const user = getUser(entry.userId);
          const isCenter = idx === 0;
          const heights = [120, 150, 100];
          const h = heights[idx];

          return (
            <div key={entry.userId} className="flex flex-col items-center cursor-pointer"
              onClick={() => openUserProfile(entry.userId)}
              style={{ width: isCenter ? 110 : 90 }}>
              <div className="relative mb-2">
                <div className="rounded-full flex items-center justify-center font-bold text-white text-lg"
                  style={{
                    width: isCenter ? 52 : 42, height: isCenter ? 52 : 42,
                    background: user?.avatarGrad || `linear-gradient(135deg, ${c.accent}, ${c.gold})`,
                    border: `3px solid ${podiumColors[idx]}`,
                    boxShadow: `0 0 15px ${podiumColors[idx]}30`
                  }}>
                  {user?.avatar || entry.userId[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">
                  {podiumLabels[idx]}
                </div>
              </div>
              <div className="text-[11px] font-semibold mb-0.5 text-center truncate w-full" style={{ color: c.text }}>
                {user?.name || entry.userId}
              </div>
              <div className="text-[11px] font-bold" style={{ color: podiumColors[idx] }}>
                {currentDim.getDisplay(entry.value)} <span className="text-[9px] font-normal">{currentDim.unit}</span>
              </div>
              <div className="w-full rounded-t-lg mt-1.5 flex items-end justify-center pb-1.5"
                style={{
                  height: h,
                  background: `linear-gradient(to top, ${podiumColors[idx]}12, transparent)`,
                  border: `1px solid ${podiumColors[idx]}18`,
                  borderBottom: 'none',
                  borderRadius: '12px 12px 0 0'
                }}>
                <span className="font-display text-xl font-extrabold" style={{ color: podiumColors[idx] }}>
                  {entry.rank}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remaining rankings */}
      <div className="px-5 pb-4">
        {rest.map((entry, i) => {
          const user = getUser(entry.userId);
          const isMe = entry.userId === 'michel';
          return (
            <div key={entry.userId}
              className="flex items-center gap-3 py-3 cursor-pointer"
              style={{
                borderBottom: i < rest.length - 1 ? `1px solid ${c.divider}` : 'none',
                background: isMe ? `${c.accent}08` : 'transparent',
                margin: isMe ? '0 -20px' : 0,
                padding: isMe ? '12px 20px' : undefined,
                borderRadius: isMe ? 12 : 0,
              }}
              onClick={() => openUserProfile(entry.userId)}>
              <div className="w-6 text-sm font-extrabold text-center flex-shrink-0 font-display"
                style={{ color: isMe ? c.accent : c.textDim }}>
                {entry.rank}
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: user?.avatarGrad || `linear-gradient(135deg, ${c.accent}, ${c.gold})` }}>
                {user?.avatar || entry.userId[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold" style={{ color: c.text }}>
                    {user?.name || entry.userId}
                  </span>
                  {isMe && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: `${c.accent}20`, color: c.accent }}>YOU</span>
                  )}
                </div>
                <div className="text-[11px]" style={{ color: c.textDim }}>
                  {currentDim.getSublabel(entry.userId)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold" style={{ color: currentDim.color }}>
                  {currentDim.getDisplay(entry.value)}
                </div>
                <div className="text-[9px]" style={{ color: c.textDim }}>{currentDim.unit}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly reset countdown banner */}
      <div className="px-5 pb-3">
        <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.divider}` }}>
          <div className="flex items-center gap-2 mb-2.5">
            <Calendar size={14} style={{ color: c.blue }} />
            <span className="text-xs font-bold" style={{ color: c.text }}>Monthly Reset</span>
            <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${c.blue}15`, color: c.blue }}>
              {resetInfo.currentMonth} {resetInfo.currentYear}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full mb-2.5" style={{ background: c.surfaceAlt }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(resetInfo.progress * 100, 100)}%`,
                background: `linear-gradient(90deg, ${c.accent}, ${c.gold})`,
              }} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Timer size={11} style={{ color: c.textDim }} />
              <span className="text-[11px]" style={{ color: c.textMuted }}>
                Resets in <span className="font-bold" style={{ color: c.accent }}>{resetInfo.diffDays}d {resetInfo.diffHours}h</span>
              </span>
            </div>
            <span className="text-[10px]" style={{ color: c.textDim }}>
              Next: {resetInfo.nextMonth} 1st
            </span>
          </div>

          <div className="mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${c.divider}` }}>
            <p className="text-[10px] leading-relaxed" style={{ color: c.textDim }}>
              All leaderboard rankings refresh on the 1st of every month. Keep logging places, writing reviews, and earning badges to climb the ranks!
            </p>
          </div>
        </div>
      </div>

      {/* Stats summary card */}
      <div className="px-5 pb-6">
        <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.divider}` }}>
          <div className="flex items-center gap-2 mb-3">
            <Crown size={14} style={{ color: c.gold }} />
            <span className="text-xs font-bold" style={{ color: c.text }}>Season Highlights</span>
            <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full" style={{ background: `${c.green}15`, color: c.green }}>{resetInfo.currentMonth} {resetInfo.currentYear}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Top Explorer', value: ranked[0]?.userId ? (getUser(ranked[0].userId)?.name || ranked[0].userId) : '—', icon: '👑', color: c.gold },
              { label: 'Most Active', value: '847 logs', icon: '📝', color: c.accent },
              { label: 'New Members', value: '+23', icon: '🆕', color: c.green },
            ].map((stat, i) => (
              <div key={i} className="text-center p-2.5 rounded-xl" style={{ background: c.surfaceAlt }}>
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-[11px] font-bold truncate" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[9px] mt-0.5" style={{ color: c.textDim }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
