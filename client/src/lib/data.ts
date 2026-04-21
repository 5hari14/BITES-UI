// Bites App Mock Data Store
// All venue, user, review, and list data for the mockup

export const IMAGES = {
  burger: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663300373949/THHktkiA44oH8gCBtmfmtn/bites-hero-burger-HRhLsJyd6J5wUUz8t3JgGx.webp',
  pasta: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663300373949/THHktkiA44oH8gCBtmfmtn/bites-hero-pasta-kEe7MYKaqMtYn5GURv7LZT.webp',
  coffee: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663300373949/THHktkiA44oH8gCBtmfmtn/bites-hero-coffee-d5WhAzx7PCXzD5EyzjEF3h.webp',
  sushi: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663300373949/THHktkiA44oH8gCBtmfmtn/bites-hero-sushi-edGkXsTZ9UfBxdZEjAnyMc.webp',
};

export interface Venue {
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  price: string;
  city: string;
  area?: string;
  score: number;
  food: number;
  service: number;
  vibe: number;
  value: number;
  reviewCount: number;
  badge?: string;
  gradient: string;
  image?: string;
  tags: string[];
  category: string[];
  venueType: string[];
  cuisineType: string[];
  occasion: string[];
  dietary: string[];
  hours: { day: string; time: string; today?: boolean; closed?: boolean }[];
  info: { icon: string; text: string; link?: boolean }[];
  dishes: { emoji: string; name: string; orders: number }[];
  distance?: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  avatarGrad: string;
  coverGrad: string;
  level: number;
  xp: number;
  places: string;
  followers: string;
  following: string;
  reviewCount: string;
  badges: { icon: string; name: string; sub: string; date: string }[];
  lists: { emoji: string; name: string; count: string; priv?: boolean }[];
  tags?: string[];
  visitedPlaces: string[];
}

export interface Review {
  id: string;
  userId: string;
  venueId: string;
  overall: number;
  food: number;
  service: number | null;
  vibe: number;
  value: number;
  text: string;
  time: string;
  photos: { emoji: string; bg: string }[];
  dishes: string[];
  details: string[];
  friends: { initial: string; bg: string; name: string }[];
}

