import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TripHeader from './components/TripHeader';
import PremierSection from './components/PremierSection';
import TransportationSection from './components/TransportationSection';
import AdditionalCostsSection from './components/AdditionalCostsSection';
import GuideSection from './components/GuideSection';
import PackageGrandTotalCard from './components/PackageGrandTotalCard';
import ItineraryPlanningTab from './components/ItineraryPlanningTab';
import HotelRatesTab from './components/HotelRatesTab';
import TransportationRatesTab from './components/TransportationRatesTab';
import QuotationsHistoryTab from './components/QuotationsHistoryTab';
import FinalizeQuoteModal from './components/FinalizeQuoteModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import QuotationPreviewModal from './components/QuotationPreviewModal';
import EmailQuoteModal from './components/EmailQuoteModal';
import PrintQuotation from './components/PrintQuotation';
import { 
  fetchHotelsService, 
  createHotelService, 
  updateHotelService, 
  deleteHotelService, 
  resetHotelToBaseRateService,
  fetchTransportRoutesService,
  createTransportRouteService,
  updateTransportRouteService,
  deleteTransportRouteService,
  resetTransportRouteToBaseRateService,
  fetchItineraryTemplatesService,
  createItineraryTemplateService,
  updateItineraryTemplateService,
  deleteItineraryTemplateService,
  fetchQuotationsService,
  saveQuotationService,
  updateQuotationStatusService,
  deleteQuotationService,
  logQuotationEmailService,
  isSupabaseConfigured 
} from './lib/supabase';
import { 
  INITIAL_HOTEL_ROWS, 
  INITIAL_TRANSPORT_ITEMS, 
  INITIAL_ADDITIONAL_ITEMS, 
  INITIAL_GUIDE_ITEMS,
  INITIAL_ITINERARY_DAYS,
  MASTER_TRANSPORT_ROUTES,
  MASTER_ADDITIONAL_ACTIVITIES,
  MASTER_GUIDE_OPTIONS,
  MASTER_ITINERARY_TEMPLATES,
  SAMPLE_PAST_QUOTATIONS,
  generateItineraryFromTransport,
  syncItineraryWithTransportList
} from './lib/mockData';

