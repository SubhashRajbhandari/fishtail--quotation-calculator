// Master catalog for Transportation, Additional Activities, Flights, and Guide services

export const INITIAL_HOTELS = [
  {
    id: 'h-1',
    name: 'HOTEL WOOD APPLE',
    city: 'Kathmandu',
    category: 'Premier',
    meal_plan: 'CP',
    star_rating: 3,
    half_twin_inr: 1500,
    single_inr: 2500,
    half_twin_npr: 2400,
    single_npr: 4000,
    half_twin_usd: 20,
    single_usd: 32,
    base_half_twin_inr: 1500,
    base_single_inr: 2500,
    base_half_twin_npr: 2400,
    base_single_npr: 4000,
    base_half_twin_usd: 20,
    base_single_usd: 32,
    season_note: 'Standard Tariff',
    is_custom_rate: false,
    notes: 'Near Thamel & City center'
  },
  {
    id: 'h-2',
    name: 'HOTEL KAUSI',
    city: 'Kathmandu',
    category: 'Premier',
    meal_plan: 'CP',
    star_rating: 3,
    half_twin_inr: 1250,
    single_inr: 2000,
    half_twin_npr: 2000,
    single_npr: 3200,
    half_twin_usd: 16,
    single_usd: 26,
    base_half_twin_inr: 1250,
    base_single_inr: 2000,
    base_half_twin_npr: 2000,
    base_single_npr: 3200,
    base_half_twin_usd: 16,
    base_single_usd: 26,
    season_note: 'Standard Tariff',
    is_custom_rate: false,
    notes: 'Cozy boutique hotel'
  },
  {
    id: 'h-3',
    name: 'TREKKERS INN',
    city: 'Pokhara',
    category: 'Premier',
    meal_plan: 'CP',
    star_rating: 3,
    half_twin_inr: 2200,
    single_inr: 3500,
    half_twin_npr: 3520,
    single_npr: 5600,
    half_twin_usd: 28,
    single_usd: 45,
    base_half_twin_inr: 2200,
    base_single_inr: 3500,
    base_half_twin_npr: 3520,
    base_single_npr: 5600,
    base_half_twin_usd: 28,
    base_single_usd: 45,
    season_note: 'Standard Tariff',
    is_custom_rate: false,
    notes: 'Lakeside Pokhara'
  },
  {
    id: 'h-4',
    name: 'HOTEL MARSYANGDI',
    city: 'Kathmandu',
    category: 'Premier',
    meal_plan: 'CP',
    star_rating: 3,
    half_twin_inr: 1800,
    single_inr: 3000,
    half_twin_npr: 2880,
    single_npr: 4800,
    half_twin_usd: 24,
    single_usd: 38,
    base_half_twin_inr: 1800,
    base_single_inr: 3000,
    base_half_twin_npr: 2880,
    base_single_npr: 4800,
    base_half_twin_usd: 24,
    base_single_usd: 38,
    season_note: 'July Special Offer: 1200 INR',
    is_custom_rate: false,
    notes: 'Prime Thamel location'
  },
  {
    id: 'h-5',
    name: 'FISH TAIL LODGE',
    city: 'Pokhara',
    category: 'Luxury',
    meal_plan: 'CP',
    star_rating: 5,
    half_twin_inr: 4500,
    single_inr: 7500,
    half_twin_npr: 7200,
    single_npr: 12000,
    half_twin_usd: 58,
    single_usd: 95,
    base_half_twin_inr: 4500,
    base_single_inr: 7500,
    base_half_twin_npr: 7200,
    base_single_npr: 12000,
    base_half_twin_usd: 58,
    base_single_usd: 95,
    season_note: 'Standard Tariff',
    is_custom_rate: false,
    notes: 'Iconic heritage island resort on Phewa lake'
  },
  {
    id: 'h-6',
    name: 'HOTEL BARAHI',
    city: 'Pokhara',
    category: 'Premier',
    meal_plan: 'CP',
    star_rating: 4,
    half_twin_inr: 2800,
    single_inr: 4800,
    half_twin_npr: 4480,
    single_npr: 7680,
    half_twin_usd: 36,
    single_usd: 62,
    base_half_twin_inr: 2800,
    base_single_inr: 4800,
    base_half_twin_npr: 4480,
    base_single_npr: 7680,
    base_half_twin_usd: 36,
    base_single_usd: 62,
    season_note: 'Standard Tariff',
    is_custom_rate: false,
    notes: 'Luxury stay in Lakeside'
  },
  {
    id: 'h-7',
    name: 'CLUB HIMALAYA',
    city: 'Nagarkot',
    category: 'Premier',
    meal_plan: 'CP',
    star_rating: 4,
    half_twin_inr: 3200,
    single_inr: 5500,
    half_twin_npr: 5120,
    single_npr: 8800,
    half_twin_usd: 42,
    single_usd: 70,
    base_half_twin_inr: 3200,
    base_single_inr: 5500,
    base_half_twin_npr: 5120,
    base_single_npr: 8800,
    base_half_twin_usd: 42,
    base_single_usd: 70,
    season_note: 'Standard Tariff',
    is_custom_rate: false,
    notes: 'Himalayan Sunrise Resort'
  },
  {
    id: 'h-8',
    name: 'ROYAL PARK HOTEL',
    city: 'Chitwan',
    category: 'Premier',
    meal_plan: 'AP',
    star_rating: 3,
    half_twin_inr: 2500,
    single_inr: 4200,
    half_twin_npr: 4000,
    single_npr: 6720,
    half_twin_usd: 32,
    single_usd: 54,
    base_half_twin_inr: 2500,
    base_single_inr: 4200,
    base_half_twin_npr: 4000,
    base_single_npr: 6720,
    base_half_twin_usd: 32,
    base_single_usd: 54,
    season_note: 'Standard Tariff',
    is_custom_rate: false,
    notes: 'Sauraha Jungle Safari Resort'
  }
];

export const INITIAL_HOTEL_ROWS = [
  {
    id: 'row-1',
    hotel_id: 'h-1',
    hotel_name: 'HOTEL WOOD APPLE',
    city: 'Kathmandu',
    half_twin_price: 1500,
    single_room_price: 0,
    nights: 3,
    single_rooms: 0,
    custom_price: false
  },
  {
    id: 'row-2',
    hotel_id: 'h-2',
    hotel_name: 'HOTEL KAUSI',
    city: 'Kathmandu',
    half_twin_price: 1250,
    single_room_price: 0,
    nights: 3,
    single_rooms: 0,
    custom_price: false
  },
  {
    id: 'row-3',
    hotel_id: 'h-3',
    hotel_name: 'TREKKERS INN',
    city: 'Pokhara',
    half_twin_price: 2200,
    single_room_price: 0,
    nights: 1,
    single_rooms: 0,
    custom_price: false
  }
];