export const venues: Venue[] = [
  {
    id: 'bottega-amaro', name: 'Bottega Amaro', emoji: '🍝', cuisine: 'Italian',
    price: '€€€', city: 'Limassol', area: 'Old Town', score: 9.2,
    food: 4.6, service: 4.2, vibe: 4.8, value: 3.8, reviewCount: 847,
    gradient: 'linear-gradient(135deg, #3d1e0f, #1a0f08)',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663300373949/THHktkiA44oH8gCBtmfmtn/bites-hero-pasta-kEe7MYKaqMtYn5GURv7LZT.webp',
    tags: ['Italian', 'Fine Dining', '€€€', 'Old Town, Limassol'],
    category: ['trending', 'datenight', 'favourites'],
    venueType: ['dinner', 'lunch'],
    cuisineType: ['Italian', 'Mediterranean'],
    occasion: ['date night', 'romantic', 'upscale', 'intimate'],
    dietary: ['vegetarian'],
    hours: [
      { day: 'Mon', time: '12:00 – 23:00' }, { day: 'Tue', time: '12:00 – 23:00' },
      { day: 'Wed', time: '12:00 – 23:00', today: true }, { day: 'Thu', time: '12:00 – 23:30' },
      { day: 'Fri', time: '12:00 – 00:00' }, { day: 'Sat', time: '11:00 – 00:00' },
      { day: 'Sun', time: 'Closed', closed: true }
    ],
    info: [
      { icon: '📍', text: '23 Agiou Andreou, Old Town' },
      { icon: '📞', text: '+357 25 123 456', link: true },
      { icon: '🌐', text: 'bottega-amaro.cy', link: true },
      { icon: '🅿️', text: 'Street parking available' }
    ],
    dishes: [
      { emoji: '🍝', name: 'Truffle Pappardelle', orders: 342 },
      { emoji: '🥩', name: 'Osso Buco', orders: 218 },
      { emoji: '🍰', name: 'Tiramisu', orders: 189 }
    ],
    distance: '0.3km'
  },
  {
    id: 'koi-sushi', name: 'Koi Sushi Bar', emoji: '🍣', cuisine: 'Japanese',
    price: '€€', city: 'Nicosia', area: 'Old City', score: 8.8,
    food: 4.5, service: 4.0, vibe: 4.2, value: 4.4, reviewCount: 523,
    gradient: 'linear-gradient(135deg, #0f2a3d, #081a1a)',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663300373949/THHktkiA44oH8gCBtmfmtn/bites-hero-sushi-edGkXsTZ9UfBxdZEjAnyMc.webp',
    tags: ['Japanese', 'Sushi', '€€', 'Nicosia'],
    category: ['trending'],
    venueType: ['dinner', 'lunch'],
    cuisineType: ['Japanese', 'Asian'],
    occasion: ['casual', 'trendy', 'hangout'],
    dietary: ['pescatarian'],
    hours: [
      { day: 'Mon', time: '11:30 – 22:30' }, { day: 'Tue', time: '11:30 – 22:30' },
      { day: 'Wed', time: '11:30 – 22:30', today: true }, { day: 'Thu', time: '11:30 – 23:00' },
      { day: 'Fri', time: '11:30 – 23:30' }, { day: 'Sat', time: '12:00 – 23:30' },
      { day: 'Sun', time: '12:00 – 22:00' }
    ],
    info: [
      { icon: '📍', text: '15 Makarios Ave, Nicosia' },
      { icon: '📞', text: '+357 22 456 789', link: true }
    ],
    dishes: [
      { emoji: '🍣', name: 'Dragon Roll', orders: 287 },
      { emoji: '🍱', name: 'Omakase Set', orders: 156 },
      { emoji: '🍜', name: 'Miso Ramen', orders: 134 }
    ],
    distance: '0.8km'
  },
  {
    id: 'istorja-cafe', name: 'Istorja Cafe', emoji: '☕', cuisine: 'Cafe',
    price: '€', city: 'Limassol', area: 'Old Town', score: 9.3,
    food: 4.3, service: 4.5, vibe: 4.8, value: 4.9, reviewCount: 612,
    gradient: 'linear-gradient(135deg, #1a2a0f, #0f1a08)',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663300373949/THHktkiA44oH8gCBtmfmtn/bites-hero-coffee-d5WhAzx7PCXzD5EyzjEF3h.webp',
    tags: ['Cafe', 'Specialty Coffee', '€', 'Limassol'],
    category: ['new', 'coffee'],
    venueType: ['coffee', 'breakfast', 'grab and go'],
    cuisineType: [],
    occasion: ['casual', 'hangout'],
    dietary: ['vegan', 'vegetarian'],
    hours: [
      { day: 'Mon', time: '07:00 – 18:00' }, { day: 'Tue', time: '07:00 – 18:00' },
      { day: 'Wed', time: '07:00 – 18:00', today: true }, { day: 'Thu', time: '07:00 – 18:00' },
      { day: 'Fri', time: '07:00 – 19:00' }, { day: 'Sat', time: '08:00 – 19:00' },
      { day: 'Sun', time: '08:00 – 16:00' }
    ],
    info: [
      { icon: '📍', text: '8 Saripolou, Limassol' },
      { icon: '💻', text: 'WiFi available' },
      { icon: '🌐', text: 'istorja.com', link: true }
    ],
    dishes: [
      { emoji: '☕', name: 'Flat White', orders: 456 },
      { emoji: '🥐', name: 'Almond Croissant', orders: 312 },
      { emoji: '🍰', name: 'Carrot Cake', orders: 198 }
    ],
    distance: '0.5km'
  },
  {
    id: 'grill-house', name: 'The Grill House', emoji: '🥩', cuisine: 'Steakhouse',
    price: '€€€€', city: 'Paphos', area: 'Kato Paphos', score: 9.0,
    food: 4.7, service: 4.3, vibe: 4.1, value: 3.5, reviewCount: 389,
    gradient: 'linear-gradient(135deg, #2a0f3d, #1a081a)',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    tags: ['Steakhouse', 'Fine Dining', '€€€€', 'Paphos'],
    category: ['trending'],
    venueType: ['dinner'],
    cuisineType: ['Grill', 'American'],
    occasion: ['upscale', 'business meetings', 'date night'],
    dietary: [],
    hours: [
      { day: 'Mon', time: 'Closed', closed: true }, { day: 'Tue', time: '18:00 – 23:00' },
      { day: 'Wed', time: '18:00 – 23:00', today: true }, { day: 'Thu', time: '18:00 – 23:30' },
      { day: 'Fri', time: '18:00 – 00:00' }, { day: 'Sat', time: '17:00 – 00:00' },
      { day: 'Sun', time: '17:00 – 22:00' }
    ],
    info: [{ icon: '📍', text: '42 Poseidon Ave, Paphos' }],
    dishes: [
      { emoji: '🥩', name: 'Wagyu Ribeye', orders: 201 },
      { emoji: '🍟', name: 'Truffle Fries', orders: 178 }
    ]
  },
  {
    id: 'aigion', name: 'Aigion', emoji: '🕯️', cuisine: 'Mediterranean',
    price: '€€€€', city: 'Limassol', area: 'Marina', score: 9.4,
    food: 4.8, service: 4.6, vibe: 4.9, value: 3.6, reviewCount: 456,
    gradient: 'linear-gradient(135deg, #2a0f3d, #1a081a)',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    tags: ['Mediterranean', 'Fine Dining', '€€€€', 'Limassol'],
    category: ['datenight'],
    venueType: ['dinner'],
    cuisineType: ['Mediterranean', 'Seafood'],
    occasion: ['date night', 'romantic', 'upscale', 'intimate', 'seaside'],
    dietary: ['pescatarian'],
    hours: [
      { day: 'Mon', time: 'Closed', closed: true }, { day: 'Tue', time: '19:00 – 23:30' },
      { day: 'Wed', time: '19:00 – 23:30', today: true }, { day: 'Thu', time: '19:00 – 00:00' },
      { day: 'Fri', time: '19:00 – 00:30' }, { day: 'Sat', time: '18:00 – 00:30' },
      { day: 'Sun', time: '18:00 – 23:00' }
    ],
    info: [{ icon: '📍', text: '5 Amathus Ave, Limassol' }],
    dishes: [
      { emoji: '🐙', name: 'Grilled Octopus', orders: 267 },
      { emoji: '🐟', name: 'Sea Bass Ceviche', orders: 189 }
    ]
  },
  {
    id: 'seaside-lounge', name: 'Seaside Lounge', emoji: '🌊', cuisine: 'Seafood',
    price: '€€€', city: 'Paphos', area: 'Coral Bay', score: 8.6,
    food: 4.5, service: 4.5, vibe: 5.0, value: 3.5, reviewCount: 312,
    gradient: 'linear-gradient(135deg, #0f2a3d, #081a1a)',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=300&fit=crop',
    tags: ['Seafood', 'Waterfront', '€€€', 'Paphos'],
    category: ['datenight'],
    venueType: ['dinner', 'lunch'],
    cuisineType: ['Seafood', 'Mediterranean'],
    occasion: ['date night', 'romantic', 'seaside', 'casual'],
    dietary: ['pescatarian'],
    hours: [
      { day: 'Mon', time: '12:00 – 23:00' }, { day: 'Tue', time: '12:00 – 23:00' },
      { day: 'Wed', time: '12:00 – 23:00', today: true }, { day: 'Thu', time: '12:00 – 23:30' },
      { day: 'Fri', time: '12:00 – 00:00' }, { day: 'Sat', time: '11:00 – 00:00' },
      { day: 'Sun', time: '11:00 – 22:00' }
    ],
    info: [{ icon: '📍', text: 'Harbour Front, Paphos' }],
    dishes: [
      { emoji: '🐙', name: 'Grilled Octopus', orders: 198 },
      { emoji: '🐟', name: 'Whole Sea Bass', orders: 167 }
    ]
  },
  {
    id: 'verde-kitchen', name: 'Verde Kitchen', emoji: '🥑', cuisine: 'Vegan',
    price: '€€', city: 'Larnaca', area: 'Finikoudes', score: 8.5,
    food: 4.3, service: 4.1, vibe: 4.4, value: 4.5, reviewCount: 178,
    badge: '🆕 New', gradient: 'linear-gradient(135deg, #1a3d0f, #0a1a08)',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    tags: ['Vegan', 'Healthy', '€€', 'Larnaca'],
    category: ['new'],
    venueType: ['lunch', 'breakfast', 'grab and go'],
    cuisineType: [],
    occasion: ['casual', 'hangout'],
    dietary: ['vegan', 'vegetarian'],
    hours: [
      { day: 'Mon', time: '09:00 – 21:00' }, { day: 'Tue', time: '09:00 – 21:00' },
      { day: 'Wed', time: '09:00 – 21:00', today: true }, { day: 'Thu', time: '09:00 – 21:00' },
      { day: 'Fri', time: '09:00 – 22:00' }, { day: 'Sat', time: '10:00 – 22:00' },
      { day: 'Sun', time: '10:00 – 20:00' }
    ],
    info: [{ icon: '📍', text: '12 Finikoudes, Larnaca' }],
    dishes: [
      { emoji: '🥑', name: 'Avo Toast', orders: 134 },
      { emoji: '🥗', name: 'Buddha Bowl', orders: 112 }
    ]
  },
  {
    id: 'noir-bar', name: 'Noir Cocktail Bar', emoji: '🍸', cuisine: 'Cocktails',
    price: '€€€', city: 'Limassol', area: 'Tourist Area', score: 9.0,
    food: 3.8, service: 4.5, vibe: 4.9, value: 3.7, reviewCount: 267,
    gradient: 'linear-gradient(135deg, #2a0f3d, #1a081a)',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
    tags: ['Cocktails', 'Bar', '€€€', 'Limassol'],
    category: ['bars'],
    venueType: ['bars'],
    cuisineType: [],
    occasion: ['trendy', 'date night', 'hangout'],
    dietary: [],
    hours: [
      { day: 'Mon', time: 'Closed', closed: true }, { day: 'Tue', time: '18:00 – 01:00' },
      { day: 'Wed', time: '18:00 – 01:00', today: true }, { day: 'Thu', time: '18:00 – 02:00' },
      { day: 'Fri', time: '18:00 – 03:00' }, { day: 'Sat', time: '18:00 – 03:00' },
      { day: 'Sun', time: '18:00 – 00:00' }
    ],
    info: [{ icon: '📍', text: '7 Anexartisias, Limassol' }],
    dishes: [
      { emoji: '🍸', name: 'Noir Old Fashioned', orders: 198 },
      { emoji: '🍹', name: 'Passion Sour', orders: 156 }
    ]
  },
  {
    id: 'brunch-club', name: 'The Brunch Club', emoji: '🥞', cuisine: 'Brunch',
    price: '€€', city: 'Limassol', area: 'Germasogeia', score: 8.7,
    food: 4.4, service: 4.0, vibe: 4.3, value: 4.2, reviewCount: 234,
    gradient: 'linear-gradient(135deg, #3d2a0f, #1a1508)',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
    tags: ['Brunch', 'Breakfast', '€€', 'Limassol'],
    category: ['brunch'],
    venueType: ['brunch', 'breakfast'],
    cuisineType: ['American', 'Brunch'],
    occasion: ['casual', 'hangout'],
    dietary: ['vegetarian'],
    hours: [
      { day: 'Mon', time: '08:00 – 16:00' }, { day: 'Tue', time: '08:00 – 16:00' },
      { day: 'Wed', time: '08:00 – 16:00', today: true }, { day: 'Thu', time: '08:00 – 16:00' },
      { day: 'Fri', time: '08:00 – 17:00' }, { day: 'Sat', time: '09:00 – 17:00' },
      { day: 'Sun', time: '09:00 – 16:00' }
    ],
    info: [{ icon: '📍', text: '18 Makarios Ave, Limassol' }],
    dishes: [
      { emoji: '🥞', name: 'Fluffy Pancakes', orders: 189 },
      { emoji: '🥑', name: 'Eggs Benedict', orders: 156 }
    ]
  },
  {
    id: 'meze-republic', name: 'Meze Republic', emoji: '🥘', cuisine: 'Cypriot',
    price: '€€', city: 'Limassol', area: 'Old Town', score: 9.5,
    food: 4.8, service: 4.6, vibe: 4.5, value: 4.8, reviewCount: 534,
    gradient: 'linear-gradient(135deg, #3d2a0f, #1a1508)',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    tags: ['Cypriot', 'Traditional', '€€', 'Limassol'],
    category: ['trending', 'favourites'],
    venueType: ['dinner', 'lunch'],
    cuisineType: ['Cypriot', 'Greek', 'Meze', 'Mediterranean'],
    occasion: ['traditional', 'casual', 'hangout'],
    dietary: ['vegetarian'],
    hours: [
      { day: 'Mon', time: '12:00 – 22:00' }, { day: 'Tue', time: '12:00 – 22:00' },
      { day: 'Wed', time: '12:00 – 22:00', today: true }, { day: 'Thu', time: '12:00 – 23:00' },
      { day: 'Fri', time: '12:00 – 23:00' }, { day: 'Sat', time: '11:00 – 23:00' },
      { day: 'Sun', time: '11:00 – 21:00' }
    ],
    info: [{ icon: '📍', text: '31 Old Town, Limassol' }],
    dishes: [
      { emoji: '🥘', name: 'Mixed Meze', orders: 378 },
      { emoji: '🧀', name: 'Halloumi Platter', orders: 289 }
    ],
    distance: '1.1km'
  },
  {
    id: 'la-terrazza', name: 'La Terrazza', emoji: '🥂', cuisine: 'Italian',
   price: '€€€', city: 'Limassol', area: 'Marina', score: 8.9,
    food: 8.84, service: 4.3, vibe: 4.6, value: 3.9, reviewCount: 298,
    gradient: 'linear-gradient(135deg, #3d2a0f, #1a1508)',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    tags: ['Italian', 'Rooftop', '€€€', 'Limassol'],
    category: ['datenight'],
    venueType: ['dinner'],
    cuisineType: ['Italian', 'Mediterranean'],
    occasion: ['date night', 'romantic', 'upscale', 'trendy'],
    dietary: ['vegetarian'],
    hours: [
      { day: 'Mon', time: '18:00 – 23:00' }, { day: 'Tue', time: '18:00 – 23:00' },
      { day: 'Wed', time: '18:00 – 23:00', today: true }, { day: 'Thu', time: '18:00 – 00:00' },
      { day: 'Fri', time: '18:00 – 00:30' }, { day: 'Sat', time: '17:00 – 00:30' },
      { day: 'Sun', time: '17:00 – 22:00' }
    ],
    info: [{ icon: '📍', text: '9 Limassol Marina' }],
    dishes: [
      { emoji: '🍕', name: 'Truffle Pizza', orders: 167 },
      { emoji: '🥂', name: 'Prosecco Spritz', orders: 198 }
    ]
  },
  {
    id: 'kboo-bakery', name: 'Kboo Bakery', emoji: '🥐', cuisine: 'Bakery & Coffee',
    price: '€', city: 'Limassol', area: 'Germasogeia', score: 8.9,
    food: 4.5, service: 4.0, vibe: 4.2, value: 4.6, reviewCount: 345,
    gradient: 'linear-gradient(135deg, #2a0f3d, #1a081a)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    tags: ['Bakery', 'Coffee', '€', 'Limassol'],
    category: ['coffee'],
    venueType: ['bakery', 'coffee', 'breakfast', 'grab and go'],
    cuisineType: [],
    occasion: ['casual', 'hangout'],
    dietary: ['vegetarian'],
    hours: [
      { day: 'Mon', time: '07:00 – 17:00' }, { day: 'Tue', time: '07:00 – 17:00' },
      { day: 'Wed', time: '07:00 – 17:00', today: true }, { day: 'Thu', time: '07:00 – 17:00' },
      { day: 'Fri', time: '07:00 – 18:00' }, { day: 'Sat', time: '08:00 – 18:00' },
      { day: 'Sun', time: '08:00 – 15:00' }
    ],
    info: [{ icon: '📍', text: '5 Agiou Andreou, Limassol' }],
    dishes: [
      { emoji: '🥐', name: 'Butter Croissant', orders: 267 },
      { emoji: '🍞', name: 'Sourdough Loaf', orders: 189 }
    ]
  },
  {
    id: 'skyline-rooftop', name: 'Skyline Rooftop', emoji: '🌅', cuisine: 'Rooftop Bar',
    price: '€€€', city: 'Limassol', area: 'Tourist Area', score: 9.2,
    food: 8.5, service: 4.4, vibe: 5.0, value: 3.6, reviewCount: 198,
    gradient: 'linear-gradient(135deg, #0f2a3d, #081a1a)',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    tags: ['Rooftop', 'Bar', '€€€', 'Limassol'],
    category: ['bars'],
    venueType: ['bars'],
    cuisineType: [],
    occasion: ['trendy', 'date night', 'hangout', 'seaside'],
    dietary: [],
    hours: [
      { day: 'Mon', time: 'Closed', closed: true }, { day: 'Tue', time: '17:00 – 01:00' },
      { day: 'Wed', time: '17:00 – 01:00', today: true }, { day: 'Thu', time: '17:00 – 02:00' },
      { day: 'Fri', time: '17:00 – 03:00' }, { day: 'Sat', time: '16:00 – 03:00' },
      { day: 'Sun', time: '16:00 – 00:00' }
    ],
    info: [{ icon: '📍', text: 'Limassol Marina Tower' }],
    dishes: [
      { emoji: '🍸', name: 'Sunset Spritz', orders: 156 },
      { emoji: '🍷', name: 'Wine Flight', orders: 89 }
    ]
  },
  {
    id: 'napoli-express', name: 'Napoli Express', emoji: '🍕', cuisine: 'Pizza',
    price: '€€', city: 'Nicosia', area: 'Ledra Street', score: 8.6,
    food: 4.4, service: 3.8, vibe: 3.9, value: 4.5, reviewCount: 156,
    badge: '🆕 New', gradient: 'linear-gradient(135deg, #3d1e0f, #1a0f08)',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    tags: ['Pizza', 'Italian', '€€', 'Nicosia'],
    category: ['new'],
    venueType: ['dinner', 'lunch', 'grab and go'],
    cuisineType: ['Italian', 'Burgers'],
    occasion: ['casual', 'hangout'],
    dietary: ['vegetarian'],
    hours: [
      { day: 'Mon', time: '11:00 – 22:00' }, { day: 'Tue', time: '11:00 – 22:00' },
      { day: 'Wed', time: '11:00 – 22:00', today: true }, { day: 'Thu', time: '11:00 – 23:00' },
      { day: 'Fri', time: '11:00 – 23:30' }, { day: 'Sat', time: '11:00 – 23:30' },
      { day: 'Sun', time: '12:00 – 21:00' }
    ],
    info: [{ icon: '📍', text: '22 Ledra St, Nicosia' }],
    dishes: [
      { emoji: '🍕', name: 'Margherita DOP', orders: 134 },
      { emoji: '🍕', name: 'Diavola', orders: 98 }
    ]
  }
];

