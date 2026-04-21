import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft } from 'lucide-react';

const notifications = [
  { type: 'follow', avatar: 'S', grad: 'linear-gradient(135deg, #FF6B35, #C74B1A)', text: 'Sofia K. started following you', time: '2 min ago', unread: true },
  { type: 'like', avatar: 'E', grad: 'linear-gradient(135deg, #F472B6, #EC4899)', text: 'Elena P. found your review of Bottega Amaro helpful', time: '1 hour ago', unread: true },
  { type: 'badge', avatar: '🏆', grad: 'linear-gradient(135deg, #F5C542, #D4A72C)', text: 'You earned the "Coffee Expert" badge!', time: '3 hours ago', unread: true },
  { type: 'comment', avatar: 'A', grad: 'linear-gradient(135deg, #60A5FA, #3B82F6)', text: 'Andreas M. commented on your review of Istorja Cafe', time: 'Yesterday', unread: false },
  { type: 'trending', avatar: '🔥', grad: 'linear-gradient(135deg, #FF6B35, #F5C542)', text: 'Bottega Amaro is trending in Limassol!', time: '2 days ago', unread: false },
  { type: 'list', avatar: '📋', grad: 'linear-gradient(135deg, #4ADE80, #22C55E)', text: 'Your list "Best Coffee" was saved 50 times', time: '3 days ago', unread: false },
  { type: 'follow', avatar: 'K', grad: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', text: 'Kostas D. started following you', time: '4 days ago', unread: false },
];

export default function NotificationsScreen() {
  const { goBack } = useApp();
  const { c } = useBiteTheme();

  return (
    <div>
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <h2 className="font-display text-xl font-bold" style={{ color: c.text }}>Notifications</h2>
        <span className="ml-auto text-xs font-medium cursor-pointer" style={{ color: c.accent }}>
          Mark all read
        </span>
      </div>

      <div className="px-5">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-3 py-3.5 transition-all"
            style={{
              borderBottom: i < notifications.length - 1 ? `1px solid ${c.divider}` : 'none',
              opacity: n.unread ? 1 : 0.6
            }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: n.grad }}>
              {n.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] leading-relaxed" style={{ color: c.text }}>{n.text}</p>
              <span className="text-[11px]" style={{ color: c.textDim }}>{n.time}</span>
            </div>
            {n.unread && (
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: c.accent }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
