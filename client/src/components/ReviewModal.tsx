import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { ChevronLeft } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { reviews } from '@/lib/data';

export default function ReviewModal() {
  const { selectedReviewId, goBack } = useApp();
  const { c } = useBiteTheme();
  const review = reviews.find(r => r.id === selectedReviewId);

  if (!review) {
    return (
      <div className="px-5 pt-14 text-center">
        <button onClick={goBack} className="absolute top-14 left-5 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <div className="text-4xl mb-3">📝</div>
        <div className="text-sm" style={{ color: c.textMuted }}>Review not found</div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="flex items-center gap-3 px-5 mb-4">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <h2 className="font-display text-lg font-bold" style={{ color: c.text }}>Review</h2>
      </div>
      <ReviewCard review={review} />
    </div>
  );
}
