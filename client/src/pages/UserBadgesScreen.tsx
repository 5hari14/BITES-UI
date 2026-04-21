import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, Award } from 'lucide-react';
import { getUser } from '@/lib/data';
import { useState } from 'react';

type BadgeCategory = 'Cuisine Explorer' | 'Lifestyle' | 'Consistency' | 'Milestones';

interface BadgeDef {
  icon: string;
  name: string;
  sub: string;
  requirement: string;
  target: number;
  unit: string;
  category: BadgeCategory;
}

interface CategoryMeta {
  name: BadgeCategory;
  icon: string;
  color: string; // key from BiteColors or hex
  description: string;
}

const CATEGORIES: CategoryMeta[] = [
  { name: 'Cuisine Explorer', icon: '🍽️', color: 'accent', description: 'Discover cuisines & dining styles' },
  { name: 'Lifestyle', icon: '✨', color: 'pink', description: 'Your dining personality & habits' },
  { name: 'Consistency', icon: '🔥', color: 'gold', description: 'Keep the streak alive' },
  { name: 'Milestones', icon: '🏆', color: 'green', description: 'Major achievements unlocked' },
];

// All possible badges with targets for progress tracking
const ALL_BADGES: BadgeDef[] = [
  // Cuisine Explorer
  { icon: '☕', name: 'Coffee Expert', sub: '20+ cafes visited', requirement: 'Visit 20 cafes', target: 20, unit: 'cafes', category: 'Cuisine Explorer' },
  { icon: '🍕', name: 'Pizza Hunter', sub: '15+ pizza spots', requirement: 'Visit 15 pizza places', target: 15, unit: 'pizza spots', category: 'Cuisine Explorer' },
  { icon: '🍝', name: 'Pasta Pro', sub: '30+ Italian spots', requirement: 'Visit 30 Italian restaurants', target: 30, unit: 'Italian spots', category: 'Cuisine Explorer' },
  { icon: '🌊', name: 'Seafood Lover', sub: '25+ seafood spots', requirement: 'Visit 25 seafood restaurants', target: 25, unit: 'seafood spots', category: 'Cuisine Explorer' },
  { icon: '🌱', name: 'Plant Based', sub: '15+ vegan spots', requirement: 'Visit 15 vegan restaurants', target: 15, unit: 'vegan spots', category: 'Cuisine Explorer' },
  { icon: '☕', name: 'Caffeine Addict', sub: '40+ cafes visited', requirement: 'Visit 40 cafes', target: 40, unit: 'cafes', category: 'Cuisine Explorer' },
  // Lifestyle
  { icon: '🌅', name: 'Sunset Chaser', sub: 'Outdoor dining pro', requirement: 'Visit 20 outdoor venues', target: 20, unit: 'outdoor venues', category: 'Lifestyle' },
  { icon: '💻', name: 'Remote Worker', sub: 'WiFi hunter', requirement: 'Log 15 work-friendly cafes', target: 15, unit: 'work cafes', category: 'Lifestyle' },
  { icon: '📸', name: 'Top Photographer', sub: '500+ food photos', requirement: 'Upload 500 photos', target: 500, unit: 'photos', category: 'Lifestyle' },
  // Consistency
  { icon: '🔥', name: '30-Day Streak', sub: 'Consistent reviewer', requirement: 'Log 30 days in a row', target: 30, unit: 'days', category: 'Consistency' },
  { icon: '🔥', name: '90-Day Streak', sub: 'On fire!', requirement: 'Log 90 days in a row', target: 90, unit: 'days', category: 'Consistency' },
  // Milestones
  { icon: '✨', name: 'Top Reviewer', sub: 'Top 5% in your city', requirement: 'Reach top 5% reviewers', target: 100, unit: 'reviews', category: 'Milestones' },
  { icon: '🗺️', name: 'Explorer', sub: '5+ cities explored', requirement: 'Log in 5 different cities', target: 5, unit: 'cities', category: 'Milestones' },
  { icon: '👑', name: 'Legend', sub: 'Level 20 reached', requirement: 'Reach Level 20', target: 20, unit: 'levels', category: 'Milestones' },
];