export default function App() {
  // Navigation Tab ('quotation' | 'itinerary' | 'history' | 'rates' | 'transportRates')
  const [activeTab, setActiveTab] = useState('quotation');

  // Trip & Quotation Info
  const [tripInfo, setTripInfo] = useState({
    tripTitle: 'Kathmandu - Pokhara - Chitwan - Chandragiri 7D/6N Tour',
    clientName: 'Acme Travels / Direct Guest',
    preparedBy: localStorage.getItem('fishtail_agent_name') || 'Subhash Rajbhandari',
    quoteNumber: `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    quoteDate: new Date().toISOString().split('T')[0],
    paxAdults: 2,
    singleRoomsCount: 0,
    usdToNprRate: 135.5 // 1 USD = 135.5 NPR
  });

  // Per-Component Independent Currencies ('INR' | 'NPR' | 'USD')
  const [hotelCurrency, setHotelCurrency] = useState('INR');
  const [transportCurrency, setTransportCurrency] = useState('NPR');
  const [additionalCurrency, setAdditionalCurrency] = useState('NPR');
  const [guideCurrency, setGuideCurrency] = useState('NPR');

  // Hotel Quotation Rows
  const [hotelRows, setHotelRows] = useState(INITIAL_HOTEL_ROWS);

  // Transportation Sectors Items
  const [transportItems, setTransportItems] = useState(INITIAL_TRANSPORT_ITEMS);

  // Available Master Transport Routes
  const [availableTransportRoutes, setAvailableTransportRoutes] = useState(MASTER_TRANSPORT_ROUTES);

  // Additional Activities & Flights Items
  const [additionalItems, setAdditionalItems] = useState(INITIAL_ADDITIONAL_ITEMS);

  // Guide Services Items
  const [guideItems, setGuideItems] = useState(INITIAL_GUIDE_ITEMS);

  // Profit Margin per Pax (in NPR)
  const [marginPerPax, setMarginPerPax] = useState(2500);

  // Day-by-day Itinerary State (Synced from Transportation Packages)
  const [itineraryDays, setItineraryDays] = useState(INITIAL_ITINERARY_DAYS);

  // Itinerary Templates Catalog (Multi-Variant Presets from Database)
  const [itineraryTemplates, setItineraryTemplates] = useState(MASTER_ITINERARY_TEMPLATES);

  // Past Quotations Records List
  const [quotationsList, setQuotationsList] = useState(SAMPLE_PAST_QUOTATIONS);

  // Transportation items update handler with automatic itinerary synchronization
  const handleUpdateTransportItems = (newItems) => {
    setTransportItems(newItems);
    setItineraryDays(prevDays => syncItineraryWithTransportList(newItems, prevDays, availableTransportRoutes, hotelRows));
  };

  // Sync / regenerate itinerary from active transport items
  const handleSyncItineraryWithTransport = () => {
    const synced = generateItineraryFromTransport(transportItems, availableTransportRoutes, hotelRows);
    setItineraryDays(synced);
  };

  // Available Hotels from Supabase
  const [availableHotels, setAvailableHotels] = useState([]);
  const [isLiveSupabase, setIsLiveSupabase] = useState(isSupabaseConfigured());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [previewQuoteData, setPreviewQuoteData] = useState(null);
  const [emailQuoteData, setEmailQuoteData] = useState(null);

  // Quotation Inclusions & Terms
  const [notes, setNotes] = useState(
    '1. Quotation includes accommodation in Premier category hotels on CP basis (Bed & Breakfast).\n2. All private sightseeing and sector transfers in dedicated A/C vehicle.\n3. English-speaking licensed tour escort / guide fees included.\n4. All applicable government taxes and service charges included.'
  );

  // Helper to get rate from hotel object based on selected currency
  const getRateForCurrency = (hotel, curr, type = 'half') => {
    if (!hotel) return 0;
    const usdRate = Number(tripInfo.usdToNprRate) || 135.5;
    if (curr === 'NPR') {
      return type === 'half' ? (hotel.half_twin_npr || Math.round(hotel.half_twin_inr * 1.6)) : (hotel.single_npr || Math.round(hotel.single_inr * 1.6));
    }
    if (curr === 'USD') {
      return type === 'half' ? (hotel.half_twin_usd || Math.round((hotel.half_twin_inr * 1.6) / usdRate)) : (hotel.single_usd || Math.round((hotel.single_inr * 1.6) / usdRate));
    }
    return type === 'half' ? (hotel.half_twin_inr || hotel.half_twin_price || 0) : (hotel.single_inr || hotel.single_room_price || 0);
  };

  // Load Hotels from Supabase / Local Storage
  const loadHotels = async () => {
    try {
      const { data, isLive } = await fetchHotelsService();
      if (data) {
        setAvailableHotels(data);
        setIsLiveSupabase(isLive);
      }
    } catch (err) {
      console.error('Failed to load hotels:', err);
    }
  };

  // Load Transport Routes from Supabase / Local Storage
  const loadTransportRoutes = async () => {
    try {
      const { data, isLive } = await fetchTransportRoutesService();
      if (data && data.length > 0) {
        setAvailableTransportRoutes(data);
        if (isLive) setIsLiveSupabase(true);
      }
    } catch (err) {
      console.error('Failed to load transport routes:', err);
    }
  };

  // Load Itinerary Templates from Supabase / Local Storage
  const loadItineraryTemplates = async () => {
    try {
      const { data, isLive } = await fetchItineraryTemplatesService();
      if (data && data.length > 0) {
        setItineraryTemplates(data);
        if (isLive) setIsLiveSupabase(true);
      }
    } catch (err) {
      console.error('Failed to load itinerary templates:', err);
    }
  };

  // Load Quotations from Supabase / Local Storage
  const loadQuotations = async () => {
    try {
      const { data, isLive } = await fetchQuotationsService();
      if (data && data.length > 0) {
        setQuotationsList(data);
        if (isLive) setIsLiveSupabase(true);
      }
    } catch (err) {
      console.error('Failed to load quotations:', err);
    }
  };

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        loadHotels(), 
        loadTransportRoutes(), 
        loadItineraryTemplates(),
        loadQuotations()
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Template CRUD Handlers
  const handleCreateTemplate = async (templateData) => {
    const { data } = await createItineraryTemplateService(templateData);
    if (data) {
      await loadItineraryTemplates();
    }
  };

  const handleUpdateTemplate = async (id, templateData) => {
    await updateItineraryTemplateService(id, templateData);
    await loadItineraryTemplates();
  };

  const handleDeleteTemplate = async (id) => {
    await deleteItineraryTemplateService(id);
    await loadItineraryTemplates();
  };

  // Update trip info fields
  const handleTripInfoChange = (field, value) => {
    setTripInfo(prev => ({ ...prev, [field]: value }));
  };

  // 1. HOTEL CURRENCY CHANGE HANDLER
  const handleHotelCurrencyChange = (newCurr) => {
    setHotelCurrency(newCurr);
    setHotelRows(currRows => currRows.map(row => {
      const hotel = availableHotels.find(h => h.id === row.hotel_id || h.name === row.hotel_name);
      if (hotel) {
        return {
          ...row,
          half_twin_price: getRateForCurrency(hotel, newCurr, 'half'),
          single_room_price: getRateForCurrency(hotel, newCurr, 'single'),
          custom_price: false
        };
      }
      return row;
    }));
  };

  // 2. TRANSPORT CURRENCY CHANGE HANDLER
  const handleTransportCurrencyChange = (newCurr) => {
    setTransportCurrency(newCurr);
    const usdRate = Number(tripInfo.usdToNprRate) || 135.5;
    
    setTransportItems(prev => prev.map(item => {
      const matched = availableTransportRoutes.find(r => r.id === item.route_id) || MASTER_TRANSPORT_ROUTES.find(r => r.id === item.route_id);
      const baseNpr = matched ? (matched.car_npr || matched.car_inr || 1000) : (item.rate_inr || 1000);
      let calculatedRate = baseNpr;
      if (newCurr === 'INR') calculatedRate = matched?.car_inr || Math.round(baseNpr / 1.6);
      else if (newCurr === 'USD') calculatedRate = Math.round(baseNpr / usdRate);
      
      return {
        ...item,
        rate_inr: calculatedRate
      };
    }));
  };

  // 3. ADDITIONAL COSTS CURRENCY CHANGE HANDLER
  const handleAdditionalCurrencyChange = (newCurr) => {
    setAdditionalCurrency(newCurr);
    const usdRate = Number(tripInfo.usdToNprRate) || 135.5;

    setAdditionalItems(prev => prev.map(item => {
      const matched = MASTER_ADDITIONAL_ACTIVITIES.find(a => a.id === item.activity_id);
      const baseNpr = matched ? (matched.unit_price_npr || matched.unit_price_inr || 1000) : (item.unit_price_inr || 1000);
      let calculatedRate = baseNpr;
      if (newCurr === 'INR') calculatedRate = matched?.unit_price_inr || Math.round(baseNpr / 1.6);
      else if (newCurr === 'USD') calculatedRate = matched?.unit_price_usd || Math.round(baseNpr / usdRate);

      return {
        ...item,
        unit_price_inr: calculatedRate
      };
    }));
  };

  // 4. GUIDE CURRENCY CHANGE HANDLER
  const handleGuideCurrencyChange = (newCurr) => {
    setGuideCurrency(newCurr);
    const usdRate = Number(tripInfo.usdToNprRate) || 135.5;

    setGuideItems(prev => prev.map(item => {
      const matched = MASTER_GUIDE_OPTIONS.find(g => g.id === item.guide_id);
      const baseNpr = matched ? (matched.rate_per_day_npr || matched.rate_per_day_inr || 2000) : (item.rate_per_day_inr || 2000);
      let calculatedRate = baseNpr;
      if (newCurr === 'INR') calculatedRate = matched?.rate_per_day_inr || Math.round(baseNpr / 1.6);
      else if (newCurr === 'USD') calculatedRate = matched?.rate_per_day_usd || Math.round(baseNpr / usdRate);

      return {
        ...item,
        rate_per_day_inr: calculatedRate
      };
    }));
  };

  // Selecting a hotel from the dropdown in Quotation Maker
  const handleHotelSelect = (rowId, selectedHotelId) => {
    const matchedHotel = availableHotels.find(h => h.id === selectedHotelId);
    if (!matchedHotel) return;

    setHotelRows(prev => prev.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          hotel_id: matchedHotel.id,
          hotel_name: matchedHotel.name,
          city: matchedHotel.city,
          half_twin_price: getRateForCurrency(matchedHotel, hotelCurrency, 'half'),
          single_room_price: getRateForCurrency(matchedHotel, hotelCurrency, 'single'),
          custom_price: false
        };
      }
      return row;
    }));
  };

  // Adding a new hotel row
  const handleAddRow = () => {
    const defaultHotel = availableHotels[0] || {
      id: '',
      name: 'Select Hotel',
      city: 'Kathmandu',
      half_twin_inr: 1500,
      single_inr: 2500
    };

    const newRow = {
      id: 'row-' + Date.now(),
      hotel_id: defaultHotel.id || '',
      hotel_name: defaultHotel.name || '',
      city: defaultHotel.city || '',
      half_twin_price: getRateForCurrency(defaultHotel, hotelCurrency, 'half'),
      single_room_price: getRateForCurrency(defaultHotel, hotelCurrency, 'single'),
      nights: 1,
      single_rooms: 0,
      custom_price: false
    };

    setHotelRows(prev => [...prev, newRow]);
  };

  // Updating hotel row
  const handleUpdateRow = (rowId, field, value, isCustom = false) => {
    setHotelRows(prev => prev.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          [field]: value,
          custom_price: isCustom ? true : row.custom_price
        };
      }
      return row;
    }));
  };

  const handleDeleteRow = (rowId) => {
    setHotelRows(prev => prev.filter(row => row.id !== rowId));
  };

  const handleDuplicateRow = (rowId) => {
    const target = hotelRows.find(r => r.id === rowId);
    if (target) {
      const duplicate = {
        ...target,
        id: 'row-' + Date.now()
      };
      setHotelRows(prev => [...prev, duplicate]);
    }
  };

  // Hotel Rates Tab Actions
  const handleAddHotelMaster = async (hotelData) => {
    const { data } = await createHotelService(hotelData);
    if (data) {
      await loadHotels();
    }
  };

  const handleUpdateHotelMaster = async (id, hotelData) => {
    await updateHotelService(id, hotelData);
    await loadHotels();
    setHotelRows(currRows => currRows.map(row => {
      if (row.hotel_id === id) {
        return {
          ...row,
          half_twin_price: getRateForCurrency(hotelData, hotelCurrency, 'half'),
          single_room_price: getRateForCurrency(hotelData, hotelCurrency, 'single')
        };
      }
      return row;
    }));
  };

  const handleResetToBaseRate = async (hotel) => {
    await resetHotelToBaseRateService(hotel);
    await loadHotels();
    setHotelRows(currRows => currRows.map(row => {
      if (row.hotel_id === hotel.id) {
        const baseRate = getRateForCurrency(hotel, hotelCurrency, 'half');
        return {
          ...row,
          half_twin_price: baseRate,
          custom_price: false
        };
      }
      return row;
    }));
  };

  const handleDeleteHotelMaster = async (id) => {
    await deleteHotelService(id);
    await loadHotels();
  };

  // Transportation Rates Tab Actions
  const handleAddTransportRouteMaster = async (routeData) => {
    const { data } = await createTransportRouteService(routeData);
    if (data) {
      await loadTransportRoutes();
    }
  };

  const handleUpdateTransportRouteMaster = async (id, routeData) => {
    await updateTransportRouteService(id, routeData);
    await loadTransportRoutes();

    // Auto-update active quotation items with new default rate if applicable
    setTransportItems(prevItems => prevItems.map(item => {
      if (item.route_id === id) {
        const baseNpr = routeData.car_npr || 1000;
        let finalRate = baseNpr;
        if (transportCurrency === 'INR') finalRate = routeData.car_inr || Math.round(baseNpr / 1.6);
        else if (transportCurrency === 'USD') finalRate = Math.round(baseNpr / (Number(tripInfo.usdToNprRate) || 135.5));

        return {
          ...item,
          name: routeData.name,
          rate_inr: finalRate
        };
      }
      return item;
    }));
  };

  const handleResetTransportRouteToBaseRate = async (route) => {
    await resetTransportRouteToBaseRateService(route);
    await loadTransportRoutes();

    setTransportItems(prevItems => prevItems.map(item => {
      if (item.route_id === route.id) {
        const baseNpr = route.base_car_npr || route.car_npr || 1000;
        let finalRate = baseNpr;
        if (transportCurrency === 'INR') finalRate = Math.round(baseNpr / 1.6);
        else if (transportCurrency === 'USD') finalRate = Math.round(baseNpr / (Number(tripInfo.usdToNprRate) || 135.5));

        return {
          ...item,
          rate_inr: finalRate
        };
      }
      return item;
    }));
  };

  const handleDeleteTransportRouteMaster = async (id) => {
    await deleteTransportRouteService(id);
    await loadTransportRoutes();
  };

  // Calculation Aggregates for Master Package Matrix
  const calculatedHotels = hotelRows.map((row) => {
    const halfTwinRate = Number(row.half_twin_price) || 0;
    const singleRate = Number(row.single_room_price) || 0;
    const nights = Number(row.nights) || 0;
    const singleRooms = Number(row.single_rooms !== undefined ? row.single_rooms : tripInfo.singleRoomsCount) || 0;

    return {
      totalHalfTwin: halfTwinRate * nights,
      totalSingle: singleRate * singleRooms * nights
    };
  });

  const hotelTotalHalfTwin = calculatedHotels.reduce((sum, r) => sum + r.totalHalfTwin, 0);
  const hotelTotalSingle = calculatedHotels.reduce((sum, r) => sum + r.totalSingle, 0);
  const transportTotal = transportItems.reduce((sum, it) => sum + (Number(it.rate_inr) || 0) * (Number(it.qty) || 1), 0);
  const additionalTotal = additionalItems.reduce((sum, it) => sum + (Number(it.unit_price_inr) || 0) * (Number(it.qty) || 1), 0);
  const guideTotal = guideItems.reduce((sum, it) => sum + (Number(it.rate_per_day_inr) || 0) * (Number(it.days) || 1), 0);

  const paxCount = Math.max(1, tripInfo.paxAdults || 1);
  const usdRate = Number(tripInfo.usdToNprRate) || 135.5;

  const getMultiplierToNpr = (curr) => {
    if (curr === 'INR') return 1.6;
    if (curr === 'USD') return usdRate;
    return 1.0;
  };

  const hotelNprMultiplier = getMultiplierToNpr(hotelCurrency);
  const transportNprMultiplier = getMultiplierToNpr(transportCurrency);
  const additionalNprMultiplier = getMultiplierToNpr(additionalCurrency);
  const guideNprMultiplier = getMultiplierToNpr(guideCurrency);

  const hotelPerPax = Math.round(hotelTotalHalfTwin);
  const transportPerPax = Math.round(transportTotal / paxCount);
  const additionalPerPax = Math.round(additionalTotal / paxCount);
  const guidePerPax = Math.round(guideTotal / paxCount);
  const margin = Number(marginPerPax) || 0;

  const hotelPerPaxNpr = Math.round(hotelPerPax * hotelNprMultiplier);
  const transportPerPaxNpr = Math.round(transportPerPax * transportNprMultiplier);
  const additionalPerPaxNpr = Math.round(additionalPerPax * additionalNprMultiplier);
  const guidePerPaxNpr = Math.round(guidePerPax * guideNprMultiplier);

  const netPackageCostPerAdultNpr = hotelPerPaxNpr + transportPerPaxNpr + additionalPerPaxNpr + guidePerPaxNpr;
  const finalAdultRateNpr = netPackageCostPerAdultNpr + margin;
  const finalTotalAdultGroupNpr = finalAdultRateNpr * paxCount;
  const singleSupplementNpr = Math.round((Number(hotelTotalSingle) || 0) * hotelNprMultiplier);
  const groupGrandTotalNpr = finalTotalAdultGroupNpr + singleSupplementNpr;

  // Finalize Quotation Handler (Save to Supabase / Local Storage)
  const handleSaveQuotation = async (finalizeData) => {
    const totalNights = hotelRows.reduce((sum, r) => sum + (Number(r.nights) || 0), 0);
    const quotePayload = {
      quote_number: tripInfo.quoteNumber || `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      client_name: tripInfo.clientName || 'Direct Guest',
      prepared_by: finalizeData?.prepared_by || tripInfo.preparedBy || 'Subhash Rajbhandari',
      trip_title: tripInfo.tripTitle || 'Custom Nepal Tour Package',
      quote_date: tripInfo.quoteDate || new Date().toISOString().split('T')[0],
      pax_adults: tripInfo.paxAdults || 2,
      single_rooms_count: tripInfo.singleRoomsCount || 0,
      total_nights: totalNights || 1,
      hotel_currency: hotelCurrency,
      transport_currency: transportCurrency,
      additional_currency: additionalCurrency,
      guide_currency: guideCurrency,
      usd_to_npr_rate: Number(tripInfo.usdToNprRate) || 135.5,
      hotel_rows: hotelRows,
      transport_items: transportItems,
      additional_items: additionalItems,
      guide_items: guideItems,
      itinerary_days: itineraryDays,
      margin_per_pax: marginPerPax,
      final_adult_rate_npr: finalAdultRateNpr,
      group_grand_total_npr: groupGrandTotalNpr,
      status: finalizeData?.status || 'materialized',
      materialized_at: finalizeData?.materialized_at || (finalizeData?.status === 'materialized' ? new Date().toISOString() : null),
      notes: finalizeData?.remarks ? `${notes}\n\n[Agent Remarks]: ${finalizeData.remarks}` : notes
    };

    await saveQuotationService(quotePayload);
    await loadQuotations();

    // Prepare next quote reference for fresh quotation creation
    setTripInfo(prev => ({
      ...prev,
      quoteNumber: `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    }));

    // Switch to history tab to show the recorded quotation
    setActiveTab('history');
  };

  // 1-Click Status Update Handler from Past Quotations Dashboard
  const handleUpdateQuoteStatus = async (id, newStatus) => {
    await updateQuotationStatusService(id, newStatus);
    await loadQuotations();
  };

  // Delete Quotation Record
  const handleDeleteQuote = async (id) => {
    await deleteQuotationService(id);
    await loadQuotations();
  };

  // Load Past Quotation back into active workspace
  const handleLoadQuoteIntoWorkspace = (quote) => {
    if (!quote) return;

    setTripInfo({
      tripTitle: quote.trip_title || 'Custom Nepal Tour Package',
      clientName: quote.client_name || 'Direct Guest',
      preparedBy: quote.prepared_by || tripInfo.preparedBy || 'Subhash Rajbhandari',
      quoteNumber: quote.quote_number || `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      quoteDate: quote.quote_date || new Date().toISOString().split('T')[0],
      paxAdults: quote.pax_adults || 2,
      singleRoomsCount: quote.single_rooms_count || 0,
      usdToNprRate: Number(quote.usd_to_npr_rate) || 135.5
    });

    if (quote.hotel_rows && Array.isArray(quote.hotel_rows)) setHotelRows(quote.hotel_rows);
    if (quote.transport_items && Array.isArray(quote.transport_items)) setTransportItems(quote.transport_items);
    if (quote.additional_items && Array.isArray(quote.additional_items)) setAdditionalItems(quote.additional_items);
    if (quote.guide_items && Array.isArray(quote.guide_items)) setGuideItems(quote.guide_items);
    if (quote.itinerary_days && Array.isArray(quote.itinerary_days)) setItineraryDays(quote.itinerary_days);

    if (quote.hotel_currency) setHotelCurrency(quote.hotel_currency);
    if (quote.transport_currency) setTransportCurrency(quote.transport_currency);
    if (quote.additional_currency) setAdditionalCurrency(quote.additional_currency);
    if (quote.guide_currency) setGuideCurrency(quote.guide_currency);

    if (quote.margin_per_pax !== undefined) setMarginPerPax(quote.margin_per_pax);
    if (quote.notes) setNotes(quote.notes);

    setActiveTab('quotation');
  };

  // Clone Past Quotation as a new draft
  const handleCloneQuote = async (quote) => {
    if (!quote) return;
    const cloned = {
      ...quote,
      id: undefined,
      quote_number: `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'draft',
      materialized_at: null,
      quote_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    await saveQuotationService(cloned);
    await loadQuotations();
  };

  // Preview Past Quotation
  const handlePreviewPastQuote = (quote) => {
    setPreviewQuoteData(quote);
    setIsPreviewOpen(true);
  };

  // Trigger Native Browser Print Dialog (supports printing active workspace or explicit past quote)
  const handlePrint = (quoteToPrint = null) => {
    if (quoteToPrint && (quoteToPrint.quote_number || quoteToPrint.id)) {
      setPreviewQuoteData(quoteToPrint);
      setTimeout(() => {
        window.print();
      }, 150);
    } else {
      window.print();
    }
  };

  // Email Dispatch Modal Handlers
  const handleOpenEmailModal = (quoteToEmail = null) => {
    setEmailQuoteData(quoteToEmail);
    setIsEmailModalOpen(true);
  };

  const handleEmailSent = async (details) => {
    try {
      await logQuotationEmailService({
        quoteNumber: details.quoteNumber,
        recipientEmail: details.recipientEmail,
        subject: details.subject || `Quotation - ${details.quoteNumber}`,
        sesMessageId: details.messageId,
        sentBy: tripInfo.preparedBy || 'Subhash Rajbhandari'
      });
    } catch (err) {
      console.warn('Failed to log email to Supabase:', err);
    }
  };

  const materializedQuotationsCount = quotationsList.filter(q => q.status === 'materialized').length;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLiveSupabase={isLiveSupabase}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        onPreview={() => {
          setPreviewQuoteData(null);
          setIsPreviewOpen(true);
        }}
        onPrint={handlePrint}
        onEmailQuote={() => handleOpenEmailModal(null)}
        onFinalizeQuote={() => setIsFinalizeModalOpen(true)}
        onNewQuotation={() => {
          setTripInfo(prev => ({
            ...prev,
            quoteNumber: `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
          }));
          setActiveTab('quotation');
        }}
        isRefreshing={isRefreshing}
        onRefresh={loadAllData}
        hotelCount={availableHotels.length}
        transportRouteCount={availableTransportRoutes.length}
        itineraryCount={itineraryDays.length}
        quotationCount={quotationsList.length}
        materializedCount={materializedQuotationsCount}
      />

      {/* Main Workspace Area */}
      <main className="main-content">
        {activeTab === 'quotation' && (
          <>
            {/* 1. Trip Header Specs */}
            <TripHeader
              tripInfo={tripInfo}
              onChange={handleTripInfoChange}
              onFinalize={() => setIsFinalizeModalOpen(true)}
            />

            {/* 2. Premier Hotel Costing Section */}
            <PremierSection
              hotelRows={hotelRows}
              availableHotels={availableHotels}
              currency={hotelCurrency}
              onCurrencyChange={handleHotelCurrencyChange}
              tripInfo={tripInfo}
              onAddRow={handleAddRow}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
              onDuplicateRow={handleDuplicateRow}
              onHotelSelect={handleHotelSelect}
            />

            {/* 3. Transportation Sectors Costing */}
            <TransportationSection
              transportItems={transportItems}
              onUpdateTransportItems={handleUpdateTransportItems}
              tripInfo={tripInfo}
              currency={transportCurrency}
              onCurrencyChange={handleTransportCurrencyChange}
              availableTransportRoutes={availableTransportRoutes}
              onOpenTransportRates={() => setActiveTab('transportRates')}
            />

            {/* 4. Additional Activities, Flights & Permits */}
            <AdditionalCostsSection
              additionalItems={additionalItems}
              onUpdateAdditionalItems={setAdditionalItems}
              tripInfo={tripInfo}
              currency={additionalCurrency}
              onCurrencyChange={handleAdditionalCurrencyChange}
            />

            {/* 5. Guide Services */}
            <GuideSection
              guideItems={guideItems}
              onUpdateGuideItems={setGuideItems}
              tripInfo={tripInfo}
              currency={guideCurrency}
              onCurrencyChange={handleGuideCurrencyChange}
            />

            {/* 6. Package Master Grand Total Matrix (Adults, Children 75%/35%, Profit Margin) */}
            <PackageGrandTotalCard
              hotelTotalHalfTwin={hotelTotalHalfTwin}
              hotelTotalSingle={hotelTotalSingle}
              hotelCurrency={hotelCurrency}
              transportTotal={transportTotal}
              transportCurrency={transportCurrency}
              additionalTotal={additionalTotal}
              additionalCurrency={additionalCurrency}
              guideTotal={guideTotal}
              guideCurrency={guideCurrency}
              tripInfo={tripInfo}
              notes={notes}
              onNotesChange={setNotes}
              marginPerPax={marginPerPax}
              onMarginChange={setMarginPerPax}
              onNavigateToItinerary={() => setActiveTab('itinerary')}
              onFinalizeQuote={() => setIsFinalizeModalOpen(true)}
              onEmailQuote={() => handleOpenEmailModal(null)}
            />
          </>
        )}

        {activeTab === 'itinerary' && (
          /* 7. Step 2: Tour Itinerary Planning Tab */
          <ItineraryPlanningTab
            itineraryDays={itineraryDays}
            onUpdateItineraryDays={setItineraryDays}
            transportItems={transportItems}
            availableTransportRoutes={availableTransportRoutes}
            availableHotels={availableHotels}
            hotelRows={hotelRows}
            availableItineraryTemplates={itineraryTemplates}
            onCreateTemplate={handleCreateTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            tripInfo={tripInfo}
            onNavigateToCosting={() => setActiveTab('quotation')}
            onPreview={() => {
              setPreviewQuoteData(null);
              setIsPreviewOpen(true);
            }}
            onPrint={handlePrint}
            onEmailQuote={() => handleOpenEmailModal(null)}
            onSyncWithTransport={handleSyncItineraryWithTransport}
            onFinalize={() => setIsFinalizeModalOpen(true)}
          />
        )}

        {activeTab === 'history' && (
          /* 8. Past Quotations History & Materialization Tracking Tab */
          <QuotationsHistoryTab
            quotations={quotationsList}
            isLiveSupabase={isLiveSupabase}
            onUpdateStatus={handleUpdateQuoteStatus}
            onDeleteQuote={handleDeleteQuote}
            onDelete={handleDeleteQuote}
            onLoadQuoteIntoWorkspace={handleLoadQuoteIntoWorkspace}
            onLoadIntoWorkspace={handleLoadQuoteIntoWorkspace}
            onCloneQuote={handleCloneQuote}
            onClone={handleCloneQuote}
            onPreviewQuote={handlePreviewPastQuote}
            onPreview={handlePreviewPastQuote}
            onPrintQuote={handlePrint}
            onPrint={handlePrint}
            onEmailQuote={handleOpenEmailModal}
            onEmail={handleOpenEmailModal}
            onRefresh={loadAllData}
            onNavigateToNewQuote={() => {
              setTripInfo(prev => ({
                ...prev,
                quoteNumber: `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
              }));
              setActiveTab('quotation');
            }}
            onNewQuotation={() => {
              setTripInfo(prev => ({
                ...prev,
                quoteNumber: `FT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
              }));
              setActiveTab('quotation');
            }}
          />
        )}

        {activeTab === 'rates' && (
          /* Hotel Rates & Seasonality Tab */
          <HotelRatesTab
            hotels={availableHotels}
            isLiveSupabase={isLiveSupabase}
            onUpdateHotel={handleUpdateHotelMaster}
            onAddHotel={handleAddHotelMaster}
            onDeleteHotel={handleDeleteHotelMaster}
            onResetToBaseRate={handleResetToBaseRate}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'transportRates' && (
          /* Transportation Fleet & Master Rates Tab */
          <TransportationRatesTab
            transportRoutes={availableTransportRoutes}
            isLiveSupabase={isLiveSupabase}
            onUpdateTransportRoute={handleUpdateTransportRouteMaster}
            onAddTransportRoute={handleAddTransportRouteMaster}
            onDeleteTransportRoute={handleDeleteTransportRouteMaster}
            onResetToBaseRate={handleResetTransportRouteToBaseRate}
            onRefresh={loadAllData}
            availableItineraryTemplates={itineraryTemplates}
            onCreateTemplate={handleCreateTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}
      </main>

      {/* Supabase Setup Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
        onConfigSaved={(live) => {
          setIsLiveSupabase(live);
          loadAllData();
        }}
      />

      {/* Finalize Quotation Modal */}
      <FinalizeQuoteModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        onSave={handleSaveQuotation}
        tripInfo={tripInfo}
        groupGrandTotalNpr={groupGrandTotalNpr}
        finalAdultRateNpr={finalAdultRateNpr}
        hotelCurrency={hotelCurrency}
        transportCurrency={transportCurrency}
        additionalCurrency={additionalCurrency}
        guideCurrency={guideCurrency}
        notes={notes}
      />

      {/* Quotation Document Preview Modal */}
      <QuotationPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewQuoteData(null);
        }}
        onPrint={handlePrint}
        quoteData={previewQuoteData}
        tripInfo={tripInfo}
        hotelRows={hotelRows}
        availableHotels={availableHotels}
        hotelCurrency={hotelCurrency}
        transportItems={transportItems}
        transportCurrency={transportCurrency}
        additionalItems={additionalItems}
        additionalCurrency={additionalCurrency}
        guideItems={guideItems}
        guideCurrency={guideCurrency}
        itineraryDays={itineraryDays}
        notes={notes}
        marginPerPax={marginPerPax}
      />

      {/* Email Quotation Modal (AWS SES) */}
      <EmailQuoteModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailQuoteData(null);
        }}
        quoteData={emailQuoteData}
        tripInfo={tripInfo}
        hotelRows={hotelRows}
        availableHotels={availableHotels}
        hotelCurrency={hotelCurrency}
        transportItems={transportItems}
        transportCurrency={transportCurrency}
        additionalItems={additionalItems}
        additionalCurrency={additionalCurrency}
        guideItems={guideItems}
        guideCurrency={guideCurrency}
        itineraryDays={itineraryDays}
        notes={notes}
        marginPerPax={marginPerPax}
        onEmailSent={handleEmailSent}
      />

      {/* Dedicated High-Resolution Print / PDF Document Root */}
      <PrintQuotation
        tripInfo={previewQuoteData ? {
          tripTitle: previewQuoteData.trip_title,
          clientName: previewQuoteData.client_name,
          preparedBy: previewQuoteData.prepared_by || tripInfo.preparedBy || 'Subhash Rajbhandari',
          quoteNumber: previewQuoteData.quote_number,
          quoteDate: previewQuoteData.quote_date,
          paxAdults: previewQuoteData.pax_adults,
          singleRoomsCount: previewQuoteData.single_rooms_count,
          usdToNprRate: previewQuoteData.usd_to_npr_rate || 135.5
        } : tripInfo}
        hotelRows={previewQuoteData?.hotel_rows || hotelRows}
        availableHotels={availableHotels}
        hotelCurrency={previewQuoteData?.hotel_currency || hotelCurrency}
        transportItems={previewQuoteData?.transport_items || transportItems}
        transportCurrency={previewQuoteData?.transport_currency || transportCurrency}
        additionalItems={previewQuoteData?.additional_items || additionalItems}
        additionalCurrency={previewQuoteData?.additional_currency || additionalCurrency}
        guideItems={previewQuoteData?.guide_items || guideItems}
        guideCurrency={previewQuoteData?.guide_currency || guideCurrency}
        itineraryDays={previewQuoteData?.itinerary_days || itineraryDays}
        notes={previewQuoteData?.notes !== undefined ? previewQuoteData.notes : notes}
        marginPerPax={previewQuoteData?.margin_per_pax !== undefined ? previewQuoteData.margin_per_pax : marginPerPax}
      />
    </div>
  );
}
