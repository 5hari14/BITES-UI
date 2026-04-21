import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export interface FilterState {
  distance: string | null;
  price: string[];
  venueType: string[];
  cuisineType: string[];
  occasion: string[];
  dietary: string[];
  sortBy: string | null;
}

export const defaultFilters: FilterState = {
  distance: null,
  price: [],
  venueType: [],
  cuisineType: [],
  occasion: [],
  dietary: [],
  sortBy: null,
};

export function countActiveFilters(f: FilterState): number {
  let count = 0;
  if (f.distance) count++;
  count += f.price.length;
  count += f.venueType.length;
  count += f.cuisineType.length;
  count += f.occasion.length;
  count += f.dietary.length;
  return count;
}

const DISTANCE_OPTIONS = [
  { label: 'Near Me', value: 'near', icon: '📍' },
  { label: '< 1 km', value: '1km', icon: '🚶' },
  { label: '< 3 km', value: '3km', icon: '🚲' },
  { label: '< 5 km', value: '5km', icon: '🚗' },
];

const PRICE_OPTIONS = [
  { label: '€', value: '€' },
  { label: '€€', value: '€€' },
  { label: '€€€', value: '€€€' },
  { label: '€€€€', value: '€€€€' },
];

const TYPE_OPTIONS = [
  { label: 'Dinner', value: 'dinner', icon: '🍽️' },
  { label: 'Lunch', value: 'lunch', icon: '🥗' },
  { label: 'Bakery', value: 'bakery', icon: '🥐' },
  { label: 'Coffee', value: 'coffee', icon: '☕' },
  { label: 'Bars', value: 'bars', icon: '🍸' },
  { label: 'Brunch', value: 'brunch', icon: '🥞' },
  { label: 'Breakfast', value: 'breakfast', icon: '🍳' },
  { label: 'Grab & Go', value: 'grab and go', icon: '🥡' },
];

const CUISINE_OPTIONS = [
  'Italian', 'Cypriot', 'Greek', 'Asian', 'Chinese', 'Indian', 'Japanese',
  'Mediterranean', 'Grill', 'Brunch', 'Arabic', 'Seafood', 'Thai', 'Meze',
  'Burgers', 'American', 'Pub',
];

const OCCASION_OPTIONS = [
  { label: 'Date Night', value: 'date night', icon: '💕' },
  { label: 'Romantic', value: 'romantic', icon: '🌹' },
  { label: 'Intimate', value: 'intimate', icon: '🕯️' },
  { label: 'Trendy', value: 'trendy', icon: '✨' },
  { label: 'Casual', value: 'casual', icon: '😎' },
  { label: 'Upscale', value: 'upscale', icon: '🥂' },
  { label: 'Business', value: 'business meetings', icon: '💼' },
  { label: 'Seaside', value: 'seaside', icon: '🌊' },
  { label: 'Traditional', value: 'traditional', icon: '🏛️' },
  { label: 'Hangout', value: 'hangout', icon: '👯' },
];

const DIETARY_OPTIONS = [
  { label: 'Vegan', value: 'vegan', icon: '🌱' },
  { label: 'Vegetarian', value: 'vegetarian', icon: '🥬' },
  { label: 'Pescatarian', value: 'pescatarian', icon: '🐟' },
];

export const SORT_OPTIONS = [
  { label: 'Most Reviews', value: 'most_reviews', icon: '📝' },
  { label: 'Least Reviews', value: 'least_reviews', icon: '📄' },
  { label: 'Highest Rated', value: 'highest_rated', icon: '⭐' },
  { label: 'Lowest Rated', value: 'lowest_rated', icon: '📉' },
];

interface FilterSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, icon, children, defaultOpen = false }: FilterSectionProps) {
  const { c } = useBiteTheme();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-[13px] font-semibold" style={{ color: c.text }}>{title}</span>
        </div>
        {open ? (
          <ChevronUp size={16} style={{ color: c.textDim }} />
        ) : (
          <ChevronDown size={16} style={{ color: c.textDim }} />
        )}
      </button>
      <div
        style={{
          maxHeight: open ? 500 : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.2s ease',
        }}
      >
        <div className="pb-3 px-1">{children}</div>
      </div>
      <div style={{ height: 1, background: c.divider }} />
    </div>
  );
}

