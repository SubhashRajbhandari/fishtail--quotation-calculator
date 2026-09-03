-- ===================================================================
-- Supabase Schema for FishTail Travel Quotation Maker (Multi-Currency & Seasonal Rates)
-- Pure React + Supabase (Direct Client Connection)
-- ===================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to automatically update `updated_at` timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Hotels Table with Multi-Currency Rates (INR, NPR, USD) & Base Standard Rates
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Kathmandu',
    category TEXT NOT NULL DEFAULT 'Premier', -- Premier, Luxury, Deluxe, Standard
    meal_plan TEXT DEFAULT 'CP',             -- EP, CP (Breakfast), MAP, AP (Full Board)
    star_rating INT DEFAULT 3,
    
    -- Current Active Rates (Can be seasonally modified by user)
    half_twin_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    single_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    half_twin_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    single_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    
    half_twin_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    single_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

    -- Base Standard Standard Rates (Allows 1-click revert to original base tariff)
    base_half_twin_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_single_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_half_twin_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_single_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_half_twin_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_single_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

    -- Seasonal notes / validity info (e.g. "July Off-Season Special: 1200 INR", "Oct-Nov Peak: 1500 INR")
    season_note TEXT DEFAULT 'Standard Tariff',
    is_custom_rate BOOLEAN DEFAULT FALSE,
    notes TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hotels_name ON public.hotels(name);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON public.hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_category ON public.hotels(category);

