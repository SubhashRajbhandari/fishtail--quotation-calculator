import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TripHeader from './components/TripHeader';
import PremierSection from './components/PremierSection';
import TransportationSection from './components/TransportationSection';
import AdditionalCostsSection from './components/AdditionalCostsSection';
import GuideSection from './components/GuideSection';
import PackageGrandTotalCard from './components/PackageGrandTotalCard';
import HotelRatesTab from './components/HotelRatesTab';
import TransportationRatesTab from './components/TransportationRatesTab';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import QuotationPreviewModal from './components/QuotationPreviewModal';
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
  isSupabaseConfigured 
} from './lib/supabase';
import { 
  INITIAL_HOTEL_ROWS, 
  INITIAL_TRANSPORT_ITEMS, 
  INITIAL_ADDITIONAL_ITEMS, 
  INITIAL_GUIDE_ITEMS,
  MASTER_TRANSPORT_ROUTES,
  MASTER_ADDITIONAL_ACTIVITIES,
  MASTER_GUIDE_OPTIONS
} from './lib/mockData';

export default function App() {
  // Navigation Tab ('quotation' | 'rates' | 'transportRates')
  const [activeTab, setActiveTab] = useState('quotation');

  // Trip & Quotation Info
  const [tripInfo, setTripInfo] = useState({
    tripTitle: 'Kathmandu - Pokhara - Chitwan - Chandragiri 7D/6N Tour',
    clientName: 'Acme Travels / Direct Guest',
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

  // Available Hotels from Supabase
  const [availableHotels, setAvailableHotels] = useState([]);
  const [isLiveSupabase, setIsLiveSupabase] = useState(isSupabaseConfigured());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadHotels(), loadTransportRoutes()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

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

  // Trigger Native Browser Print Dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLiveSupabase={isLiveSupabase}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        onPreview={() => setIsPreviewOpen(true)}
        onPrint={handlePrint}
        isRefreshing={isRefreshing}
        onRefresh={loadAllData}
        hotelCount={availableHotels.length}
        transportRouteCount={availableTransportRoutes.length}
      />

      {/* Main Workspace Area */}
      <main className="main-content">
        {activeTab === 'quotation' && (
          <>
            {/* 1. Trip Header Specs */}
            <TripHeader
              tripInfo={tripInfo}
              onChange={handleTripInfoChange}
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
              onUpdateTransportItems={setTransportItems}
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
            />
          </>
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

      {/* Quotation Document Preview Modal */}
      <QuotationPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPrint={handlePrint}
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
        notes={notes}
        marginPerPax={marginPerPax}
      />

      {/* Dedicated High-Resolution Print / PDF Document Root */}
      <PrintQuotation
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
        notes={notes}
        marginPerPax={marginPerPax}
      />
    </div>
  );
}
