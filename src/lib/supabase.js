import { createClient } from '@supabase/supabase-js';
import { INITIAL_HOTELS, MASTER_TRANSPORT_ROUTES, MASTER_ITINERARY_TEMPLATES } from './mockData';

const LOCAL_STORAGE_KEY_URL = 'fishtail_supabase_url';
const LOCAL_STORAGE_KEY_KEY = 'fishtail_supabase_anon_key';
const LOCAL_STORAGE_HOTELS_BACKUP = 'fishtail_local_hotels';
const LOCAL_STORAGE_TRANSPORT_BACKUP = 'fishtail_local_transport_routes';
const LOCAL_STORAGE_ITINERARY_TEMPLATES_BACKUP = 'fishtail_local_itinerary_templates';

// Retrieve credentials
export function getStoredConfig() {
  const url = localStorage.getItem(LOCAL_STORAGE_KEY_URL) 
    || import.meta.env.VITE_SUPABASE_URL 
    || import.meta.env.NEXT_PUBLIC_SUPABASE_URL 
    || '';
  const key = localStorage.getItem(LOCAL_STORAGE_KEY_KEY) 
    || import.meta.env.VITE_SUPABASE_ANON_KEY 
    || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY 
    || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 
    || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    || '';
  return { url, key };
}

