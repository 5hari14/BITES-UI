import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Screen = 'home' | 'search' | 'log' | 'social' | 'profile' | 'detail' | 'review' | 'login' | 'settings' | 'notifications' | 'curated-list' | 'onboarding' | 'user-places' | 'user-reviews' | 'user-followers' | 'user-following' | 'user-badges' | 'user-lists' | 'user-streak' | 'user-photos' | 'list-detail';

export interface UserReview {
  id: string;
  userId: string;
  venueId: string;
  overall: number;
  food: number;
  service: number;
  vibe: number;
  value: number;
  text: string;
  time: string;
  dishes: string[];
  details: string[];
  photos: { emoji: string; bg: string }[];
  friends: { initial: string; bg: string; name: string }[];
}

interface AppState {
  screen: Screen;
  history: Screen[];
  selectedVenueId: string | null;
  selectedReviewId: string | null;
  selectedUserId: string | null;
  /** The user whose sub-page (places/reviews/followers/following/badges/lists/streak) we're viewing */
  profileSubUserId: string | null;
  /** Currently selected list ID for list-detail screen */
  selectedListId: string | null;
  logStep: 1 | 2;
  logSelectedVenueId: string | null;
  searchTab: 'restaurants' | 'map' | 'foodies' | 'lists';
  socialTab: 'following' | 'leaderboard' | 'yourtaste';
  profileTab: 'wantgo' | 'lists' | 'stats';
  isLoggedIn: boolean;
  bookmarkedVenues: Set<string>;
  followedUsers: Set<string>;
  selectedCountry: string;
  selectedCity: string;
  selectedNeighborhood: string;
  searchQuery: string;
  /** Reviews submitted by the current user during this session */
  userReviews: UserReview[];
  /** Venues the current user has visited (includes both static data + newly logged) */
  userVisitedPlaces: Set<string>;
}

type ProfileSubScreen = 'user-places' | 'user-reviews' | 'user-followers' | 'user-following' | 'user-badges' | 'user-lists' | 'user-streak' | 'user-photos';

interface SubmitReviewData {
  venueId: string;
  overall: number;
  food: number;
  service: number;
  vibe: number;
  value: number;
  text: string;
  dishes: string[];
  details: string[];
}

