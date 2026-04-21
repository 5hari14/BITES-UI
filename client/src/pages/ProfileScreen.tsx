import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Settings, Bell, ChevronLeft, Edit3 } from 'lucide-react';
import { getUser, venues, reviews, findListForUser } from '@/lib/data';
import type { UserReview } from '@/contexts/AppContext';
import TasteMatch from '@/components/TasteMatch';

export default function ProfileScreen() {
  const { selectedUserId, profileTab, setProfileTab, navigate, goBack, previousScreen, toggleFollow, followedUsers, openProfileSub, userReviews, userVisitedPlaces } = useApp();
  const { c, isDark } = useBiteTheme();
  const userId = selectedUserId || 'michel';
  const user = getUser(userId);
  if (!user) return null;

  const isOwnProfile = userId === 'michel';
  const isFollowing = followedUsers.has(userId);
  const tabs = [
    { key: 'stats', label: 'Stats' },
    { key: 'wantgo', label: 'Want to Go' },
    { key: 'lists', label: 'Lists' },
  ] as const;

  const coverOverlay = isDark
    ? `linear-gradient(to bottom, transparent 30%, ${c.bg})`
    : `linear-gradient(to bottom, transparent 30%, ${c.bg})`;

  return (
    <div>
      {/* Cover + header */}
      <div className="relative" style={{ height: 160 }}>
        <div className="absolute inset-0" style={{ background: user.coverGrad }} />
        <div className="absolute inset-0" style={{ background: coverOverlay }} />
        <div className="absolute top-12 left-5 right-5 flex justify-between items-center z-10">
          {previousScreen && !isOwnProfile ? (
            <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={18} color="#F5F0EB" />
            </button>
          ) : <div />}
          {isOwnProfile && (
            <div className="flex gap-2">
              <button onClick={() => navigate('notifications')} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                <Bell size={16} color="#F5F0EB" />
              </button>
              <button onClick={() => navigate('settings')} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                <Settings size={16} color="#F5F0EB" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar + info */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="flex items-end gap-3 mb-3">
          <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: user.avatarGrad, border: `3px solid ${c.bg}`, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold" style={{ color: c.text }}>{user.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: `${c.accent}20`, color: c.accent }}>
                Lvl {user.level}
              </span>
            </div>
            <div className="text-xs" style={{ color: c.textDim }}>{user.handle}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-around py-3 mb-3 rounded-xl"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          {[
            { label: 'Places', value: isOwnProfile ? String(userVisitedPlaces.size) : user.places, screen: 'user-places' as const },
            { label: 'Followers', value: user.followers, screen: 'user-followers' as const },
            { label: 'Following', value: user.following, screen: 'user-following' as const },
            { label: 'Reviews', value: isOwnProfile ? String(parseInt(user.reviewCount) + userReviews.length) : user.reviewCount, screen: 'user-reviews' as const },
          ].map(s => (
            <button key={s.label}
              onClick={() => openProfileSub(s.screen, userId)}
              className="text-center cursor-pointer transition-all active:scale-95 hover:opacity-80 px-2 py-1 rounded-lg">
              <div className="font-display text-lg font-bold" style={{ color: c.text }}>{s.value}</div>
              <div className="text-[10px]" style={{ color: c.textDim }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        {isOwnProfile ? (
          <button className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mb-4"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.textMuted }}>
            <Edit3 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2 mb-4">
            <button onClick={() => toggleFollow(userId)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: isFollowing ? c.surface : c.accent,
                color: isFollowing ? c.textMuted : '#fff',
                border: isFollowing ? `1px solid ${c.border}` : 'none',
                boxShadow: isFollowing ? 'none' : `0 2px 8px ${c.accent}50`
              }}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.textMuted }}>
              Message
            </button>
          </div>
        )}
      </div>

      {/* Taste Match */}
      {!isOwnProfile && <TasteMatch userId={userId} />}

      <div className="px-5">
        {/* XP bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium" style={{ color: c.textMuted }}>Level {user.level}</span>
            <span className="text-xs" style={{ color: c.textDim }}>{user.xp} / {(user.level + 1) * 500} XP</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: c.surface }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${(user.xp / ((user.level + 1) * 500)) * 100}%`,
                background: `linear-gradient(90deg, ${c.accent}, ${c.gold})`
              }} />
          </div>
        </div>

        {/* Badges */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2" style={{ color: c.text }}>Badges</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {user.badges.map(b => (
              <div key={b.name} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                <span className="text-lg">{b.icon}</span>
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: c.text }}>{b.name}</div>
                  <div className="text-[10px]" style={{ color: c.textDim }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 mb-4">
        {tabs.map(tab => (
          <button key={tab.key}
            onClick={() => setProfileTab(tab.key)}
            className="flex-1 text-center py-2.5 text-xs font-medium transition-all"
            style={{
              color: profileTab === tab.key ? c.text : c.textDim,
              borderBottom: `2px solid ${profileTab === tab.key ? c.accent : 'transparent'}`,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {profileTab === 'wantgo' && <ProfileWantToGo />}
      {profileTab === 'lists' && <ProfileLists userId={userId} />}
      {profileTab === 'stats' && <ProfileStats userId={userId} />}
    </div>
  );
}

function ProfileReviews({ userId }: { userId: string }) {
  const { openVenueDetail } = useApp();
  const { c } = useBiteTheme();
  const userReviews = reviews.filter(r => r.userId === userId);

  if (userReviews.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <div className="text-4xl mb-3">📝</div>
        <div className="text-sm font-medium mb-1" style={{ color: c.textMuted }}>No reviews yet</div>
        <div className="text-xs" style={{ color: c.textDim }}>Reviews will appear here</div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {userReviews.map(r => {
        const venue = venues.find(v => v.id === r.venueId);
        if (!venue) return null;
        return (
          <div key={r.id} className="mx-5 mb-3 p-3.5 rounded-xl cursor-pointer transition-press"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}
            onClick={() => openVenueDetail(venue.id)}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: venue.gradient }}>{venue.emoji}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: c.text }}>{venue.name}</div>
                <div className="text-[11px]" style={{ color: c.textDim }}>{r.time}</div>
              </div>
              <div className="font-display text-xl font-extrabold" style={{ color: c.gold }}>{r.overall}</div>
            </div>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: c.textMuted }}>{r.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function ProfileWantToGo() {
  const { bookmarkedVenues, openVenueDetail } = useApp();
  const { c } = useBiteTheme();
  const saved = venues.filter(v => bookmarkedVenues.has(v.id));

  return (
    <div className="px-5 pb-4">
      {saved.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-4xl mb-3">🔖</div>
          <div className="text-sm font-medium mb-1" style={{ color: c.textMuted }}>No saved places</div>
          <div className="text-xs" style={{ color: c.textDim }}>Bookmark restaurants to save them here</div>
        </div>
      ) : (
        saved.map((v, i) => (
          <div key={v.id} className="flex items-center gap-3 py-3 cursor-pointer transition-press"
            style={{ borderBottom: i < saved.length - 1 ? `1px solid ${c.divider}` : 'none' }}
            onClick={() => openVenueDetail(v.id)}>
            <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: v.gradient }}>{v.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: c.text }}>{v.name}</div>
              <div className="text-xs" style={{ color: c.textMuted }}>{v.cuisine} · {v.price} · {v.city}</div>
            </div>
            <div className="font-display text-lg font-extrabold flex-shrink-0" style={{ color: c.gold }}>{v.score}</div>
          </div>
        ))
      )}
    </div>
  );
}

function ProfileLists({ userId }: { userId: string }) {
  const { c } = useBiteTheme();
  const { openListDetail } = useApp();
  const user = getUser(userId);
  const isOwnProfile = userId === 'michel';
  const [showForm, setShowForm] = useState(false);
  const [listName, setListName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [createdLists, setCreatedLists] = useState<{ emoji: string; name: string; count: string; priv?: boolean }[]>([]);

  if (!user) return null;

  const allLists = [...user.lists, ...createdLists];
  const emojiOptions = ['❤️', '🌟', '🍕', '☕', '🍎', '🌊', '🌅', '🍾', '🍵', '🍔', '🥩', '🍣', '🍰', '🌿', '🔥', '📸', '🏠', '🎵', '💎', '🎉'];

  const handleCreate = () => {
    if (!listName.trim()) return;
    setCreatedLists(prev => [...prev, {
      emoji: selectedEmoji || '📋',
      name: listName.trim(),
      count: '0 places',
      priv: isPrivate || undefined,
    }]);
    setListName('');
    setSelectedEmoji('');
    setIsPrivate(false);
    setShowForm(false);
  };

  return (
    <div className="px-5 pb-4">
      {/* Create List Button */}
      {isOwnProfile && !showForm && (
        <button onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: `${c.accent}12`, border: `1.5px dashed ${c.accent}50`, color: c.accent }}>
          <span className="text-lg">+</span> Create New List
        </button>
      )}

      {/* Create List Form */}
      {isOwnProfile && showForm && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.accent}30` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: c.text }}>New List</span>
            <button onClick={() => { setShowForm(false); setListName(''); setSelectedEmoji(''); setIsPrivate(false); }}
              className="text-xs px-2 py-1 rounded-lg" style={{ color: c.textDim, background: c.surfaceAlt }}>
              Cancel
            </button>
          </div>

          {/* Emoji picker */}
          <div className="mb-3">
            <label className="text-[11px] font-medium mb-1.5 block" style={{ color: c.textDim }}>Choose an icon</label>
            <div className="flex flex-wrap gap-1.5">
              {emojiOptions.map(e => (
                <button key={e} onClick={() => setSelectedEmoji(e)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                  style={{
                    background: selectedEmoji === e ? `${c.accent}20` : c.surfaceAlt,
                    border: `1.5px solid ${selectedEmoji === e ? c.accent : 'transparent'}`,
                    transform: selectedEmoji === e ? 'scale(1.15)' : 'scale(1)',
                  }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div className="mb-3">
            <label className="text-[11px] font-medium mb-1.5 block" style={{ color: c.textDim }}>List name</label>
            <input
              type="text"
              value={listName}
              onChange={e => setListName(e.target.value)}
              placeholder="e.g. Best Brunch Spots"
              maxLength={40}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: c.surfaceAlt,
                border: `1px solid ${listName ? c.accent + '40' : c.border}`,
                color: c.text,
              }}
            />
            <div className="text-[10px] text-right mt-0.5" style={{ color: c.textDim }}>{listName.length}/40</div>
          </div>

          {/* Privacy toggle */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <div className="text-xs font-medium" style={{ color: c.text }}>Private list</div>
              <div className="text-[10px]" style={{ color: c.textDim }}>Only visible to you</div>
            </div>
            <button onClick={() => setIsPrivate(!isPrivate)}
              className="w-10 h-5.5 rounded-full relative transition-all"
              style={{
                background: isPrivate ? c.accent : c.surfaceAlt,
                border: `1px solid ${isPrivate ? c.accent : c.border}`,
                padding: 2,
              }}>
              <div className="w-4 h-4 rounded-full transition-all absolute top-0.5"
                style={{
                  background: isPrivate ? '#fff' : c.textDim,
                  left: isPrivate ? 21 : 3,
                }} />
            </button>
          </div>

          {/* Create button */}
          <button onClick={handleCreate}
            disabled={!listName.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            style={{
              background: listName.trim() ? c.accent : c.surfaceAlt,
              color: listName.trim() ? '#fff' : c.textDim,
              opacity: listName.trim() ? 1 : 0.5,
            }}>
            Create List
          </button>
        </div>
      )}

      {/* Lists */}
      {allLists.map((list, i) => {
        const curatedList = findListForUser(userId, list.name);
        return (
          <div key={list.name + i}
            onClick={() => curatedList ? openListDetail(curatedList.id) : null}
            className="flex items-center gap-3 py-3 cursor-pointer transition-press active:scale-[0.98]"
            style={{ borderBottom: i < allLists.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
            <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              {list.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: c.text }}>
                {list.name}
                {list.priv && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: c.surfaceAlt, color: c.textDim }}>Private</span>}
              </div>
              <div className="text-[11px]" style={{ color: c.textDim }}>{list.count}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileStats({ userId }: { userId: string }) {
  const { c } = useBiteTheme();
  const { openProfileSub, userReviews, userVisitedPlaces } = useApp();
  const user = getUser(userId);
  if (!user) return null;
  const isOwn = userId === 'michel';

  const stats: { label: string; value: string | number; icon: string; screen?: 'user-places' | 'user-reviews' | 'user-badges' | 'user-lists' | 'user-streak' | 'user-photos' }[] = [
    { label: 'Total Places Visited', value: isOwn ? String(userVisitedPlaces.size) : user.places, icon: '📍', screen: 'user-places' },
    { label: 'Reviews Written', value: isOwn ? String(parseInt(user.reviewCount) + userReviews.length) : user.reviewCount, icon: '📝', screen: 'user-reviews' },
    { label: 'Photos Shared', value: '234', icon: '📸', screen: 'user-photos' },
    { label: 'Lists Created', value: String(user.lists.length), icon: '📋', screen: 'user-lists' },
    { label: 'Badges Earned', value: String(user.badges.length), icon: '🏆', screen: 'user-badges' },
    { label: 'Current Streak', value: '12 days', icon: '🔥', screen: 'user-streak' },
  ];

  const topCuisines = [
    { name: 'Italian', pct: 32, color: c.accent },
    { name: 'Japanese', pct: 18, color: c.blue },
    { name: 'Cypriot', pct: 15, color: c.green },
    { name: 'Cafe', pct: 12, color: c.gold },
    { name: 'Other', pct: 23, color: c.textDim },
  ];

  return (
    <div className="px-5 pb-4">
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {stats.map(s => {
          const isInteractive = !!s.screen;
          const Tag = isInteractive ? 'button' : 'div';
          return (
            <Tag key={s.label}
              className={`p-3 rounded-lg text-left transition-all ${isInteractive ? 'cursor-pointer active:scale-95 hover:opacity-80' : ''}`}
              style={{
                background: c.surface,
                border: `1px solid ${isInteractive ? c.accent + '40' : c.border}`,
              }}
              onClick={isInteractive ? () => openProfileSub(s.screen!, userId) : undefined}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{s.icon}</span>
                {isInteractive && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${c.accent}15`, color: c.accent }}>View all →</span>
                )}
              </div>
              <div className="font-display text-xl font-bold" style={{ color: c.text }}>{s.value}</div>
              <div className="text-[10px]" style={{ color: c.textDim }}>{s.label}</div>
            </Tag>
          );
        })}
      </div>

      <h3 className="text-sm font-semibold mb-3" style={{ color: c.text }}>Top Cuisines</h3>
      <div className="space-y-2.5">
        {topCuisines.map(tc => (
          <div key={tc.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs" style={{ color: c.textMuted }}>{tc.name}</span>
              <span className="text-xs font-semibold" style={{ color: tc.color }}>{tc.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: c.surface }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${tc.pct}%`, background: tc.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