// Simulated progress data per user
const USER_PROGRESS: Record<string, Record<string, number>> = {
  michel: {
    'Coffee Expert': 20, 'Pizza Hunter': 15, '30-Day Streak': 30,
    'Pasta Pro': 21, 'Top Photographer': 234, 'Seafood Lover': 12,
    'Sunset Chaser': 8, 'Top Reviewer': 89, 'Remote Worker': 7,
    'Plant Based': 6, 'Caffeine Addict': 28,
    'Explorer': 3, 'Legend': 8, '90-Day Streak': 30,
  },
  sofia: {
    'Coffee Expert': 18, 'Pizza Hunter': 14, '30-Day Streak': 30,
    'Pasta Pro': 30, 'Top Photographer': 500, 'Seafood Lover': 22,
    'Sunset Chaser': 16, 'Top Reviewer': 178, 'Remote Worker': 5,
    'Plant Based': 9, 'Caffeine Addict': 35,
    'Explorer': 4, 'Legend': 18, '90-Day Streak': 90,
  },
  elena: {
    'Coffee Expert': 14, 'Pizza Hunter': 8, '30-Day Streak': 22,
    'Pasta Pro': 18, 'Top Photographer': 312, 'Seafood Lover': 25,
    'Sunset Chaser': 20, 'Top Reviewer': 124, 'Remote Worker': 3,
    'Plant Based': 4, 'Caffeine Addict': 22,
    'Explorer': 4, 'Legend': 14, '90-Day Streak': 45,
  },
  andreas: {
    'Coffee Expert': 20, 'Pizza Hunter': 6, '30-Day Streak': 18,
    'Pasta Pro': 8, 'Top Photographer': 89, 'Seafood Lover': 5,
    'Sunset Chaser': 4, 'Top Reviewer': 56, 'Remote Worker': 15,
    'Plant Based': 15, 'Caffeine Addict': 40,
    'Explorer': 2, 'Legend': 9, '90-Day Streak': 18,
  },
};

function getCategoryColor(cat: CategoryMeta, c: any): string {
  switch (cat.color) {
    case 'accent': return c.accent;
    case 'pink': return c.pink;
    case 'gold': return c.gold;
    case 'green': return c.green;
    case 'blue': return c.blue;
    default: return c.accent;
  }
}