-- Auto-update trigger for hotels
DROP TRIGGER IF EXISTS trigger_update_hotels_timestamp ON public.hotels;
CREATE TRIGGER trigger_update_hotels_timestamp
BEFORE UPDATE ON public.hotels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. Quotations Table (Persistent Quote History)
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    trip_title TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR', -- 'INR', 'NPR', 'USD'
    pax_adults INT DEFAULT 2,
    pax_children INT DEFAULT 0,
    travel_dates TEXT DEFAULT '',
    hotel_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_nights INT DEFAULT 0,
    total_half_twin NUMERIC(12, 2) DEFAULT 0.00,
    total_single_room NUMERIC(12, 2) DEFAULT 0.00,
    grand_total NUMERIC(12, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'draft',
    remarks TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Row Level Security (RLS) Policies
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon full access on hotels" ON public.hotels;
CREATE POLICY "Allow anon full access on hotels" 
ON public.hotels 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access on quotations" ON public.quotations;
CREATE POLICY "Allow anon full access on quotations" 
ON public.quotations 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Seed Initial Hotels with Complete Multi-Currency Rates (INR, NPR, USD)
INSERT INTO public.hotels (
    name, city, category, meal_plan, star_rating,
    half_twin_inr, single_inr,
    half_twin_npr, single_npr,
    half_twin_usd, single_usd,
    base_half_twin_inr, base_single_inr,
    base_half_twin_npr, base_single_npr,
    base_half_twin_usd, base_single_usd,
    season_note, is_custom_rate, notes
)
VALUES
    (
        'HOTEL WOOD APPLE', 'Kathmandu', 'Premier', 'CP', 3,
        1500.00, 2500.00,
        2400.00, 4000.00,
        20.00, 32.00,
        1500.00, 2500.00,
        2400.00, 4000.00,
        20.00, 32.00,
        'Standard Tariff', FALSE, 'Boutique hotel in Kathmandu center'
    ),
    (
        'HOTEL KAUSI', 'Kathmandu', 'Premier', 'CP', 3,
        1250.00, 2000.00,
        2000.00, 3200.00,
        16.00, 26.00,
        1250.00, 2000.00,
        2000.00, 3200.00,
        16.00, 26.00,
        'Standard Tariff', FALSE, 'Cozy heritage stay with rooftop garden'
    ),
    (
        'TREKKERS INN', 'Pokhara', 'Premier', 'CP', 3,
        2200.00, 3500.00,
        3520.00, 5600.00,
        28.00, 45.00,
        2200.00, 3500.00,
        3520.00, 5600.00,
        28.00, 45.00,
        'Standard Tariff', FALSE, 'Lakeside Pokhara hotel with mountain views'
    ),
    (
        'HOTEL MARSYANGDI', 'Kathmandu', 'Premier', 'CP', 3,
        1800.00, 3000.00,
        2880.00, 4800.00,
        24.00, 38.00,
        1800.00, 3000.00,
        2880.00, 4800.00,
        24.00, 38.00,
        'July Promo: 1200 INR (Regular: 1800 INR)', FALSE, 'Popular Thamel central hotel'
    ),
    (
        'FISH TAIL LODGE', 'Pokhara', 'Luxury', 'CP', 5,
        4500.00, 7500.00,
        7200.00, 12000.00,
        58.00, 95.00,
        4500.00, 7500.00,
        7200.00, 12000.00,
        58.00, 95.00,
        'Standard Tariff', FALSE, 'Iconic island resort on Phewa Lake'
    ),
    (
        'HOTEL BARAHI', 'Pokhara', 'Premier', 'CP', 4,
        2800.00, 4800.00,
        4480.00, 7680.00,
        36.00, 62.00,
        2800.00, 4800.00,
        4480.00, 7680.00,
        36.00, 62.00,
        'Standard Tariff', FALSE, 'Centrally located luxury resort in Lakeside'
    ),
    (
        'CLUB HIMALAYA', 'Nagarkot', 'Premier', 'CP', 4,
        3200.00, 5500.00,
        5120.00, 8800.00,
        42.00, 70.00,
        3200.00, 5500.00,
        5120.00, 8800.00,
        42.00, 70.00,
        'Standard Tariff', FALSE, 'Panoramic sunrise resort Nagarkot'
    ),
    (
        'ROYAL PARK HOTEL', 'Chitwan', 'Premier', 'AP', 3,
        2500.00, 4200.00,
        4000.00, 6720.00,
        32.00, 54.00,
        2500.00, 4200.00,
        4000.00, 6720.00,
        32.00, 54.00,
        'Standard Tariff', FALSE, 'Sauraha Chitwan Safari Resort (Full Board)'
    )
ON CONFLICT DO NOTHING;

-- ===================================================================
-- 6. Transportation Master Routes Table (Multi-Vehicle Category Rates)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Kathmandu', -- Kathmandu, Pokhara, Inter-City, Airport, Excursion
    notes TEXT DEFAULT '',
    season_note TEXT DEFAULT 'Standard Tariff',
    is_custom_rate BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    -- Current Active Rates in NPR (Base Currency)
    car_npr NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    scorpio_npr NUMERIC(12, 2) NOT NULL DEFAULT 1500.00,
    hiace_npr NUMERIC(12, 2) NOT NULL DEFAULT 1750.00,
    coaster_npr NUMERIC(12, 2) NOT NULL DEFAULT 2250.00,
    shuttle_npr NUMERIC(12, 2) NOT NULL DEFAULT 2750.00,

    -- Rates in INR
    car_inr NUMERIC(12, 2) NOT NULL DEFAULT 625.00,
    scorpio_inr NUMERIC(12, 2) NOT NULL DEFAULT 938.00,
    hiace_inr NUMERIC(12, 2) NOT NULL DEFAULT 1094.00,
    coaster_inr NUMERIC(12, 2) NOT NULL DEFAULT 1406.00,
    shuttle_inr NUMERIC(12, 2) NOT NULL DEFAULT 1719.00,

    -- Base Standard Rates in NPR (For 1-click restore)
    base_car_npr NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    base_scorpio_npr NUMERIC(12, 2) NOT NULL DEFAULT 1500.00,
    base_hiace_npr NUMERIC(12, 2) NOT NULL DEFAULT 1750.00,
    base_coaster_npr NUMERIC(12, 2) NOT NULL DEFAULT 2250.00,
    base_shuttle_npr NUMERIC(12, 2) NOT NULL DEFAULT 2750.00,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transport_routes_name ON public.transport_routes(name);
CREATE INDEX IF NOT EXISTS idx_transport_routes_category ON public.transport_routes(category);

-- Auto-update trigger for transport_routes
DROP TRIGGER IF EXISTS trigger_update_transport_routes_timestamp ON public.transport_routes;
CREATE TRIGGER trigger_update_transport_routes_timestamp
BEFORE UPDATE ON public.transport_routes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon full access on transport_routes" ON public.transport_routes;
CREATE POLICY "Allow anon full access on transport_routes" 
ON public.transport_routes 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Seed Initial Transport Routes
INSERT INTO public.transport_routes (
    name, category, notes, season_note,
    car_npr, scorpio_npr, hiace_npr, coaster_npr, shuttle_npr,
    car_inr, scorpio_inr, hiace_inr, coaster_inr, shuttle_inr,
    base_car_npr, base_scorpio_npr, base_hiace_npr, base_coaster_npr, base_shuttle_npr
)
VALUES
    ('ARRIVAL - KTM Airport Pick-up', 'Airport', 'Airport to Hotel transfer', 'Standard Tariff', 1000, 1500, 1750, 2250, 2750, 625, 938, 1094, 1406, 1719, 1000, 1500, 1750, 2250, 2750),
    ('KTM SS - FULL DAY Sightseeing', 'Kathmandu', 'Pashupatinath, Boudha, Swayambhu, Durbar Sq', 'Standard Tariff', 4000, 6000, 7000, 9000, 11000, 2500, 3750, 4375, 5625, 6875, 4000, 6000, 7000, 9000, 11000),
    ('PKR HALF DAY Sightseeing', 'Pokhara', 'Davis Falls, Gupteshwor, Seti River gorge', 'Standard Tariff', 2000, 3000, 3500, 4500, 5500, 1250, 1875, 2188, 2813, 3438, 2000, 3000, 3500, 4500, 5500),
    ('PKR - SARANKOT Sunrise Excursion', 'Pokhara', 'Early morning sunrise viewing trip', 'Standard Tariff', 6500, 9750, 11375, 14625, 17875, 4063, 6094, 7109, 9141, 11172, 6500, 9750, 11375, 14625, 17875),
    ('PUMDIKOT PKR - Shiva Statue Excursion', 'Pokhara', 'Shiva statue and scenic valley view', 'Standard Tariff', 2500, 3750, 4375, 5625, 6875, 1563, 2344, 2734, 3516, 4297, 2500, 3750, 4375, 5625, 6875),
    ('CHANDRAGIRI CABLE CAR Transfer', 'Kathmandu', 'City hotel to Cable Car Station round-trip', 'Standard Tariff', 4000, 6000, 7000, 9000, 11000, 2500, 3750, 4375, 5625, 6875, 4000, 6000, 7000, 9000, 11000),
    ('KTM - PKR Domestic Departure Drop', 'Airport', 'Hotel to KTM domestic terminal', 'Standard Tariff', 1000, 1500, 1750, 2250, 2750, 625, 938, 1094, 1406, 1719, 1000, 1500, 1750, 2250, 2750),
    ('PKR Domestic Airport Drop', 'Airport', 'Pokhara hotel to airport drop', 'Standard Tariff', 1500, 2250, 2625, 3375, 4125, 938, 1406, 1641, 2109, 2578, 1500, 2250, 2625, 3375, 4125),
    ('PKR - KTM Domestic Arrival Pick-up', 'Airport', 'Arrival pick-up from domestic airport', 'Standard Tariff', 1000, 1500, 1750, 2250, 2750, 625, 938, 1094, 1406, 1719, 1000, 1500, 1750, 2250, 2750),
    ('DEPARTURE - KTM International Drop', 'Airport', 'Hotel to Tribhuvan Int. Airport', 'Standard Tariff', 1000, 1500, 1750, 2250, 2750, 625, 938, 1094, 1406, 1719, 1000, 1500, 1750, 2250, 2750)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- 7. Itinerary Templates Table (Multiple Variants per Transport Sector)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.itinerary_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_identifier TEXT NOT NULL, -- e.g. 't-1', 't-2', 't-3' or route name
    route_name TEXT NOT NULL,
    template_name TEXT NOT NULL, -- e.g. 'Standard Heritage & Lake', 'Tibetan & Cultural', 'Pumdikot & Begnas'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights JSONB DEFAULT '[]'::jsonb,
    meals TEXT DEFAULT 'Breakfast (CP)',
    city TEXT DEFAULT 'Kathmandu',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_itinerary_templates_route ON public.itinerary_templates(route_identifier);
CREATE INDEX IF NOT EXISTS idx_itinerary_templates_route_name ON public.itinerary_templates(route_name);

-- Auto-update trigger for itinerary_templates
DROP TRIGGER IF EXISTS trigger_update_itinerary_templates_timestamp ON public.itinerary_templates;
CREATE TRIGGER trigger_update_itinerary_templates_timestamp
BEFORE UPDATE ON public.itinerary_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.itinerary_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon full access on itinerary_templates" ON public.itinerary_templates;
CREATE POLICY "Allow anon full access on itinerary_templates" 
ON public.itinerary_templates 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Seed Initial Multi-Variant Itinerary Presets
INSERT INTO public.itinerary_templates (
    route_identifier, route_name, template_name, title, description, highlights, meals, city, is_default
)
VALUES
    -- ARRIVAL Presets
    (
        't-1', 'ARRIVAL - KTM Airport Pick-up', 'Standard Welcome & Thamel Walk',
        'Arrival in Kathmandu & Transfer to Hotel',
        'Warm traditional welcome on arrival at Tribhuvan International Airport (KTM) with marigold garlands. Meet our representative and transfer by private vehicle to your hotel. Complete check-in formalities, enjoy a welcome beverage, and receive a comprehensive trip briefing. Evening free to stroll through the vibrant lanes of Thamel.',
        '["Airport Welcome Garland", "Private Hotel Transfer", "Trip Orientation", "Thamel Evening Walk"]'::jsonb,
        'Breakfast (CP)', 'Kathmandu', TRUE
    ),
    (
        't-1', 'ARRIVAL - KTM Airport Pick-up', 'VIP Welcome with Cultural Dinner',
        'VIP Airport Reception & Authentic Cultural Dinner',
        'Arrive at Kathmandu International Airport. Receive a royal welcome with silk Khadas and flower garlands. Private transfer to your luxury hotel. In the evening, attend a special welcome Nepali dinner at a traditional palace restaurant featuring live cultural folk music and ethnic dance performances.',
        '["Silk Khada & Garland Welcome", "Executive Transfer", "Traditional Nepali Dinner", "Live Folk Cultural Dance"]'::jsonb,
        'Dinner Included (MAP)', 'Kathmandu', FALSE
    ),

    -- KTM FULL DAY SS Presets
    (
        't-2', 'KTM SS - FULL DAY Sightseeing', 'Classic 4 UNESCO Heritage Sites',
        'Kathmandu Valley UNESCO World Heritage Cultural Tour',
        'After breakfast at hotel, embark on a full-day guided exploration of Kathmandu Valley’s UNESCO World Heritage treasures. Visit the sacred Hindu shrine of Pashupatinath along the Bagmati River, circumambulate the massive Buddhist dome of Boudhanath Stupa, explore ancient Kathmandu Durbar Square with the Kumari Ghar, and witness breathtaking sunset views from the hilltop Swayambhunath (Monkey Temple).',
        '["Pashupatinath Temple", "Boudhanath Stupa", "Kathmandu Durbar Square", "Swayambhunath Stupa"]'::jsonb,
        'Breakfast (CP)', 'Kathmandu', TRUE
    ),
    (
        't-2', 'KTM SS - FULL DAY Sightseeing', 'Medieval Royalty: Bhaktapur & Patan',
        'Medieval Royalty & Architectural Marvels of Bhaktapur and Patan',
        'Spend the day discovering the ancient royal city of Bhaktapur with its 55-Window Palace, Golden Gate, and soaring Nyatapola Temple. In the afternoon, visit Patan Durbar Square, the City of Fine Arts, to admire the Krishna Mandir, Golden Temple, and traditional bronze craft workshops.',
        '["Bhaktapur 55-Window Palace", "Nyatapola Temple", "Patan Durbar Square", "Traditional Metalcraft Workshops"]'::jsonb,
        'Breakfast (CP)', 'Kathmandu', FALSE
    ),

    -- PKR HALF DAY SS Presets
    (
        't-3', 'PKR HALF DAY Sightseeing', 'Standard Heritage, Falls & Shanti Stupa',
        'Pokhara City Highlights & Shanti Stupa Sightseeing',
        'Morning drive from hotel to Davis Falls (Patale Chhango) to watch the cascading torrent plunge into an underground tunnel. Explore the sacred Gupteshwor Mahadev Cave directly opposite, visit the deep geological chasm of Seti River Gorge, and stop by the Tibetan Refugee Settlement. Enjoy a delicious lakeside lunch, then take a scenic drive up to the World Peace Pagoda (Shanti Stupa) for panoramic views of Phewa Lake and the Annapurna range.',
        '["Davis Falls", "Gupteshwor Mahadev Cave", "Seti River Gorge", "World Peace Pagoda (Shanti Stupa)"]'::jsonb,
        'Breakfast (CP)', 'Pokhara', TRUE
    ),
    (
        't-3', 'PKR HALF DAY Sightseeing', 'Tibetan Cultural Heritage & Monasteries',
        'Tibetan Cultural Immersion & Old Pokhara Heritage',
        'Explore the historic Old Pokhara Bazaar and the ancient Bindhyabasini Temple. Visit the vibrant Tibetan Refugee Camp to observe traditional carpet weaving and handicraft making. Ascend to the peaceful Matepani Buddhist Monastery atop a hillock overlooking the valley to hear monks chanting afternoon prayers.',
        '["Bindhyabasini Temple", "Old Pokhara Bazaar", "Tibetan Refugee Handicrafts", "Matepani Buddhist Monastery"]'::jsonb,
        'Breakfast (CP)', 'Pokhara', FALSE
    ),
    (
        't-3', 'PKR HALF DAY Sightseeing', 'Pumdikot Shiva & Begnas Lake Serenity',
        'Pumdikot 108-ft Shiva Statue & Begnas Lake Escape',
        'Scenic drive up to Pumdikot to marvel at the 108-foot colossal Lord Shiva statue with 360-degree vistas. Continue to Davis Falls and Gupteshwor Cave, followed by a scenic drive to the serene, crowd-free Begnas Lake for a tranquil afternoon boat ride and fresh fish lunch.',
        '["108-ft Pumdikot Shiva Statue", "Davis Falls & Cave", "Tranquil Begnas Lake Boating", "Scenic Mountain Vistas"]'::jsonb,
        'Breakfast (CP)', 'Pokhara', FALSE
    ),

    -- SARANKOT SUNRISE Presets
    (
        't-4', 'PKR - SARANKOT Sunrise Excursion', 'Sunrise Mountain View & Lake Boating',
        'Sarangkot Sunrise Mountain View & Phewa Lake Boating',
        'Early morning (05:00 AM) drive up to Sarangkot hilltop viewpoint. Witness the spellbinding golden sunrise illuminating the towering peaks of Annapurna I, II, III, IV, Dhaulagiri, and the sacred Machhapuchhre (Fishtail). Return to the hotel for a hearty breakfast. Afternoon tranquil 1-hour boat ride on Phewa Lake with a visit to the island temple of Tal Barahi.',
        '["Sarangkot Sunrise Over Annapurnas", "Fishtail Peak Panorama", "Phewa Lake Boating", "Tal Barahi Island Temple"]'::jsonb,
        'Breakfast (CP)', 'Pokhara', TRUE
    ),
    (
        't-4', 'PKR - SARANKOT Sunrise Excursion', 'Sunrise & Tandem Paragliding Flight',
        'Sarangkot Sunrise & Thrilling Tandem Paragliding Adventure',
        'Early sunrise at Sarangkot with Himalayan panorama. Following sunrise, thrill-seekers can strap in for an exhilarating tandem paragliding flight gliding alongside Himalayan eagles above Phewa Lake with stunning GoPro aerial photos and video footage.',
        '["Sarangkot Mountain Sunrise", "Tandem Paragliding Flight", "Aerial Phewa Lake Views", "GoPro Photos/Videos"]'::jsonb,
        'Breakfast (CP)', 'Pokhara', FALSE
    ),

    -- CHANDRAGIRI CABLE CAR Presets
    (
        't-6', 'CHANDRAGIRI CABLE CAR Transfer', 'Gondola Ride & Everest Views',
        'Chandragiri Hills Cable Car & Himalayan View Excursion',
        'Morning transfer from Kathmandu hotel to Thankot Cable Car base station. Board the scenic 2.5 km gondola lift soaring above lush green forests to reach Chandragiri Top (2,551m). Experience awe-inspiring panoramic vistas of Mount Everest, Ganesh Himal, Langtang, and Manaslu ranges. Visit the historic Bhaleshwor Mahadev Temple, enjoy mountain-top lunch, and return via cable car to Kathmandu.',
        '["Scenic Gondola Cable Car Ride", "Bhaleshwor Mahadev Temple", "Panoramic Everest & Langtang Views"]'::jsonb,
        'Breakfast (CP)', 'Kathmandu', TRUE
    ),

    -- DEPARTURE Presets
    (
        't-10', 'DEPARTURE - KTM International Drop', 'Standard International Drop',
        'Final Departure from Kathmandu with Golden Memories',
        'Savor your final breakfast in Nepal. Depending on your flight schedule, enjoy any remaining free time for packing and exploration. Our private vehicle will pick you up from the hotel 3 hours prior to your international flight departure and transfer you to Tribhuvan International Airport (KTM) for your journey home.',
        '["Hotel Check-out", "Tribhuvan International Airport Transfer", "Farewell Nepal"]'::jsonb,
        'Breakfast (CP)', 'Departure', TRUE
    ),
    (
        't-10', 'DEPARTURE - KTM International Drop', 'Souvenir Shopping & Airport Drop',
        'Last-Minute Thamel Shopping & Airport Farewell',
        'Morning dedicated to last-minute souvenir shopping in Thamel for authentic cashmere pashminas, organic Himalayan teas, handmade paper journals, and prayer flags. Afternoon private transfer to Kathmandu Airport with warm farewells.',
        '["Thamel Handicrafts Shopping", "Pashmina & Tea Buying", "Airport Farewell Drop"]'::jsonb,
        'Breakfast (CP)', 'Departure', FALSE
    )
ON CONFLICT DO NOTHING;

-- ===================================================================
-- 8. Explicit Role Permissions (Required for Anon Web Client Access)
-- ===================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;



