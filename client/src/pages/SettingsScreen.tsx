import { useApp } from '@/contexts/AppContext';
import { useBiteTheme, type ThemeMode } from '@/contexts/BiteThemeContext';
import {
  ChevronLeft, ChevronRight, User, Bell, Shield, Palette, Globe, HelpCircle, LogOut,
  Sun, Moon, Monitor, Camera, Check, X, Eye, EyeOff, Lock, UserX, MessageCircle,
  Mail, Smartphone, BellRing, BellOff, Heart, Star, Users, TrendingUp,
  ChevronDown, ChevronUp, ExternalLink, Info, AlertTriangle, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

/* ─── Toggle Switch Component ─── */
function Toggle({ on, onChange, color }: { on: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: on ? color : 'rgba(128,128,128,0.3)' }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300"
        style={{ left: on ? '22px' : '2px' }}
      />
    </button>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ title, c }: { title: string; c: any }) {
  return (
    <div className="px-5 mb-2 mt-5">
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: c.textDim }}>
        {title}
      </span>
    </div>
  );
}

/* ─── Sub-page Header ─── */
function SubHeader({ title, goBack, c }: { title: string; goBack: () => void; c: any }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-14 pb-4">
      <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <ChevronLeft size={18} style={{ color: c.text }} />
      </button>
      <h2 className="font-display text-xl font-bold" style={{ color: c.text }}>{title}</h2>
    </div>
  );
}

