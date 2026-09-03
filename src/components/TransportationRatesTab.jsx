import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  RotateCcw, 
  Edit3, 
  Save, 
  X, 
  Search, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  Layers,
  ArrowRightLeft,
  Truck,
  ShieldCheck,
  Zap,
  Info,
  DollarSign,
  BookmarkPlus,
  Compass,
  Utensils,
  MapPin,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MASTER_ITINERARY_TEMPLATES } from '../lib/mockData';

export default function TransportationRatesTab({
  transportRoutes,
  isLiveSupabase,
  onUpdateTransportRoute,
  onAddTransportRoute,
  onDeleteTransportRoute,
  onResetToBaseRate,
  onRefresh,
  availableItineraryTemplates = MASTER_ITINERARY_TEMPLATES,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [displayCurrency, setDisplayCurrency] = useState('NPR'); // NPR | INR | USD
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Itinerary Variants Management State
  const [variantsModalRoute, setVariantsModalRoute] = useState(null);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariantForm, setNewVariantForm] = useState({
    template_name: '',
    title: '',
    description: '',
    highlights: '',
    meals: 'Breakfast (CP)',
    city: 'Kathmandu',
    is_default: false
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Kathmandu',
    notes: '',
    season_note: 'Standard Tariff',
    car_npr: 1000,
    scorpio_npr: 1500,
    hiace_npr: 1750,
    coaster_npr: 2250,
    shuttle_npr: 2750,
    car_inr: 625,
    scorpio_inr: 938,
    hiace_inr: 1094,
    coaster_inr: 1406,
    shuttle_inr: 1719,
    base_car_npr: 1000,
    base_scorpio_npr: 1500,
    base_hiace_npr: 1750,
    base_coaster_npr: 2250,
    base_shuttle_npr: 2750
  });

  const categories = ['ALL', 'Kathmandu', 'Pokhara', 'Airport', 'Chitwan', 'Inter-City / Overland', 'Excursion'];

  const templates = availableItineraryTemplates && availableItineraryTemplates.length > 0
    ? availableItineraryTemplates
    : MASTER_ITINERARY_TEMPLATES;

  // Get templates matching a route
  const getTemplatesForRoute = (routeId, routeName) => {
    return templates.filter(t => 
      (t.route_identifier && t.route_identifier === routeId) ||
      (t.route_id && t.route_id === routeId) ||
      (t.route_name && (t.route_name === routeName || t.route_name.toLowerCase().includes(routeName?.toLowerCase())))
    );
  };

  const openVariantsModal = (route) => {
    setVariantsModalRoute(route);
    setIsAddingVariant(false);
    const existingVariants = getTemplatesForRoute(route.id, route.name);
    setNewVariantForm({
      template_name: `Option ${existingVariants.length + 1}: Custom Sightseeing Plan`,
      title: `${route.name} - Exploration`,
      description: '',
      highlights: '',
      meals: 'Breakfast (CP)',
      city: route.category || 'Kathmandu',
      is_default: existingVariants.length === 0
    });
  };

  const handleCreateVariantSubmit = async (e) => {
    e.preventDefault();
    if (!variantsModalRoute || !newVariantForm.template_name.trim()) return;

    const highlightsArray = newVariantForm.highlights
      ? newVariantForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : [variantsModalRoute.name];

    const payload = {
      route_identifier: String(variantsModalRoute.id),
      route_name: variantsModalRoute.name,
      template_name: newVariantForm.template_name.trim(),
      title: newVariantForm.title.trim() || variantsModalRoute.name,
      description: newVariantForm.description.trim(),
      highlights: highlightsArray,
      meals: newVariantForm.meals || 'Breakfast (CP)',
      city: newVariantForm.city || 'Kathmandu',
      is_default: Boolean(newVariantForm.is_default)
    };

    if (onCreateTemplate) {
      await onCreateTemplate(payload);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }

    setIsAddingVariant(false);
  };

  const startEdit = (route) => {
    setEditingRouteId(route.id);
    setIsAddingNew(false);
    setEditForm({
      name: route.name || '',
      category: route.category || 'Kathmandu',
      notes: route.notes || '',
      season_note: route.season_note || 'Standard Tariff',
      car_npr: route.car_npr || 1000,
      scorpio_npr: route.scorpio_npr || 1500,
      hiace_npr: route.hiace_npr || 1750,
      coaster_npr: route.coaster_npr || 2250,
      shuttle_npr: route.shuttle_npr || 2750,
      car_inr: route.car_inr || Math.round((route.car_npr || 1000) / 1.6),
      scorpio_inr: route.scorpio_inr || Math.round((route.scorpio_npr || 1500) / 1.6),
      hiace_inr: route.hiace_inr || Math.round((route.hiace_npr || 1750) / 1.6),
      coaster_inr: route.coaster_inr || Math.round((route.coaster_npr || 2250) / 1.6),
      shuttle_inr: route.shuttle_inr || Math.round((route.shuttle_npr || 2750) / 1.6),
      base_car_npr: route.base_car_npr || route.car_npr || 1000,
      base_scorpio_npr: route.base_scorpio_npr || route.scorpio_npr || 1500,
      base_hiace_npr: route.base_hiace_npr || route.hiace_npr || 1750,
      base_coaster_npr: route.base_coaster_npr || route.coaster_npr || 2250,
      base_shuttle_npr: route.base_shuttle_npr || route.shuttle_npr || 2750
    });
  };

  const startAdd = () => {
    setIsAddingNew(true);
    setEditingRouteId(null);
    setEditForm({
      name: '',
      category: 'Kathmandu',
      notes: '',
      season_note: 'Standard Tariff',
      car_npr: 1000,
      scorpio_npr: 1500,
      hiace_npr: 1750,
      coaster_npr: 2250,
      shuttle_npr: 2750,
      car_inr: 625,
      scorpio_inr: 938,
      hiace_inr: 1094,
      coaster_inr: 1406,
      shuttle_inr: 1719,
      base_car_npr: 1000,
      base_scorpio_npr: 1500,
      base_hiace_npr: 1750,
      base_coaster_npr: 2250,
      base_shuttle_npr: 2750
    });
  };

  // Auto-fill INR & vehicle scale ratios from car_npr
  const autoCalculateFleetFromCar = () => {
    const carNpr = parseFloat(editForm.car_npr) || 1000;
    const scorpioNpr = Math.round(carNpr * 1.5);
    const hiaceNpr = Math.round(carNpr * 1.75);
    const coasterNpr = Math.round(carNpr * 2.25);
    const shuttleNpr = Math.round(carNpr * 2.75);

    setEditForm({
      ...editForm,
      scorpio_npr: scorpioNpr,
      hiace_npr: hiaceNpr,
      coaster_npr: coasterNpr,
      shuttle_npr: shuttleNpr,
      car_inr: Math.round(carNpr / 1.6),
      scorpio_inr: Math.round(scorpioNpr / 1.6),
      hiace_inr: Math.round(hiaceNpr / 1.6),
      coaster_inr: Math.round(coasterNpr / 1.6),
      shuttle_inr: Math.round(shuttleNpr / 1.6)
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    const payload = {
      ...editForm,
      car_npr: parseFloat(editForm.car_npr) || 1000,
      scorpio_npr: parseFloat(editForm.scorpio_npr) || 1500,
      hiace_npr: parseFloat(editForm.hiace_npr) || 1750,
      coaster_npr: parseFloat(editForm.coaster_npr) || 2250,
      shuttle_npr: parseFloat(editForm.shuttle_npr) || 2750,
      car_inr: parseFloat(editForm.car_inr) || Math.round((parseFloat(editForm.car_npr) || 1000) / 1.6),
      scorpio_inr: parseFloat(editForm.scorpio_inr) || Math.round((parseFloat(editForm.scorpio_npr) || 1500) / 1.6),
      hiace_inr: parseFloat(editForm.hiace_inr) || Math.round((parseFloat(editForm.hiace_npr) || 1750) / 1.6),
      coaster_inr: parseFloat(editForm.coaster_inr) || Math.round((parseFloat(editForm.coaster_npr) || 2250) / 1.6),
      shuttle_inr: parseFloat(editForm.shuttle_inr) || Math.round((parseFloat(editForm.shuttle_npr) || 2750) / 1.6),
      base_car_npr: parseFloat(editForm.base_car_npr) || parseFloat(editForm.car_npr) || 1000,
      base_scorpio_npr: parseFloat(editForm.base_scorpio_npr) || parseFloat(editForm.scorpio_npr) || 1500,
      base_hiace_npr: parseFloat(editForm.base_hiace_npr) || parseFloat(editForm.hiace_npr) || 1750,
      base_coaster_npr: parseFloat(editForm.base_coaster_npr) || parseFloat(editForm.coaster_npr) || 2250,
      base_shuttle_npr: parseFloat(editForm.base_shuttle_npr) || parseFloat(editForm.shuttle_npr) || 2750,
      is_custom_rate: Number(editForm.car_npr) !== Number(editForm.base_car_npr)
    };

    if (isAddingNew) {
      await onAddTransportRoute(payload);
    } else {
      await onUpdateTransportRoute(editingRouteId, payload);
    }

    setEditingRouteId(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from master transportation routes?`)) {
      await onDeleteTransportRoute(id);
    }
  };

  const handleReset = async (route) => {
    await onResetToBaseRate(route);
  };

  // Filter routes
  const filteredRoutes = (transportRoutes || []).filter(route => {
    const matchesSearch = route.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          route.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          route.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          route.season_note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || route.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Display Rate Formatter
  const getPriceForDisplay = (route, vehKey) => {
    const npr = route[`${vehKey}_npr`] || 0;
    if (displayCurrency === 'INR') return route[`${vehKey}_inr`] || Math.round(npr / 1.6);
    if (displayCurrency === 'USD') return Math.round(npr / 135.5);
    return npr;
  };

  const currSymbol = displayCurrency === 'INR' ? '₹' : (displayCurrency === 'USD' ? '$' : 'Rs. ');
  const formatNum = (val) => Number(val || 0).toLocaleString();

  return (
    <div className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ border: '2px solid #0f172a', background: '#0f172a', color: '#ffffff', overflow: 'hidden' }}>
        <div className="card-body" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ 
                background: 'var(--gold-gradient)', 
                color: '#000', 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px', 
                letterSpacing: '0.05em' 
              }}>
                FLEET & SIGHTSEEING MASTER CATALOG
              </span>
              {isLiveSupabase ? (
                <span style={{ fontSize: '0.75rem', background: '#064e3b', color: '#6ee7b7', padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} /> Live PostgreSQL
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', background: '#451a03', color: '#fdba74', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  Local Storage Mode
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              Transportation Fleet Rates & Itinerary Variants Catalog
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '0.35rem 0 0 0', maxWidth: '750px' }}>
              Manage master tariffs across all 5 vehicle allocations and configure <strong>multi-variant pre-saved sightseeing day schedules</strong> for each sector transfer.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={startAdd}
              className="btn btn-accent"
              style={{ padding: '0.6rem 1.25rem', fontWeight: 700 }}
            >
              <Plus size={16} />
              <span>Add New Sector Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit / Add Route Form Drawer */}
      {(editingRouteId || isAddingNew) && (
        <div className="card" style={{ border: '2px solid #2563eb', background: '#f8fafc', boxShadow: 'var(--shadow-md)' }}>
          <div className="card-header" style={{ background: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Truck size={20} style={{ color: '#2563eb' }} />
              <div>
                <div className="card-title" style={{ color: '#1e40af', fontSize: '1.1rem' }}>
                  {isAddingNew ? 'Add New Sector Transfer Route' : `Edit Rates & Notes for "${editForm.name}"`}
                </div>
                <div className="card-subtitle">
                  Configure default base tariffs across all 5 vehicle allocations in Nepalese Rupees (NPR).
                </div>
              </div>
            </div>
            <button type="button" onClick={() => { setIsAddingNew(false); setEditingRouteId(null); }} className="btn-danger-ghost">
              <X size={20} />
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSave}>
              {/* Basic Route Details */}
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Sector / Route Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. ARRIVAL - KTM Airport Pick-up"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Region / Category</label>
                  <select
                    className="form-select"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="Kathmandu">Kathmandu Valley</option>
                    <option value="Pokhara">Pokhara Valley</option>
                    <option value="Airport">Airport Transfers</option>
                    <option value="Chitwan">Chitwan National Park</option>
                    <option value="Inter-City / Overland">Inter-City / Overland</option>
                    <option value="Excursion">Sunrise & Day Excursion</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Seasonality / Promo Status</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Standard Tariff or Peak Season"
                    value={editForm.season_note}
                    onChange={(e) => setEditForm({ ...editForm, season_note: e.target.value })}
                  />
                </div>
              </div>

              {/* Multi-Vehicle Category Rates in NPR */}
              <div style={{ 
                background: '#ffffff', 
                border: '1px solid #cbd5e1', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem', 
                marginBottom: '1.25rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Car size={16} /> Vehicle Class Tariffs (Base Currency: NPR)
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Set the standard rate for each vehicle category for this sector.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={autoCalculateFleetFromCar}
                    className="btn btn-secondary btn-sm"
                    title="Auto-fill Scorpio (1.5x), Hiace (1.75x), Coaster (2.25x), Coach (2.75x) from Car"
                    style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                  >
                    <Zap size={13} />
                    <span>Auto-scale Fleet from Car</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {/* 1. Sedan Car */}
                  <div className="rate-box" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '0.35rem' }}>
                      🚗 Private Sedan Car (1-2 Pax)
                    </div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Rate in NPR (Rs):</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}
                      value={editForm.car_npr}
                      onChange={(e) => setEditForm({ ...editForm, car_npr: e.target.value, car_inr: Math.round((parseFloat(e.target.value) || 0) / 1.6) })}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      INR equiv: ₹{Math.round((editForm.car_npr || 0) / 1.6)}
                    </div>
                  </div>

                  {/* 2. Scorpio SUV */}
                  <div className="rate-box" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', marginBottom: '0.35rem' }}>
                      🚙 4WD Scorpio / SUV (3-4 Pax)
                    </div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Rate in NPR (Rs):</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}
                      value={editForm.scorpio_npr}
                      onChange={(e) => setEditForm({ ...editForm, scorpio_npr: e.target.value, scorpio_inr: Math.round((parseFloat(e.target.value) || 0) / 1.6) })}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      INR equiv: ₹{Math.round((editForm.scorpio_npr || 0) / 1.6)}
                    </div>
                  </div>

                  {/* 3. Toyota Hiace */}
                  <div className="rate-box" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', marginBottom: '0.35rem' }}>
                      🚐 Toyota Hiace (5-13 Pax)
                    </div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Rate in NPR (Rs):</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}
                      value={editForm.hiace_npr}
                      onChange={(e) => setEditForm({ ...editForm, hiace_npr: e.target.value, hiace_inr: Math.round((parseFloat(e.target.value) || 0) / 1.6) })}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      INR equiv: ₹{Math.round((editForm.hiace_npr || 0) / 1.6)}
                    </div>
                  </div>

                  {/* 4. Toyota Coaster */}
                  <div className="rate-box" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', marginBottom: '0.35rem' }}>
                      🚌 Coaster Bus (13-20 Pax)
                    </div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Rate in NPR (Rs):</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}
                      value={editForm.coaster_npr}
                      onChange={(e) => setEditForm({ ...editForm, coaster_npr: e.target.value, coaster_inr: Math.round((parseFloat(e.target.value) || 0) / 1.6) })}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      INR equiv: ₹{Math.round((editForm.coaster_npr || 0) / 1.6)}
                    </div>
                  </div>

                  {/* 5. Coach */}
                  <div className="rate-box" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6d28d9', marginBottom: '0.35rem' }}>
                      🚍 Tourist Coach (21+ Pax)
                    </div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Rate in NPR (Rs):</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}
                      value={editForm.shuttle_npr}
                      onChange={(e) => setEditForm({ ...editForm, shuttle_npr: e.target.value, shuttle_inr: Math.round((parseFloat(e.target.value) || 0) / 1.6) })}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      INR equiv: ₹{Math.round((editForm.shuttle_npr || 0) / 1.6)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Base Reference & Notes */}
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Base Reference Car Rate (NPR)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.base_car_npr}
                    onChange={(e) => setEditForm({ ...editForm, base_car_npr: parseFloat(e.target.value) || 0 })}
                  />
                  <small style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Used when clicking "Reset to Standard Rate"</small>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Operational Notes</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Airport pickup to city hotel via Ring Road"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingRouteId(null); }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Save size={16} />
                  <span>{isAddingNew ? 'Create Master Route' : 'Save Fleet Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Category Filter Toolbar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '1rem', 
        flexWrap: 'wrap',
        background: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search routes by name, city, notes, or season..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '0.35rem 0' }}
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={() => setSearchTerm('')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Currency toggle for preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            View Currency:
          </span>
          <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
            {['NPR', 'INR', 'USD'].map(curr => (
              <button
                key={curr}
                type="button"
                onClick={() => setDisplayCurrency(curr)}
                style={{
                  background: displayCurrency === curr ? '#2563eb' : '#ffffff',
                  color: displayCurrency === curr ? '#ffffff' : '#475569',
                  border: 'none',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Master Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ width: '32%' }}>Sector Transfer & Itinerary Variants</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Region</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚗 Sedan Car</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚙 Scorpio SUV</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚐 Toyota Hiace</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚌 Coaster Bus</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Status</th>
                <th style={{ width: '6%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No transport routes found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((route) => {
                  const carPrice = getPriceForDisplay(route, 'car');
                  const scorpioPrice = getPriceForDisplay(route, 'scorpio');
                  const hiacePrice = getPriceForDisplay(route, 'hiace');
                  const coasterPrice = getPriceForDisplay(route, 'coaster');
                  const shuttlePrice = getPriceForDisplay(route, 'shuttle');

                  const isCustom = route.is_custom_rate || (
                    Number(route.car_npr) !== Number(route.base_car_npr || route.car_npr)
                  );

                  const routeVariants = getTemplatesForRoute(route.id, route.name);

                  return (
                    <tr key={route.id} className="hotel-row">
                      {/* Name & Variants Badge */}
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {route.name}
                        </div>
                        {route.notes && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {route.notes}
                          </div>
                        )}

                        {/* Itinerary Variants Badge / Manager Button */}
                        <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => openVariantsModal(route)}
                            style={{
                              background: '#fffbeb',
                              color: '#92400e',
                              border: '1px solid #fde68a',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            title="View, add, or customize pre-defined itinerary variants for this route"
                          >
                            <Sparkles size={12} style={{ color: '#d97706' }} />
                            <span>{routeVariants.length} Itinerary Variants</span>
                            <span style={{ background: '#fef3c7', padding: '0.05rem 0.35rem', borderRadius: '3px', fontSize: '0.68rem', color: '#b45309' }}>+ Add Variant</span>
                          </button>

                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            Coach (21+): {currSymbol}{formatNum(shuttlePrice)}
                          </span>
                        </div>
                      </td>

                      {/* Region Category */}
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge-city" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
                          {route.category || 'Kathmandu'}
                        </span>
                      </td>

                      {/* Sedan Car */}
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#1d4ed8' }}>
                        {currSymbol}{formatNum(carPrice)}
                      </td>

                      {/* Scorpio SUV */}
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                        {currSymbol}{formatNum(scorpioPrice)}
                      </td>

                      {/* Hiace */}
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#047857' }}>
                        {currSymbol}{formatNum(hiacePrice)}
                      </td>

                      {/* Coaster Bus */}
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                        {currSymbol}{formatNum(coasterPrice)}
                      </td>

                      {/* Status / Season Note */}
                      <td style={{ textAlign: 'center' }}>
                        {isCustom ? (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            background: '#fef3c7', 
                            color: '#b45309', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '9999px',
                            fontWeight: 700,
                            border: '1px solid #fde68a'
                          }}>
                            {route.season_note || 'Custom Tariff'}
                          </span>
                        ) : (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            background: '#ecfdf5', 
                            color: '#047857', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '9999px',
                            fontWeight: 600
                          }}>
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => startEdit(route)}
                            className="btn-icon"
                            title="Edit default route tariffs"
                            style={{ padding: '0.3rem', color: '#2563eb' }}
                          >
                            <Edit3 size={15} />
                          </button>

                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleReset(route)}
                              className="btn-icon"
                              title="Reset back to base standard tariff"
                              style={{ padding: '0.3rem', color: '#f59e0b' }}
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(route.id, route.name)}
                            className="btn-danger-ghost"
                            title="Delete route from master DB"
                            style={{ padding: '0.3rem' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div style={{ 
          padding: '0.85rem 1.25rem', 
          background: '#f8fafc', 
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={14} style={{ color: 'var(--primary)' }} />
            <span>Showing <strong>{filteredRoutes.length}</strong> master sector routes. Click any <strong>"Itinerary Variants"</strong> badge to add or configure predefined day schedules.</span>
          </div>

          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            Base Currency: <strong>NPR (Nepalese Rupee)</strong>
          </div>
        </div>
      </div>

      {/* ITINERARY VARIANTS MODAL FOR SPECIFIC TRANSPORT ROUTE */}
      {variantsModalRoute && (
        <div className="modal-backdrop no-print" onClick={() => setVariantsModalRoute(null)}>
          <div 
            className="modal-dialog" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '850px', width: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Modal Header */}
            <div className="modal-header" style={{ background: '#0f172a', color: '#ffffff', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={20} style={{ color: '#facc15' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    Itinerary Variants for: {variantsModalRoute.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Pre-saved sightseeing schedules and narratives available in the dropdown when planning tours.
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setVariantsModalRoute(null)} 
                className="btn-icon" 
                style={{ color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Subheader Bar */}
            <div style={{ padding: '0.75rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                Total Defined Variants: <strong style={{ color: '#1d4ed8' }}>{getTemplatesForRoute(variantsModalRoute.id, variantsModalRoute.name).length} Options</strong>
              </div>

              {!isAddingVariant && (
                <button
                  type="button"
                  onClick={() => setIsAddingVariant(true)}
                  className="btn btn-sm btn-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Plus size={14} />
                  <span>Add New Variant for this Route</span>
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Form to Add New Itinerary Variant */}
              {isAddingVariant && (
                <div style={{ 
                  background: '#eff6ff', 
                  border: '2px solid #3b82f6', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1.25rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e40af', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookmarkPlus size={16} /> Create New Itinerary Variant
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingVariant(false)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateVariantSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      {/* Variant Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          Variant Name / Label *:
                        </label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Option 3: Sunrise & Paragliding Adventure"
                          value={newVariantForm.template_name}
                          onChange={(e) => setNewVariantForm({ ...newVariantForm, template_name: e.target.value })}
                          style={{ background: '#ffffff', fontWeight: 700 }}
                        />
                      </div>

                      {/* Headline / Title */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          Activity Headline / Day Title *:
                        </label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="e.g. Sarangkot Sunrise & Thrilling Paragliding Flight"
                          value={newVariantForm.title}
                          onChange={(e) => setNewVariantForm({ ...newVariantForm, title: e.target.value })}
                          style={{ background: '#ffffff' }}
                        />
                      </div>
                    </div>

                    {/* Sightseeing Narrative */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                        Detailed Day Schedule & Sightseeing Narrative *:
                      </label>
                      <textarea
                        rows={3}
                        required
                        className="form-textarea"
                        placeholder="Detailed itinerary description, landmarks visited, lunch/dining plans, and travel timings..."
                        value={newVariantForm.description}
                        onChange={(e) => setNewVariantForm({ ...newVariantForm, description: e.target.value })}
                        style={{ background: '#ffffff', fontSize: '0.85rem' }}
                      />
                    </div>

                    {/* Highlights & Meals Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          Key Highlights (Comma-separated):
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Sarangkot Sunrise, Paragliding, Lake Views"
                          value={newVariantForm.highlights}
                          onChange={(e) => setNewVariantForm({ ...newVariantForm, highlights: e.target.value })}
                          style={{ background: '#ffffff', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          Meals Plan:
                        </label>
                        <select
                          className="form-select"
                          value={newVariantForm.meals}
                          onChange={(e) => setNewVariantForm({ ...newVariantForm, meals: e.target.value })}
                          style={{ background: '#ffffff', fontSize: '0.85rem' }}
                        >
                          <option value="Breakfast (CP)">Breakfast (CP)</option>
                          <option value="Breakfast & Dinner (MAP)">Breakfast & Dinner (MAP)</option>
                          <option value="Full Board - B/L/D (AP)">Full Board (AP)</option>
                          <option value="Room Only (EP)">Room Only (EP)</option>
                          <option value="On Direct Payment">On Direct Payment</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          City / Region:
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Pokhara"
                          value={newVariantForm.city}
                          onChange={(e) => setNewVariantForm({ ...newVariantForm, city: e.target.value })}
                          style={{ background: '#ffffff', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer', color: '#1e40af' }}>
                        <input
                          type="checkbox"
                          checked={newVariantForm.is_default}
                          onChange={(e) => setNewVariantForm({ ...newVariantForm, is_default: e.target.checked })}
                        />
                        <span>Set as Default Preset for this Route</span>
                      </label>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setIsAddingVariant(false)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                        >
                          <Save size={14} />
                          <span>Save Variant to Database</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* List of Existing Variants for this Route */}
              {getTemplatesForRoute(variantsModalRoute.id, variantsModalRoute.name).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1' }}>
                  <Compass size={36} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontWeight: 700, color: '#334155' }}>No Itinerary Variants Defined Yet</div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '400px', margin: '0.35rem auto 1rem auto' }}>
                    Add the first predefined sightseeing itinerary variant for <strong>{variantsModalRoute.name}</strong> so coworkers can select it with 1 click.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddingVariant(true)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} />
                    <span>Create First Variant</span>
                  </button>
                </div>
              ) : (
                getTemplatesForRoute(variantsModalRoute.id, variantsModalRoute.name).map((tpl, idx) => (
                  <div 
                    key={tpl.id} 
                    style={{ 
                      background: '#ffffff', 
                      border: tpl.is_default ? '2px solid #fde68a' : '1px solid #e2e8f0', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '1.25rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                          background: tpl.is_default ? '#fef3c7' : '#eff6ff', 
                          color: tpl.is_default ? '#92400e' : '#1d4ed8', 
                          fontWeight: 800, 
                          fontSize: '0.75rem', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '4px',
                          border: tpl.is_default ? '1px solid #fcd34d' : '1px solid #bfdbfe'
                        }}>
                          {tpl.template_name}
                        </span>

                        {tpl.is_default && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                            ⭐ Default Choice
                          </span>
                        )}

                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          • {tpl.city || 'Kathmandu'} • {tpl.meals || 'Breakfast (CP)'}
                        </span>
                      </div>

                      {onDeleteTemplate && (
                        <button
                          type="button"
                          onClick={() => onDeleteTemplate(tpl.id)}
                          className="btn-danger-ghost"
                          title="Delete this variant"
                          style={{ padding: '0.2rem' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0.35rem 0 0.4rem 0' }}>
                      {tpl.title}
                    </h5>

                    <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: '1.55', margin: '0 0 0.75rem 0' }}>
                      {tpl.description}
                    </p>

                    {tpl.highlights && tpl.highlights.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>Highlights:</span>
                        {tpl.highlights.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            style={{ 
                              background: '#f1f5f9', 
                              color: '#1e293b', 
                              fontSize: '0.72rem', 
                              padding: '0.15rem 0.45rem', 
                              borderRadius: '3px',
                              border: '1px solid #cbd5e1'
                            }}
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '0.85rem 1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setVariantsModalRoute(null)} 
                className="btn btn-secondary btn-sm"
              >
                Close Variants Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
