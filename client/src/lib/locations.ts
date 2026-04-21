// Location data for country/city/neighborhood selector

export interface NeighborhoodInfo {
  name: string;
  venueCount: number;
}

export interface CityInfo {
  name: string;
  emoji: string;
  venueCount: number;
  neighborhoods: NeighborhoodInfo[];
}

export interface CountryInfo {
  name: string;
  flag: string;
  cities: CityInfo[];
}

export const countries: CountryInfo[] = [
  {
    name: 'Cyprus',
    flag: '🇨🇾',
    cities: [
      {
        name: 'Limassol',
        emoji: '🏛️',
        venueCount: 142,
        neighborhoods: [
          { name: 'Old Town', venueCount: 28 },
          { name: 'Marina', venueCount: 22 },
          { name: 'Tourist Area', venueCount: 34 },
          { name: 'Potamos Germasogeia', venueCount: 18 },
          { name: 'Agios Tychonas', venueCount: 14 },
          { name: 'Mesa Geitonia', venueCount: 12 },
          { name: 'Zakaki', venueCount: 8 },
          { name: 'Molos', venueCount: 6 },
        ],
      },
      {
        name: 'Nicosia',
        emoji: '🏰',
        venueCount: 98,
        neighborhoods: [
          { name: 'Old City (Walled)', venueCount: 24 },
          { name: 'Engomi', venueCount: 18 },
          { name: 'Strovolos', venueCount: 16 },
          { name: 'Lakatamia', venueCount: 12 },
          { name: 'Aglantzia', venueCount: 14 },
          { name: 'Makedonitissa', venueCount: 8 },
          { name: 'Acropolis', venueCount: 6 },
        ],
      },
      {
        name: 'Paphos',
        emoji: '🌊',
        venueCount: 76,
        neighborhoods: [
          { name: 'Kato Paphos', venueCount: 22 },
          { name: 'Paphos Harbour', venueCount: 16 },
          { name: 'Coral Bay', venueCount: 14 },
          { name: 'Tombs of the Kings', venueCount: 10 },
          { name: 'Yeroskipou', venueCount: 8 },
          { name: 'Chloraka', venueCount: 6 },
        ],
      },
      {
        name: 'Larnaca',
        emoji: '✈️',
        venueCount: 54,
        neighborhoods: [
          { name: 'Finikoudes', venueCount: 16 },
          { name: 'Mackenzie', venueCount: 12 },
          { name: 'Old Town', venueCount: 10 },
          { name: 'Drosia', venueCount: 8 },
          { name: 'Kamares', venueCount: 8 },
        ],
      },
    ],
  },
  {
    name: 'Greece',
    flag: '🇬🇷',
    cities: [
      {
        name: 'Athens',
        emoji: '🏛️',
        venueCount: 312,
        neighborhoods: [
          { name: 'Plaka', venueCount: 48 },
          { name: 'Monastiraki', venueCount: 42 },
          { name: 'Psyrri', venueCount: 36 },
          { name: 'Kolonaki', venueCount: 38 },
          { name: 'Exarchia', venueCount: 28 },
          { name: 'Koukaki', venueCount: 24 },
          { name: 'Glyfada', venueCount: 32 },
          { name: 'Kifisia', venueCount: 22 },
          { name: 'Piraeus', venueCount: 26 },
          { name: 'Vouliagmeni', venueCount: 16 },
        ],
      },
      {
        name: 'Thessaloniki',
        emoji: '🌊',
        venueCount: 187,
        neighborhoods: [
          { name: 'Ladadika', venueCount: 34 },
          { name: 'Ano Poli', venueCount: 28 },
          { name: 'Aristotelous Square', venueCount: 32 },
          { name: 'Kalamaria', venueCount: 24 },
          { name: 'Nea Paralia', venueCount: 22 },
          { name: 'Toumba', venueCount: 16 },
          { name: 'Panorama', venueCount: 18 },
          { name: 'Thermi', venueCount: 13 },
        ],
      },
      {
        name: 'Mykonos',
        emoji: '🏖️',
        venueCount: 89,
        neighborhoods: [
          { name: 'Mykonos Town (Chora)', venueCount: 32 },
          { name: 'Little Venice', venueCount: 18 },
          { name: 'Ornos', venueCount: 14 },
          { name: 'Platis Gialos', venueCount: 12 },
          { name: 'Paradise Beach', venueCount: 13 },
        ],
      },
      {
        name: 'Santorini',
        emoji: '🌅',
        venueCount: 67,
        neighborhoods: [
          { name: 'Oia', venueCount: 22 },
          { name: 'Fira', venueCount: 18 },
          { name: 'Imerovigli', venueCount: 12 },
          { name: 'Kamari', venueCount: 8 },
          { name: 'Perissa', venueCount: 7 },
        ],
      },
      {
        name: 'Crete',
        emoji: '🏔️',
        venueCount: 124,
        neighborhoods: [
          { name: 'Chania Old Town', venueCount: 28 },
          { name: 'Heraklion Centre', venueCount: 24 },
          { name: 'Rethymno', venueCount: 22 },
          { name: 'Agios Nikolaos', venueCount: 18 },
          { name: 'Elounda', venueCount: 16 },
          { name: 'Hersonissos', venueCount: 16 },
        ],
      },
    ],
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    cities: [
      {
        name: 'London',
        emoji: '🎡',
        venueCount: 1240,
        neighborhoods: [
          { name: 'Soho', venueCount: 145 },
          { name: 'Covent Garden', venueCount: 98 },
          { name: 'Shoreditch', venueCount: 112 },
          { name: 'Mayfair', venueCount: 86 },
          { name: 'Chelsea', venueCount: 78 },
          { name: 'Notting Hill', venueCount: 64 },
          { name: 'Camden', venueCount: 72 },
          { name: 'Borough Market', venueCount: 56 },
          { name: 'Brixton', venueCount: 48 },
          { name: 'Islington', venueCount: 52 },
          { name: 'Hackney', venueCount: 68 },
          { name: 'Kensington', venueCount: 54 },
        ],
      },
      {
        name: 'Manchester',
        emoji: '⚽',
        venueCount: 345,
        neighborhoods: [
          { name: 'Northern Quarter', venueCount: 68 },
          { name: 'Deansgate', venueCount: 54 },
          { name: 'Ancoats', venueCount: 42 },
          { name: 'Spinningfields', venueCount: 38 },
          { name: 'Didsbury', venueCount: 34 },
          { name: 'Chorlton', venueCount: 32 },
          { name: 'Rusholme (Curry Mile)', venueCount: 28 },
          { name: 'Salford Quays', venueCount: 22 },
        ],
      },
      {
        name: 'Edinburgh',
        emoji: '🏰',
        venueCount: 198,
        neighborhoods: [
          { name: 'Old Town', venueCount: 42 },
          { name: 'New Town', venueCount: 38 },
          { name: 'Leith', venueCount: 34 },
          { name: 'Stockbridge', venueCount: 28 },
          { name: 'Grassmarket', venueCount: 24 },
          { name: 'Bruntsfield', venueCount: 18 },
          { name: 'Morningside', venueCount: 14 },
        ],
      },
      {
        name: 'Birmingham',
        emoji: '🏭',
        venueCount: 267,
        neighborhoods: [
          { name: 'Brindleyplace', venueCount: 42 },
          { name: 'Digbeth', venueCount: 38 },
          { name: 'Jewellery Quarter', venueCount: 34 },
          { name: 'Colmore Row', venueCount: 32 },
          { name: 'Moseley', venueCount: 28 },
          { name: 'Harborne', venueCount: 24 },
          { name: 'Balti Triangle', venueCount: 36 },
          { name: 'Edgbaston', venueCount: 18 },
        ],
      },
      {
        name: 'Bristol',
        emoji: '🌉',
        venueCount: 156,
        neighborhoods: [
          { name: 'Clifton', venueCount: 32 },
          { name: 'Harbourside', venueCount: 28 },
          { name: 'Stokes Croft', venueCount: 24 },
          { name: 'Gloucester Road', venueCount: 22 },
          { name: 'Redland', venueCount: 16 },
          { name: 'Bedminster', venueCount: 18 },
          { name: 'Old City', venueCount: 16 },
        ],
      },
    ],
  },
  {
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    cities: [
      {
        name: 'Dubai',
        emoji: '🏙️',
        venueCount: 876,
        neighborhoods: [
          { name: 'Downtown Dubai', venueCount: 124 },
          { name: 'Dubai Marina', venueCount: 108 },
          { name: 'DIFC', venueCount: 86 },
          { name: 'JBR', venueCount: 72 },
          { name: 'Business Bay', venueCount: 64 },
          { name: 'Al Barsha', venueCount: 48 },
          { name: 'Jumeirah', venueCount: 56 },
          { name: 'Deira', venueCount: 42 },
          { name: 'Al Quoz', venueCount: 38 },
          { name: 'City Walk', venueCount: 34 },
          { name: 'Palm Jumeirah', venueCount: 46 },
          { name: 'Karama', venueCount: 28 },
        ],
      },
      {
        name: 'Abu Dhabi',
        emoji: '🕌',
        venueCount: 432,
        neighborhoods: [
          { name: 'Corniche', venueCount: 68 },
          { name: 'Al Maryah Island', venueCount: 54 },
          { name: 'Saadiyat Island', venueCount: 42 },
          { name: 'Yas Island', venueCount: 48 },
          { name: 'Al Reem Island', venueCount: 36 },
          { name: 'Khalifa City', venueCount: 28 },
          { name: 'Tourist Club Area', venueCount: 32 },
          { name: 'Al Bateen', venueCount: 24 },
        ],
      },
      {
        name: 'Sharjah',
        emoji: '🎨',
        venueCount: 145,
        neighborhoods: [
          { name: 'Al Majaz', venueCount: 32 },
          { name: 'Al Qasba', venueCount: 28 },
          { name: 'Al Nahda', venueCount: 24 },
          { name: 'Al Khan', venueCount: 22 },
          { name: 'Heritage Area', venueCount: 18 },
          { name: 'University City', venueCount: 12 },
        ],
      },
    ],
  },
  {
    name: 'Italy',
    flag: '🇮🇹',
    cities: [
      {
        name: 'Rome',
        emoji: '🏛️',
        venueCount: 567,
        neighborhoods: [
          { name: 'Trastevere', venueCount: 78 },
          { name: 'Centro Storico', venueCount: 86 },
          { name: 'Testaccio', venueCount: 54 },
          { name: 'Monti', venueCount: 62 },
          { name: 'Prati', venueCount: 48 },
          { name: 'San Lorenzo', venueCount: 42 },
          { name: 'Pigneto', venueCount: 36 },
          { name: 'Ostiense', venueCount: 34 },
          { name: 'Esquilino', venueCount: 28 },
          { name: 'EUR', venueCount: 22 },
        ],
      },
      {
        name: 'Milan',
        emoji: '👗',
        venueCount: 489,
        neighborhoods: [
          { name: 'Brera', venueCount: 72 },
          { name: 'Navigli', venueCount: 68 },
          { name: 'Duomo', venueCount: 56 },
          { name: 'Porta Romana', venueCount: 48 },
          { name: 'Isola', venueCount: 42 },
          { name: 'Porta Venezia', venueCount: 38 },
          { name: 'Tortona', venueCount: 32 },
          { name: 'Chinatown', venueCount: 28 },
          { name: 'Garibaldi', venueCount: 34 },
        ],
      },
      {
        name: 'Florence',
        emoji: '🎨',
        venueCount: 234,
        neighborhoods: [
          { name: 'Santa Croce', venueCount: 42 },
          { name: 'Oltrarno', venueCount: 38 },
          { name: 'San Lorenzo', venueCount: 34 },
          { name: 'Duomo', venueCount: 36 },
          { name: 'Santo Spirito', venueCount: 28 },
          { name: 'San Frediano', venueCount: 24 },
          { name: 'Campo di Marte', venueCount: 18 },
        ],
      },
      {
        name: 'Naples',
        emoji: '🍕',
        venueCount: 312,
        neighborhoods: [
          { name: 'Spaccanapoli', venueCount: 56 },
          { name: 'Vomero', venueCount: 42 },
          { name: 'Chiaia', venueCount: 48 },
          { name: 'Quartieri Spagnoli', venueCount: 38 },
          { name: 'Posillipo', venueCount: 32 },
          { name: 'Sanità', venueCount: 28 },
          { name: 'Porto', venueCount: 24 },
          { name: 'Mergellina', venueCount: 22 },
        ],
      },
      {
        name: 'Venice',
        emoji: '🛶',
        venueCount: 156,
        neighborhoods: [
          { name: 'San Marco', venueCount: 34 },
          { name: 'Rialto', venueCount: 28 },
          { name: 'Cannaregio', venueCount: 26 },
          { name: 'Dorsoduro', venueCount: 24 },
          { name: 'Castello', venueCount: 18 },
          { name: 'Burano', venueCount: 14 },
          { name: 'Giudecca', venueCount: 12 },
        ],
      },
    ],
  },
  {
    name: 'Spain',
    flag: '🇪🇸',
    cities: [
      {
        name: 'Barcelona',
        emoji: '⛪',
        venueCount: 678,
        neighborhoods: [
          { name: 'Gothic Quarter', venueCount: 86 },
          { name: 'El Born', venueCount: 72 },
          { name: 'Eixample', venueCount: 94 },
          { name: 'Gràcia', venueCount: 68 },
          { name: 'Barceloneta', venueCount: 54 },
          { name: 'Raval', venueCount: 48 },
          { name: 'Poble Sec', venueCount: 42 },
          { name: 'Sant Antoni', venueCount: 38 },
          { name: 'Poblenou', venueCount: 36 },
          { name: 'Sarrià', venueCount: 28 },
        ],
      },
      {
        name: 'Madrid',
        emoji: '🏟️',
        venueCount: 534,
        neighborhoods: [
          { name: 'Malasaña', venueCount: 72 },
          { name: 'Chueca', venueCount: 64 },
          { name: 'La Latina', venueCount: 58 },
          { name: 'Sol', venueCount: 52 },
          { name: 'Lavapiés', venueCount: 46 },
          { name: 'Salamanca', venueCount: 54 },
          { name: 'Chamberí', venueCount: 38 },
          { name: 'Retiro', venueCount: 32 },
          { name: 'Huertas', venueCount: 42 },
        ],
      },
      {
        name: 'Valencia',
        emoji: '🍊',
        venueCount: 287,
        neighborhoods: [
          { name: 'El Carmen', venueCount: 48 },
          { name: 'Ruzafa', venueCount: 52 },
          { name: 'Cabanyal', venueCount: 36 },
          { name: 'Benimaclet', venueCount: 28 },
          { name: 'Ciutat Vella', venueCount: 34 },
          { name: 'Eixample', venueCount: 32 },
          { name: 'La Malvarrosa', venueCount: 24 },
        ],
      },
      {
        name: 'Seville',
        emoji: '💃',
        venueCount: 198,
        neighborhoods: [
          { name: 'Santa Cruz', venueCount: 38 },
          { name: 'Triana', venueCount: 34 },
          { name: 'Alameda', venueCount: 28 },
          { name: 'Macarena', venueCount: 24 },
          { name: 'Arenal', venueCount: 22 },
          { name: 'Nervión', venueCount: 18 },
          { name: 'Los Remedios', venueCount: 16 },
        ],
      },
      {
        name: 'Ibiza',
        emoji: '🎶',
        venueCount: 134,
        neighborhoods: [
          { name: 'Ibiza Town (Eivissa)', venueCount: 42 },
          { name: 'Playa d\'en Bossa', venueCount: 28 },
          { name: 'San Antonio', venueCount: 24 },
          { name: 'Santa Eulalia', venueCount: 18 },
          { name: 'Talamanca', venueCount: 12 },
          { name: 'Cala Comte', venueCount: 10 },
        ],
      },
    ],
  },
  {
    name: 'France',
    flag: '🇫🇷',
    cities: [
      {
        name: 'Paris',
        emoji: '🗼',
        venueCount: 1456,
        neighborhoods: [
          { name: 'Le Marais', venueCount: 148 },
          { name: 'Saint-Germain-des-Prés', venueCount: 124 },
          { name: 'Montmartre', venueCount: 108 },
          { name: 'Latin Quarter', venueCount: 96 },
          { name: 'Bastille', venueCount: 86 },
          { name: 'Oberkampf', venueCount: 72 },
          { name: 'Belleville', venueCount: 64 },
          { name: 'Champs-Élysées', venueCount: 78 },
          { name: 'Canal Saint-Martin', venueCount: 56 },
          { name: 'Pigalle', venueCount: 48 },
          { name: 'Batignolles', venueCount: 34 },
        ],
      },
      {
        name: 'Lyon',
        emoji: '🍷',
        venueCount: 345,
        neighborhoods: [
          { name: 'Vieux Lyon', venueCount: 62 },
          { name: 'Presqu\'île', venueCount: 54 },
          { name: 'Croix-Rousse', venueCount: 48 },
          { name: 'Confluence', venueCount: 38 },
          { name: 'Guillotière', venueCount: 32 },
          { name: 'Brotteaux', venueCount: 28 },
          { name: 'Part-Dieu', venueCount: 24 },
        ],
      },
      {
        name: 'Nice',
        emoji: '🌴',
        venueCount: 234,
        neighborhoods: [
          { name: 'Vieux Nice', venueCount: 48 },
          { name: 'Promenade des Anglais', venueCount: 38 },
          { name: 'Port', venueCount: 32 },
          { name: 'Cimiez', venueCount: 24 },
          { name: 'Libération', venueCount: 22 },
          { name: 'Jean-Médecin', venueCount: 28 },
          { name: 'Carré d\'Or', venueCount: 18 },
        ],
      },
      {
        name: 'Marseille',
        emoji: '⛵',
        venueCount: 278,
        neighborhoods: [
          { name: 'Vieux-Port', venueCount: 52 },
          { name: 'Le Panier', venueCount: 38 },
          { name: 'Cours Julien', venueCount: 42 },
          { name: 'La Joliette', venueCount: 32 },
          { name: 'Endoume', venueCount: 24 },
          { name: 'Castellane', venueCount: 22 },
          { name: 'Prado', venueCount: 28 },
          { name: 'Noailles', venueCount: 18 },
        ],
      },
    ],
  },
];

export function getCountry(name: string): CountryInfo | undefined {
  return countries.find(c => c.name === name);
}

export function getCitiesForCountry(countryName: string): CityInfo[] {
  return getCountry(countryName)?.cities || [];
}

export function getNeighborhoods(countryName: string, cityName: string): NeighborhoodInfo[] {
  const city = getCitiesForCountry(countryName).find(c => c.name === cityName);
  return city?.neighborhoods || [];
}