export function saveStoredConfig(url, key) {
  if (url) localStorage.setItem(LOCAL_STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(LOCAL_STORAGE_KEY_URL);

  if (key) localStorage.setItem(LOCAL_STORAGE_KEY_KEY, key.trim());
  else localStorage.removeItem(LOCAL_STORAGE_KEY_KEY);
}

export function isSupabaseConfigured() {
  const { url, key } = getStoredConfig();
  return Boolean(url && key && url.startsWith('http'));
}

let supabaseClientInstance = null;

export function getSupabaseClient() {
  const { url, key } = getStoredConfig();
  if (url && key && url.startsWith('http')) {
    if (!supabaseClientInstance || supabaseClientInstance.supabaseUrl !== url) {
      supabaseClientInstance = createClient(url, key, {
        auth: { persistSession: false }
      });
    }
    return supabaseClientInstance;
  }
  return null;
}

export async function testConnection(url, key) {
  try {
    const testClient = createClient(url, key);
    const results = {
      hotels: false,
      transport_routes: false,
      itinerary_templates: false
    };
    
    const [hRes, tRes, iRes] = await Promise.all([
      testClient.from('hotels').select('count', { count: 'exact', head: true }),
      testClient.from('transport_routes').select('count', { count: 'exact', head: true }),
      testClient.from('itinerary_templates').select('count', { count: 'exact', head: true })
    ]);

    results.hotels = !hRes.error;
    results.transport_routes = !tRes.error;
    results.itinerary_templates = !iRes.error;

    if (results.hotels && results.transport_routes && results.itinerary_templates) {
      return { 
        success: true, 
        message: 'Connected successfully to Supabase! All tables (hotels, transport_routes, itinerary_templates) verified and live.',
        tables: results
      };
    } else if (results.hotels || results.transport_routes || results.itinerary_templates) {
      const missing = [];
      if (!results.hotels) missing.push('hotels');
      if (!results.transport_routes) missing.push('transport_routes');
      if (!results.itinerary_templates) missing.push('itinerary_templates');
      return {
        success: true,
        partial: true,
        message: `Connected! Found active tables, but missing: ${missing.join(', ')}. Run the full SQL schema in Supabase SQL Editor.`,
        tables: results
      };
    } else {
      return {
        success: false,
        message: hRes.error?.message || 'Could not query tables. Please run the supabase_schema.sql script in Supabase SQL Editor.',
        tables: results
      };
    }
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

// Seed All Sample Master Data to Supabase in one operation
export async function seedAllSupabaseData() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not connected. Configure URL & Key first.');

  const results = {
    hotels: false,
    transportRoutes: false,
    itineraryTemplates: false
  };

  try {
    await seedSupabaseHotels();
    results.hotels = true;
  } catch (err) {
    console.warn('Hotels seed warning:', err.message);
  }

  try {
    await seedSupabaseTransportRoutes();
    results.transportRoutes = true;
  } catch (err) {
    console.warn('Transport routes seed warning:', err.message);
  }

  try {
    await seedSupabaseItineraryTemplates();
    results.itineraryTemplates = true;
  } catch (err) {
    console.warn('Itinerary templates seed warning:', err.message);
  }

  return results;
}

// ==========================================
// 1. HOTEL LOCAL STORAGE & SANITIZATION
// ==========================================
function getLocalHotels() {
  const stored = localStorage.getItem(LOCAL_STORAGE_HOTELS_BACKUP);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(LOCAL_STORAGE_HOTELS_BACKUP, JSON.stringify(INITIAL_HOTELS));
  return INITIAL_HOTELS;
}

function saveLocalHotels(hotels) {
  localStorage.setItem(LOCAL_STORAGE_HOTELS_BACKUP, JSON.stringify(hotels));
}

// Format sanitized hotel payload with multi-currency rates
function sanitizeHotelPayload(hotelData) {
  const half_inr = Number(hotelData.half_twin_inr) || 0;
  const single_inr = Number(hotelData.single_inr) || 0;
  const half_npr = Number(hotelData.half_twin_npr) || Math.round(half_inr * 1.6);
  const single_npr = Number(hotelData.single_npr) || Math.round(single_inr * 1.6);
  const half_usd = Number(hotelData.half_twin_usd) || Math.round(half_inr / 75);
  const single_usd = Number(hotelData.single_usd) || Math.round(single_inr / 75);

  return {
    name: hotelData.name || '',
    city: hotelData.city || 'Kathmandu',
    category: hotelData.category || 'Premier',
    meal_plan: hotelData.meal_plan || 'CP',
    star_rating: Number(hotelData.star_rating) || 3,
    
    // Multi-currency active rates
    half_twin_inr: half_inr,
    single_inr: single_inr,
    half_twin_npr: half_npr,
    single_npr: single_npr,
    half_twin_usd: half_usd,
    single_usd: single_usd,

    // Base standard rates (revertable)
    base_half_twin_inr: Number(hotelData.base_half_twin_inr) || half_inr,
    base_single_inr: Number(hotelData.base_single_inr) || single_inr,
    base_half_twin_npr: Number(hotelData.base_half_twin_npr) || half_npr,
    base_single_npr: Number(hotelData.base_single_npr) || single_npr,
    base_half_twin_usd: Number(hotelData.base_half_twin_usd) || half_usd,
    base_single_usd: Number(hotelData.base_single_usd) || single_usd,

    season_note: hotelData.season_note || 'Standard Tariff',
    is_custom_rate: Boolean(hotelData.is_custom_rate),
    notes: hotelData.notes || '',
    is_active: hotelData.is_active !== false
  };
}

// Fetch all hotels
export async function fetchHotelsService() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('hotels')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return { data, isLive: true, error: null };
      }
      if (error) {
        console.warn('Supabase fetch error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('Supabase network error, using local fallback:', err);
    }
  }

  return { data: getLocalHotels(), isLive: false, error: null };
}

// Create new hotel
export async function createHotelService(hotelData) {
  const client = getSupabaseClient();
  const payload = sanitizeHotelPayload(hotelData);

  if (client) {
    try {
      const { data, error } = await client
        .from('hotels')
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        return { data, isLive: true, error: null };
      }
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err.message);
    }
  }

  const localList = getLocalHotels();
  const created = { ...payload, id: 'h-loc-' + Date.now() };
  const updatedList = [created, ...localList];
  saveLocalHotels(updatedList);
  return { data: created, isLive: false, error: null };
}

// Update existing hotel rates
export async function updateHotelService(id, hotelData) {
  const client = getSupabaseClient();
  const payload = sanitizeHotelPayload(hotelData);

  if (client && !String(id).startsWith('h-loc-') && !String(id).startsWith('h-')) {
    try {
      const { data, error } = await client
        .from('hotels')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return { data, isLive: true, error: null };
      }
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
  }

  const localList = getLocalHotels();
  const updatedList = localList.map(h => h.id === id ? { ...h, ...payload } : h);
  saveLocalHotels(updatedList);
  return { data: { id, ...payload }, isLive: false, error: null };
}