export const users: User[] = [
  {
    id: 'michel', name: 'Michel', handle: '@michel_bites', avatar: 'M',
    avatarGrad: 'linear-gradient(135deg, #FF6B35, #F5C542)',
    coverGrad: 'linear-gradient(135deg, #FF6B35, #C74B1A, #8B3010)',
    level: 8, xp: 2340, places: '142', followers: '1.2k', following: '384', reviewCount: '89',
    badges: [
      { icon: '☕', name: 'Coffee Expert', sub: '20+ cafes visited', date: 'Dec 2025' },
      { icon: '🍕', name: 'Pizza Hunter', sub: '15+ pizza spots', date: 'Jan 2026' },
      { icon: '🔥', name: '30-Day Streak', sub: 'Consistent reviewer', date: 'Feb 2026' }
    ],
    lists: [
      { emoji: '❤️', name: 'Favourites', count: '24 places' },
      { emoji: '🌅', name: 'Date Night CY', count: '12 places' },
      { emoji: '☕', name: 'Best Coffee', count: '18 places' },
      { emoji: '🔒', name: 'Secret Spots', count: '7 places', priv: true }
    ],
    visitedPlaces: ['bottega-amaro', 'istorja-cafe', 'meze-republic', 'koi-sushi', 'brunch-club', 'noir-bar', 'kboo-bakery', 'aigion', 'verde-kitchen', 'napoli-express', 'la-terrazza']
  },
  {
    id: 'sofia', name: 'Sofia K.', handle: '@sofia_eats', avatar: 'S',
    avatarGrad: 'linear-gradient(135deg, #FF6B35, #C74B1A)',
    coverGrad: 'linear-gradient(135deg, #C74B1A, #FF6B35, #F5C542)',
    level: 18, xp: 5890, places: '215', followers: '3.4k', following: '198', reviewCount: '178',
    badges: [
      { icon: '🍝', name: 'Pasta Pro', sub: '30+ Italian spots', date: 'Nov 2025' },
      { icon: '📸', name: 'Top Photographer', sub: '500+ food photos', date: 'Jan 2026' },
      { icon: '🔥', name: '90-Day Streak', sub: 'On fire!', date: 'Mar 2026' }
    ],
    lists: [
      { emoji: '🇮🇹', name: 'Best Italian CY', count: '18 places' },
      { emoji: '📸', name: 'Most Instagrammable', count: '22 places' },
      { emoji: '🍷', name: 'Wine Bars', count: '9 places' },
      { emoji: '💰', name: 'Cheap Eats Limassol', count: '14 places' }
    ],
    tags: ['🍝 Italian', '📸 Photography'],
    visitedPlaces: ['bottega-amaro', 'aigion', 'la-terrazza', 'seaside-lounge', 'meze-republic', 'koi-sushi', 'noir-bar', 'skyline-rooftop', 'brunch-club', 'istorja-cafe', 'grill-house', 'napoli-express', 'verde-kitchen']
  },
  {
    id: 'elena', name: 'Elena P.', handle: '@elena_adventures', avatar: 'E',
    avatarGrad: 'linear-gradient(135deg, #F472B6, #EC4899)',
    coverGrad: 'linear-gradient(135deg, #EC4899, #F472B6, #F9A8D4)',
    level: 14, xp: 4120, places: '163', followers: '2.1k', following: '276', reviewCount: '124',
    badges: [
      { icon: '🌊', name: 'Seafood Lover', sub: '25+ seafood spots', date: 'Oct 2025' },
      { icon: '🌅', name: 'Sunset Chaser', sub: 'Outdoor dining pro', date: 'Dec 2025' },
      { icon: '✨', name: 'Top Reviewer', sub: 'Top 5% in Paphos', date: 'Feb 2026' }
    ],
    lists: [
      { emoji: '🌅', name: 'Sunset Dining', count: '13 places' },
      { emoji: '🌊', name: 'Harbour Favourites', count: '9 places' },
      { emoji: '🥂', name: 'Special Occasions', count: '7 places' },
      { emoji: '🐙', name: 'Best Seafood CY', count: '11 places' }
    ],
    tags: ['🌊 Seafood', '🌅 Sunset'],
    visitedPlaces: ['seaside-lounge', 'aigion', 'bottega-amaro', 'grill-house', 'la-terrazza', 'skyline-rooftop', 'noir-bar', 'meze-republic']
  },
  {
    id: 'andreas', name: 'Andreas M.', handle: '@andreas_m', avatar: 'A',
    avatarGrad: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
    coverGrad: 'linear-gradient(135deg, #3B82F6, #60A5FA, #93C5FD)',
    level: 9, xp: 3750, places: '87', followers: '642', following: '312', reviewCount: '56',
    badges: [
      { icon: '☕', name: 'Caffeine Addict', sub: '40+ cafes visited', date: 'Sep 2025' },
      { icon: '💻', name: 'Remote Worker', sub: 'WiFi hunter', date: 'Nov 2025' },
      { icon: '🌱', name: 'Plant Based', sub: '15+ vegan spots', date: 'Jan 2026' }
    ],
    lists: [
      { emoji: '☕', name: 'Best Flat Whites', count: '11 places' },
      { emoji: '💻', name: 'Work-Friendly Cafes', count: '16 places' },
      { emoji: '🌱', name: 'Vegan Nicosia', count: '8 places' }
    ],
    tags: ['☕ Coffee', '💻 Remote Work'],
    visitedPlaces: ['istorja-cafe', 'kboo-bakery', 'verde-kitchen', 'brunch-club', 'bottega-amaro', 'napoli-express']
  }
];

