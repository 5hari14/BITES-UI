import { useBiteTheme } from '@/contexts/BiteThemeContext';

export default function StatusBar() {
  const { c } = useBiteTheme();
  return (
    <div className="flex items-end justify-between px-7 font-semibold text-sm"
      style={{ height: 54, paddingBottom: 8, color: c.text }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px]">●●●●○</span>
        <span className="text-[11px]">🔋</span>
      </div>
    </div>
  );
}
