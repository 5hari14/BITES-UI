import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import type { Review } from '@/lib/data';
import { getUser, getVenue } from '@/lib/data';

interface Props {
  review: Review;
  showFollow?: boolean;
}

export default function ReviewCard({ review, showFollow }: Props) {
  const { openVenueDetail, openUserProfile, toggleFollow, followedUsers } = useApp();
  const { c } = useBiteTheme();
  const [liked, setLiked] = useState(false);
  const user = getUser(review.userId);
  const venue = getVenue(review.venueId);
  if (!user || !venue) return null;

  const isFollowing = followedUsers.has(user.id);

  return (
    <div className="mx-5 mb-4 rounded-2xl overflow-hidden"
      style={{ background: c.surface, border: `1px solid ${c.border}` }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 pt-3.5">
        <div className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center text-base font-bold text-white cursor-pointer transition-press"
          style={{ background: user.avatarGrad }}
          onClick={() => openUserProfile(user.id)}>
          {user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold cursor-pointer transition-colors"
            style={{ color: c.text }}
            onClick={() => openUserProfile(user.id)}>
            {user.name}
          </div>
          <div className="text-[11px]" style={{ color: c.textDim }}>{review.time}</div>
        </div>
        {showFollow && user.id !== 'michel' && (
          <button className="text-xs font-semibold"
            style={{ color: isFollowing ? c.green : c.accent }}
            onClick={() => toggleFollow(user.id)}>
            {isFollowing ? 'Following' : '+ Follow'}
          </button>
        )}
      </div>

      {/* Venue */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer"
        onClick={() => openVenueDetail(venue.id)}>
        <div className="flex-shrink-0 w-[50px] h-[50px] rounded-lg flex items-center justify-center text-xl"
          style={{ background: venue.gradient }}>
          {venue.emoji}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: c.text }}>{venue.name}</div>
          <div className="text-xs" style={{ color: c.textMuted }}>
            {venue.cuisine} · {venue.price} · {venue.city}
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="flex gap-2 px-3.5 pb-2.5 flex-wrap">
        <RatingTag label={`⭐ ${review.overall} /10`} type="overall" />
        <RatingTag label={`🍽️ ${review.food}`} type="food" />
        {review.service !== null && <RatingTag label={`👤 ${review.service}`} type="service" />}
        <RatingTag label={`✨ ${review.vibe}`} type="vibe" />
        <RatingTag label={`💰 ${review.value}`} type="value" />
      </div>

      {/* Text */}
      <div className="px-3.5 pb-3 text-[13px] leading-relaxed" style={{ color: c.textMuted }}>
        {review.text}
      </div>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-1 px-3.5 pb-3">
          {review.photos.map((p, i) => (
            <div key={i} className="flex-1 h-24 rounded-md flex items-center justify-center text-2xl"
              style={{ background: p.bg }}>
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-5 px-3.5 py-2.5" style={{ borderTop: `1px solid ${c.divider}` }}>
        <button className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: liked ? c.accent : c.textDim }}
          onClick={() => setLiked(!liked)}>
          <Heart size={16} fill={liked ? c.accent : 'none'} />
          <span>Helpful</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs" style={{ color: c.textDim }}>
          <MessageCircle size={16} />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs" style={{ color: c.textDim }}>
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

function RatingTag({ label, type }: { label: string; type: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    overall: { bg: 'linear-gradient(135deg, rgba(245,197,66,0.2), rgba(255,107,53,0.15))', text: '#F5C542' },
    food: { bg: 'rgba(255,107,53,0.15)', text: '#FF6B35' },
    service: { bg: 'rgba(96,165,250,0.15)', text: '#60A5FA' },
    vibe: { bg: 'rgba(244,114,182,0.15)', text: '#F472B6' },
    value: { bg: 'rgba(74,222,128,0.15)', text: '#4ADE80' },
  };
  const col = colors[type] || colors.food;

  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1"
      style={{ background: col.bg, color: col.text }}>
      {label}
    </span>
  );
}