interface ChipProps {
  label: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, icon, active, onClick }: ChipProps) {
  const { c } = useBiteTheme();
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        background: active ? `${c.accent}20` : c.surfaceAlt,
        border: `1px solid ${active ? c.accent : c.border}`,
        color: active ? c.accent : c.textMuted,
      }}
    >
      {icon && <span className="text-[11px]">{icon}</span>}
      {label}
    </button>
  );
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function FilterPanel({ isOpen, onClose, filters, onFiltersChange, resultCount }: FilterPanelProps) {
  const { c, isDark } = useBiteTheme();
  const [local, setLocal] = useState<FilterState>(filters);
  const [phoneFrame, setPhoneFrame] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setLocal(filters);
  }, [filters, isOpen]);

  useEffect(() => {
    const el = document.querySelector('[data-phone-frame]') as HTMLElement
      || document.getElementById('phone-frame') as HTMLElement;
    if (el) setPhoneFrame(el);
  }, [isOpen]);

  const toggleArray = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const update = (patch: Partial<FilterState>) => {
    setLocal(prev => ({ ...prev, ...patch }));
  };

  const resetAll = () => setLocal(defaultFilters);

  const handleApply = () => {
    onFiltersChange(local);
    onClose();
  };

  const handleReset = () => {
    const cleared = { ...defaultFilters };
    setLocal(cleared);
    onFiltersChange(cleared);
    onClose();
  };

  const activeCount = countActiveFilters(local);

  if (!isOpen || !phoneFrame) return null;

  const panel = (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        zIndex: 9999,
        background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        // Close when clicking the backdrop area
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top spacer — click to close */}
      <div className="flex-shrink-0 h-[8%]" onClick={onClose} />

      {/* Main panel container — NOT overflow hidden, uses flex layout */}
      <div
        className="flex-1 flex flex-col rounded-t-2xl"
        style={{
          background: c.bg,
          boxShadow: '0 -4px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold" style={{ color: c.text }}>Filters</h3>
            {activeCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: c.accent, color: '#fff' }}
              >
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: c.accent }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: c.surfaceAlt }}
            >
              <X size={16} style={{ color: c.textMuted }} />
            </button>
          </div>
        </div>

        {/* Scrollable filter sections — flex-1 to fill remaining space above bottom bar */}
        <div className="flex-1 overflow-y-auto px-5">
          {/* Distance */}
          <FilterSection title="Distance" icon="📍" defaultOpen>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map(opt => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  active={local.distance === opt.value}
                  onClick={() => update({ distance: local.distance === opt.value ? null : opt.value })}
                />
              ))}
            </div>
          </FilterSection>

          {/* Price */}
          <FilterSection title="Price Range" icon="💰" defaultOpen>
            <div className="flex gap-2">
              {PRICE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={(e) => { e.stopPropagation(); update({ price: toggleArray(local.price, opt.value) }); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: local.price.includes(opt.value) ? c.accent : c.surfaceAlt,
                    color: local.price.includes(opt.value) ? '#fff' : c.textMuted,
                    border: `1px solid ${local.price.includes(opt.value) ? c.accent : c.border}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Type */}
          <FilterSection title="Type" icon="🍽️" defaultOpen>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map(opt => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  active={local.venueType.includes(opt.value)}
                  onClick={() => update({ venueType: toggleArray(local.venueType, opt.value) })}
                />
              ))}
            </div>
          </FilterSection>

          {/* Cuisine */}
          <FilterSection title="Cuisine" icon="🌍">
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map(opt => (
                <Chip
                  key={opt}
                  label={opt}
                  active={local.cuisineType.includes(opt)}
                  onClick={() => update({ cuisineType: toggleArray(local.cuisineType, opt) })}
                />
              ))}
            </div>
          </FilterSection>

          {/* Occasion */}
          <FilterSection title="Occasion" icon="🎉">
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map(opt => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  active={local.occasion.includes(opt.value)}
                  onClick={() => update({ occasion: toggleArray(local.occasion, opt.value) })}
                />
              ))}
            </div>
          </FilterSection>

          {/* Dietary */}
          <FilterSection title="Dietary" icon="🥬">
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(opt => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  active={local.dietary.includes(opt.value)}
                  onClick={() => update({ dietary: toggleArray(local.dietary, opt.value) })}
                />
              ))}
            </div>
          </FilterSection>

          {/* Bottom spacer so last section isn't hidden behind bottom bar */}
          <div className="h-4" />
        </div>

        {/* Fixed bottom action bar — flex-shrink-0 keeps it always visible */}
        <div
          className="flex-shrink-0 px-5 py-4 flex gap-3"
          style={{
            borderTop: `1px solid ${c.divider}`,
            background: c.bg,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); handleReset(); }}
            className="flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{
              background: c.surfaceAlt,
              color: c.textMuted,
              border: `1px solid ${c.border}`,
            }}
          >
            Reset All
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleApply(); }}
            className="flex-[2] py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: c.accent,
              color: '#fff',
            }}
          >
            Show Results{resultCount > 0 ? ` (${resultCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(panel, phoneFrame);
}
