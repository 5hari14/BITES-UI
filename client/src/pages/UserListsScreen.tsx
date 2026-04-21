import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, ChevronRight, Lock, List } from 'lucide-react';
import { getUser, findListForUser } from '@/lib/data';

export default function UserListsScreen() {
  const { profileSubUserId, goBack, openListDetail } = useApp();
  const { c } = useBiteTheme();
  const user = getUser(profileSubUserId || 'michel');
  if (!user) return null;

  const isOwnProfile = (profileSubUserId || 'michel') === 'michel';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>{user.name}'s Lists</h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>
            {user.lists.length} lists · {user.lists.filter(l => l.priv).length} private
          </p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: `${c.accent}18`, border: `1px solid ${c.accent}30` }}>
          <List size={18} style={{ color: c.accent }} />
        </div>
      </div>

      {/* Create new list button (own profile only) */}
      {isOwnProfile && (
        <div className="px-5 mb-4">
          <button
            onClick={() => {}}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: `${c.accent}12`,
              border: `1.5px dashed ${c.accent}50`,
              color: c.accent,
            }}>
            <span className="text-lg">+</span> Create New List
          </button>
        </div>
      )}

      {/* Lists */}
      <div className="px-5 pb-6 space-y-2.5">
        {user.lists.map((list, i) => {
          const isPrivate = list.priv;
          // Show private lists only on own profile
          if (isPrivate && !isOwnProfile) return null;

          const curatedList = findListForUser(profileSubUserId || 'michel', list.name);

          return (
            <button key={i}
              onClick={() => curatedList ? openListDetail(curatedList.id) : null}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl text-left transition-all active:scale-[0.98]"
              style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: c.surfaceAlt }}>
                {list.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: c.text }}>{list.name}</span>
                  {isPrivate && (
                    <Lock size={12} style={{ color: c.textDim }} />
                  )}
                </div>
                <div className="text-[11px]" style={{ color: c.textMuted }}>{list.count}</div>
              </div>
              <ChevronRight size={16} style={{ color: c.textDim }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