// Reset hotel rate back to base standard tariff
export async function resetHotelToBaseRateService(hotel) {
  const revertedPayload = {
    ...hotel,
    half_twin_inr: hotel.base_half_twin_inr || hotel.half_twin_inr,
    single_inr: hotel.base_single_inr || hotel.single_inr,
    half_twin_npr: hotel.base_half_twin_npr || hotel.half_twin_npr,
    single_npr: hotel.base_single_npr || hotel.single_npr,
    half_twin_usd: hotel.base_half_twin_usd || hotel.half_twin_usd,
    single_usd: hotel.base_single_usd || hotel.single_usd,
    season_note: 'Standard Tariff',
    is_custom_rate: false
  };

  return await updateHotelService(hotel.id, revertedPayload);
}

// Delete hotel
export async function deleteHotelService(id) {
  const client = getSupabaseClient();
  if (client && !String(id).startsWith('h-loc-') && !String(id).startsWith('h-')) {
    try {
      await client.from('hotels').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }

  const localList = getLocalHotels();
  const updatedList = localList.filter(h => h.id !== id);
  saveLocalHotels(updatedList);
  return { success: true };
}

// Seed initial hotels with multi-currency rates
export async function seedSupabaseHotels() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not connected. Configure URL & Key first.');

  const seedPayload = INITIAL_HOTELS.map(({ id, ...rest }) => sanitizeHotelPayload(rest));
  const { data, error } = await client.from('hotels').insert(seedPayload).select();
  if (error) throw error;
  return data;
}

// ==========================================
// 2. TRANSPORTATION LOCAL STORAGE & SANITIZATION
// ==========================================
function getLocalTransportRoutes() {
  const stored = localStorage.getItem(LOCAL_STORAGE_TRANSPORT_BACKUP);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(LOCAL_STORAGE_TRANSPORT_BACKUP, JSON.stringify(MASTER_TRANSPORT_ROUTES));
  return MASTER_TRANSPORT_ROUTES;
}

function saveLocalTransportRoutes(routes) {
  localStorage.setItem(LOCAL_STORAGE_TRANSPORT_BACKUP, JSON.stringify(routes));
}

// Format sanitized transport route payload
function sanitizeTransportRoutePayload(routeData) {
  const car_npr = Number(routeData.car_npr) || 0;
  const scorpio_npr = Number(routeData.scorpio_npr) || Math.round(car_npr * 1.5);
  const hiace_npr = Number(routeData.hiace_npr) || Math.round(car_npr * 1.75);
  const coaster_npr = Number(routeData.coaster_npr) || Math.round(car_npr * 2.25);
  const shuttle_npr = Number(routeData.shuttle_npr) || Math.round(car_npr * 2.75);

  const car_inr = Number(routeData.car_inr) || Math.round(car_npr / 1.6);
  const scorpio_inr = Number(routeData.scorpio_inr) || Math.round(scorpio_npr / 1.6);
  const hiace_inr = Number(routeData.hiace_inr) || Math.round(hiace_npr / 1.6);
  const coaster_inr = Number(routeData.coaster_inr) || Math.round(coaster_npr / 1.6);
  const shuttle_inr = Number(routeData.shuttle_inr) || Math.round(shuttle_npr / 1.6);

  return {
    name: routeData.name || '',
    category: routeData.category || 'Kathmandu',
    notes: routeData.notes || '',
    season_note: routeData.season_note || 'Standard Tariff',
    is_custom_rate: Boolean(routeData.is_custom_rate),
    is_active: routeData.is_active !== false,

    // Current active rates
    car_npr,
    scorpio_npr,
    hiace_npr,
    coaster_npr,
    shuttle_npr,

    car_inr,
    scorpio_inr,
    hiace_inr,
    coaster_inr,
    shuttle_inr,

    // Base standard rates (revertable)
    base_car_npr: Number(routeData.base_car_npr) || car_npr,
    base_scorpio_npr: Number(routeData.base_scorpio_npr) || scorpio_npr,
    base_hiace_npr: Number(routeData.base_hiace_npr) || hiace_npr,
    base_coaster_npr: Number(routeData.base_coaster_npr) || coaster_npr,
    base_shuttle_npr: Number(routeData.base_shuttle_npr) || shuttle_npr
  };
}