/* ─── Row Item ─── */
function SettingRow({ label, sub, right, divider, c, onClick }: {
  label: string; sub?: string; right?: React.ReactNode; divider?: boolean; c: any; onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? 'cursor-pointer active:opacity-70' : ''}`}
      style={{ borderBottom: divider ? `1px solid ${c.divider}` : 'none' }}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: c.text }}>{label}</div>
        {sub && <div className="text-[11px]" style={{ color: c.textDim }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EDIT PROFILE PANEL
   ═══════════════════════════════════════════════════════════════ */
function EditProfilePanel({ goBack }: { goBack: () => void }) {
  const { c } = useBiteTheme();
  const [name, setName] = useState('Michel');
  const [username, setUsername] = useState('@michel_bites');
  const [bio, setBio] = useState('Food explorer 🍕 | Coffee addict ☕ | Based in Limassol, Cyprus');
  const [email, setEmail] = useState('michel@bites.app');
  const [phone, setPhone] = useState('+357 99 123 456');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated', { description: 'Your changes have been saved' });
      goBack();
    }, 800);
  };

  return (
    <div>
      <SubHeader title="Edit Profile" goBack={goBack} c={c} />

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #F5C542)' }}>
            M
          </div>
          <button
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: c.accent }}
            onClick={() => toast.info('Change Photo', { description: 'Photo picker would open here' })}
          >
            <Camera size={14} className="text-white" />
          </button>
        </div>
        <button className="mt-2 text-xs font-medium" style={{ color: c.accent }}
          onClick={() => toast.info('Change Photo', { description: 'Photo picker would open here' })}>
          Change Photo
        </button>
      </div>

      {/* Form Fields */}
      <div className="px-5 space-y-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: c.textDim }}>
            Full Name
          </label>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: c.textDim }}>
            Username
          </label>
          <input
            type="text" value={username} onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}
          />
          <p className="text-[10px] mt-1" style={{ color: c.textDim }}>This is how others find you on Bites</p>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: c.textDim }}>
            Bio
          </label>
          <textarea
            value={bio} onChange={e => setBio(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}
          />
          <p className="text-[10px] mt-1 text-right" style={{ color: c.textDim }}>{bio.length}/150</p>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: c.textDim }}>
            Email
          </label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: c.textDim }}>
            Phone
          </label>
          <input
            type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="px-5 mt-6 mb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: saving ? c.textMuted : c.accent, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS PANEL
   ═══════════════════════════════════════════════════════════════ */
function NotificationsPanel({ goBack }: { goBack: () => void }) {
  const { c } = useBiteTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  // Push notification types
  const [newFollower, setNewFollower] = useState(true);
  const [newLike, setNewLike] = useState(true);
  const [newComment, setNewComment] = useState(true);
  const [friendReview, setFriendReview] = useState(true);
  const [leaderboard, setLeaderboard] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [newBadge, setNewBadge] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);

  const handleToggle = (setter: (v: boolean) => void, label: string) => (val: boolean) => {
    setter(val);
    toast.success(val ? `${label} enabled` : `${label} disabled`);
  };

  return (
    <div>
      <SubHeader title="Notifications" goBack={goBack} c={c} />

      {/* Master Toggles */}
      <SectionHeader title="Channels" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="Push Notifications" sub="Alerts on your device" divider c={c}
          right={<Toggle on={pushEnabled} onChange={handleToggle(setPushEnabled, 'Push notifications')} color={c.accent} />} />
        <SettingRow label="Email Notifications" sub="Updates to your inbox" divider c={c}
          right={<Toggle on={emailEnabled} onChange={handleToggle(setEmailEnabled, 'Email notifications')} color={c.accent} />} />
        <SettingRow label="In-App Notifications" sub="Banners inside Bites" c={c}
          right={<Toggle on={inAppEnabled} onChange={handleToggle(setInAppEnabled, 'In-app notifications')} color={c.accent} />} />
      </div>

      {/* Activity Notifications */}
      <SectionHeader title="Activity" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="New Followers" sub="When someone follows you" divider c={c}
          right={<Toggle on={newFollower} onChange={handleToggle(setNewFollower, 'New follower alerts')} color={c.accent} />} />
        <SettingRow label="Likes on Reviews" sub="When someone likes your review" divider c={c}
          right={<Toggle on={newLike} onChange={handleToggle(setNewLike, 'Like alerts')} color={c.accent} />} />
        <SettingRow label="Comments" sub="Replies to your reviews" divider c={c}
          right={<Toggle on={newComment} onChange={handleToggle(setNewComment, 'Comment alerts')} color={c.accent} />} />
        <SettingRow label="Friend Reviews" sub="When friends post new reviews" c={c}
          right={<Toggle on={friendReview} onChange={handleToggle(setFriendReview, 'Friend review alerts')} color={c.accent} />} />
      </div>

      {/* Engagement */}
      <SectionHeader title="Engagement" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden mb-8" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="Leaderboard Updates" sub="Monthly ranking changes" divider c={c}
          right={<Toggle on={leaderboard} onChange={handleToggle(setLeaderboard, 'Leaderboard alerts')} color={c.accent} />} />
        <SettingRow label="New Badges" sub="When you earn achievements" divider c={c}
          right={<Toggle on={newBadge} onChange={handleToggle(setNewBadge, 'Badge alerts')} color={c.accent} />} />
        <SettingRow label="Streak Reminders" sub="Don't break your streak!" divider c={c}
          right={<Toggle on={streakReminder} onChange={handleToggle(setStreakReminder, 'Streak reminders')} color={c.accent} />} />
        <SettingRow label="Weekly Digest" sub="Summary of your week on Bites" divider c={c}
          right={<Toggle on={weeklyDigest} onChange={handleToggle(setWeeklyDigest, 'Weekly digest')} color={c.accent} />} />
        <SettingRow label="Promotions & Offers" sub="Deals from partner restaurants" c={c}
          right={<Toggle on={promotions} onChange={handleToggle(setPromotions, 'Promotions')} color={c.accent} />} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRIVACY PANEL
   ═══════════════════════════════════════════════════════════════ */
function PrivacyPanel({ goBack }: { goBack: () => void }) {
  const { c } = useBiteTheme();
  const [profilePublic, setProfilePublic] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [showLists, setShowLists] = useState(true);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);

  const [blockedUsers] = useState([
    { id: 'spam1', name: 'SpamBot99', handle: '@spambot99', avatar: 'S' },
    { id: 'spam2', name: 'FakeReviewer', handle: '@fakereviewer', avatar: 'F' },
  ]);

  const [unblockedIds, setUnblockedIds] = useState<Set<string>>(new Set());

  const handleUnblock = (id: string, name: string) => {
    setUnblockedIds(prev => { const next = new Set(Array.from(prev)); next.add(id); return next; });
    toast.success(`Unblocked ${name}`);
  };

  const handleToggle = (setter: (v: boolean) => void, label: string) => (val: boolean) => {
    setter(val);
    toast.success(`${label} ${val ? 'enabled' : 'disabled'}`);
  };

  return (
    <div>
      <SubHeader title="Privacy" goBack={goBack} c={c} />

      {/* Profile Visibility */}
      <SectionHeader title="Profile Visibility" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="Public Profile" sub="Anyone can see your profile" divider c={c}
          right={<Toggle on={profilePublic} onChange={handleToggle(setProfilePublic, 'Public profile')} color={c.accent} />} />
        <SettingRow label="Show Places Visited" sub="Display your places count" divider c={c}
          right={<Toggle on={showPlaces} onChange={handleToggle(setShowPlaces, 'Places visibility')} color={c.accent} />} />
        <SettingRow label="Show Reviews" sub="Display your reviews publicly" divider c={c}
          right={<Toggle on={showReviews} onChange={handleToggle(setShowReviews, 'Reviews visibility')} color={c.accent} />} />
        <SettingRow label="Show Lists" sub="Make your lists discoverable" c={c}
          right={<Toggle on={showLists} onChange={handleToggle(setShowLists, 'Lists visibility')} color={c.accent} />} />
      </div>

      {/* Social */}
      <SectionHeader title="Social" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="Show on Leaderboard" sub="Appear in public rankings" divider c={c}
          right={<Toggle on={showOnLeaderboard} onChange={handleToggle(setShowOnLeaderboard, 'Leaderboard visibility')} color={c.accent} />} />
        <SettingRow label="Allow Tagging" sub="Let friends tag you in reviews" divider c={c}
          right={<Toggle on={allowTagging} onChange={handleToggle(setAllowTagging, 'Tagging')} color={c.accent} />} />
        <SettingRow label="Online Status" sub="Show when you're active" c={c}
          right={<Toggle on={showOnlineStatus} onChange={handleToggle(setShowOnlineStatus, 'Online status')} color={c.accent} />} />
      </div>

      {/* Blocked Users */}
      <SectionHeader title="Blocked Users" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden mb-6" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        {blockedUsers.filter(u => !unblockedIds.has(u.id)).length === 0 ? (
          <div className="px-4 py-6 text-center">
            <UserX size={24} style={{ color: c.textDim }} className="mx-auto mb-2" />
            <p className="text-xs" style={{ color: c.textDim }}>No blocked users</p>
          </div>
        ) : (
          blockedUsers.filter(u => !unblockedIds.has(u.id)).map((user, i, arr) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < arr.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #666, #999)' }}>
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: c.text }}>{user.name}</div>
                <div className="text-[11px]" style={{ color: c.textDim }}>{user.handle}</div>
              </div>
              <button
                onClick={() => handleUnblock(user.id, user.name)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-95"
                style={{ background: `${c.accent}15`, color: c.accent, border: `1px solid ${c.accent}30` }}
              >
                Unblock
              </button>
            </div>
          ))
        )}
      </div>

      {/* Danger Zone */}
      <SectionHeader title="Data & Account" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden mb-8" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="Download My Data" sub="Export all your Bites data" divider c={c}
          onClick={() => toast.info('Data Export', { description: 'Your data export will be ready in 24 hours. We\'ll email you a download link.' })}
          right={<ExternalLink size={16} style={{ color: c.textDim }} />} />
        <SettingRow label="Delete Account" sub="Permanently remove your account" c={c}
          onClick={() => toast.error('Delete Account', { description: 'Are you sure? This action cannot be undone. Contact support@bites.app to proceed.' })}
          right={<Trash2 size={16} style={{ color: '#EF4444' }} />} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANGUAGE PANEL
   ═══════════════════════════════════════════════════════════════ */
function LanguagePanel({ goBack }: { goBack: () => void }) {
  const { c } = useBiteTheme();
  const [selected, setSelected] = useState('en');

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇦🇪' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  ];

  const handleSelect = (code: string, name: string) => {
    setSelected(code);
    toast.success(`Language changed to ${name}`, { description: 'The app will now display in your selected language' });
  };

  return (
    <div>
      <SubHeader title="Language" goBack={goBack} c={c} />

      <div className="px-5 mb-4">
        <p className="text-xs" style={{ color: c.textDim }}>
          Choose your preferred language. This will change all text throughout the app.
        </p>
      </div>

      <div className="mx-5 rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        {languages.map((lang, i) => {
          const isActive = selected === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code, lang.name)}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all active:opacity-70"
              style={{
                borderBottom: i < languages.length - 1 ? `1px solid ${c.divider}` : 'none',
                background: isActive ? `${c.accent}10` : 'transparent',
              }}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: isActive ? c.accent : c.text }}>{lang.name}</div>
                <div className="text-[11px]" style={{ color: c.textDim }}>{lang.native}</div>
              </div>
              {isActive && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: c.accent }}>
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-5 mt-4 mb-8">
        <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: `${c.blue}12`, border: `1px solid ${c.blue}20` }}>
          <Info size={14} style={{ color: c.blue }} className="mt-0.5 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed" style={{ color: c.textMuted }}>
            Some content like restaurant names and reviews will remain in their original language regardless of this setting.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELP & FAQ PANEL
   ═══════════════════════════════════════════════════════════════ */
function HelpPanel({ goBack }: { goBack: () => void }) {
  const { c } = useBiteTheme();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do I log a restaurant visit?',
      a: 'Tap the orange "+" button in the bottom navigation bar. Search for the restaurant, then rate your experience across food, service, vibe, and value. Add a text review, tag dishes, and submit!'
    },
    {
      q: 'How does the leaderboard work?',
      a: 'The leaderboard ranks users across multiple dimensions: XP, places visited, reviews written, badges earned, and streaks. Rankings refresh on the 1st of every month, giving everyone a fresh start.'
    },
    {
      q: 'How do I earn badges?',
      a: 'Badges are earned by reaching milestones — like visiting 20+ cafes (Coffee Expert), reviewing 15+ pizza spots (Pizza Hunter), or maintaining a 30-day review streak. Check your profile to see available badges.'
    },
    {
      q: 'Can I make my reviews private?',
      a: 'Yes! Go to Settings > Privacy and toggle off "Show Reviews." Your reviews will still count toward your stats but won\'t be visible to other users.'
    },
    {
      q: 'How does "Your Taste" work?',
      a: 'After logging 10+ different places, our algorithm analyzes your preferences across cuisine types, price ranges, and vibes to suggest new places you\'ll love. The more you review, the better the recommendations!'
    },
    {
      q: 'How do I create a curated list?',
      a: 'Go to your Profile > Lists tab and tap "Create New List." Give it a name, emoji, and description. You can add restaurants from their detail pages using the bookmark icon, then assign them to your lists.'
    },
    {
      q: 'Is Bites available outside Cyprus?',
      a: 'We\'re currently live in Cyprus with plans to expand to Greece, UK, UAE, Italy, Spain, and France. Use the location selector to see which cities are coming soon and get notified when we launch.'
    },
    {
      q: 'How do I report an incorrect listing?',
      a: 'On any restaurant\'s detail page, scroll to the bottom and tap "Report an Issue." You can flag incorrect hours, wrong location, closed venues, or other problems. Our team reviews reports within 48 hours.'
    },
  ];

  return (
    <div>
      <SubHeader title="Help & FAQ" goBack={goBack} c={c} />

      {/* Quick Actions */}
      <SectionHeader title="Get Help" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden mb-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="Contact Support" sub="Email us at support@bites.app" divider c={c}
          onClick={() => toast.info('Support', { description: 'Email sent to support@bites.app — we\'ll respond within 24 hours' })}
          right={<Mail size={16} style={{ color: c.textDim }} />} />
        <SettingRow label="Report a Bug" sub="Help us improve Bites" divider c={c}
          onClick={() => toast.info('Bug Report', { description: 'Bug report form would open here. Thank you for helping us improve!' })}
          right={<AlertTriangle size={16} style={{ color: c.textDim }} />} />
        <SettingRow label="Feature Request" sub="Suggest new features" c={c}
          onClick={() => toast.info('Feature Request', { description: 'Feature request form would open here. We love hearing your ideas!' })}
          right={<MessageCircle size={16} style={{ color: c.textDim }} />} />
      </div>

      {/* FAQ */}
      <SectionHeader title="Frequently Asked Questions" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden mb-6" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
            <button
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all"
            >
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: expandedFaq === i ? c.accent : c.text }}>
                  {faq.q}
                </div>
              </div>
              {expandedFaq === i
                ? <ChevronUp size={16} style={{ color: c.accent }} />
                : <ChevronDown size={16} style={{ color: c.textDim }} />
              }
            </button>
            {expandedFaq === i && (
              <div className="px-4 pb-3.5 -mt-1">
                <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* App Info */}
      <SectionHeader title="About" c={c} />
      <div className="mx-5 rounded-xl overflow-hidden mb-8" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <SettingRow label="App Version" c={c} divider
          right={<span className="text-xs" style={{ color: c.textDim }}>v2.0.0</span>} />
        <SettingRow label="Terms of Service" c={c} divider
          onClick={() => toast.info('Terms of Service', { description: 'Terms of Service would open in browser' })}
          right={<ExternalLink size={14} style={{ color: c.textDim }} />} />
        <SettingRow label="Privacy Policy" c={c} divider
          onClick={() => toast.info('Privacy Policy', { description: 'Privacy Policy would open in browser' })}
          right={<ExternalLink size={14} style={{ color: c.textDim }} />} />
        <SettingRow label="Open Source Licenses" c={c}
          onClick={() => toast.info('Licenses', { description: 'Open source license information would display here' })}
          right={<ExternalLink size={14} style={{ color: c.textDim }} />} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APPEARANCE PANEL (existing, cleaned up)
   ═══════════════════════════════════════════════════════════════ */
function AppearancePanel({ goBack }: { goBack: () => void }) {
  const { c, mode, setMode } = useBiteTheme();

  const modes: { key: ThemeMode; icon: typeof Sun; label: string; desc: string }[] = [
    { key: 'light', icon: Sun, label: 'Light', desc: 'Bright, clean interface' },
    { key: 'dark', icon: Moon, label: 'Dark', desc: 'Easy on the eyes' },
    { key: 'system', icon: Monitor, label: 'System', desc: 'Match device settings' },
  ];

  return (
    <div>
      <SubHeader title="Appearance" goBack={goBack} c={c} />

      <SectionHeader title="Theme" c={c} />

      <div className="mx-5 mb-6 flex gap-3">
        {modes.map(m => {
          const Icon = m.icon;
          const active = mode === m.key;
          return (
            <button key={m.key}
              onClick={() => {
                setMode(m.key);
                toast.success(`${m.label} mode`, { description: `Switched to ${m.label.toLowerCase()} mode` });
              }}
              className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all active:scale-95"
              style={{
                background: active ? `${c.accent}18` : c.surface,
                border: `1.5px solid ${active ? c.accent : c.border}`,
              }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: active ? `${c.accent}30` : c.surfaceAlt }}>
                <Icon size={20} style={{ color: active ? c.accent : c.textMuted }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: active ? c.accent : c.textMuted }}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active mode description */}
      <div className="mx-5 p-3 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2 mb-1">
          {mode === 'light' && <Sun size={14} style={{ color: '#F5C542' }} />}
          {mode === 'dark' && <Moon size={14} style={{ color: '#60A5FA' }} />}
          {mode === 'system' && <Monitor size={14} style={{ color: c.textMuted }} />}
          <span className="text-xs font-semibold" style={{ color: c.text }}>
            {mode === 'light' ? 'Light Mode' : mode === 'dark' ? 'Dark Mode' : 'System Default'}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: c.textDim }}>
          {mode === 'light'
            ? 'A bright, clean interface that works best in well-lit environments. Easy to read with high contrast.'
            : mode === 'dark'
            ? 'A darker interface that reduces eye strain in low-light conditions. Saves battery on OLED screens.'
            : 'Automatically switches between light and dark mode based on your device settings.'}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SETTINGS SCREEN
   ═══════════════════════════════════════════════════════════════ */
type SettingsSubPage = 'main' | 'edit-profile' | 'notifications' | 'privacy' | 'appearance' | 'language' | 'help';

export default function SettingsScreen() {
  const { goBack, logout } = useApp();
  const { c, mode } = useBiteTheme();
  const [subPage, setSubPage] = useState<SettingsSubPage>('main');

  // Sub-page routing
  if (subPage === 'edit-profile') return <EditProfilePanel goBack={() => setSubPage('main')} />;
  if (subPage === 'notifications') return <NotificationsPanel goBack={() => setSubPage('main')} />;
  if (subPage === 'privacy') return <PrivacyPanel goBack={() => setSubPage('main')} />;
  if (subPage === 'appearance') return <AppearancePanel goBack={() => setSubPage('main')} />;
  if (subPage === 'language') return <LanguagePanel goBack={() => setSubPage('main')} />;
  if (subPage === 'help') return <HelpPanel goBack={() => setSubPage('main')} />;

  const modeLabel = mode === 'dark' ? 'Dark mode' : mode === 'light' ? 'Light mode' : 'System default';

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', sub: 'Name, photo, bio', action: () => setSubPage('edit-profile') },
        { icon: Bell, label: 'Notifications', sub: 'Push, email, in-app', action: () => setSubPage('notifications') },
        { icon: Shield, label: 'Privacy', sub: 'Visibility, blocked users', action: () => setSubPage('privacy') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Palette, label: 'Appearance', sub: modeLabel, action: () => setSubPage('appearance') },
        { icon: Globe, label: 'Language', sub: 'English', action: () => setSubPage('language') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', sub: 'Get support', action: () => setSubPage('help') },
      ]
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <ChevronLeft size={18} style={{ color: c.text }} />
        </button>
        <h2 className="font-display text-xl font-bold" style={{ color: c.text }}>Settings</h2>
      </div>

      {sections.map(section => (
        <div key={section.title} className="mb-5">
          <div className="px-5 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: c.textDim }}>
              {section.title}
            </span>
          </div>
          <div className="mx-5 rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={item.label}
                  className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all active:opacity-70"
                  style={{ borderBottom: i < section.items.length - 1 ? `1px solid ${c.divider}` : 'none' }}
                  onClick={item.action}>
                  <Icon size={18} style={{ color: c.textMuted }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: c.text }}>{item.label}</div>
                    <div className="text-[11px]" style={{ color: c.textDim }}>{item.sub}</div>
                  </div>
                  <ChevronRight size={16} style={{ color: c.textDim }} />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div className="mx-5 mb-8">
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-all active:scale-[0.98]"
          style={{ background: `${c.accent}12`, border: `1px solid ${c.accent}25` }}>
          <LogOut size={18} style={{ color: c.accent }} />
          <span className="text-sm font-medium" style={{ color: c.accent }}>Sign Out</span>
        </button>
      </div>

      <div className="text-center pb-8">
        <span className="text-[11px]" style={{ color: c.textDim }}>Bites v2.0.0 · Made in Cyprus</span>
      </div>
    </div>
  );
}
