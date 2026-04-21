import { useState, useMemo } from 'react';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Search, X, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import { getAllDishes, getDishesForVenue, type CatalogDish } from '@/lib/data';

interface DishCatalogModalProps {
  venueId: string;
  selectedDishes: string[];
  onToggleDish: (name: string) => void;
  onClose: () => void;
}

export default function DishCatalogModal({ venueId, selectedDishes, onToggleDish, onClose }: DishCatalogModalProps) {
  const { c } = useBiteTheme();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { catalog } = getDishesForVenue(venueId);
  const allDishes = useMemo(() => getAllDishes(), []);

  const catalogByCategory = useMemo(() => {
    const map = new Map<string, CatalogDish[]>();
    for (const d of catalog) {
      const arr = map.get(d.category) || [];
      arr.push(d);
      map.set(d.category, arr);
    }
    return map;
  }, [catalog]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return allDishes.filter(d =>
      d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );
  }, [query, allDishes]);

  const categoryOrder = ['Starter', 'Main', 'Side', 'Dessert', 'Drink', 'Snack'];
  const sortedCategories = Array.from(catalogByCategory.keys()).sort(
    (a, b) => (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
              (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
  );

  const selectedCount = selectedDishes.length;

  /* 
   * The modal is rendered inside PhoneShell's scrollable container.
   * We use sticky positioning for the header and search bar so they
   * stay pinned at the top while the dish list scrolls naturally.
   */
  return (
    <div style={{ background: c.bg, minHeight: '100vh' }}>
      {/* Sticky header + search */}
      <div
        className="sticky top-0 z-20"
        style={{ background: c.bg, paddingTop: 0 }}
      >
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <X size={16} style={{ color: c.textMuted }} />
          </button>
          <div className="flex-1">
            <h3 className="text-base font-bold" style={{ color: c.text }}>Dish Catalog</h3>
            <p className="text-[11px]" style={{ color: c.textDim }}>
              {selectedCount > 0 ? `${selectedCount} dish${selectedCount > 1 ? 'es' : ''} selected` : 'Search & add dishes'}
            </p>
          </div>
          <button onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: c.accent, color: '#fff' }}>
            Done
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: c.surface, border: `1px solid ${query ? c.accent + '50' : c.border}` }}>
            <Search size={16} style={{ color: c.accent }} />
            <input type="text" placeholder="Search all dishes..."
              className="bg-transparent border-none outline-none text-sm w-full"
              style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }}
              value={query} onChange={e => setQuery(e.target.value)} />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={14} style={{ color: c.textDim }} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom fade edge */}
        <div style={{ height: 1, background: c.border }} />
      </div>

      {/* Scrollable content */}
      <div className="px-4 pt-3 pb-24">
        {searchResults ? (
          <div>
            <div className="text-[11px] font-medium mb-2" style={{ color: c.textDim }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-sm" style={{ color: c.textDim }}>No dishes found</div>
                <div className="text-xs mt-1" style={{ color: c.textMuted }}>Try a different search term</div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {searchResults.map(d => (
                  <DishRow key={d.name} dish={d} selected={selectedDishes.includes(d.name)}
                    onToggle={() => onToggleDish(d.name)} c={c} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Category accordions */}
            {sortedCategories.map(cat => {
              const dishes = catalogByCategory.get(cat) || [];
              const isOpen = activeCategory === cat;
              return (
                <div key={cat} className="rounded-xl overflow-hidden"
                  style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                  <button onClick={() => setActiveCategory(isOpen ? null : cat)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: c.text }}>{cat}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: c.surfaceAlt, color: c.textDim }}>
                        {dishes.length}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={16} style={{ color: c.textDim }} /> :
                      <ChevronDown size={16} style={{ color: c.textDim }} />}
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-2 space-y-1">
                      {dishes.map(d => (
                        <DishRow key={d.name} dish={d} selected={selectedDishes.includes(d.name)}
                          onToggle={() => onToggleDish(d.name)} c={c} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* All dishes */}
            <div className="pt-2">
              <div className="text-[11px] font-medium mb-2" style={{ color: c.textDim }}>
                All Dishes ({allDishes.length})
              </div>
              <div className="space-y-1.5">
                {allDishes.slice(0, 30).map(d => (
                  <DishRow key={d.name} dish={d} selected={selectedDishes.includes(d.name)}
                    onToggle={() => onToggleDish(d.name)} c={c} />
                ))}
              </div>
              {allDishes.length > 30 && (
                <div className="text-center py-3">
                  <span className="text-xs" style={{ color: c.textDim }}>
                    Use search to find more dishes...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom selected dishes bar */}
      {selectedCount > 0 && (
        <div className="sticky bottom-0 z-20 px-4 py-3"
          style={{ borderTop: `1px solid ${c.border}`, background: c.surface }}>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {selectedDishes.map(name => (
              <span key={name} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium flex-shrink-0"
                style={{ background: `${c.accent}20`, color: c.accent, border: `1px solid ${c.accent}40` }}>
                {name}
                <button onClick={() => onToggleDish(name)} className="ml-0.5">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DishRow({ dish, selected, onToggle, c }: {
  dish: CatalogDish; selected: boolean; onToggle: () => void; c: any;
}) {
  return (
    <button onClick={onToggle}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all"
      style={{
        background: selected ? `${c.accent}12` : 'transparent',
        border: `1px solid ${selected ? c.accent + '30' : 'transparent'}`,
      }}>
      <span className="text-base flex-shrink-0">{dish.emoji}</span>
      <div className="flex-1 text-left min-w-0">
        <div className="text-xs font-medium truncate" style={{ color: selected ? c.accent : c.text }}>
          {dish.name}
        </div>
        <div className="text-[10px]" style={{ color: c.textDim }}>{dish.category}</div>
      </div>
      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: selected ? c.accent : c.surfaceAlt,
          border: `1.5px solid ${selected ? c.accent : c.border}`,
        }}>
        {selected ? <Check size={12} color="#fff" /> : <Plus size={12} style={{ color: c.textDim }} />}
      </div>
    </button>
  );
}