// Fetch all transport routes
export async function fetchTransportRoutesService() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('transport_routes')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return { data, isLive: true, error: null };
      }
      if (error) {
        console.warn('Supabase fetch transport_routes error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('Supabase transport network error, using local fallback:', err);
    }
  }

  return { data: getLocalTransportRoutes(), isLive: false, error: null };
}

// Create new transport route
export async function createTransportRouteService(routeData) {
  const client = getSupabaseClient();
  const payload = sanitizeTransportRoutePayload(routeData);

  if (client) {
    try {
      const { data, error } = await client
        .from('transport_routes')
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        return { data, isLive: true, error: null };
      }
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase transport insert failed, saving locally:', err.message);
    }
  }

  const localList = getLocalTransportRoutes();
  const created = { ...payload, id: 't-loc-' + Date.now() };
  const updatedList = [created, ...localList];
  saveLocalTransportRoutes(updatedList);
  return { data: created, isLive: false, error: null };
}

// Update existing transport route
export async function updateTransportRouteService(id, routeData) {
  const client = getSupabaseClient();
  const payload = sanitizeTransportRoutePayload(routeData);

  if (client && !String(id).startsWith('t-loc-') && !String(id).startsWith('t-')) {
    try {
      const { data, error } = await client
        .from('transport_routes')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return { data, isLive: true, error: null };
      }
    } catch (err) {
      console.warn('Supabase transport update failed:', err);
    }
  }

  const localList = getLocalTransportRoutes();
  const updatedList = localList.map(r => r.id === id ? { ...r, ...payload } : r);
  saveLocalTransportRoutes(updatedList);
  return { data: { id, ...payload }, isLive: false, error: null };
}

// Reset transport route back to base standard tariff
export async function resetTransportRouteToBaseRateService(route) {
  const baseCar = route.base_car_npr || route.car_npr;
  const baseScorpio = route.base_scorpio_npr || route.scorpio_npr;
  const baseHiace = route.base_hiace_npr || route.hiace_npr;
  const baseCoaster = route.base_coaster_npr || route.coaster_npr;
  const baseShuttle = route.base_shuttle_npr || route.shuttle_npr;

  const revertedPayload = {
    ...route,
    car_npr: baseCar,
    scorpio_npr: baseScorpio,
    hiace_npr: baseHiace,
    coaster_npr: baseCoaster,
    shuttle_npr: baseShuttle,
    car_inr: Math.round(baseCar / 1.6),
    scorpio_inr: Math.round(baseScorpio / 1.6),
    hiace_inr: Math.round(baseHiace / 1.6),
    coaster_inr: Math.round(baseCoaster / 1.6),
    shuttle_inr: Math.round(baseShuttle / 1.6),
    season_note: 'Standard Tariff',
    is_custom_rate: false
  };

  return await updateTransportRouteService(route.id, revertedPayload);
}

// Delete transport route
export async function deleteTransportRouteService(id) {
  const client = getSupabaseClient();
  if (client && !String(id).startsWith('t-loc-') && !String(id).startsWith('t-')) {
    try {
      await client.from('transport_routes').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase transport delete failed:', err);
    }
  }

  const localList = getLocalTransportRoutes();
  const updatedList = localList.filter(r => r.id !== id);
  saveLocalTransportRoutes(updatedList);
  return { success: true };
}

// Seed initial transport routes
export async function seedSupabaseTransportRoutes() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not connected. Configure URL & Key first.');

  const seedPayload = MASTER_TRANSPORT_ROUTES.map(({ id, ...rest }) => sanitizeTransportRoutePayload(rest));
  const { data, error } = await client.from('transport_routes').insert(seedPayload).select();
  if (error) throw error;
  return data;
}

