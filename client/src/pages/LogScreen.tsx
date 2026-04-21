import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Search, ChevronRight, Camera, Star, X, Check, Plus } from 'lucide-react';
import { venues, getDishesForVenue } from '@/lib/data';
import { toast } from 'sonner';
import DishCatalogModal from '@/components/DishCatalogModal';

export default function LogScreen() {
  const { logStep, logSelectedVenueId } = useApp();
  if (logStep === 2 && logSelectedVenueId) return <LogStep2 />;
  return <LogStep1 />;
}

function LogStep1() {
  const { setLogStep, setLogSelectedVenue } = useApp();
  const { c } = useBiteTheme();
  const [query, setQuery] = useState('');
  const filtered = query
    ? venues.filter(v => v.name.toLowerCase().includes(query.toLowerCase()) || v.cuisine.toLowerCase().includes(query.toLowerCase()))
    : venues.slice(0, 8);

  const recentVisits = [
    { emoji: '🍝', name: 'Bottega Amaro', time: '2 days ago', id: 'bottega-amaro' },
    { emoji: '☕', name: 'Istorja Cafe', time: 'Last week', id: 'istorja-cafe' },
    { emoji: '🍣', name: 'Koi Sushi Bar', time: '2 weeks ago', id: 'koi-sushi' },
  ];

  const selectVenue = (id: string) => { setLogSelectedVenue(id); setLogStep(2); };

  return (
    <div>
      <div className="px-5 pt-2 pb-4">
        <h2 className="font-display text-[22px] font-bold mb-1" style={{ color: c.text }}>Log a Bite</h2>
        <p className="text-sm mb-4" style={{ color: c.textMuted }}>Where did you eat?</p>
        <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl"
          style={{ background: c.surface, border: `1px solid ${c.accent}50` }}>
          <Search size={18} style={{ color: c.accent }} />
          <input type="text" placeholder="Search restaurant name..."
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }}
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      {!query && (
        <>
          <div className="flex justify-between items-center px-5 pb-3">
            <h3 className="text-sm font-semibold" style={{ color: c.text }}>Recent Visits</h3>
          </div>
          <div className="px-5 pb-4">
            {recentVisits.map((v, i) => (
              <div key={v.id} className="flex items-center gap-3 py-3 cursor-pointer transition-press"
                style={{ borderBottom: i < recentVisits.length - 1 ? `1px solid ${c.divider}` : 'none' }}
                onClick={() => selectVenue(v.id)}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                  {v.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: c.text }}>{v.name}</div>
                  <div className="text-[11px]" style={{ color: c.textDim }}>{v.time}</div>
                </div>
                <ChevronRight size={16} style={{ color: c.textDim }} />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-between items-center px-5 pb-3">
        <h3 className="text-sm font-semibold" style={{ color: c.text }}>
          {query ? `Results for "${query}"` : 'All Restaurants'}
        </h3>
      </div>
      <div className="px-5 pb-4">
        {filtered.map((v, i) => (
          <div key={v.id} className="flex items-center gap-3 py-3 cursor-pointer transition-press"
            style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${c.divider}` : 'none' }}
            onClick={() => selectVenue(v.id)}>
            <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: v.gradient }}>{v.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: c.text }}>{v.name}</div>
              <div className="text-xs" style={{ color: c.textMuted }}>{v.cuisine} · {v.price} · {v.city}</div>
            </div>
            <ChevronRight size={16} style={{ color: c.textDim }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StarRow({ count, value, onChange, size, color, hoverColor }: {
  count: number; value: number; onChange: (n: number) => void;
  size: number; color: string; hoverColor?: string;
}) {
  const { c } = useBiteTheme();
  const [hover, setHover] = useState(0);
  const activeColor = hoverColor || color;

  const handleClick = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    onChange(clickX < rect.width / 2 ? starIndex - 0.5 : starIndex);
  };

  const handleHover = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    setHover(hoverX < rect.width / 2 ? starIndex - 0.5 : starIndex);
  };

  const displayValue = hover || value;

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: count }, (_, i) => i + 1).map(n => {
        const full = displayValue >= n;
        const half = !full && displayValue >= n - 0.5;
        const active = full || half;
        return (
          <button key={n}
            onClick={(e) => handleClick(n, e)}
            onMouseMove={(e) => handleHover(n, e)}
            className="p-0.5 transition-transform relative"
            style={{ transform: active ? 'scale(1.1)' : 'scale(1)' }}>
            <Star size={size} fill="transparent" stroke={c.textDim} strokeWidth={1.5}
              style={{ transition: 'all 0.15s ease' }} />
            {active && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ clipPath: half ? 'inset(0 50% 0 0)' : 'none' }}>
                <div className="p-0.5">
                  <Star size={size} fill={activeColor} stroke={activeColor} strokeWidth={1.5}
                    style={{ filter: `drop-shadow(0 1px 4px ${activeColor}40)`, transition: 'all 0.15s ease' }} />
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LogStep2() {
  const { logSelectedVenueId, setLogStep, setLogSelectedVenue, navigate, submitReview } = useApp();
  const { c } = useBiteTheme();
  const venue = venues.find(v => v.id === logSelectedVenueId);
  const [ratings, setRatings] = useState({ food: 0, service: 0, vibe: 0, value: 0 });
  const [overallRating, setOverallRating] = useState(0);
  const [text, setText] = useState('');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);

  const { suggested, catalog } = useMemo(() => {
    if (!logSelectedVenueId) return { suggested: [], catalog: [] };
    return getDishesForVenue(logSelectedVenueId);
  }, [logSelectedVenueId]);

  if (!venue) return null;

  const ratingCategories = [
    { key: 'food', label: 'Food', emoji: '🍽️', color: c.accent },
    { key: 'service', label: 'Service', emoji: '👤', color: c.blue },
    { key: 'vibe', label: 'Vibe', emoji: '✨', color: c.pink },
    { key: 'value', label: 'Value', emoji: '💰', color: c.green },
  ];

  const mealTimes = ['☀️ Breakfast', '🌤️ Brunch', '☀️ Lunch', '🌙 Dinner', '🌃 Late Night'];
  const companions = ['👤 Solo', '👫 Date Night', '👨‍👩‍👧 Family', '👥 Friends', '💼 Business'];

  const toggleDetail = (d: string) => setDetails(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleDish = (d: string) => setSelectedDishes(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const handleSubmit = () => {
    // Persist the review in app state
    submitReview({
      venueId: venue.id,
      overall: overallRating || ((ratings.food + ratings.service + ratings.vibe + ratings.value) / 4) * 2,
      food: ratings.food,
      service: ratings.service,
      vibe: ratings.vibe,
      value: ratings.value,
      text,
      dishes: selectedDishes,
      details,
    });
    toast.success('Review submitted!', { description: `Your review for ${venue.name} has been saved.` });
    setLogStep(1);
    setLogSelectedVenue(null);
    navigate('home');
  };

  // Show the dish catalog modal
  if (showCatalog) {
    return (
      <DishCatalogModal
        venueId={logSelectedVenueId!}
        selectedDishes={selectedDishes}
        onToggleDish={toggleDish}
        onClose={() => setShowCatalog(false)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <button onClick={() => { setLogStep(1); setLogSelectedVenue(null); }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <X size={16} style={{ color: c.textMuted }} />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>Rate Your Experience</h2>
          <div className="text-xs" style={{ color: c.textMuted }}>{venue.name}</div>
        </div>
      </div>

      <div className="mx-5 mb-5 flex items-center gap-3 p-3 rounded-xl"
        style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: venue.gradient }}>{venue.emoji}</div>
        <div>
          <div className="text-sm font-semibold" style={{ color: c.text }}>{venue.name}</div>
          <div className="text-xs" style={{ color: c.textMuted }}>{venue.cuisine} · {venue.price} · {venue.city}</div>
        </div>
      </div>

      {/* Overall rating */}
      <div className="px-5 mb-4">
        <div className="p-3 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: c.text }}>Overall</span>
            <span className="text-base font-bold" style={{ color: overallRating > 0 ? c.gold : c.textDim }}>
              {overallRating > 0 ? overallRating : '—'}<span className="text-[10px] font-normal" style={{ color: c.textDim }}>/10</span>
            </span>
          </div>
          <StarRow count={10} value={overallRating} onChange={setOverallRating} size={20} color="#F5C542" />
        </div>
      </div>

      {/* Category ratings */}
      <div className="px-5 mb-4">
        <div className="rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          {ratingCategories.map((cat, i) => (
            <div key={cat.key} className="flex items-center justify-between px-3 py-2.5"
              style={{ borderBottom: i < ratingCategories.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
              <span className="text-xs w-16 flex-shrink-0" style={{ color: c.textMuted }}>{cat.emoji} {cat.label}</span>
              <StarRow count={5} value={(ratings as any)[cat.key]}
                onChange={(n) => setRatings(prev => ({ ...prev, [cat.key]: n }))}
                size={20} color={cat.color} />
              <span className="text-sm font-bold w-10 text-right flex-shrink-0"
                style={{ color: (ratings as any)[cat.key] > 0 ? cat.color : c.textDim }}>
                {(ratings as any)[cat.key] || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dishes — Simplified Suggestions */}
      <div className="px-5 mb-3">
        <h3 className="text-xs font-semibold mb-2" style={{ color: c.text }}>What did you order?</h3>

        {/* Top 4-5 suggested dishes */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {suggested.slice(0, 3).concat(catalog.slice(0, 2)).map(d => (
            <button key={d.name} onClick={() => toggleDish(d.name)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all"
              style={{
                background: selectedDishes.includes(d.name) ? `${c.accent}25` : c.surface,
                color: selectedDishes.includes(d.name) ? c.accent : c.textMuted,
                border: `1px solid ${selectedDishes.includes(d.name) ? `${c.accent}50` : c.border}`,
              }}>
              {selectedDishes.includes(d.name) && <Check size={10} />}
              <span>{d.emoji}</span> {d.name}
            </button>
          ))}
          <button onClick={() => setShowCatalog(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all active:scale-95"
            style={{ background: `${c.accent}12`, color: c.accent, border: `1px dashed ${c.accent}40` }}>
            <Plus size={12} /> More
          </button>
        </div>

        {/* Selected dishes summary */}
        {selectedDishes.length > 0 && (
          <div className="p-2 rounded-lg" style={{ background: `${c.accent}08`, border: `1px solid ${c.accent}15` }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: c.accent }}>
              ✓ {selectedDishes.length} dish{selectedDishes.length > 1 ? 'es' : ''} selected
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedDishes.map(name => (
                <span key={name} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                  style={{ background: `${c.accent}20`, color: c.accent }}>
                  {name}
                  <button onClick={() => toggleDish(name)} className="ml-0.5 opacity-70 hover:opacity-100">
                    <X size={8} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="px-5 mb-3">
        <h3 className="text-xs font-semibold mb-2" style={{ color: c.text }}>Details</h3>
        <div className="mb-2">
          <div className="text-xs mb-2" style={{ color: c.textDim }}>Meal type</div>
          <div className="flex flex-wrap gap-2">
            {mealTimes.map(t => (
              <button key={t} onClick={() => toggleDetail(t)}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all"
                style={{
                  background: details.includes(t) ? `${c.accent}25` : c.surface,
                  color: details.includes(t) ? c.accent : c.textMuted,
                  border: `1px solid ${details.includes(t) ? `${c.accent}50` : c.border}`,
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs mb-2" style={{ color: c.textDim }}>Who were you with?</div>
          <div className="flex flex-wrap gap-2">
            {companions.map(comp => (
              <button key={comp} onClick={() => toggleDetail(comp)}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all"
                style={{
                  background: details.includes(comp) ? `${c.accent}25` : c.surface,
                  color: details.includes(comp) ? c.accent : c.textMuted,
                  border: `1px solid ${details.includes(comp) ? `${c.accent}50` : c.border}`,
                }}>
                {comp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Review text */}
      <div className="px-5 mb-3">
        <h3 className="text-xs font-semibold mb-2" style={{ color: c.text }}>Your thoughts</h3>
        <textarea placeholder="Share your experience..."
          className="w-full h-20 px-3 py-2.5 rounded-xl text-xs resize-none"
          style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text, fontFamily: "'DM Sans', sans-serif" }}
          value={text} onChange={e => setText(e.target.value)} />
      </div>

      {/* Photo upload */}
      <div className="px-5 mb-4">
        <h3 className="text-xs font-semibold mb-2" style={{ color: c.text }}>Add photos</h3>
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all"
            style={{ background: c.surface, border: `2px dashed ${c.border}` }}
            onClick={() => toast.info('Photo upload', { description: 'Camera access would open here' })}>
            <Camera size={20} style={{ color: c.textDim }} />
            <span className="text-[10px]" style={{ color: c.textDim }}>Add</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 pb-6">
        <button onClick={handleSubmit}
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: c.accent, color: '#fff' }}>
          <Check size={18} />
          Submit Review
        </button>
      </div>
    </div>
  );
}
