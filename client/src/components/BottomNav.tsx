import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Home, Search, Plus, Users, User } from 'lucide-react';

export default function BottomNav() {
  const { screen, navigate, openUserProfile } = useApp();
  const { c } = useBiteTheme();

  const items = [
    { key: 'home', icon: Home, label: 'Home' },
    { key: 'search', icon: Search, label: 'Search' },
    { key: 'log', icon: Plus, label: 'Log', isCenter: true },
    { key: 'social', icon: Users, label: 'Social' },
    { key: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex items-start justify-around px-4 pt-3"
      style={{ height: 84, background: `linear-gradient(to top, ${c.navGradient} 70%, transparent)` }}>
      {items.map(item => {
        const isActive = screen === item.key || (item.key === 'profile' && screen === 'profile');
        const Icon = item.icon;

        if (item.isCenter) {
          return (
            <button key={item.key} onClick={() => navigate('log')}
              className="flex flex-col items-center gap-1 transition-all">
              <div className="flex items-center justify-center rounded-full -mt-2.5 transition-all hover:scale-110"
                style={{
                  width: 40, height: 40, background: c.accent,
                  boxShadow: 'none'
                }}>
                <Icon size={20} color="#fff" strokeWidth={2} />
              </div>
              <span className="text-[10px] font-medium mt-0.5"
                style={{ color: screen === 'log' ? c.accent : c.textDim }}>
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button key={item.key}
            onClick={() => {
              if (item.key === 'profile') openUserProfile('michel');
              else navigate(item.key as any);
            }}
            className="flex flex-col items-center gap-1 transition-all">
            <Icon size={22} strokeWidth={1.8}
              style={{ color: isActive ? c.accent : c.textDim }} />
            <span className="text-[10px] font-medium"
              style={{ color: isActive ? c.accent : c.textDim }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