export const reviews: Review[] = [
  {
    id: 'michel_meze', userId: 'michel', venueId: 'meze-republic',
    overall: 9.5, food: 5.0, service: 4.5, vibe: 4.5, value: 5.0,
    text: 'Absolutely incredible meze experience. The halloumi was perfectly grilled with that golden crust, and the mixed meze platter had at least 15 different dishes. Best traditional Cypriot food I\'ve had in Limassol.',
    time: '1 day ago', photos: [
      { emoji: '🥘', bg: 'linear-gradient(135deg,#3d2a0f,#1a1508)' },
      { emoji: '🧀', bg: 'linear-gradient(135deg,#3d1e0f,#1a0f08)' }
    ],
    dishes: ['🥘 Mixed Meze', '🧀 Halloumi Platter'],
    details: ['🌙 Dinner', '👨‍👩‍👧 Family'],
    friends: [{ initial: 'S', bg: 'linear-gradient(135deg,#FF6B35,#C74B1A)', name: 'Sofia' }]
  },
  {
    id: 'michel_istorja', userId: 'michel', venueId: 'istorja-cafe',
    overall: 9.0, food: 4.5, service: 4.5, vibe: 5.0, value: 4.5,
    text: 'My go-to cafe in Limassol. The flat white is consistently excellent and the almond croissant is flaky perfection. Love the minimalist interior and the natural light.',
    time: '3 days ago', photos: [
      { emoji: '☕', bg: 'linear-gradient(135deg,#1a2a0f,#0f1a08)' }
    ],
    dishes: ['☕ Flat White', '🥐 Almond Croissant'],
    details: ['☀️ Morning', '💻 Solo Work'],
    friends: []
  },
  {
    id: 'michel_bottega', userId: 'michel', venueId: 'bottega-amaro',
    overall: 9.2, food: 4.8, service: 4.0, vibe: 4.8, value: 3.8,
    text: 'The truffle pappardelle here is a religious experience. Rich, earthy, and perfectly al dente. The osso buco was fall-off-the-bone tender. Only downside is the wait time on weekends.',
    time: '1 week ago', photos: [
      { emoji: '🍝', bg: 'linear-gradient(135deg,#3d1e0f,#1a0f08)' },
      { emoji: '🥩', bg: 'linear-gradient(135deg,#2a0f1a,#1a0810)' }
    ],
    dishes: ['🍝 Truffle Pappardelle', '🥩 Osso Buco', '🍰 Tiramisu'],
    details: ['🌙 Dinner', '👫 Date Night'],
    friends: [{ initial: 'E', bg: 'linear-gradient(135deg,#F472B6,#EC4899)', name: 'Elena' }]
  },
  {
    id: 'sofia_bottega', userId: 'sofia', venueId: 'bottega-amaro',
    overall: 9.0, food: 4.5, service: 3.5, vibe: 4.5, value: 3.5,
    text: 'The truffle pasta was out of this world — genuinely the best I\'ve had on the island. The handmade pappardelle was cooked to perfection, and the truffle shavings were generous.',
    time: '2 hours ago', photos: [
      { emoji: '🍝', bg: 'linear-gradient(135deg,#3d2a0f,#1a1508)' },
      { emoji: '🍷', bg: 'linear-gradient(135deg,#3d0f1a,#1a0810)' }
    ],
    dishes: ['🍝 Truffle Pappardelle', '🍷 House Chianti', '🍰 Tiramisu'],
    details: ['🌙 Dinner', '👫 Date Night'],
    friends: [{ initial: 'M', bg: 'linear-gradient(135deg,#FF6B35,#F5C542)', name: 'Michel' }]
  },
  {
    id: 'andreas_istorja', userId: 'andreas', venueId: 'istorja-cafe',
    overall: 8.5, food: 4.0, service: null, vibe: 4.5, value: 5.0,
    text: 'Best flat white on the island, hands down. They use specialty beans from a small roaster in Athens and you can really taste the difference.',
    time: '5 hours ago', photos: [
      { emoji: '☕', bg: 'linear-gradient(135deg,#1a0f08,#0f0805)' },
      { emoji: '🥐', bg: 'linear-gradient(135deg,#3d2a0f,#1a1508)' }
    ],
    dishes: ['☕ Flat White', '🥐 Almond Croissant'],
    details: ['☀️ Morning', '💻 Solo Work'],
    friends: []
  },
  {
    id: 'elena_seaside', userId: 'elena', venueId: 'seaside-lounge',
    overall: 8.0, food: 4.5, service: 4.5, vibe: 5.0, value: 3.5,
    text: 'Sunset dinner was absolutely magical. We arrived around 6pm and got a table right on the terrace overlooking the harbour.',
    time: 'Yesterday', photos: [
      { emoji: '🐙', bg: 'linear-gradient(135deg,#2a0f1a,#1a0810)' },
      { emoji: '🐟', bg: 'linear-gradient(135deg,#0f2a3d,#081a1a)' }
    ],
    dishes: ['🐙 Grilled Octopus', '🐟 Whole Sea Bass', '🥗 Greek Salad'],
    details: ['🌙 Dinner', '👫 Date Night', '🌅 Outdoor'],
    friends: [
      { initial: 'K', bg: 'linear-gradient(135deg,#F5C542,#FF6B35)', name: 'Kostas' },
      { initial: 'M', bg: 'linear-gradient(135deg,#4ADE80,#22C55E)', name: 'Maria' }
    ]
  }
];

