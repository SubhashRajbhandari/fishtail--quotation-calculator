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
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TransportationRatesTab({
  transportRoutes,
  isLiveSupabase,
  onUpdateTransportRoute,
  onAddTransportRoute,
  onDeleteTransportRoute,
  onResetToBaseRate,
  onRefresh
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [displayCurrency, setDisplayCurrency] = useState('NPR'); // NPR | INR | USD
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

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

  // Helper: auto-calculate SUV/Hiace/Coaster/Coach from Sedan Car rate using standard ratios
  const autoCalculateFleetFromCar = () => {
    const car = Number(editForm.car_npr) || 1000;
    const scorpio = Math.round(car * 1.5);
    const hiace = Math.round(car * 1.75);
    const coaster = Math.round(car * 2.25);
    const shuttle = Math.round(car * 2.75);

    setEditForm(prev => ({
      ...prev,
      scorpio_npr: scorpio,
      hiace_npr: hiace,
      coaster_npr: coaster,
      shuttle_npr: shuttle,
      car_inr: Math.round(car / 1.6),
      scorpio_inr: Math.round(scorpio / 1.6),
      hiace_inr: Math.round(hiace / 1.6),
      coaster_inr: Math.round(coaster / 1.6),
      shuttle_inr: Math.round(shuttle / 1.6)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Please enter a sector or route name');
      return;
    }

    const isCustom = (
      Number(editForm.car_npr) !== Number(editForm.base_car_npr) ||
      Number(editForm.hiace_npr) !== Number(editForm.base_hiace_npr) ||
      (editForm.season_note && editForm.season_note !== 'Standard Tariff')
    );

    const payload = {
      ...editForm,
      is_custom_rate: isCustom
    };

    if (isAddingNew) {
      await onAddTransportRoute(payload);
      setIsAddingNew(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else if (editingRouteId) {
      await onUpdateTransportRoute(editingRouteId, payload);
      setEditingRouteId(null);
    }
  };

  const handleReset = async (route) => {
    if (confirm(`Reset rates for "${route.name}" back to base standard tariff (Car: Rs ${route.base_car_npr || route.car_npr} NPR)?`)) {
      await onResetToBaseRate(route);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete route "${name}"?`)) {
      await onDeleteTransportRoute(id);
    }
  };

  const filteredRoutes = transportRoutes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.season_note && r.season_note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const formatNum = (num) => (Number(num) || 0).toLocaleString();

  const getPriceForDisplay = (route, vehicleField) => {
    const nprVal = Number(route[`${vehicleField}_npr`]) || 0;
    if (displayCurrency === 'INR') {
      return route[`${vehicleField}_inr`] || Math.round(nprVal / 1.6);
    }
    if (displayCurrency === 'USD') {
      return Math.round(nprVal / 135.5);
    }
    return nprVal;
  };

  const currSymbol = displayCurrency === 'USD' ? '$' : (displayCurrency === 'INR' ? '₹' : 'Rs ');

  return (
    <div className="hotel-rates-tab">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', border: 'none' }}>
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="premier-badge" style={{ background: 'var(--accent-gradient)', color: '#fff' }}>
                <Car size={14} /> TRANSPORTATION FLEET & MASTER SECTOR TARIFFS
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                background: isLiveSupabase ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isLiveSupabase ? '#34d399' : '#fbbf24',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                border: '1px solid currentColor',
                fontWeight: 600
              }}>
                {isLiveSupabase ? '● Live Supabase Storage' : '● Local Offline Storage'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', marginTop: '0.4rem', color: '#ffffff' }}>
              Multi-Vehicle Standard Rates (Sedan, Scorpio, Hiace, Coaster, Coach) & Seasonal Tariffs
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Customize sector transfer charges for Kathmandu, Pokhara, Chitwan, Airport runs, and Excursions. Any changes here immediately update default rates in the Quotation Maker.
            </p>
          </div>

          <button type="button" onClick={startAdd} className="btn btn-accent">
            <Plus size={16} />
            <span>Add New Sector Route</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Route Form Card */}
      {(isAddingNew || editingRouteId) && (
        <div className="card" style={{ border: '2px solid #3b82f6', marginBottom: '1.5rem', background: '#f8fafc' }}>
          <div className="card-header" style={{ background: '#eff6ff' }}>
            <div className="card-title-group">
              <div className="card-icon" style={{ background: '#2563eb', color: '#fff' }}>
                <Edit3 size={18} />
              </div>
              <div>
                <div className="card-title">
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
                  <label className="form-label">Sector Notes / Route Details</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Airport to Hotel via Ring Road / Durbar Marg"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
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
                  <span>{isAddingNew ? 'Save New Route to Master DB' : 'Update Default Tariffs'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '1rem', 
        flexWrap: 'wrap', 
        gap: '0.75rem',
        background: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Search */}
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
                <th style={{ width: '28%' }}>Sector / Transfer Itinerary</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Region / Tag</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚗 Sedan Car</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚙 Scorpio SUV</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚐 Toyota Hiace</th>
                <th style={{ width: '11%', textAlign: 'right' }}>🚌 Coaster Bus</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Tariff Status</th>
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

                  return (
                    <tr key={route.id} className="hotel-row">
                      {/* Name & Notes */}
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {route.name}
                        </div>
                        {route.notes && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {route.notes}
                          </div>
                        )}
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                          Coach (21+): {currSymbol}{formatNum(shuttlePrice)}
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
            <span>Showing <strong>{filteredRoutes.length}</strong> master sector routes. Changes sync to all new Quotation drafts automatically.</span>
          </div>

          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            Base Currency: <strong>NPR (Nepalese Rupee)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
