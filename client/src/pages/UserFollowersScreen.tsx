import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, Search, X } from 'lucide-react';
import { getUser, users } from '@/lib/data';

export default function UserFollowersScreen() {
  const { profileSubUserId, goBack, openUserProfile, toggleFollow, followedUsers } = useApp();
  const { c } = useBiteTheme();
  const [query, setQuery] = useState('');
  const userId = profileSubUserId || 'michel';
  const user = getUser(userId);
  if (!user) return null;

  const realFollowers = users.filter(u => u.id !== userId);
  const extraFollowers = getExtraFollowers();
  const allFollowers = [...realFollowers, ...extraFollowers];

  const filtered = query.trim()
    ? allFollowers.filter(f =>
        (f as any).name.toLowerCase().includes(query.toLowerCase()) ||
        (f as any).handle.toLowerCase().includes(query.toLowerCase())
      )
    : allFollowers;

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
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>Followers</h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>{user.followers} followers</p>
        </div>
      </div>

      <div className="px-5 mb-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.textDim }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search followers..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }} />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: c.textDim }} />
            </button>
          )}
        </div>
      </div>

      {query.trim() && (
        <div className="px-5 mb-2">
          <span className="text-[11px]" style={{ color: c.textDim }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
          </span>
        </div>
      )}

      <div className="px-5 pb-6 space-y-1">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm font-medium" style={{ color: c.textMuted }}>No followers found</div>
            <div className="text-xs mt-1" style={{ color: c.textDim }}>Try a different search term</div>
          </div>
        ) : (
          filtered.map((f, i) => {
            const isReal = 'id' in f && typeof f.id === 'string' && users.some(u => u.id === f.id);
            const fId = isReal ? (f as typeof users[0]).id : null;
            const isFollowing = fId ? followedUsers.has(fId) : (f as any).following;

            return (
              <div key={i} className="flex items-center gap-3 py-3 transition-all"
                style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
                <div onClick={() => fId && openUserProfile(fId)}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0 cursor-pointer"
                  style={{ background: (f as any).avatarGrad }}>
                  {(f as any).avatar}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => fId && openUserProfile(fId)}>
                  <div className="text-sm font-semibold" style={{ color: c.text }}>{(f as any).name}</div>
                  <div className="text-[11px]" style={{ color: c.textDim }}>{(f as any).handle} · Level {(f as any).level}</div>
                </div>
                <button onClick={() => fId && toggleFollow(fId)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0"
                  style={{
                    background: isFollowing ? c.surface : c.accent,
                    color: isFollowing ? c.textMuted : '#fff',
                    border: isFollowing ? `1px solid ${c.border}` : `1px solid ${c.accent}`,
                    boxShadow: isFollowing ? 'none' : `0 2px 8px ${c.accent}30`,
                  }}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getExtraFollowers() {
  return [
    { name: 'Maria L.', handle: '@maria_foodie', avatar: 'M', avatarGrad: 'linear-gradient(135deg, #A78BFA, #7C3AED)', level: 12, following: false },
    { name: 'Nikos T.', handle: '@nikos_eats', avatar: 'N', avatarGrad: 'linear-gradient(135deg, #34D399, #059669)', level: 7, following: false },
    { name: 'Christina K.', handle: '@christina_cy', avatar: 'C', avatarGrad: 'linear-gradient(135deg, #F472B6, #DB2777)', level: 15, following: true },
    { name: 'George P.', handle: '@george_gourmet', avatar: 'G', avatarGrad: 'linear-gradient(135deg, #FBBF24, #D97706)', level: 5, following: false },
    { name: 'Anna S.', handle: '@anna_sips', avatar: 'A', avatarGrad: 'linear-gradient(135deg, #F87171, #DC2626)', level: 10, following: false },
    { name: 'Dimitris V.', handle: '@dim_bites', avatar: 'D', avatarGrad: 'linear-gradient(135deg, #38BDF8, #0284C7)', level: 6, following: true },
    { name: 'Katerina M.', handle: '@kat_flavors', avatar: 'K', avatarGrad: 'linear-gradient(135deg, #FB923C, #EA580C)', level: 11, following: false },
  ];
}
