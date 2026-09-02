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

// Master Transportation Rates (Tariffs based in Nepalese Rupees - NPR)
export const MASTER_TRANSPORT_ROUTES = [
  { 
    id: 't-1', 
    name: 'ARRIVAL - KTM Airport Pick-up', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Airport to Hotel transfer'
  },
  { 
    id: 't-2', 
    name: 'KTM SS - FULL DAY Sightseeing', 
    category: 'Kathmandu', 
    car_npr: 4000, scorpio_npr: 6000, hiace_npr: 7000, coaster_npr: 9000, shuttle_npr: 11000, 
    car_inr: 2500, scorpio_inr: 3750, hiace_inr: 4375, coaster_inr: 5625, shuttle_inr: 6875,
    base_car_npr: 4000, base_scorpio_npr: 6000, base_hiace_npr: 7000, base_coaster_npr: 9000, base_shuttle_npr: 11000,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Pashupatinath, Boudhanath, Swayambhu, Durbar Sq'
  },
  { 
    id: 't-3', 
    name: 'PKR HALF DAY Sightseeing', 
    category: 'Pokhara', 
    car_npr: 2000, scorpio_npr: 3000, hiace_npr: 3500, coaster_npr: 4500, shuttle_npr: 5500, 
    car_inr: 1250, scorpio_inr: 1875, hiace_inr: 2188, coaster_inr: 2813, shuttle_inr: 3438,
    base_car_npr: 2000, base_scorpio_npr: 3000, base_hiace_npr: 3500, base_coaster_npr: 4500, base_shuttle_npr: 5500,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Davis Falls, Gupteshwor, Seti River gorge'
  },
  { 
    id: 't-4', 
    name: 'PKR - SARANKOT Sunrise Excursion', 
    category: 'Pokhara', 
    car_npr: 6500, scorpio_npr: 9750, hiace_npr: 11375, coaster_npr: 14625, shuttle_npr: 17875, 
    car_inr: 4063, scorpio_inr: 6094, hiace_inr: 7109, coaster_inr: 9141, shuttle_inr: 11172,
    base_car_npr: 6500, base_scorpio_npr: 9750, base_hiace_npr: 11375, base_coaster_npr: 14625, base_shuttle_npr: 17875,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Early morning sunrise viewing trip'
  },
  { 
    id: 't-5', 
    name: 'PUMDIKOT PKR - Shiva Statue Excursion', 
    category: 'Pokhara', 
    car_npr: 2500, scorpio_npr: 3750, hiace_npr: 4375, coaster_npr: 5625, shuttle_npr: 6875, 
    car_inr: 1563, scorpio_inr: 2344, hiace_inr: 2734, coaster_inr: 3516, shuttle_inr: 4297,
    base_car_npr: 2500, base_scorpio_npr: 3750, base_hiace_npr: 4375, base_coaster_npr: 5625, base_shuttle_npr: 6875,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Shiva statue and scenic valley view'
  },
  { 
    id: 't-6', 
    name: 'CHANDRAGIRI CABLE CAR Transfer', 
    category: 'Kathmandu', 
    car_npr: 4000, scorpio_npr: 6000, hiace_npr: 7000, coaster_npr: 9000, shuttle_npr: 11000, 
    car_inr: 2500, scorpio_inr: 3750, hiace_inr: 4375, coaster_inr: 5625, shuttle_inr: 6875,
    base_car_npr: 4000, base_scorpio_npr: 6000, base_hiace_npr: 7000, base_coaster_npr: 9000, base_shuttle_npr: 11000,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'City hotel to Cable Car Station round-trip'
  },
  { 
    id: 't-7', 
    name: 'KTM - PKR Domestic Departure Drop', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Hotel to KTM domestic terminal'
  },
  { 
    id: 't-8', 
    name: 'PKR Domestic Airport Drop', 
    category: 'Airport', 
    car_npr: 1500, scorpio_npr: 2250, hiace_npr: 2625, coaster_npr: 3375, shuttle_npr: 4125, 
    car_inr: 938, scorpio_inr: 1406, hiace_inr: 1641, coaster_inr: 2109, shuttle_inr: 2578,
    base_car_npr: 1500, base_scorpio_npr: 2250, base_hiace_npr: 2625, base_coaster_npr: 3375, base_shuttle_npr: 4125,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Pokhara hotel to airport drop'
  },
  { 
    id: 't-9', 
    name: 'PKR - KTM Domestic Arrival Pick-up', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Arrival pick-up from domestic airport'
  },
  { 
    id: 't-10', 
    name: 'DEPARTURE - KTM International Drop', 
    category: 'Airport', 
    car_npr: 1000, scorpio_npr: 1500, hiace_npr: 1750, coaster_npr: 2250, shuttle_npr: 2750, 
    car_inr: 625, scorpio_inr: 938, hiace_inr: 1094, coaster_inr: 1406, shuttle_inr: 1719,
    base_car_npr: 1000, base_scorpio_npr: 1500, base_hiace_npr: 1750, base_coaster_npr: 2250, base_shuttle_npr: 2750,
    season_note: 'Standard Tariff', is_custom_rate: false, notes: 'Hotel to Tribhuvan Int. Airport'
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