export default function UserBadgesScreen() {
  const { profileSubUserId, goBack } = useApp();
  const { c } = useBiteTheme();
  const userId = profileSubUserId || 'michel';
  const user = getUser(userId);
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all');

  if (!user) return null;

  const earnedNames = new Set(user.badges.map(b => b.name));
  const progress = USER_PROGRESS[userId] || USER_PROGRESS.michel;

  // Filter badges by category
  const filteredBadges = activeCategory === 'all'
    ? ALL_BADGES
    : ALL_BADGES.filter(b => b.category === activeCategory);

  const earnedBadges = filteredBadges.filter(b => earnedNames.has(b.name)).map(b => ({
    ...b,
    date: user.badges.find(ub => ub.name === b.name)?.date || '',
    current: progress[b.name] ?? b.target,
  }));

  const lockedBadges = filteredBadges.filter(b => !earnedNames.has(b.name)).map(b => ({
    ...b,
    current: progress[b.name] ?? 0,
  }));

  const totalEarned = ALL_BADGES.filter(b => earnedNames.has(b.name)).length;
  const totalXp = totalEarned * 150;

  // Category stats
  const categoryStats = CATEGORIES.map(cat => {
    const catBadges = ALL_BADGES.filter(b => b.category === cat.name);
    const catEarned = catBadges.filter(b => earnedNames.has(b.name)).length;
    return { ...cat, total: catBadges.length, earned: catEarned };
  });

  const activeCatMeta = activeCategory !== 'all'
    ? CATEGORIES.find(cat => cat.name === activeCategory)
    : null;
  const activeCatColor = activeCatMeta ? getCategoryColor(activeCatMeta, c) : c.accent;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-3">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>{user.name}'s Badges</h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>{totalEarned} earned · {ALL_BADGES.length - totalEarned} to unlock</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: `${c.gold}18`, border: `1px solid ${c.gold}30` }}>
          <Award size={18} style={{ color: c.gold }} />
        </div>
      </div>

      {/* Summary card */}
      <div className="mx-5 mb-4 p-3.5 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: c.textDim }}>Badge XP</div>
            <div className="text-xl font-bold" style={{ color: c.gold }}>{totalXp} XP</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: c.textDim }}>Completion</div>
            <div className="text-xl font-bold" style={{ color: c.accent }}>
              {Math.round((totalEarned / ALL_BADGES.length) * 100)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: c.textDim }}>Next Badge</div>
            <div className="text-lg">
              {lockedBadges.length > 0
                ? [...lockedBadges].sort((a, b) => (b.current / b.target) - (a.current / a.target))[0].icon
                : '🎉'}
            </div>
          </div>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="mx-5 mb-4 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {/* All chip */}
          <button
            onClick={() => setActiveCategory('all')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all active:scale-[0.96] flex-shrink-0"
            style={{
              background: activeCategory === 'all' ? `${c.accent}18` : c.surface,
              border: `1.5px solid ${activeCategory === 'all' ? c.accent : c.border}`,
              color: activeCategory === 'all' ? c.accent : c.textMuted,
            }}>
            <span>🏅</span> All
            <span className="text-[9px] opacity-70">{totalEarned}/{ALL_BADGES.length}</span>
          </button>

          {/* Category chips */}
          {categoryStats.map(cat => {
            const catColor = getCategoryColor(cat, c);
            const isActive = activeCategory === cat.name;
            return (
              <button key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all active:scale-[0.96] flex-shrink-0"
                style={{
                  background: isActive ? `${catColor}18` : c.surface,
                  border: `1.5px solid ${isActive ? catColor : c.border}`,
                  color: isActive ? catColor : c.textMuted,
                }}>
                <span>{cat.icon}</span> {cat.name}
                <span className="text-[9px] opacity-70">{cat.earned}/{cat.total}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category description (when a specific category is selected) */}
      {activeCatMeta && (
        <div className="mx-5 mb-4 px-3.5 py-2.5 rounded-lg flex items-center gap-2.5"
          style={{ background: `${activeCatColor}08`, border: `1px solid ${activeCatColor}15` }}>
          <span className="text-lg">{activeCatMeta.icon}</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: activeCatColor }}>{activeCatMeta.name}</div>
            <div className="text-[10px]" style={{ color: c.textDim }}>{activeCatMeta.description}</div>
          </div>
        </div>
      )}

      {/* Earned badges */}
      {earnedBadges.length > 0 && (
        <>
          <div className="px-5 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: c.green }}>
              Earned ({earnedBadges.length})
            </span>
          </div>
          <div className="px-5 mb-5 space-y-2.5">
            {earnedBadges.map((badge, i) => (
              <div key={i} className="p-3.5 rounded-xl"
                style={{ background: c.surface, border: `1px solid ${c.gold}25` }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${c.gold}15` }}>
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold" style={{ color: c.text }}>{badge.name}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                        style={{ background: `${c.green}18`, color: c.green }}>Complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px]" style={{ color: c.textMuted }}>{badge.sub}</span>
                      {activeCategory === 'all' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{ background: c.surfaceAlt, color: c.textDim }}>
                          {badge.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] font-medium" style={{ color: c.gold }}>{badge.date}</div>
                    <div className="text-[10px] font-bold" style={{ color: c.green }}>
                      {badge.current}/{badge.target}
                    </div>
                  </div>
                </div>
                {/* Full progress bar */}
                <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: c.surfaceAlt }}>
                  <div className="h-full rounded-full" style={{
                    width: '100%',
                    background: `linear-gradient(90deg, ${c.green}, ${c.gold})`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* In Progress / Locked badges */}
      {lockedBadges.length > 0 && (
        <>
          <div className="px-5 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: c.accent }}>
              In Progress ({lockedBadges.length})
            </span>
          </div>
          <div className="px-5 pb-6 space-y-2.5">
            {[...lockedBadges]
              .sort((a, b) => (b.current / b.target) - (a.current / a.target))
              .map((badge, i) => {
                const pct = Math.min(Math.round((badge.current / badge.target) * 100), 100);
                const isClose = pct >= 70;
                return (
                  <div key={i} className="p-3.5 rounded-xl"
                    style={{
                      background: c.surface,
                      border: `1px solid ${isClose ? c.accent + '30' : c.border}`,
                    }}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          background: isClose ? `${c.accent}12` : c.surfaceAlt,
                          filter: pct < 20 ? 'grayscale(0.6)' : 'none',
                        }}>
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold" style={{ color: isClose ? c.text : c.textMuted }}>
                            {badge.name}
                          </span>
                          {isClose && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                              style={{ background: `${c.accent}18`, color: c.accent }}>Almost!</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px]" style={{ color: c.textDim }}>{badge.requirement}</span>
                          {activeCategory === 'all' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                              style={{ background: c.surfaceAlt, color: c.textDim }}>
                              {badge.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold" style={{ color: isClose ? c.accent : c.textMuted }}>
                          {pct}%
                        </div>
                        <div className="text-[10px]" style={{ color: c.textDim }}>
                          {badge.current}/{badge.target}
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: c.surfaceAlt }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: `${pct}%`,
                        background: isClose
                          ? `linear-gradient(90deg, ${c.accent}, ${c.gold})`
                          : c.textDim,
                      }} />
                    </div>
                    <div className="mt-1 text-[9px] text-right" style={{ color: c.textDim }}>
                      {badge.target - badge.current} {badge.unit} to go
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {/* Empty state when filtering */}
      {earnedBadges.length === 0 && lockedBadges.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="text-3xl mb-2">🏅</div>
          <div className="text-sm font-medium" style={{ color: c.textMuted }}>No badges in this category</div>
        </div>
      )}
    </div>
  );
}
