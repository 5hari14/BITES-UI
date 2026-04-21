import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft, Flame, ChevronRight as ChevRight } from 'lucide-react';
import { getUser } from '@/lib/data';
import { useState, useMemo } from 'react';

// Generate deterministic mock activity data for a user
function generateActivityData(userId: string) {
  let seed = 0;
  for (let i = 0; i < userId.length; i++) seed = ((seed << 5) - seed + userId.charCodeAt(i)) | 0;
  const rng = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed & 0x7fffffff) / 2147483647; };

  const activity: Record<string, number> = {};
  const today = new Date(2026, 2, 6);

  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const r = rng();
    if (userId === 'michel' && i < 12) {
      activity[key] = Math.ceil(rng() * 3) + 1;
    } else if (r > 0.35) {
      activity[key] = Math.ceil(rng() * 4);
    }
  }
  return activity;
}

export default function UserStreakScreen() {
  const { profileSubUserId, goBack } = useApp();
  const { c } = useBiteTheme();
  const user = getUser(profileSubUserId || 'michel');
  if (!user) return null;

  const activity = useMemo(() => generateActivityData(user.id), [user.id]);

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date(2026, 2, 6);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (activity[key]) currentStreak++;
    else break;
  }

  // Month navigation
  const [monthOffset, setMonthOffset] = useState(0);
  const baseDate = new Date(2026, 2, 1);
  const viewDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - monthOffset, 1);
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  function getIntensity(count: number): string {
    if (count === 0) return c.surfaceAlt;
    if (count === 1) return `${c.accent}40`;
    if (count === 2) return `${c.accent}70`;
    if (count === 3) return `${c.accent}A0`;
    return c.accent;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>Day Streaks</h2>
          <p className="text-[11px]" style={{ color: c.textDim }}>{user.name}'s logging calendar</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: `${c.accent}18`, border: `1px solid ${c.accent}30` }}>
          <Flame size={14} style={{ color: c.accent }} />
          <span className="text-sm font-bold" style={{ color: c.accent }}>{currentStreak}</span>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between px-5 mb-3">
        <button onClick={() => setMonthOffset(prev => Math.min(prev + 1, 2))}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={14} style={{ color: c.textMuted }} />
        </button>
        <span className="text-sm font-semibold" style={{ color: c.text }}>{monthName}</span>
        <button onClick={() => setMonthOffset(prev => Math.max(prev - 1, 0))}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: c.surface,
            border: `1px solid ${c.border}`,
            opacity: monthOffset === 0 ? 0.3 : 1,
          }}
          disabled={monthOffset === 0}>
          <ChevRight size={14} style={{ color: c.textMuted }} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="mx-5 p-3 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayLabels.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium py-1" style={{ color: c.textDim }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = activity[key] || 0;
            const isToday = year === 2026 && month === 2 && day === 6;

            return (
              <div key={day}
                className="aspect-square rounded-md flex items-center justify-center text-[10px] font-medium"
                style={{
                  background: getIntensity(count),
                  color: count > 0 ? '#fff' : c.textDim,
                  boxShadow: isToday ? `0 0 0 1.5px ${c.accent}` : 'none',
                }}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