// Master Transportation Rates with Pre-Saved Itinerary Templates (Tariffs based in NPR)
export const MASTER_TRANSPORT_ROUTES = [
  { 
    id: 't-1', 
    name: 'ARRIVAL - KTM Airport Pick-up', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Airport to Hotel transfer',
    default_itinerary_title: 'Arrival in Kathmandu & Transfer to Hotel',
    default_itinerary_desc: 'Warm traditional welcome on arrival at Tribhuvan International Airport (KTM) with marigold garlands. Meet our representative and transfer by private vehicle to your hotel. Complete check-in formalities, enjoy a welcome beverage, and receive a comprehensive trip briefing. Evening free to stroll through the vibrant lanes of Thamel.',
    default_highlights: ['Airport Welcome Garland', 'Private Hotel Transfer', 'Trip Orientation', 'Thamel Evening Walk'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Kathmandu'
  },
  { 
    id: 't-2', 
    name: 'KTM SS - FULL DAY Sightseeing', 
    category: 'Kathmandu', 
    car_npr: 4000, scorpio_npr: 6000, hiace_npr: 7000, coaster_npr: 9000, shuttle_npr: 11000, 
    car_inr: 2500, scorpio_inr: 3750, hiace_inr: 4375, coaster_inr: 5625, shuttle_inr: 6875,
    base_car_npr: 4000, base_scorpio_npr: 6000, base_hiace_npr: 7000, base_coaster_npr: 9000, base_shuttle_npr: 11000,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Pashupatinath, Boudhanath, Swayambhu, Durbar Sq',
    default_itinerary_title: 'Kathmandu Valley UNESCO World Heritage Cultural Tour',
    default_itinerary_desc: 'After breakfast at hotel, embark on a full-day guided exploration of Kathmandu Valley’s UNESCO World Heritage treasures. Visit the sacred Hindu shrine of Pashupatinath along the Bagmati River, circumambulate the massive Buddhist dome of Boudhanath Stupa, explore ancient Kathmandu Durbar Square with the Kumari Ghar, and witness breathtaking sunset views from the hilltop Swayambhunath (Monkey Temple).',
    default_highlights: ['Pashupatinath Temple', 'Boudhanath Stupa', 'Kathmandu Durbar Square', 'Swayambhunath Stupa'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Kathmandu'
  },
  { 
    id: 't-3', 
    name: 'PKR HALF DAY Sightseeing', 
    category: 'Pokhara', 
    car_npr: 2000, scorpio_npr: 3000, hiace_npr: 3500, coaster_npr: 4500, shuttle_npr: 5500, 
    car_inr: 1250, scorpio_inr: 1875, hiace_inr: 2188, coaster_inr: 2813, shuttle_inr: 3438,
    base_car_npr: 2000, base_scorpio_npr: 3000, base_hiace_npr: 3500, base_coaster_npr: 4500, base_shuttle_npr: 5500,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Davis Falls, Gupteshwor, Seti River gorge',
    default_itinerary_title: 'Pokhara City Highlights & Shanti Stupa Sightseeing',
    default_itinerary_desc: 'Morning drive from hotel to Davis Falls (Patale Chhango) to watch the cascading torrent plunge into an underground tunnel. Explore the sacred Gupteshwor Mahadev Cave directly opposite, visit the deep geological chasm of Seti River Gorge, and stop by the Tibetan Refugee Settlement. Enjoy a delicious lakeside lunch, then take a scenic drive up to the World Peace Pagoda (Shanti Stupa) for panoramic views of Phewa Lake and the Annapurna range.',
    default_highlights: ["Davis Falls", "Gupteshwor Mahadev Cave", "Seti River Gorge", "World Peace Pagoda (Shanti Stupa)"],
    default_meals: 'Breakfast (CP)',
    default_city: 'Pokhara'
  },
  { 
    id: 't-4', 
    name: 'PKR - SARANKOT Sunrise Excursion', 
    category: 'Pokhara', 
    car_npr: 6500, scorpio_npr: 9750, hiace_npr: 11375, coaster_npr: 14625, shuttle_npr: 17875, 
    car_inr: 4063, scorpio_inr: 6094, hiace_inr: 7109, coaster_inr: 9141, shuttle_inr: 11172,
    base_car_npr: 6500, base_scorpio_npr: 9750, base_hiace_npr: 11375, base_coaster_npr: 14625, base_shuttle_npr: 17875,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Early morning sunrise viewing trip',
    default_itinerary_title: 'Sarangkot Sunrise Mountain View & Phewa Lake Boating',
    default_itinerary_desc: 'Early morning (05:00 AM) drive up to Sarangkot hilltop viewpoint. Witness the spellbinding golden sunrise illuminating the towering peaks of Annapurna I, II, III, IV, Dhaulagiri, and the sacred Machhapuchhre (Fishtail). Return to the hotel for a hearty breakfast. Afternoon tranquil 1-hour boat ride on Phewa Lake with a visit to the island temple of Tal Barahi.',
    default_highlights: ['Sarangkot Sunrise Over Annapurnas', 'Fishtail Peak Panorama', 'Phewa Lake Boating', 'Tal Barahi Island Temple'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Pokhara'
  },
  { 
    id: 't-5', 
    name: 'PUMDIKOT PKR - Shiva Statue Excursion', 
    category: 'Pokhara', 
    car_npr: 2500, scorpio_npr: 3750, hiace_npr: 4375, coaster_npr: 5625, shuttle_npr: 6875, 
    car_inr: 1563, scorpio_inr: 2344, hiace_inr: 2734, coaster_inr: 3516, shuttle_inr: 4297,
    base_car_npr: 2500, base_scorpio_npr: 3750, base_hiace_npr: 4375, base_coaster_npr: 5625, base_shuttle_npr: 6875,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Shiva statue and scenic valley view',
    default_itinerary_title: 'Pumdikot Colossal Shiva Statue & Pokhara Ridge Excursion',
    default_itinerary_desc: 'Scenic drive along the southern ridge of Pokhara to visit the majestic 108-foot colossal Lord Shiva statue at Pumdikot. Enjoy 360-degree panoramic vistas of the entire Pokhara Valley, Phewa Lake below, and the snow-capped Himalayan horizon. Perfect spot for photography and spiritual tranquility.',
    default_highlights: ['108-ft Pumdikot Shiva Statue', '360° Pokhara Valley Vista', 'Himalayan Ridge Photography'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Pokhara'
  },
  { 
    id: 't-6', 
    name: 'CHANDRAGIRI CABLE CAR Transfer', 
    category: 'Kathmandu', 
    car_npr: 4000, scorpio_npr: 6000, hiace_npr: 7000, coaster_npr: 9000, shuttle_npr: 11000, 
    car_inr: 2500, scorpio_inr: 3750, hiace_inr: 4375, coaster_inr: 5625, shuttle_inr: 6875,
    base_car_npr: 4000, base_scorpio_npr: 6000, base_hiace_npr: 7000, base_coaster_npr: 9000, base_shuttle_npr: 11000,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'City hotel to Cable Car Station round-trip',
    default_itinerary_title: 'Chandragiri Hills Cable Car & Himalayan View Excursion',
    default_itinerary_desc: 'Morning transfer from Kathmandu hotel to Thankot Cable Car base station. Board the scenic 2.5 km gondola lift soaring above lush green forests to reach Chandragiri Top (2,551m). Experience awe-inspiring panoramic vistas of Mount Everest, Ganesh Himal, Langtang, and Manaslu ranges. Visit the historic Bhaleshwor Mahadev Temple, enjoy mountain-top lunch, and return via cable car to Kathmandu.',
    default_highlights: ['Scenic Gondola Cable Car Ride', 'Bhaleshwor Mahadev Temple', 'Panoramic Everest & Langtang Views'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Kathmandu'
  },
  { 
    id: 't-7', 
    name: 'KTM - PKR Domestic Departure Drop', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Hotel to KTM domestic terminal',
    default_itinerary_title: 'Kathmandu to Pokhara Scenic Mountain Flight / Transfer',
    default_itinerary_desc: 'Breakfast at hotel, private transfer to Kathmandu Domestic Airport. Board the spectacular 25-minute scenic mountain flight to Pokhara with breathtaking views of the central Himalayas. On arrival at Pokhara Airport, meet our local representative and transfer to your lakeside hotel. Free afternoon to enjoy leisurely café hopping by Phewa Lake.',
    default_highlights: ['Domestic Airport Transfer', 'Scenic Mountain Flight', 'Pokhara Hotel Check-in', 'Lakeside Leisure'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Pokhara'
  },
  { 
    id: 't-8', 
    name: 'PKR Domestic Airport Drop', 
    category: 'Airport', 
    car_npr: 1500, scorpio_npr: 2250, hiace_npr: 2625, coaster_npr: 3375, shuttle_npr: 4125, 
    car_inr: 938, scorpio_inr: 1406, hiace_inr: 1641, coaster_inr: 2109, shuttle_inr: 2578,
    base_car_npr: 1500, base_scorpio_npr: 2250, base_hiace_npr: 2625, base_coaster_npr: 3375, base_shuttle_npr: 4125,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Pokhara hotel to airport drop',
    default_itinerary_title: 'Pokhara Departure to Kathmandu / Next Destination',
    default_itinerary_desc: 'Enjoy morning breakfast overlooking the tranquil Phewa Lake. Check out from Pokhara hotel and transfer by private vehicle to Pokhara Domestic Airport for your scheduled return flight to Kathmandu or onward travel.',
    default_highlights: ['Hotel Check-out', 'Pokhara Airport Private Transfer', 'Departure Flight Assistance'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Kathmandu'
  },
  { 
    id: 't-9', 
    name: 'PKR - KTM Domestic Arrival Pick-up', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Arrival pick-up from domestic airport',
    default_itinerary_title: 'Arrival in Kathmandu & Souvenir Shopping',
    default_itinerary_desc: 'Meet our driver upon arrival at Kathmandu Domestic Terminal and transfer to your hotel. Afternoon is free for last-minute souvenir shopping in Thamel and Basantapur for authentic Pashmina shawls, singing bowls, tea, and handicrafts.',
    default_highlights: ['Domestic Airport Pickup', 'Hotel Transfer', 'Thamel Souvenir Shopping'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Kathmandu'
  },
  { 
    id: 't-10', 
    name: 'DEPARTURE - KTM International Drop', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Hotel to Tribhuvan Int. Airport',
    default_itinerary_title: 'Final Departure from Kathmandu with Golden Memories',
    default_itinerary_desc: 'Savor your final breakfast in Nepal. Depending on your flight schedule, enjoy any remaining free time for packing and exploration. Our private vehicle will pick you up from the hotel 3 hours prior to your international flight departure and transfer you to Tribhuvan International Airport (KTM) for your journey home.',
    default_highlights: ['Hotel Check-out', 'Tribhuvan International Airport Transfer', 'Farewell Nepal'],
    default_meals: 'Breakfast (CP)',
    default_city: 'Departure'
  }
];

export const INITIAL_TRANSPORT_ITEMS = [
  { id: 'tr-1', route_id: 't-1', name: 'ARRIVAL - KTM Airport Pick-up', rate_inr: 1000, qty: 1, notes: 'Airport to Hotel' },
  { id: 'tr-2', route_id: 't-2', name: 'KTM SS - FULL DAY Sightseeing', rate_inr: 4000, qty: 1, notes: 'Pashupatinath, Boudhanath, Swayambhu' },
  { id: 'tr-3', route_id: 't-3', name: 'PKR HALF DAY Sightseeing', rate_inr: 2000, qty: 1, notes: 'Davis Falls, Gupteshwor, Seti River' },
  { id: 'tr-4', route_id: 't-4', name: 'PKR - SARANKOT Sunrise Excursion', rate_inr: 6500, qty: 1, notes: 'Early morning sunrise' },
  { id: 'tr-5', route_id: 't-6', name: 'CHANDRAGIRI CABLE CAR Transfer', rate_inr: 4000, qty: 1, notes: 'Kathmandu to Cable car base' },
  { id: 'tr-6', route_id: 't-10', name: 'DEPARTURE - KTM International Drop', rate_inr: 1000, qty: 1, notes: 'Hotel to Airport' }
];

// Master Additional Activities & Flights Catalog (Tariffs based in Nepalese Rupees - NPR)
export const MASTER_ADDITIONAL_ACTIVITIES = [
  { id: 'act-1', name: 'POKHARA - KATHMANDU FLIGHT', unit_price_npr: 7500, unit_price_inr: 4688, unit_price_usd: 55, pricing_type: 'per_pax', category: 'Flight', notes: 'One-way domestic airfare' },
  { id: 'act-2', name: 'POKHARA - JOMSOM FLIGHT', unit_price_npr: 12500, unit_price_inr: 7813, unit_price_usd: 92, pricing_type: 'per_pax', category: 'Flight', notes: 'Mountain flight to Jomsom' },
  { id: 'act-3', name: 'ACAP Permit (Annapurna Conservation Area)', unit_price_npr: 670, unit_price_inr: 419, unit_price_usd: 5, pricing_type: 'per_pax', category: 'Permit', notes: 'Mandatory conservation permit' },
  { id: 'act-4', name: 'JOMSOM - MUKTINATH Jeep Transfer', unit_price_npr: 2090, unit_price_inr: 1306, unit_price_usd: 15, pricing_type: 'per_pax', category: 'Transport', notes: 'Sharing 4WD Jeep' },
  { id: 'act-5', name: 'Paragliding in Pokhara (Sarangkot)', unit_price_npr: 6000, unit_price_inr: 3750, unit_price_usd: 44, pricing_type: 'per_pax', category: 'Activity', notes: 'Tandem flight with photos/video' },
  { id: 'act-6', name: 'Phewa Lake 1-Hour Boating (with Taal Barahi)', unit_price_npr: 600, unit_price_inr: 375, unit_price_usd: 4, pricing_type: 'per_group', category: 'Activity', notes: 'Boat hire + life jackets' },
  { id: 'act-7', name: 'Chandragiri Cable Car Both Ways Ticket', unit_price_npr: 1500, unit_price_inr: 938, unit_price_usd: 11, pricing_type: 'per_pax', category: 'Activity', notes: 'Round trip cable car ticket' },
  { id: 'act-8', name: 'Miscellaneous & Arrival Garland / Water', unit_price_npr: 500, unit_price_inr: 313, unit_price_usd: 4, pricing_type: 'per_group', category: 'Other', notes: 'Traditional welcome & mineral water' }
];

export const INITIAL_ADDITIONAL_ITEMS = [
  { id: 'ai-1', activity_id: 'act-8', name: 'Miscellaneous & Arrival Garland / Water', unit_price_inr: 500, qty: 1, pricing_type: 'per_group' },
  { id: 'ai-2', activity_id: 'act-7', name: 'Chandragiri Cable Car Both Ways Ticket', unit_price_inr: 1500, qty: 2, pricing_type: 'per_pax' }
];

// Guide Cost Catalog (Tariffs based in Nepalese Rupees - NPR)
export const MASTER_GUIDE_OPTIONS = [
  { id: 'g-1', name: 'English Speaking Guide - Kathmandu Valley (Full Day)', rate_per_day_npr: 2000, rate_per_day_inr: 1250, rate_per_day_usd: 15, city: 'Kathmandu' },
  { id: 'g-2', name: 'English Speaking Guide - Pokhara Sightseeing (Half Day)', rate_per_day_npr: 1500, rate_per_day_inr: 938, rate_per_day_usd: 11, city: 'Pokhara' },
  { id: 'g-3', name: 'Licensed Tour Escort (KTM + PKR Valley)', rate_per_day_npr: 2500, rate_per_day_inr: 1563, rate_per_day_usd: 18, city: 'Combined' },
  { id: 'g-4', name: 'Language Guide (French / German / Spanish / Japanese)', rate_per_day_npr: 3500, rate_per_day_inr: 2188, rate_per_day_usd: 26, city: 'Kathmandu' }
];

export const INITIAL_GUIDE_ITEMS = [
  { id: 'gi-1', guide_id: 'g-3', name: 'Licensed Tour Escort (KTM + PKR Valley)', rate_per_day_inr: 2000, days: 3, notes: 'Kathmandu + Pokhara valley tours' }
];

// Helper to generate day-by-day itinerary from active transport sectors
export function generateItineraryFromTransport(transportItems = [], availableRoutes = MASTER_TRANSPORT_ROUTES, hotelRows = []) {
  if (!transportItems || transportItems.length === 0) {
    return [];
  }

  // Create lookup for hotel per city
  const hotelsByCity = {};
  hotelRows.forEach(row => {
    if (row.city && row.hotel_name) {
      hotelsByCity[row.city.toLowerCase()] = row.hotel_name;
    }
  });

  return transportItems.map((item, index) => {
    const matchedRoute = (availableRoutes || MASTER_TRANSPORT_ROUTES).find(r => r.id === item.route_id || r.name === item.name) || MASTER_TRANSPORT_ROUTES[0];
    const dayNumber = index + 1;
    const city = matchedRoute?.default_city || matchedRoute?.category || 'Kathmandu';
    const hotelForCity = hotelsByCity[city.toLowerCase()] || (city.toLowerCase().includes('pokhara') ? 'Trekkers Inn' : 'Hotel Wood Apple');

    return {
      id: 'day-' + (item.id || index + 1),
      transportItemId: item.id,
      dayNumber: dayNumber,
      title: matchedRoute?.default_itinerary_title || `${item.name}`,
      transportRouteId: item.route_id || matchedRoute?.id || '',
      transportRouteName: item.name || matchedRoute?.name || 'Sector Transfer',
      description: matchedRoute?.default_itinerary_desc || `Private sector transfer and exploration for ${item.name}. Enjoy scheduled sightseeing with our experienced chauffeur.`,
      highlights: matchedRoute?.default_highlights || [item.name],
      meals: matchedRoute?.default_meals || 'Breakfast (CP)',
      overnightStay: city === 'Departure' ? 'Flight Home / Departure' : `${city} (${hotelForCity})`,
      city: city
    };
  });
}

// Smart sync that removes deleted transport days, adds new ones, updates changed routes, and preserves custom user edits
export function syncItineraryWithTransportList(newTransportItems = [], currentItineraryDays = [], availableRoutes = MASTER_TRANSPORT_ROUTES, hotelRows = []) {
  if (!newTransportItems || newTransportItems.length === 0) {
    // Keep only custom days without transportItemId
    const customOnly = (currentItineraryDays || []).filter(d => !d.transportItemId);
    return customOnly.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
  }

  const hotelsByCity = {};
  hotelRows.forEach(row => {
    if (row.city && row.hotel_name) {
      hotelsByCity[row.city.toLowerCase()] = row.hotel_name;
    }
  });

  const existingDaysMap = new Map();
  (currentItineraryDays || []).forEach(day => {
    if (day.transportItemId) {
      existingDaysMap.set(day.transportItemId, day);
    }
  });

  const activeTransportIds = new Set(newTransportItems.map(item => item.id));

  const syncedDays = [];

  newTransportItems.forEach((item, index) => {
    const existing = existingDaysMap.get(item.id);
    const matchedRoute = (availableRoutes || MASTER_TRANSPORT_ROUTES).find(r => r.id === item.route_id || r.name === item.name) || MASTER_TRANSPORT_ROUTES[0];
    const city = matchedRoute?.default_city || matchedRoute?.category || 'Kathmandu';
    const hotelForCity = hotelsByCity[city.toLowerCase()] || (city.toLowerCase().includes('pokhara') ? 'Trekkers Inn' : 'Hotel Wood Apple');

    if (existing) {
      // If the route was switched on this transport item
      const routeChanged = existing.transportRouteId !== item.route_id && item.route_id;
      syncedDays.push({
        ...existing,
        dayNumber: index + 1,
        transportItemId: item.id,
        transportRouteId: item.route_id || matchedRoute?.id || '',
        transportRouteName: item.name || matchedRoute?.name || '',
        title: routeChanged ? (matchedRoute?.default_itinerary_title || item.name) : existing.title,
        description: routeChanged ? (matchedRoute?.default_itinerary_desc || existing.description) : existing.description,
        highlights: routeChanged ? (matchedRoute?.default_highlights || existing.highlights) : existing.highlights,
        meals: routeChanged ? (matchedRoute?.default_meals || existing.meals) : existing.meals,
        overnightStay: existing.overnightStay || (city === 'Departure' ? 'Flight Home / Departure' : `${city} (${hotelForCity})`),
        city: city
      });
    } else {
      // Create new itinerary day for newly added transport sector
      syncedDays.push({
        id: 'day-' + item.id,
        transportItemId: item.id,
        dayNumber: index + 1,
        title: matchedRoute?.default_itinerary_title || `${item.name}`,
        transportRouteId: item.route_id || matchedRoute?.id || '',
        transportRouteName: item.name || matchedRoute?.name || 'Sector Transfer',
        description: matchedRoute?.default_itinerary_desc || `Private sector transfer and exploration for ${item.name}.`,
        highlights: matchedRoute?.default_highlights || [item.name],
        meals: matchedRoute?.default_meals || 'Breakfast (CP)',
        overnightStay: city === 'Departure' ? 'Flight Home / Departure' : `${city} (${hotelForCity})`,
        city: city
      });
    }
  });

  // Preserve any purely custom user-added days that don't have transportItemId
  const customDays = (currentItineraryDays || []).filter(d => !d.transportItemId);
  const combined = [...syncedDays, ...customDays].map((d, idx) => ({
    ...d,
    dayNumber: idx + 1
  }));

  return combined;
}

// Master Multi-Variant Itinerary Presets Catalog
export const MASTER_ITINERARY_TEMPLATES = [
  // 1. ARRIVAL Presets
  {
    id: 'itpl-1-1',
    route_identifier: 't-1',
    route_name: 'ARRIVAL - KTM Airport Pick-up',
    template_name: 'Standard Welcome & Thamel Stroll',
    title: 'Arrival in Kathmandu & Transfer to Hotel',
    description: 'Warm traditional welcome on arrival at Tribhuvan International Airport (KTM) with marigold garlands. Meet our representative and transfer by private vehicle to your hotel. Complete check-in formalities, enjoy a welcome beverage, and receive a comprehensive trip briefing. Evening free to stroll through the vibrant lanes of Thamel.',
    highlights: ['Airport Welcome Garland', 'Private Hotel Transfer', 'Trip Orientation', 'Thamel Evening Walk'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: true
  },
  {
    id: 'itpl-1-2',
    route_identifier: 't-1',
    route_name: 'ARRIVAL - KTM Airport Pick-up',
    template_name: 'VIP Welcome & Authentic Cultural Dinner',
    title: 'VIP Airport Reception & Authentic Cultural Dinner',
    description: 'Arrive at Kathmandu International Airport. Receive a royal welcome with silk Khadas and flower garlands. Private transfer to your luxury hotel. In the evening, attend a special welcome Nepali dinner at a traditional palace restaurant featuring live cultural folk music and ethnic dance performances.',
    highlights: ['Silk Khada & Garland Welcome', 'Executive Transfer', 'Traditional Nepali Dinner', 'Live Folk Cultural Dance'],
    meals: 'Dinner Included (MAP)',
    city: 'Kathmandu',
    is_default: false
  },

  // 2. KTM FULL DAY SS Presets
  {
    id: 'itpl-2-1',
    route_identifier: 't-2',
    route_name: 'KTM SS - FULL DAY Sightseeing',
    template_name: 'Classic 4 UNESCO Heritage Sites',
    title: 'Kathmandu Valley UNESCO World Heritage Cultural Tour',
    description: 'After breakfast at hotel, embark on a full-day guided exploration of Kathmandu Valley’s UNESCO World Heritage treasures. Visit the sacred Hindu shrine of Pashupatinath along the Bagmati River, circumambulate the massive Buddhist dome of Boudhanath Stupa, explore ancient Kathmandu Durbar Square with the Kumari Ghar, and witness breathtaking sunset views from the hilltop Swayambhunath (Monkey Temple).',
    highlights: ['Pashupatinath Temple', 'Boudhanath Stupa', 'Kathmandu Durbar Square', 'Swayambhunath Stupa'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: true
  },
  {
    id: 'itpl-2-2',
    route_identifier: 't-2',
    route_name: 'KTM SS - FULL DAY Sightseeing',
    template_name: 'Medieval Royalty: Bhaktapur & Patan Cities',
    title: 'Medieval Royalty & Architectural Marvels of Bhaktapur and Patan',
    description: 'Spend the day discovering the ancient royal city of Bhaktapur with its 55-Window Palace, Golden Gate, and soaring Nyatapola Temple. In the afternoon, visit Patan Durbar Square, the City of Fine Arts, to admire the Krishna Mandir, Golden Temple, and traditional bronze craft workshops.',
    highlights: ['Bhaktapur 55-Window Palace', 'Nyatapola Temple', 'Patan Durbar Square', 'Traditional Metalcraft Workshops'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: false
  },
  {
    id: 'itpl-2-3',
    route_identifier: 't-2',
    route_name: 'KTM SS - FULL DAY Sightseeing',
    template_name: 'Spiritual Heritage: Boudha, Pashupati & Kirtipur',
    title: 'Spiritual Kathmandu & Ancient Newari Hill-Town Kirtipur',
    description: 'Morning prayer meditation and kora around the colossal Boudhanath Stupa. Visit Pashupatinath to observe holy Sadhus and sacred rituals. In the afternoon, explore the fortified hilltop Newari settlement of Kirtipur with its cobblestone alleys, Chilamchu stupa, and panoramic valley outlook.',
    highlights: ['Boudhanath Kora', 'Pashupatinath Sacred Shrines', 'Kirtipur Historic Town', 'Panoramic Views'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: false
  },

  // 3. PKR HALF DAY SS Presets
  {
    id: 'itpl-3-1',
    route_identifier: 't-3',
    route_name: 'PKR HALF DAY Sightseeing',
    template_name: 'Standard Heritage, Falls & Shanti Stupa',
    title: 'Pokhara City Highlights & Shanti Stupa Sightseeing',
    description: 'Morning drive from hotel to Davis Falls (Patale Chhango) to watch the cascading torrent plunge into an underground tunnel. Explore the sacred Gupteshwor Mahadev Cave directly opposite, visit the deep geological chasm of Seti River Gorge, and stop by the Tibetan Refugee Settlement. Enjoy a delicious lakeside lunch, then take a scenic drive up to the World Peace Pagoda (Shanti Stupa) for panoramic views of Phewa Lake and the Annapurna range.',
    highlights: ['Davis Falls', 'Gupteshwor Mahadev Cave', 'Seti River Gorge', 'World Peace Pagoda (Shanti Stupa)'],
    meals: 'Breakfast (CP)',
    city: 'Pokhara',
    is_default: true
  },
  {
    id: 'itpl-3-2',
    route_identifier: 't-3',
    route_name: 'PKR HALF DAY Sightseeing',
    template_name: 'Tibetan Culture & Old Pokhara Bazaar',
    title: 'Tibetan Cultural Immersion & Old Pokhara Heritage',
    description: 'Explore the historic Old Pokhara Bazaar and the ancient Bindhyabasini Temple. Visit the vibrant Tibetan Refugee Camp to observe traditional carpet weaving and handicraft making. Ascend to the peaceful Matepani Buddhist Monastery atop a hillock overlooking the valley to hear monks chanting afternoon prayers.',
    highlights: ['Bindhyabasini Temple', 'Old Pokhara Bazaar', 'Tibetan Refugee Handicrafts', 'Matepani Buddhist Monastery'],
    meals: 'Breakfast (CP)',
    city: 'Pokhara',
    is_default: false
  },
  {
    id: 'itpl-3-3',
    route_identifier: 't-3',
    route_name: 'PKR HALF DAY Sightseeing',
    template_name: 'Pumdikot Shiva Statue & Begnas Lake Serenity',
    title: 'Pumdikot 108-ft Shiva Statue & Begnas Lake Escape',
    description: 'Scenic drive up to Pumdikot to marvel at the 108-foot colossal Lord Shiva statue with 360-degree vistas. Continue to Davis Falls and Gupteshwor Cave, followed by a scenic drive to the serene, crowd-free Begnas Lake for a tranquil afternoon boat ride and fresh fish lunch.',
    highlights: ['108-ft Pumdikot Shiva Statue', 'Davis Falls & Cave', 'Tranquil Begnas Lake Boating', 'Scenic Mountain Vistas'],
    meals: 'Breakfast (CP)',
    city: 'Pokhara',
    is_default: false
  },

  // 4. SARANKOT SUNRISE Presets
  {
    id: 'itpl-4-1',
    route_identifier: 't-4',
    route_name: 'PKR - SARANKOT Sunrise Excursion',
    template_name: 'Sunrise Mountain View & Lake Boating',
    title: 'Sarangkot Sunrise Mountain View & Phewa Lake Boating',
    description: 'Early morning (05:00 AM) drive up to Sarangkot hilltop viewpoint. Witness the spellbinding golden sunrise illuminating the towering peaks of Annapurna I, II, III, IV, Dhaulagiri, and the sacred Machhapuchhre (Fishtail). Return to the hotel for a hearty breakfast. Afternoon tranquil 1-hour boat ride on Phewa Lake with a visit to the island temple of Tal Barahi.',
    highlights: ['Sarangkot Sunrise Over Annapurnas', 'Fishtail Peak Panorama', 'Phewa Lake Boating', 'Tal Barahi Island Temple'],
    meals: 'Breakfast (CP)',
    city: 'Pokhara',
    is_default: true
  },
  {
    id: 'itpl-4-2',
    route_identifier: 't-4',
    route_name: 'PKR - SARANKOT Sunrise Excursion',
    template_name: 'Sunrise & Tandem Paragliding Adventure',
    title: 'Sarangkot Sunrise & Thrilling Tandem Paragliding Adventure',
    description: 'Early sunrise at Sarangkot with Himalayan panorama. Following sunrise, thrill-seekers can strap in for an exhilarating tandem paragliding flight gliding alongside Himalayan eagles above Phewa Lake with stunning GoPro aerial photos and video footage.',
    highlights: ['Sarangkot Mountain Sunrise', 'Tandem Paragliding Flight', 'Aerial Phewa Lake Views', 'GoPro Photos/Videos'],
    meals: 'Breakfast (CP)',
    city: 'Pokhara',
    is_default: false
  },

  // 5. PUMDIKOT SHIVA Presets
  {
    id: 'itpl-5-1',
    route_identifier: 't-5',
    route_name: 'PUMDIKOT PKR - Shiva Statue Excursion',
    template_name: 'Colossal Shiva & Ridge Panoramas',
    title: 'Pumdikot Colossal Shiva Statue & Pokhara Ridge Excursion',
    description: 'Scenic drive along the southern ridge of Pokhara to visit the majestic 108-foot colossal Lord Shiva statue at Pumdikot. Enjoy 360-degree panoramic vistas of the entire Pokhara Valley, Phewa Lake below, and the snow-capped Himalayan horizon. Perfect spot for photography and spiritual tranquility.',
    highlights: ['108-ft Pumdikot Shiva Statue', '360° Pokhara Valley Vista', 'Himalayan Ridge Photography'],
    meals: 'Breakfast (CP)',
    city: 'Pokhara',
    is_default: true
  },

  // 6. CHANDRAGIRI CABLE CAR Presets
  {
    id: 'itpl-6-1',
    route_identifier: 't-6',
    route_name: 'CHANDRAGIRI CABLE CAR Transfer',
    template_name: 'Gondola Cable Car & Everest Views',
    title: 'Chandragiri Hills Cable Car & Himalayan View Excursion',
    description: 'Morning transfer from Kathmandu hotel to Thankot Cable Car base station. Board the scenic 2.5 km gondola lift soaring above lush green forests to reach Chandragiri Top (2,551m). Experience awe-inspiring panoramic vistas of Mount Everest, Ganesh Himal, Langtang, and Manaslu ranges. Visit the historic Bhaleshwor Mahadev Temple, enjoy mountain-top lunch, and return via cable car to Kathmandu.',
    highlights: ['Scenic Gondola Cable Car Ride', 'Bhaleshwor Mahadev Temple', 'Panoramic Everest & Langtang Views'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: true
  },
  {
    id: 'itpl-6-2',
    route_identifier: 't-6',
    route_name: 'CHANDRAGIRI CABLE CAR Transfer',
    template_name: 'Cable Car Top & Sunset Photography',
    title: 'Chandragiri Ridge Exploration & Mountain Sunset',
    description: 'Afternoon cable car ride ascending into the clouds atop Chandragiri Hill. Explore the lush botanical walking trails, visit the Shiva shrine, and witness a spectacular golden sunset over the Greater Himalayan mountain ranges before descending back.',
    highlights: ['Gondola Forest Flight', 'Golden Mountain Sunset', 'High-Altitude Walking Trail'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: false
  },

  // 7. KTM - PKR FLIGHT DROP Presets
  {
    id: 'itpl-7-1',
    route_identifier: 't-7',
    route_name: 'KTM - PKR Domestic Departure Drop',
    template_name: 'Scenic Mountain Flight to Pokhara',
    title: 'Kathmandu to Pokhara Scenic Mountain Flight / Transfer',
    description: 'Breakfast at hotel, private transfer to Kathmandu Domestic Airport. Board the spectacular 25-minute scenic mountain flight to Pokhara with breathtaking views of the central Himalayas. On arrival at Pokhara Airport, meet our local representative and transfer to your lakeside hotel. Free afternoon to enjoy leisurely café hopping by Phewa Lake.',
    highlights: ['Domestic Airport Transfer', 'Scenic Mountain Flight', 'Pokhara Hotel Check-in', 'Lakeside Leisure'],
    meals: 'Breakfast (CP)',
    city: 'Pokhara',
    is_default: true
  },

  // 8. PKR DOMESTIC DROP Presets
  {
    id: 'itpl-8-1',
    route_identifier: 't-8',
    route_name: 'PKR Domestic Airport Drop',
    template_name: 'Pokhara Airport Transfer',
    title: 'Pokhara Departure to Kathmandu / Next Destination',
    description: 'Enjoy morning breakfast overlooking the tranquil Phewa Lake. Check out from Pokhara hotel and transfer by private vehicle to Pokhara Domestic Airport for your scheduled return flight to Kathmandu or onward travel.',
    highlights: ['Hotel Check-out', 'Pokhara Airport Private Transfer', 'Departure Flight Assistance'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: true
  },

  // 9. PKR - KTM ARRIVAL PICKUP Presets
  {
    id: 'itpl-9-1',
    route_identifier: 't-9',
    route_name: 'PKR - KTM Domestic Arrival Pick-up',
    template_name: 'Kathmandu Arrival & Souvenir Shopping',
    title: 'Arrival in Kathmandu & Souvenir Shopping',
    description: 'Meet our driver upon arrival at Kathmandu Domestic Terminal and transfer to your hotel. Afternoon is free for last-minute souvenir shopping in Thamel and Basantapur for authentic Pashmina shawls, singing bowls, tea, and handicrafts.',
    highlights: ['Domestic Airport Pickup', 'Hotel Transfer', 'Thamel Souvenir Shopping'],
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: true
  },

  // 10. DEPARTURE Presets
  {
    id: 'itpl-10-1',
    route_identifier: 't-10',
    route_name: 'DEPARTURE - KTM International Drop',
    template_name: 'Standard International Departure Drop',
    title: 'Final Departure from Kathmandu with Golden Memories',
    description: 'Savor your final breakfast in Nepal. Depending on your flight schedule, enjoy any remaining free time for packing and exploration. Our private vehicle will pick you up from the hotel 3 hours prior to your international flight departure and transfer you to Tribhuvan International Airport (KTM) for your journey home.',
    highlights: ['Hotel Check-out', 'Tribhuvan International Airport Transfer', 'Farewell Nepal'],
    meals: 'Breakfast (CP)',
    city: 'Departure',
    is_default: true
  },
  {
    id: 'itpl-10-2',
    route_identifier: 't-10',
    route_name: 'DEPARTURE - KTM International Drop',
    template_name: 'Morning Shopping & Farewell Airport Transfer',
    title: 'Last-Minute Thamel Shopping & Airport Farewell',
    description: 'Morning dedicated to last-minute souvenir shopping in Thamel for authentic cashmere pashminas, organic Himalayan teas, handmade paper journals, and prayer flags. Afternoon private transfer to Kathmandu Airport with warm farewells.',
    highlights: ['Thamel Handicrafts Shopping', 'Pashmina & Tea Buying', 'Airport Farewell Drop'],
    meals: 'Breakfast (CP)',
    city: 'Departure',
    is_default: false
  }
];

// Initial Default Itinerary Days for Default Transport Package
export const INITIAL_ITINERARY_DAYS = generateItineraryFromTransport(INITIAL_TRANSPORT_ITEMS, MASTER_TRANSPORT_ROUTES, INITIAL_HOTEL_ROWS);

// Sample Past / Finalized Quotations with Materialized, Pending, and Lost status tags
export const SAMPLE_PAST_QUOTATIONS = [
  {
    id: 'q-sample-1',
    quote_number: 'FT-2026-1042',
    client_name: 'Apex Voyages India / Rajiv Sharma',
    prepared_by: 'Subhash Rajbhandari',
    trip_title: 'Kathmandu - Pokhara - Chitwan - Chandragiri 7D/6N Tour',
    quote_date: '2026-08-25',
    pax_adults: 4,
    single_rooms_count: 0,
    total_nights: 6,
    hotel_currency: 'INR',
    transport_currency: 'NPR',
    additional_currency: 'NPR',
    guide_currency: 'NPR',
    usd_rate: 135.5,
    hotel_rows: INITIAL_HOTEL_ROWS,
    transport_items: INITIAL_TRANSPORT_ITEMS,
    additional_items: INITIAL_ADDITIONAL_ITEMS,
    guide_items: INITIAL_GUIDE_ITEMS,
    itinerary_days: INITIAL_ITINERARY_DAYS,
    margin_per_pax: 2500,
    net_package_cost_npr: 21500,
    final_adult_rate_npr: 24000,
    group_grand_total_npr: 96000,
    status: 'materialized',
    materialized_at: '2026-08-28T10:30:00Z',
    notes: 'Advance 25% received via bank transfer. Confirmed vehicle: Scorpio 4WD. Wood Apple + Trekkers Inn reserved.',
    created_at: '2026-08-25T08:15:00Z',
    updated_at: '2026-08-28T10:30:00Z'
  },
  {
    id: 'q-sample-2',
    quote_number: 'FT-2026-2189',
    client_name: 'Global Trek Explorers / Sarah Jenkins',
    prepared_by: 'Pooja Shrestha',
    trip_title: 'Nepal Heritage & Himalayan Sunrise 5D/4N Package',
    quote_date: '2026-09-01',
    pax_adults: 2,
    single_rooms_count: 0,
    total_nights: 4,
    hotel_currency: 'USD',
    transport_currency: 'NPR',
    additional_currency: 'USD',
    guide_currency: 'NPR',
    usd_rate: 135.5,
    hotel_rows: INITIAL_HOTEL_ROWS.slice(0, 2),
    transport_items: INITIAL_TRANSPORT_ITEMS.slice(0, 4),
    additional_items: INITIAL_ADDITIONAL_ITEMS,
    guide_items: INITIAL_GUIDE_ITEMS,
    itinerary_days: INITIAL_ITINERARY_DAYS.slice(0, 4),
    margin_per_pax: 3000,
    net_package_cost_npr: 18200,
    final_adult_rate_npr: 21200,
    group_grand_total_npr: 42400,
    status: 'pending',
    materialized_at: null,
    notes: 'Quotation sent to Sarah via email. Awaiting confirmation after their flight booking on Sept 10.',
    created_at: '2026-09-01T09:45:00Z',
    updated_at: '2026-09-01T09:45:00Z'
  },
  {
    id: 'q-sample-3',
    quote_number: 'FT-2026-3350',
    client_name: 'Zenith Holidays Malaysia / Tan Wee Kiat',
    prepared_by: 'Subhash Rajbhandari',
    trip_title: 'Kathmandu & Pokhara Luxury Scenic Escape 6D/5N',
    quote_date: '2026-09-03',
    pax_adults: 6,
    single_rooms_count: 1,
    total_nights: 5,
    hotel_currency: 'INR',
    transport_currency: 'NPR',
    additional_currency: 'NPR',
    guide_currency: 'NPR',
    usd_rate: 135.5,
    hotel_rows: INITIAL_HOTEL_ROWS,
    transport_items: INITIAL_TRANSPORT_ITEMS,
    additional_items: INITIAL_ADDITIONAL_ITEMS,
    guide_items: INITIAL_GUIDE_ITEMS,
    itinerary_days: INITIAL_ITINERARY_DAYS,
    margin_per_pax: 3500,
    net_package_cost_npr: 28500,
    final_adult_rate_npr: 32000,
    group_grand_total_npr: 204000,
    status: 'negotiation',
    materialized_at: null,
    notes: 'Client requested 5% discount for 6 pax group or free Chandragiri cable car ticket.',
    created_at: '2026-09-03T11:20:00Z',
    updated_at: '2026-09-04T14:10:00Z'
  },
  {
    id: 'q-sample-4',
    quote_number: 'FT-2026-4011',
    client_name: 'Direct Guest - Ananya & Friends',
    prepared_by: 'Anil Gurung',
    trip_title: 'Pokhara Sarangkot Sunrise & Adventure Excursion 4D/3N',
    quote_date: '2026-08-30',
    pax_adults: 3,
    single_rooms_count: 0,
    total_nights: 3,
    hotel_currency: 'INR',
    transport_currency: 'NPR',
    additional_currency: 'NPR',
    guide_currency: 'NPR',
    usd_rate: 135.5,
    hotel_rows: [INITIAL_HOTEL_ROWS[2]],
    transport_items: [INITIAL_TRANSPORT_ITEMS[2], INITIAL_TRANSPORT_ITEMS[3]],
    additional_items: INITIAL_ADDITIONAL_ITEMS,
    guide_items: [],
    itinerary_days: INITIAL_ITINERARY_DAYS.slice(0, 3),
    margin_per_pax: 2000,
    net_package_cost_npr: 14000,
    final_adult_rate_npr: 16000,
    group_grand_total_npr: 48000,
    status: 'materialized',
    materialized_at: '2026-09-02T16:00:00Z',
    notes: 'Materialized & Booked! Full advance received via eSewa. Trekker’s Inn Lakeview rooms confirmed.',
    created_at: '2026-08-30T15:30:00Z',
    updated_at: '2026-09-02T16:00:00Z'
  },
  {
    id: 'q-sample-5',
    quote_number: 'FT-2026-5120',
    client_name: 'Heritage Travels Sri Lanka',
    prepared_by: 'Subhash Rajbhandari',
    trip_title: 'Kathmandu Valley Pilgrimage Tour 3D/2N',
    quote_date: '2026-08-18',
    pax_adults: 10,
    single_rooms_count: 0,
    total_nights: 2,
    hotel_currency: 'INR',
    transport_currency: 'NPR',
    additional_currency: 'NPR',
    guide_currency: 'NPR',
    usd_rate: 135.5,
    hotel_rows: [INITIAL_HOTEL_ROWS[0]],
    transport_items: [INITIAL_TRANSPORT_ITEMS[0], INITIAL_TRANSPORT_ITEMS[1], INITIAL_TRANSPORT_ITEMS[5]],
    additional_items: [],
    guide_items: INITIAL_GUIDE_ITEMS,
    itinerary_days: INITIAL_ITINERARY_DAYS.slice(0, 3),
    margin_per_pax: 1500,
    net_package_cost_npr: 8500,
    final_adult_rate_npr: 10000,
    group_grand_total_npr: 100000,
    status: 'lost',
    materialized_at: null,
    notes: 'Tour cancelled due to flight schedule rescheduling by Sri Lankan Airlines.',
    created_at: '2026-08-18T10:00:00Z',
    updated_at: '2026-08-24T09:00:00Z'
  }
];