export const leaderboard = [
  { userId: 'sofia', rank: 1, xp: 5890 },
  { userId: 'elena', rank: 2, xp: 4120 },
  { userId: 'andreas', rank: 3, xp: 3750 },
  { userId: 'nikos', rank: 4, xp: 3210, name: 'Nikos T.', handle: '@nikos_eats', level: 11, avatar: 'N', grad: 'linear-gradient(135deg,#F5C542,#D4A72C)' },
  { userId: 'maria', rank: 5, xp: 2980, name: 'Maria L.', handle: '@maria_bakes', level: 16, avatar: 'M', grad: 'linear-gradient(135deg,#4ADE80,#22C55E)' },
  { userId: 'kostas', rank: 6, xp: 2750, name: 'Kostas D.', handle: '@kostas_gourmet', level: 20, avatar: 'K', grad: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
  { userId: 'michel', rank: 7, xp: 2340 },
];

export function getVenue(id: string): Venue | undefined {
  return venues.find(v => v.id === id);
}

export function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getVenuesByCategory(cat: string): Venue[] {
  return venues.filter(v => v.category.includes(cat));
}

/**
 * Calculate Taste Match score between two users.
 * Based on the Jaccard similarity of their visited/logged places.
 * Returns a percentage (0–100) — the higher, the closer their taste.
 */
export function getTasteMatch(userIdA: string, userIdB: string): { percentage: number; sharedPlaces: string[]; totalUnion: number } {
  const a = getUser(userIdA);
  const b = getUser(userIdB);
  if (!a || !b) return { percentage: 0, sharedPlaces: [], totalUnion: 0 };

  const setA = new Set(a.visitedPlaces);
  const setB = new Set(b.visitedPlaces);

  const shared = a.visitedPlaces.filter(p => setB.has(p));
  const union = new Set([...a.visitedPlaces, ...b.visitedPlaces]);

  const raw = union.size > 0 ? (shared.length / union.size) * 100 : 0;
  // Scale up for more meaningful display (Jaccard tends to be low)
  const scaled = Math.min(Math.round(raw * 2.2 + 15), 98);

  return { percentage: scaled, sharedPlaces: shared, totalUnion: union.size };
}

// ── Dish Catalog ──────────────────────────────────────────────────
export interface CatalogDish {
  emoji: string;
  name: string;
  category: string; // e.g. 'Starter', 'Main', 'Dessert', 'Drink'
}

export interface CuisineDishCatalog {
  cuisine: string;
  dishes: CatalogDish[];
}

export const dishCatalog: CuisineDishCatalog[] = [
  {
    cuisine: 'Italian',
    dishes: [
      { emoji: '🍝', name: 'Truffle Pappardelle', category: 'Main' },
      { emoji: '🍝', name: 'Spaghetti Carbonara', category: 'Main' },
      { emoji: '🍝', name: 'Cacio e Pepe', category: 'Main' },
      { emoji: '🍝', name: 'Linguine alle Vongole', category: 'Main' },
      { emoji: '🍝', name: 'Penne Arrabbiata', category: 'Main' },
      { emoji: '🍝', name: 'Fettuccine Alfredo', category: 'Main' },
      { emoji: '🍝', name: 'Bolognese Ragu', category: 'Main' },
      { emoji: '🍕', name: 'Margherita DOP', category: 'Main' },
      { emoji: '🍕', name: 'Truffle Pizza', category: 'Main' },
      { emoji: '🍕', name: 'Diavola', category: 'Main' },
      { emoji: '🍕', name: 'Quattro Formaggi', category: 'Main' },
      { emoji: '🍕', name: 'Prosciutto e Rucola', category: 'Main' },
      { emoji: '🥩', name: 'Osso Buco', category: 'Main' },
      { emoji: '🥩', name: 'Veal Milanese', category: 'Main' },
      { emoji: '🐟', name: 'Branzino al Forno', category: 'Main' },
      { emoji: '🥗', name: 'Caprese Salad', category: 'Starter' },
      { emoji: '🧀', name: 'Burrata', category: 'Starter' },
      { emoji: '🫒', name: 'Bruschetta', category: 'Starter' },
      { emoji: '🍖', name: 'Antipasto Misto', category: 'Starter' },
      { emoji: '🫕', name: 'Minestrone Soup', category: 'Starter' },
      { emoji: '🍰', name: 'Tiramisu', category: 'Dessert' },
      { emoji: '🍮', name: 'Panna Cotta', category: 'Dessert' },
      { emoji: '🍨', name: 'Affogato', category: 'Dessert' },
      { emoji: '🍰', name: 'Cannoli', category: 'Dessert' },
      { emoji: '🍷', name: 'Chianti', category: 'Drink' },
      { emoji: '🥂', name: 'Prosecco Spritz', category: 'Drink' },
      { emoji: '🍋', name: 'Limoncello', category: 'Drink' },
      { emoji: '☕', name: 'Espresso', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Japanese',
    dishes: [
      { emoji: '🍣', name: 'Dragon Roll', category: 'Main' },
      { emoji: '🍣', name: 'Salmon Nigiri', category: 'Main' },
      { emoji: '🍣', name: 'Tuna Sashimi', category: 'Main' },
      { emoji: '🍣', name: 'Rainbow Roll', category: 'Main' },
      { emoji: '🍣', name: 'Spicy Tuna Roll', category: 'Main' },
      { emoji: '🍣', name: 'Eel Avocado Roll', category: 'Main' },
      { emoji: '🍱', name: 'Omakase Set', category: 'Main' },
      { emoji: '🍱', name: 'Bento Box', category: 'Main' },
      { emoji: '🍜', name: 'Miso Ramen', category: 'Main' },
      { emoji: '🍜', name: 'Tonkotsu Ramen', category: 'Main' },
      { emoji: '🍜', name: 'Udon Noodles', category: 'Main' },
      { emoji: '🍛', name: 'Katsu Curry', category: 'Main' },
      { emoji: '🍚', name: 'Chirashi Bowl', category: 'Main' },
      { emoji: '🥟', name: 'Gyoza', category: 'Starter' },
      { emoji: '🍢', name: 'Yakitori Skewers', category: 'Starter' },
      { emoji: '🥗', name: 'Seaweed Salad', category: 'Starter' },
      { emoji: '🫘', name: 'Edamame', category: 'Starter' },
      { emoji: '🍤', name: 'Tempura Prawns', category: 'Starter' },
      { emoji: '🍡', name: 'Mochi Ice Cream', category: 'Dessert' },
      { emoji: '🍮', name: 'Matcha Cheesecake', category: 'Dessert' },
      { emoji: '🍵', name: 'Matcha Latte', category: 'Drink' },
      { emoji: '🍶', name: 'Sake', category: 'Drink' },
      { emoji: '🍺', name: 'Asahi Beer', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Cafe',
    dishes: [
      { emoji: '☕', name: 'Flat White', category: 'Drink' },
      { emoji: '☕', name: 'Cappuccino', category: 'Drink' },
      { emoji: '☕', name: 'Latte', category: 'Drink' },
      { emoji: '☕', name: 'Americano', category: 'Drink' },
      { emoji: '☕', name: 'Espresso', category: 'Drink' },
      { emoji: '☕', name: 'Cortado', category: 'Drink' },
      { emoji: '☕', name: 'Cold Brew', category: 'Drink' },
      { emoji: '☕', name: 'Iced Latte', category: 'Drink' },
      { emoji: '🍵', name: 'Matcha Latte', category: 'Drink' },
      { emoji: '🍵', name: 'Chai Latte', category: 'Drink' },
      { emoji: '🧃', name: 'Fresh Orange Juice', category: 'Drink' },
      { emoji: '🥐', name: 'Almond Croissant', category: 'Main' },
      { emoji: '🥐', name: 'Butter Croissant', category: 'Main' },
      { emoji: '🥐', name: 'Pain au Chocolat', category: 'Main' },
      { emoji: '🥑', name: 'Avo Toast', category: 'Main' },
      { emoji: '🥪', name: 'Club Sandwich', category: 'Main' },
      { emoji: '🥗', name: 'Caesar Salad', category: 'Main' },
      { emoji: '🍰', name: 'Carrot Cake', category: 'Dessert' },
      { emoji: '🍰', name: 'Cheesecake', category: 'Dessert' },
      { emoji: '🍪', name: 'Chocolate Chip Cookie', category: 'Dessert' },
      { emoji: '🧁', name: 'Blueberry Muffin', category: 'Dessert' },
    ]
  },
  {
    cuisine: 'Steakhouse',
    dishes: [
      { emoji: '🥩', name: 'Wagyu Ribeye', category: 'Main' },
      { emoji: '🥩', name: 'Filet Mignon', category: 'Main' },
      { emoji: '🥩', name: 'T-Bone Steak', category: 'Main' },
      { emoji: '🥩', name: 'NY Strip', category: 'Main' },
      { emoji: '🥩', name: 'Tomahawk Steak', category: 'Main' },
      { emoji: '🥩', name: 'Lamb Chops', category: 'Main' },
      { emoji: '🍔', name: 'Wagyu Burger', category: 'Main' },
      { emoji: '🍟', name: 'Truffle Fries', category: 'Side' },
      { emoji: '🥔', name: 'Loaded Baked Potato', category: 'Side' },
      { emoji: '🥗', name: 'Caesar Salad', category: 'Starter' },
      { emoji: '🦐', name: 'Shrimp Cocktail', category: 'Starter' },
      { emoji: '🧅', name: 'Onion Rings', category: 'Side' },
      { emoji: '🥦', name: 'Creamed Spinach', category: 'Side' },
      { emoji: '🍰', name: 'Chocolate Lava Cake', category: 'Dessert' },
      { emoji: '🍷', name: 'Cabernet Sauvignon', category: 'Drink' },
      { emoji: '🥃', name: 'Old Fashioned', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Mediterranean',
    dishes: [
      { emoji: '🐙', name: 'Grilled Octopus', category: 'Starter' },
      { emoji: '🐟', name: 'Sea Bass Ceviche', category: 'Starter' },
      { emoji: '🐟', name: 'Whole Sea Bass', category: 'Main' },
      { emoji: '🐟', name: 'Grilled Dorade', category: 'Main' },
      { emoji: '🦐', name: 'Prawn Saganaki', category: 'Main' },
      { emoji: '🥗', name: 'Greek Salad', category: 'Starter' },
      { emoji: '🧀', name: 'Halloumi', category: 'Starter' },
      { emoji: '🫒', name: 'Hummus & Pita', category: 'Starter' },
      { emoji: '🍖', name: 'Lamb Kleftiko', category: 'Main' },
      { emoji: '🍖', name: 'Souvlaki Platter', category: 'Main' },
      { emoji: '🥘', name: 'Moussaka', category: 'Main' },
      { emoji: '🍰', name: 'Baklava', category: 'Dessert' },
      { emoji: '🍷', name: 'House Wine', category: 'Drink' },
      { emoji: '🍋', name: 'Fresh Lemonade', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Seafood',
    dishes: [
      { emoji: '🐙', name: 'Grilled Octopus', category: 'Starter' },
      { emoji: '🐟', name: 'Whole Sea Bass', category: 'Main' },
      { emoji: '🐟', name: 'Grilled Salmon', category: 'Main' },
      { emoji: '🦞', name: 'Lobster Thermidor', category: 'Main' },
      { emoji: '🦐', name: 'Garlic Prawns', category: 'Main' },
      { emoji: '🦀', name: 'Crab Cakes', category: 'Starter' },
      { emoji: '🦪', name: 'Fresh Oysters', category: 'Starter' },
      { emoji: '🥗', name: 'Seafood Salad', category: 'Starter' },
      { emoji: '🍝', name: 'Seafood Linguine', category: 'Main' },
      { emoji: '🍚', name: 'Seafood Risotto', category: 'Main' },
      { emoji: '🍟', name: 'Calamari Fritti', category: 'Starter' },
      { emoji: '🍰', name: 'Key Lime Pie', category: 'Dessert' },
      { emoji: '🍷', name: 'Chablis', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Vegan',
    dishes: [
      { emoji: '🥑', name: 'Avo Toast', category: 'Main' },
      { emoji: '🥗', name: 'Buddha Bowl', category: 'Main' },
      { emoji: '🥗', name: 'Quinoa Power Bowl', category: 'Main' },
      { emoji: '🌮', name: 'Jackfruit Tacos', category: 'Main' },
      { emoji: '🍔', name: 'Beyond Burger', category: 'Main' },
      { emoji: '🥙', name: 'Falafel Wrap', category: 'Main' },
      { emoji: '🍝', name: 'Mushroom Pasta', category: 'Main' },
      { emoji: '🫕', name: 'Lentil Soup', category: 'Starter' },
      { emoji: '🥗', name: 'Kale Caesar', category: 'Starter' },
      { emoji: '🫘', name: 'Edamame Hummus', category: 'Starter' },
      { emoji: '🍠', name: 'Sweet Potato Fries', category: 'Side' },
      { emoji: '🍰', name: 'Vegan Brownie', category: 'Dessert' },
      { emoji: '🥤', name: 'Green Smoothie', category: 'Drink' },
      { emoji: '🧃', name: 'Kombucha', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Cocktails',
    dishes: [
      { emoji: '🍸', name: 'Noir Old Fashioned', category: 'Drink' },
      { emoji: '🍸', name: 'Classic Martini', category: 'Drink' },
      { emoji: '🍸', name: 'Negroni', category: 'Drink' },
      { emoji: '🍸', name: 'Manhattan', category: 'Drink' },
      { emoji: '🍹', name: 'Passion Sour', category: 'Drink' },
      { emoji: '🍹', name: 'Mojito', category: 'Drink' },
      { emoji: '🍹', name: 'Margarita', category: 'Drink' },
      { emoji: '🍹', name: 'Espresso Martini', category: 'Drink' },
      { emoji: '🍹', name: 'Aperol Spritz', category: 'Drink' },
      { emoji: '🍹', name: 'Daiquiri', category: 'Drink' },
      { emoji: '🥃', name: 'Whiskey Sour', category: 'Drink' },
      { emoji: '🍷', name: 'Glass of Wine', category: 'Drink' },
      { emoji: '🍺', name: 'Craft Beer', category: 'Drink' },
      { emoji: '🥜', name: 'Mixed Nuts', category: 'Snack' },
      { emoji: '🧀', name: 'Cheese Board', category: 'Snack' },
      { emoji: '🫒', name: 'Marinated Olives', category: 'Snack' },
    ]
  },
  {
    cuisine: 'Brunch',
    dishes: [
      { emoji: '🥞', name: 'Fluffy Pancakes', category: 'Main' },
      { emoji: '🥞', name: 'French Toast', category: 'Main' },
      { emoji: '🥑', name: 'Eggs Benedict', category: 'Main' },
      { emoji: '🥑', name: 'Avo Smash', category: 'Main' },
      { emoji: '🍳', name: 'Full English', category: 'Main' },
      { emoji: '🍳', name: 'Shakshuka', category: 'Main' },
      { emoji: '🍳', name: 'Eggs Royale', category: 'Main' },
      { emoji: '🥐', name: 'Croissant Sandwich', category: 'Main' },
      { emoji: '🥗', name: 'Acai Bowl', category: 'Main' },
      { emoji: '🥗', name: 'Granola & Yogurt', category: 'Main' },
      { emoji: '🧇', name: 'Belgian Waffles', category: 'Main' },
      { emoji: '🥤', name: 'Fresh Smoothie', category: 'Drink' },
      { emoji: '🧃', name: 'Fresh OJ', category: 'Drink' },
      { emoji: '☕', name: 'Flat White', category: 'Drink' },
      { emoji: '🥂', name: 'Mimosa', category: 'Drink' },
      { emoji: '🍹', name: 'Bloody Mary', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Cypriot',
    dishes: [
      { emoji: '🥘', name: 'Mixed Meze', category: 'Main' },
      { emoji: '🧀', name: 'Halloumi Platter', category: 'Starter' },
      { emoji: '🧀', name: 'Grilled Halloumi', category: 'Starter' },
      { emoji: '🫒', name: 'Hummus', category: 'Starter' },
      { emoji: '🫒', name: 'Tzatziki', category: 'Starter' },
      { emoji: '🫒', name: 'Tahini', category: 'Starter' },
      { emoji: '🍖', name: 'Souvlaki', category: 'Main' },
      { emoji: '🍖', name: 'Lamb Kleftiko', category: 'Main' },
      { emoji: '🍖', name: 'Sheftalia', category: 'Main' },
      { emoji: '🥗', name: 'Village Salad', category: 'Starter' },
      { emoji: '🐙', name: 'Grilled Octopus', category: 'Starter' },
      { emoji: '🍖', name: 'Koupepia', category: 'Main' },
      { emoji: '🍰', name: 'Baklava', category: 'Dessert' },
      { emoji: '🍮', name: 'Galaktoboureko', category: 'Dessert' },
      { emoji: '🍷', name: 'Commandaria', category: 'Drink' },
      { emoji: '🍺', name: 'KEO Beer', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Bakery & Coffee',
    dishes: [
      { emoji: '🥐', name: 'Butter Croissant', category: 'Main' },
      { emoji: '🥐', name: 'Almond Croissant', category: 'Main' },
      { emoji: '🥐', name: 'Pain au Chocolat', category: 'Main' },
      { emoji: '🍞', name: 'Sourdough Loaf', category: 'Main' },
      { emoji: '🍞', name: 'Focaccia', category: 'Main' },
      { emoji: '🥖', name: 'Baguette', category: 'Main' },
      { emoji: '🧁', name: 'Blueberry Muffin', category: 'Main' },
      { emoji: '🍩', name: 'Cinnamon Donut', category: 'Dessert' },
      { emoji: '🍰', name: 'Lemon Drizzle Cake', category: 'Dessert' },
      { emoji: '🍪', name: 'Chocolate Chip Cookie', category: 'Dessert' },
      { emoji: '☕', name: 'Flat White', category: 'Drink' },
      { emoji: '☕', name: 'Cappuccino', category: 'Drink' },
      { emoji: '☕', name: 'Americano', category: 'Drink' },
      { emoji: '🍵', name: 'Matcha Latte', category: 'Drink' },
    ]
  },
  {
    cuisine: 'Rooftop Bar',
    dishes: [
      { emoji: '🍸', name: 'Sunset Spritz', category: 'Drink' },
      { emoji: '🍷', name: 'Wine Flight', category: 'Drink' },
      { emoji: '🍸', name: 'Espresso Martini', category: 'Drink' },
      { emoji: '🍹', name: 'Aperol Spritz', category: 'Drink' },
      { emoji: '🍹', name: 'Mojito', category: 'Drink' },
      { emoji: '🍸', name: 'Negroni', category: 'Drink' },
      { emoji: '🍺', name: 'Craft Beer', category: 'Drink' },
      { emoji: '🥂', name: 'Champagne', category: 'Drink' },
      { emoji: '🧀', name: 'Cheese Board', category: 'Snack' },
      { emoji: '🫒', name: 'Marinated Olives', category: 'Snack' },
      { emoji: '🍖', name: 'Charcuterie', category: 'Snack' },
      { emoji: '🍤', name: 'Prawn Tempura', category: 'Snack' },
    ]
  },
  {
    cuisine: 'Pizza',
    dishes: [
      { emoji: '🍕', name: 'Margherita DOP', category: 'Main' },
      { emoji: '🍕', name: 'Diavola', category: 'Main' },
      { emoji: '🍕', name: 'Quattro Formaggi', category: 'Main' },
      { emoji: '🍕', name: 'Truffle Pizza', category: 'Main' },
      { emoji: '🍕', name: 'Prosciutto e Rucola', category: 'Main' },
      { emoji: '🍕', name: 'Pepperoni', category: 'Main' },
      { emoji: '🍕', name: 'Calzone', category: 'Main' },
      { emoji: '🍕', name: 'Marinara', category: 'Main' },
      { emoji: '🥗', name: 'Caprese Salad', category: 'Starter' },
      { emoji: '🫒', name: 'Bruschetta', category: 'Starter' },
      { emoji: '🍟', name: 'Garlic Bread', category: 'Starter' },
      { emoji: '🍰', name: 'Tiramisu', category: 'Dessert' },
      { emoji: '🍺', name: 'Italian Beer', category: 'Drink' },
      { emoji: '🍷', name: 'House Red', category: 'Drink' },
    ]
  },
];

/**
 * Get relevant dishes for a venue based on its cuisine type.
 * Returns the venue's own dishes first, then additional dishes from the matching cuisine catalog.
 */
export function getDishesForVenue(venueId: string): { suggested: CatalogDish[]; catalog: CatalogDish[] } {
  const venue = getVenue(venueId);
  if (!venue) return { suggested: [], catalog: [] };

  // Find matching cuisine catalog(s)
  const cuisineMatch = dishCatalog.find(c => c.cuisine.toLowerCase() === venue.cuisine.toLowerCase());
  
  // Also try partial matches for combined cuisines like "Bakery & Coffee"
  const partialMatches = dishCatalog.filter(c => 
    venue.cuisine.toLowerCase().includes(c.cuisine.toLowerCase()) ||
    c.cuisine.toLowerCase().includes(venue.cuisine.toLowerCase())
  );

  const matchedCatalog = cuisineMatch || partialMatches[0];

  // Venue's own dishes as suggested
  const suggested: CatalogDish[] = venue.dishes.map(d => ({
    emoji: d.emoji,
    name: d.name,
    category: 'Popular',
  }));

  // Additional dishes from the catalog (excluding ones already in venue dishes)
  const venueNames = new Set(venue.dishes.map(d => d.name.toLowerCase()));
  const catalog: CatalogDish[] = matchedCatalog
    ? matchedCatalog.dishes.filter(d => !venueNames.has(d.name.toLowerCase()))
    : [];

  return { suggested, catalog };
}

/**
 * Get all unique dishes across all cuisines for the full catalog search.
 */
export function getAllDishes(): CatalogDish[] {
  const seen = new Set<string>();
  const all: CatalogDish[] = [];
  for (const cuisine of dishCatalog) {
    for (const dish of cuisine.dishes) {
      const key = dish.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        all.push(dish);
      }
    }
  }
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

// ── Curated Lists with venue mappings ─────────────────────────────
export interface CuratedList {
  id: string;
  emoji: string;
  name: string;
  description: string;
  by: string;       // user ID or 'editors'
  byName: string;   // display name
  venueIds: string[];
  saves: string;
  isPrivate?: boolean;
}

export const curatedLists: CuratedList[] = [
  // Michel's lists
  {
    id: 'michel-favourites', emoji: '❤️', name: 'Favourites',
    description: 'My all-time favourite spots in Cyprus',
    by: 'michel', byName: 'Michel',
    venueIds: ['bottega-amaro', 'meze-republic', 'istorja-cafe', 'koi-sushi', 'aigion', 'noir-bar', 'skyline-rooftop', 'kboo-bakery', 'brunch-club', 'la-terrazza', 'grill-house', 'seaside-lounge', 'verde-kitchen', 'napoli-express'],
    saves: '—',
  },
  {
    id: 'michel-datenight', emoji: '🌅', name: 'Date Night CY',
    description: 'Romantic spots perfect for a special evening',
    by: 'michel', byName: 'Michel',
    venueIds: ['bottega-amaro', 'aigion', 'seaside-lounge', 'la-terrazza', 'noir-bar', 'skyline-rooftop'],
    saves: '342',
  },
  {
    id: 'michel-coffee', emoji: '☕', name: 'Best Coffee',
    description: 'The best flat whites and specialty coffee on the island',
    by: 'michel', byName: 'Michel',
    venueIds: ['istorja-cafe', 'kboo-bakery', 'brunch-club', 'verde-kitchen'],
    saves: '189',
  },
  {
    id: 'michel-secret', emoji: '🔒', name: 'Secret Spots',
    description: 'Hidden gems only locals know about',
    by: 'michel', byName: 'Michel',
    venueIds: ['meze-republic', 'kboo-bakery', 'verde-kitchen'],
    saves: '—', isPrivate: true,
  },
  // Sofia's lists
  {
    id: 'sofia-italian', emoji: '🇮🇹', name: 'Best Italian CY',
    description: 'The finest Italian restaurants across Cyprus',
    by: 'sofia', byName: 'Sofia K.',
    venueIds: ['bottega-amaro', 'la-terrazza', 'napoli-express', 'aigion', 'seaside-lounge', 'meze-republic', 'koi-sushi', 'grill-house'],
    saves: '1.8k',
  },
  {
    id: 'sofia-insta', emoji: '📸', name: 'Most Instagrammable',
    description: 'Stunning interiors and plating worth photographing',
    by: 'sofia', byName: 'Sofia K.',
    venueIds: ['bottega-amaro', 'aigion', 'skyline-rooftop', 'noir-bar', 'koi-sushi', 'istorja-cafe', 'seaside-lounge', 'la-terrazza', 'brunch-club', 'verde-kitchen'],
    saves: '2.4k',
  },
  {
    id: 'sofia-wine', emoji: '🍷', name: 'Wine Bars',
    description: 'Best wine selections and cozy wine bar vibes',
    by: 'sofia', byName: 'Sofia K.',
    venueIds: ['bottega-amaro', 'aigion', 'la-terrazza', 'noir-bar', 'skyline-rooftop'],
    saves: '876',
  },
  {
    id: 'sofia-cheap', emoji: '💰', name: 'Cheap Eats Limassol',
    description: 'Delicious food that won\'t break the bank',
    by: 'sofia', byName: 'Sofia K.',
    venueIds: ['napoli-express', 'meze-republic', 'kboo-bakery', 'verde-kitchen', 'brunch-club', 'istorja-cafe'],
    saves: '3.1k',
  },
  // Elena's lists
  {
    id: 'elena-sunset', emoji: '🌅', name: 'Sunset Dining',
    description: 'Best spots to watch the sunset while dining',
    by: 'elena', byName: 'Elena P.',
    venueIds: ['seaside-lounge', 'aigion', 'skyline-rooftop', 'la-terrazza', 'bottega-amaro', 'grill-house'],
    saves: '1.2k',
  },
  {
    id: 'elena-harbour', emoji: '🌊', name: 'Harbour Favourites',
    description: 'Waterfront dining at its finest',
    by: 'elena', byName: 'Elena P.',
    venueIds: ['seaside-lounge', 'aigion', 'meze-republic', 'grill-house'],
    saves: '654',
  },
  {
    id: 'elena-special', emoji: '🥂', name: 'Special Occasions',
    description: 'Where to celebrate life\'s big moments',
    by: 'elena', byName: 'Elena P.',
    venueIds: ['bottega-amaro', 'aigion', 'skyline-rooftop', 'grill-house'],
    saves: '432',
  },
  {
    id: 'elena-seafood', emoji: '🐙', name: 'Best Seafood CY',
    description: 'Fresh catches and ocean-to-table dining',
    by: 'elena', byName: 'Elena P.',
    venueIds: ['seaside-lounge', 'aigion', 'meze-republic', 'grill-house', 'bottega-amaro'],
    saves: '987',
  },
  // Andreas's lists
  {
    id: 'andreas-flatwhite', emoji: '☕', name: 'Best Flat Whites',
    description: 'Tracking down the perfect flat white across Cyprus',
    by: 'andreas', byName: 'Andreas M.',
    venueIds: ['istorja-cafe', 'kboo-bakery', 'brunch-club', 'verde-kitchen'],
    saves: '956',
  },
  {
    id: 'andreas-work', emoji: '💻', name: 'Work-Friendly Cafes',
    description: 'Great WiFi, good coffee, and power outlets',
    by: 'andreas', byName: 'Andreas M.',
    venueIds: ['istorja-cafe', 'kboo-bakery', 'verde-kitchen', 'brunch-club'],
    saves: '1.4k',
  },
  {
    id: 'andreas-vegan', emoji: '🌱', name: 'Vegan Nicosia',
    description: 'Plant-based options in and around Nicosia',
    by: 'andreas', byName: 'Andreas M.',
    venueIds: ['verde-kitchen', 'koi-sushi', 'istorja-cafe'],
    saves: '523',
  },
  // Editor lists (for Search > Lists tab)
  {
    id: 'editors-burgers', emoji: '🔥', name: 'Top 10 Burgers Limassol',
    description: 'Our editors\' picks for the hottest burgers in town',
    by: 'editors', byName: 'Bites Editors',
    venueIds: ['grill-house', 'meze-republic', 'brunch-club', 'napoli-express', 'verde-kitchen', 'seaside-lounge'],
    saves: '2.3k',
  },
];

/**
 * Find a curated list by matching user ID + list name (for user profile lists).
 * Falls back to partial name matching.
 */
export function findListForUser(userId: string, listName: string): CuratedList | undefined {
  // Exact match by user + name
  const exact = curatedLists.find(l => l.by === userId && l.name === listName);
  if (exact) return exact;
  // Partial match
  const partial = curatedLists.find(l => l.by === userId && l.name.toLowerCase().includes(listName.toLowerCase()));
  return partial;
}

/**
 * Find a curated list by its ID.
 */
export function getListById(id: string): CuratedList | undefined {
  return curatedLists.find(l => l.id === id);
}

/**
 * Get all public lists for the Search > Lists tab.
 */
export function getPublicLists(): CuratedList[] {
  return curatedLists.filter(l => !l.isPrivate);
}
