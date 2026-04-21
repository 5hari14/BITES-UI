import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { useRef, useEffect } from 'react';
import BottomNav from './BottomNav';
import StatusBar from './StatusBar';
import HomeScreen from '@/pages/HomeScreen';
import SearchScreen from '@/pages/SearchScreen';
import LogScreen from '@/pages/LogScreen';
import SocialScreen from '@/pages/SocialScreen';
import ProfileScreen from '@/pages/ProfileScreen';
import DetailScreen from '@/pages/DetailScreen';
import ReviewModal from './ReviewModal';
import LoginScreen from '@/pages/LoginScreen';
import SettingsScreen from '@/pages/SettingsScreen';
import NotificationsScreen from '@/pages/NotificationsScreen';
import OnboardingScreen from '@/pages/OnboardingScreen';
import CuratedListScreen from '@/pages/CuratedListScreen';
import UserPlacesScreen from '@/pages/UserPlacesScreen';
import UserReviewsScreen from '@/pages/UserReviewsScreen';
import UserFollowersScreen from '@/pages/UserFollowersScreen';
import UserFollowingScreen from '@/pages/UserFollowingScreen';
import UserBadgesScreen from '@/pages/UserBadgesScreen';
import UserListsScreen from '@/pages/UserListsScreen';
import UserStreakScreen from '@/pages/UserStreakScreen';
import UserPhotosScreen from '@/pages/UserPhotosScreen';
import ListDetailScreen from '@/pages/ListDetailScreen';

export default function PhoneShell() {
  const { screen } = useApp();
  const { c } = useBiteTheme();
  const phoneFrameRef = useRef<HTMLDivElement>(null);

  // Expose the phone frame element globally for portal usage
  useEffect(() => {
    if (phoneFrameRef.current) {
      (window as any).__phoneFrame = phoneFrameRef.current;
    }
    return () => { (window as any).__phoneFrame = null; };
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen />;
      case 'search': return <SearchScreen />;
      case 'log': return <LogScreen />;
      case 'social': return <SocialScreen />;
      case 'profile': return <ProfileScreen />;
      case 'detail': return <DetailScreen />;
      case 'review': return <ReviewModal />;
      case 'login': return <LoginScreen />;
      case 'settings': return <SettingsScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'onboarding': return <OnboardingScreen />;
      case 'curated-list': return <CuratedListScreen />;
      case 'user-places': return <UserPlacesScreen />;
      case 'user-reviews': return <UserReviewsScreen />;
      case 'user-followers': return <UserFollowersScreen />;
      case 'user-following': return <UserFollowingScreen />;
      case 'user-badges': return <UserBadgesScreen />;
      case 'user-lists': return <UserListsScreen />;
      case 'user-streak': return <UserStreakScreen />;
      case 'user-photos': return <UserPhotosScreen />;
      case 'list-detail': return <ListDetailScreen />;
      default: return <HomeScreen />;
    }
  };

  const showNav = ['home', 'search', 'log', 'social', 'profile'].includes(screen);
  const showStatusBar = !['detail', 'onboarding'].includes(screen);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10"
      style={{ background: c.outerBg }}>
      {/* Header */}
      <div className="text-center mb-6 max-w-lg">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-1"
          style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Bites
        </h1>
        <p className="text-sm" style={{ color: c.textMuted }}>
          Interactive App Mockup — Tap through each screen
        </p>
      </div>

      {/* Screen nav */}
      <ScreenNav />

      {/* Phone frame */}
      <div ref={phoneFrameRef} id="phone-frame" data-phone-frame className="relative" style={{
        width: 390, height: 844, borderRadius: 44,
        border: `3px solid ${c.frameBorder}`, overflow: 'hidden',
        background: c.bg,
        boxShadow: `0 0 0 1px ${c.border}, 0 30px 80px rgba(0,0,0,0.4), 0 0 120px rgba(255,107,53,0.04)`
      }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          style={{ width: 160, height: 34, background: c.bg, borderRadius: '0 0 24px 24px' }}>
          <div className="absolute top-3 left-1/2 -translate-x-1/2"
            style={{ width: 60, height: 6, background: c.surface, borderRadius: 10 }} />
        </div>

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{ paddingBottom: showNav ? 84 : 0, WebkitOverflowScrolling: 'touch', background: c.bg }}>
            {showStatusBar && <StatusBar />}
            <div className="animate-fade-in-up" key={screen}>
              {renderScreen()}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        {showNav && <BottomNav />}
      </div>

      {/* Flow diagram */}
      <FlowDiagram />
    </div>
  );
}