// ==========================================
// 3. ITINERARY TEMPLATES LOCAL STORAGE & SERVICES
// ==========================================
function getLocalItineraryTemplates() {
  const stored = localStorage.getItem(LOCAL_STORAGE_ITINERARY_TEMPLATES_BACKUP);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(LOCAL_STORAGE_ITINERARY_TEMPLATES_BACKUP, JSON.stringify(MASTER_ITINERARY_TEMPLATES));
  return MASTER_ITINERARY_TEMPLATES;
}

function saveLocalItineraryTemplates(templates) {
  localStorage.setItem(LOCAL_STORAGE_ITINERARY_TEMPLATES_BACKUP, JSON.stringify(templates));
}

function sanitizeItineraryTemplatePayload(templateData) {
  return {
    route_identifier: String(templateData.route_identifier || templateData.route_id || 't-1'),
    route_name: String(templateData.route_name || 'Sector Transfer'),
    template_name: String(templateData.template_name || 'Custom Plan'),
    title: String(templateData.title || 'Day Tour Schedule'),
    description: String(templateData.description || ''),
    highlights: Array.isArray(templateData.highlights) ? templateData.highlights : (templateData.highlights ? [templateData.highlights] : []),
    meals: String(templateData.meals || 'Breakfast (CP)'),
    city: String(templateData.city || 'Kathmandu'),
    is_default: Boolean(templateData.is_default)
  };
}

// Fetch all itinerary templates
export async function fetchItineraryTemplatesService() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('itinerary_templates')
        .select('*')
        .order('route_identifier', { ascending: true })
        .order('is_default', { ascending: false });

      if (!error && data && data.length > 0) {
        return { data, isLive: true, error: null };
      }
      if (error) {
        console.warn('Supabase fetch itinerary_templates error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('Supabase itinerary templates network error, using local fallback:', err);
    }
  }

  return { data: getLocalItineraryTemplates(), isLive: false, error: null };
}

// Create new itinerary template preset
export async function createItineraryTemplateService(templateData) {
  const client = getSupabaseClient();
  const payload = sanitizeItineraryTemplatePayload(templateData);

  if (client) {
    try {
      const { data, error } = await client
        .from('itinerary_templates')
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        return { data, isLive: true, error: null };
      }
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase itinerary template insert failed, saving locally:', err.message);
    }
  }

  const localList = getLocalItineraryTemplates();
  const created = { ...payload, id: 'itpl-loc-' + Date.now() };
  const updatedList = [created, ...localList];
  saveLocalItineraryTemplates(updatedList);
  return { data: created, isLive: false, error: null };
}

// Update existing itinerary template
export async function updateItineraryTemplateService(id, templateData) {
  const client = getSupabaseClient();
  const payload = sanitizeItineraryTemplatePayload(templateData);

  if (client && !String(id).startsWith('itpl-loc-') && !String(id).startsWith('itpl-')) {
    try {
      const { data, error } = await client
        .from('itinerary_templates')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return { data, isLive: true, error: null };
      }
    } catch (err) {
      console.warn('Supabase itinerary template update failed:', err);
    }
  }

  const localList = getLocalItineraryTemplates();
  const updatedList = localList.map(t => t.id === id ? { ...t, ...payload } : t);
  saveLocalItineraryTemplates(updatedList);
  return { data: { id, ...payload }, isLive: false, error: null };
}

// Delete itinerary template
export async function deleteItineraryTemplateService(id) {
  const client = getSupabaseClient();
  if (client && !String(id).startsWith('itpl-loc-') && !String(id).startsWith('itpl-')) {
    try {
      await client.from('itinerary_templates').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase itinerary template delete failed:', err);
    }
  }

  const localList = getLocalItineraryTemplates();
  const updatedList = localList.filter(t => t.id !== id);
  saveLocalItineraryTemplates(updatedList);
  return { success: true };
}

// Seed initial itinerary templates into Supabase
export async function seedSupabaseItineraryTemplates() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not connected. Configure URL & Key first.');

  const seedPayload = MASTER_ITINERARY_TEMPLATES.map(({ id, ...rest }) => sanitizeItineraryTemplatePayload(rest));
  const { data, error } = await client.from('itinerary_templates').insert(seedPayload).select();
  if (error) throw error;
  return data;
}