interface AppContextType extends AppState {
  previousScreen: Screen | null;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  openVenueDetail: (venueId: string) => void;
  openReview: (reviewId: string) => void;
  openUserProfile: (userId: string) => void;
  openProfileSub: (screen: ProfileSubScreen, userId: string) => void;
  openListDetail: (listId: string) => void;
  setLogStep: (step: 1 | 2) => void;
  setLogSelectedVenue: (venueId: string | null) => void;
  setSearchTab: (tab: AppState['searchTab']) => void;
  setSocialTab: (tab: AppState['socialTab']) => void;
  setProfileTab: (tab: AppState['profileTab']) => void;
  setLocation: (country: string, city: string, neighborhood?: string) => void;
  setSearchQuery: (query: string) => void;
  toggleBookmark: (venueId: string) => void;
  toggleFollow: (userId: string) => void;
  submitReview: (data: SubmitReviewData) => void;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Initial visited places for Michel (from static data)
const MICHEL_INITIAL_PLACES = new Set([
  'bottega-amaro', 'istorja-cafe', 'meze-republic', 'koi-sushi',
  'brunch-club', 'noir-bar', 'kboo-bakery', 'aigion', 'verde-kitchen',
  'napoli-express', 'la-terrazza'
]);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    screen: 'home',
    history: [],
    selectedVenueId: null,
    selectedReviewId: null,
    selectedUserId: null,
    profileSubUserId: null,
    selectedListId: null,
    logStep: 1,
    logSelectedVenueId: null,
    searchTab: 'restaurants',
    socialTab: 'following',
    profileTab: 'stats',
    isLoggedIn: true,
    bookmarkedVenues: new Set(['bottega-amaro', 'istorja-cafe']),
    followedUsers: new Set(['sofia', 'elena']),
    selectedCountry: (typeof window !== 'undefined' && localStorage.getItem('bites_country')) || 'Cyprus',
    selectedCity: (typeof window !== 'undefined' && localStorage.getItem('bites_city')) || 'All Cities',
    selectedNeighborhood: (typeof window !== 'undefined' && localStorage.getItem('bites_neighborhood')) || 'All Areas',
    searchQuery: '',
    userReviews: [],
    userVisitedPlaces: new Set(MICHEL_INITIAL_PLACES),
  });

  const navigate = useCallback((screen: Screen) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, prev.screen],
      screen,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const history = [...prev.history];
      const previousScreen = history.pop() || 'home';
      return { ...prev, screen: previousScreen, history };
    });
  }, []);

  const openVenueDetail = useCallback((venueId: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, prev.screen],
      screen: 'detail' as Screen,
      selectedVenueId: venueId,
    }));
  }, []);

  const openReview = useCallback((reviewId: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, prev.screen],
      screen: 'review' as Screen,
      selectedReviewId: reviewId,
    }));
  }, []);

  const openUserProfile = useCallback((userId: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, prev.screen],
      screen: 'profile' as Screen,
      selectedUserId: userId,
    }));
  }, []);

  const openProfileSub = useCallback((screen: ProfileSubScreen, userId: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, prev.screen],
      screen,
      profileSubUserId: userId,
    }));
  }, []);

  const openListDetail = useCallback((listId: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, prev.screen],
      screen: 'list-detail' as Screen,
      selectedListId: listId,
    }));
  }, []);

  const setLogStep = useCallback((step: 1 | 2) => {
    setState(prev => ({ ...prev, logStep: step }));
  }, []);

  const setLogSelectedVenue = useCallback((venueId: string | null) => {
    setState(prev => ({ ...prev, logSelectedVenueId: venueId }));
  }, []);

  const setSearchTab = useCallback((tab: AppState['searchTab']) => {
    setState(prev => ({ ...prev, searchTab: tab }));
  }, []);

  const setSocialTab = useCallback((tab: AppState['socialTab']) => {
    setState(prev => ({ ...prev, socialTab: tab }));
  }, []);

  const setProfileTab = useCallback((tab: AppState['profileTab']) => {
    setState(prev => ({ ...prev, profileTab: tab }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setLocation = useCallback((country: string, city: string, neighborhood?: string) => {
    const hood = neighborhood || 'All Areas';
    if (typeof window !== 'undefined') {
      localStorage.setItem('bites_country', country);
      localStorage.setItem('bites_city', city);
      localStorage.setItem('bites_neighborhood', hood);
    }
    setState(prev => ({ ...prev, selectedCountry: country, selectedCity: city, selectedNeighborhood: hood }));
  }, []);

  const toggleBookmark = useCallback((venueId: string) => {
    setState(prev => {
      const next = new Set(prev.bookmarkedVenues);
      if (next.has(venueId)) next.delete(venueId);
      else next.add(venueId);
      return { ...prev, bookmarkedVenues: next };
    });
  }, []);

  const toggleFollow = useCallback((userId: string) => {
    setState(prev => {
      const next = new Set(prev.followedUsers);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return { ...prev, followedUsers: next };
    });
  }, []);

  const submitReview = useCallback((data: SubmitReviewData) => {
    const newReview: UserReview = {
      id: `michel_${data.venueId}_${Date.now()}`,
      userId: 'michel',
      venueId: data.venueId,
      overall: data.overall,
      food: data.food,
      service: data.service,
      vibe: data.vibe,
      value: data.value,
      text: data.text,
      time: 'Just now',
      dishes: data.dishes,
      details: data.details,
      photos: [],
      friends: [],
    };

    setState(prev => {
      const updatedVisited = new Set(prev.userVisitedPlaces);
      updatedVisited.add(data.venueId);
      return {
        ...prev,
        userReviews: [newReview, ...prev.userReviews],
        userVisitedPlaces: updatedVisited,
      };
    });
  }, []);

  const login = useCallback(() => {
    setState(prev => ({ ...prev, isLoggedIn: true, screen: 'home' as Screen, history: [] }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isLoggedIn: false, screen: 'login' as Screen, history: [] }));
  }, []);

  const previousScreen = state.history.length > 0 ? state.history[state.history.length - 1] : null;

  return (
    <AppContext.Provider value={{
      ...state, previousScreen, navigate, goBack, openVenueDetail, openReview, openUserProfile, openProfileSub, openListDetail,
      setLogStep, setLogSelectedVenue, setSearchTab, setSocialTab, setProfileTab, setLocation, setSearchQuery,
      toggleBookmark, toggleFollow, submitReview, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