function ScreenNav() {
  const { screen, navigate, openVenueDetail, openUserProfile } = useApp();
  const { c } = useBiteTheme();
  const screens = [
    { key: 'onboarding', label: '👋 Onboarding' },
    { key: 'login', label: '🔐 Login' },
    { key: 'home', label: '🏠 Home' },
    { key: 'search', label: '🔍 Search' },
    { key: 'log', label: '✏️ Log' },
    { key: 'social', label: '👥 Social' },
    { key: 'detail', label: '🍝 Restaurant' },
    { key: 'profile', label: '👤 Profile' },
    { key: 'curated-list', label: '📋 Curated List' },
  ];

  const handleClick = (key: string) => {
    if (key === 'profile') openUserProfile('michel');
    else if (key === 'detail') openVenueDetail('bottega-amaro');
    else navigate(key as any);
  };

  return (
    <div className="flex gap-1.5 mb-6 flex-wrap justify-center max-w-3xl">
      {screens.map(s => (
        <button key={s.key}
          onClick={() => handleClick(s.key)}
          className="px-3.5 py-2 rounded-full text-xs font-medium transition-all"
          style={{
            background: screen === s.key ? c.accent : c.surface,
            color: screen === s.key ? '#fff' : c.textMuted,
            border: `1px solid ${screen === s.key ? c.accent : c.border}`,
            boxShadow: screen === s.key ? `0 4px 20px ${c.accent}50` : 'none'
          }}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

function FlowDiagram() {
  const { c } = useBiteTheme();
  return (
    <div className="mt-8 max-w-3xl w-full">
      <h3 className="font-display text-lg font-bold text-center mb-4" style={{ color: c.text }}>
        App Flow Diagram
      </h3>
      <div className="p-5 rounded-2xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <FlowNode label="Onboarding" emoji="👋" color={c.gold} />
          <FlowArrow />
          <FlowNode label="Login / Signup" emoji="🔐" color={c.blue} />
          <FlowArrow />
          <FlowNode label="Home Feed" emoji="🏠" color={c.accent} active />
        </div>
        <div className="flex justify-center mb-3">
          <div className="w-px h-6" style={{ background: `${c.accent}50` }} />
        </div>
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="flex flex-col items-center gap-1.5">
            <FlowNode label="Search" emoji="🔍" color={c.blue} small />
            <div className="text-[9px] text-center leading-tight" style={{ color: c.textDim }}>
              Restaurants · Map · Foodies · Lists
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FlowNode label="Log" emoji="✏️" color={c.green} small />
            <div className="text-[9px] text-center leading-tight" style={{ color: c.textDim }}>
              Select → Rate → Submit
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FlowNode label="Social" emoji="👥" color={c.pink} small />
            <div className="text-[9px] text-center leading-tight" style={{ color: c.textDim }}>
              Feed · Leaderboard
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FlowNode label="Profile" emoji="👤" color={c.gold} small />
            <div className="text-[9px] text-center leading-tight" style={{ color: c.textDim }}>
              Reviews · Saved · Lists · Stats
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FlowNode label="Detail" emoji="🍝" color={c.accent} small />
            <div className="text-[9px] text-center leading-tight" style={{ color: c.textDim }}>
              Overview · Reviews · Menu
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <SubFlow label="Settings" emoji="⚙️" />
          <SubFlow label="Notifications" emoji="🔔" />
          <SubFlow label="Curated Lists" emoji="📋" />
          <SubFlow label="User Profiles" emoji="👤" />
          <SubFlow label="Bookmark" emoji="🔖" />
          <SubFlow label="Follow/Unfollow" emoji="➕" />
        </div>
      </div>
    </div>
  );
}

function FlowNode({ label, emoji, color, active, small }: { label: string; emoji: string; color: string; active?: boolean; small?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="rounded-xl flex items-center justify-center"
        style={{
          width: small ? 40 : 48, height: small ? 40 : 48,
          background: `${color}15`,
          border: `1.5px solid ${color}${active ? '60' : '30'}`,
          boxShadow: active ? `0 0 15px ${color}20` : 'none',
        }}>
        <span className={small ? 'text-base' : 'text-xl'}>{emoji}</span>
      </div>
      <span className="text-[10px] font-medium" style={{ color }}>{label}</span>
    </div>
  );
}

function FlowArrow() {
  const { c } = useBiteTheme();
  return (
    <div className="flex items-center px-1">
      <div className="w-6 h-px" style={{ background: `${c.accent}50` }} />
      <div style={{ width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: `5px solid ${c.accent}50` }} />
    </div>
  );
}

function SubFlow({ label, emoji }: { label: string; emoji: string }) {
  const { c } = useBiteTheme();
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
      style={{ background: c.surfaceAlt, border: `1px solid ${c.divider}` }}>
      <span className="text-xs">{emoji}</span>
      <span className="text-[10px]" style={{ color: c.textDim }}>{label}</span>
    </div>
  );
}
