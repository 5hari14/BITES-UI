import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, Search, X } from 'lucide-react';
import { getUser, users } from '@/lib/data';

export default function UserFollowingScreen() {
  const { profileSubUserId, goBack, openUserProfile, toggleFollow, followedUsers } = useApp();
  const { c } = useBiteTheme();
  const [query, setQuery] = useState('');
  const userId = profileSubUserId || 'michel';
  const user = getUser(userId);
  if (!user) return null;

  const realFollowing = users.filter(u => u.id !== userId);
  const extraFollowing = getExtraFollowing();
  const allFollowing = [...realFollowing, ...extraFollowing];

  const filtered = query.trim()
    ? allFollowing.filter(f =>
        (f as any).name.toLowerCase().includes(query.toLowerCase()) ||
        (f as any).handle.toLowerCase().includes(query.toLowerCase())
      )
    : allFollowing;

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
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>Following</h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>{user.following} following</p>
        </div>
      </div>

      <div className="px-5 mb-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.textDim }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search following..."
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
            <div className="text-sm font-medium" style={{ color: c.textMuted }}>No one found</div>
            <div className="text-xs mt-1" style={{ color: c.textDim }}>Try a different search term</div>
          </div>
        ) : (
          filtered.map((f, i) => {
            const isReal = 'id' in f && typeof f.id === 'string' && users.some(u => u.id === f.id);
            const fId = isReal ? (f as typeof users[0]).id : null;
            const isFollowingUser = fId ? followedUsers.has(fId) : true;

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
                  {(f as any).tags && (
                    <div className="flex gap-1 mt-1">
                      {(f as any).tags.slice(0, 2).map((t: string) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{ background: `${c.accent}12`, color: c.accent }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => fId && toggleFollow(fId)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0"
                  style={{
                    background: isFollowingUser ? c.surface : c.accent,
                    color: isFollowingUser ? c.textMuted : '#fff',
                    border: isFollowingUser ? `1px solid ${c.border}` : `1px solid ${c.accent}`,
                    boxShadow: isFollowingUser ? 'none' : `0 2px 8px ${c.accent}30`,
                  }}>
                  {isFollowingUser ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getExtraFollowing() {
  return [
    { name: 'Yiannis K.', handle: '@yiannis_cy', avatar: 'Y', avatarGrad: 'linear-gradient(135deg, #818CF8, #6366F1)', level: 16, tags: ['🍷 Wine', '🧀 Cheese'] },
    { name: 'Stella M.', handle: '@stella_eats', avatar: 'S', avatarGrad: 'linear-gradient(135deg, #FB7185, #E11D48)', level: 13, tags: ['🍰 Desserts', '☕ Coffee'] },
    { name: 'Pavlos D.', handle: '@pavlos_grill', avatar: 'P', avatarGrad: 'linear-gradient(135deg, #4ADE80, #16A34A)', level: 8, tags: ['🥩 BBQ', '🔥 Grilling'] },
    { name: 'Irene T.', handle: '@irene_tastes', avatar: 'I', avatarGrad: 'linear-gradient(135deg, #FACC15, #CA8A04)', level: 11, tags: ['🌱 Vegan', '🥗 Healthy'] },
    { name: 'Marcos A.', handle: '@marcos_adventures', avatar: 'M', avatarGrad: 'linear-gradient(135deg, #22D3EE, #0891B2)', level: 6, tags: ['🍕 Pizza', '🍝 Pasta'] },
    { name: 'Daphne R.', handle: '@daphne_dines', avatar: 'D', avatarGrad: 'linear-gradient(135deg, #C084FC, #9333EA)', level: 14, tags: ['🌅 Sunset', '🌊 Seafood'] },
  ];
}
