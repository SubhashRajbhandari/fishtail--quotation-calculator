import React, { useState } from 'react';
import { 
  Building2, 
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
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HotelRatesTab({
  hotels,
  isLiveSupabase,
  onUpdateHotel,
  onAddHotel,
  onDeleteHotel,
  onResetToBaseRate,
  onRefresh
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Edit Form State for selected hotel
  const [editForm, setEditForm] = useState({
    name: '',
    city: 'Kathmandu',
    category: 'Premier',
    meal_plan: 'CP',
    star_rating: 3,
    half_twin_inr: 0,
    single_inr: 0,
    half_twin_npr: 0,
    single_npr: 0,
    half_twin_usd: 0,
    single_usd: 0,
    base_half_twin_inr: 0,
    base_single_inr: 0,
    base_half_twin_npr: 0,
    base_single_npr: 0,
    base_half_twin_usd: 0,
    base_single_usd: 0,
    season_note: 'Standard Tariff',
    notes: ''
  });

  const cities = ['ALL', ...Array.from(new Set(hotels.map(h => h.city || 'Kathmandu')))];

  const startEdit = (hotel) => {
    setEditingHotelId(hotel.id);
    setIsAddingNew(false);
    setEditForm({
      name: hotel.name,
      city: hotel.city || 'Kathmandu',
      category: hotel.category || 'Premier',
      meal_plan: hotel.meal_plan || 'CP',
      star_rating: hotel.star_rating || 3,
      half_twin_inr: hotel.half_twin_inr || 0,
      single_inr: hotel.single_inr || 0,
      half_twin_npr: hotel.half_twin_npr || 0,
      single_npr: hotel.single_npr || 0,
      half_twin_usd: hotel.half_twin_usd || 0,
      single_usd: hotel.single_usd || 0,
      base_half_twin_inr: hotel.base_half_twin_inr || hotel.half_twin_inr || 0,
      base_single_inr: hotel.base_single_inr || hotel.single_inr || 0,
      base_half_twin_npr: hotel.base_half_twin_npr || hotel.half_twin_npr || 0,
      base_single_npr: hotel.base_single_npr || hotel.single_npr || 0,
      base_half_twin_usd: hotel.base_half_twin_usd || hotel.half_twin_usd || 0,
      base_single_usd: hotel.base_single_usd || hotel.single_usd || 0,
      season_note: hotel.season_note || 'Standard Tariff',
      notes: hotel.notes || ''
    });
  };

  const startAdd = () => {
    setIsAddingNew(true);
    setEditingHotelId(null);
    setEditForm({
      name: '',
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
      notes: ''
    });
  };

  // One-click Auto calculate NPR and USD from INR
  const autoConvertFromInr = () => {
    const inrHalf = Number(editForm.half_twin_inr) || 0;
    const inrSingle = Number(editForm.single_inr) || 0;
    setEditForm(prev => ({
      ...prev,
      half_twin_npr: Math.round(inrHalf * 1.6),
      single_npr: Math.round(inrSingle * 1.6),
      half_twin_usd: Math.round(inrHalf / 75),
      single_usd: Math.round(inrSingle / 75)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Please enter a hotel name');
      return;
    }

    const isCustom = (
      Number(editForm.half_twin_inr) !== Number(editForm.base_half_twin_inr) ||
      Number(editForm.single_inr) !== Number(editForm.base_single_inr) ||
      (editForm.season_note && editForm.season_note !== 'Standard Tariff')
    );

    const payload = {
      ...editForm,
      is_custom_rate: isCustom
    };

    if (isAddingNew) {
      await onAddHotel(payload);
      setIsAddingNew(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else if (editingHotelId) {
      await onUpdateHotel(editingHotelId, payload);
      setEditingHotelId(null);
    }
  };

  const handleResetRate = async (hotel) => {
    if (confirm(`Reset rates for "${hotel.name}" back to base standard tariff (${hotel.base_half_twin_inr || hotel.half_twin_inr} INR)?`)) {
      await onResetToBaseRate(hotel);
    }
  };

  const filteredHotels = hotels.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.city && h.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (h.season_note && h.season_note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = cityFilter === 'ALL' || h.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const formatNum = (num) => (Number(num) || 0).toLocaleString();

  return (
    <div className="hotel-rates-tab">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', border: 'none' }}>
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="premier-badge" style={{ background: 'var(--accent-gradient)', color: '#fff' }}>
                <Layers size={14} /> HOTEL TARIFF & SEASONAL MANAGER
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
              Multi-Currency Hotel Rates (INR, NPR, USD) & Seasonal Price Overrides
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Alter standard rates for special months (e.g. July off-season special at ₹1,200 vs regular ₹1,800), and restore back to base tariff with a single click.
            </p>
          </div>

          <button type="button" onClick={startAdd} className="btn btn-accent">
            <Plus size={16} />
            <span>Add New Hotel to Master DB</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Hotel Form Modal / Card */}
      {(isAddingNew || editingHotelId) && (
        <div className="card" style={{ border: '2px solid #3b82f6', marginBottom: '1.5rem', background: '#f8fafc' }}>
          <div className="card-header" style={{ background: '#eff6ff' }}>
            <div className="card-title-group">
              <div className="card-icon" style={{ background: '#2563eb', color: '#fff' }}>
                <Edit3 size={18} />
              </div>
              <div>
                <div className="card-title">
                  {isAddingNew ? 'Add New Hotel & Multi-Currency Rates' : `Edit Rates & Season for "${editForm.name}"`}
                </div>
                <div className="card-subtitle">
                  Configure current active prices across INR, NPR, and USD, plus baseline standard tariffs.
                </div>
              </div>
            </div>
            <button type="button" onClick={() => { setIsAddingNew(false); setEditingHotelId(null); }} className="btn-danger-ghost">
              <X size={20} />
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSave}>
              {/* Basic Details */}
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Hotel Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. HOTEL MARSYANGDI"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination / City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Kathmandu, Pokhara, Chitwan"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Package Tier</label>
                  <select
                    className="form-select"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="Premier">Premier</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Meal Plan</label>
                  <select
                    className="form-select"
                    value={editForm.meal_plan}
                    onChange={(e) => setEditForm({ ...editForm, meal_plan: e.target.value })}
                  >
                    <option value="CP">CP (Breakfast Included)</option>
                    <option value="MAP">MAP (Breakfast & Dinner)</option>
                    <option value="AP">AP (Full Board / All Meals)</option>
                    <option value="EP">EP (Room Only)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Season / Offer Tag</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. July Special: 1200 INR (Regular: 1800)"
                    value={editForm.season_note}
                    onChange={(e) => setEditForm({ ...editForm, season_note: e.target.value })}
                  />
                </div>
              </div>

              {/* Multi-Currency Rate Boxes */}
              <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <DollarSign size={18} color="#2563eb" />
                    <span>Active Multi-Currency Rates (Used in Quotation Maker)</span>
                  </div>
                  <button type="button" onClick={autoConvertFromInr} className="btn btn-outline btn-sm">
                    <ArrowRightLeft size={13} />
                    <span>Auto-Calculate NPR & USD from INR</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {/* INR Section */}
                  <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>🇮🇳 Indian Rupee (INR - ₹)</span>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Half Twin Rate (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editForm.half_twin_inr}
                        onChange={(e) => setEditForm({ ...editForm, half_twin_inr: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Single Room Rate (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editForm.single_inr}
                        onChange={(e) => setEditForm({ ...editForm, single_inr: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  {/* NPR Section */}
                  <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontWeight: 700, color: '#065f46', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>🇳🇵 Nepalese Rupee (NPR - Rs)</span>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Half Twin Rate (Rs)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editForm.half_twin_npr}
                        onChange={(e) => setEditForm({ ...editForm, half_twin_npr: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Single Room Rate (Rs)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editForm.single_npr}
                        onChange={(e) => setEditForm({ ...editForm, single_npr: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  {/* USD Section */}
                  <div style={{ padding: '1rem', background: '#fefce8', borderRadius: 'var(--radius-md)', border: '1px solid #fef08a' }}>
                    <div style={{ fontWeight: 700, color: '#854d0e', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>🇺🇸 US Dollar (USD - $)</span>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Half Twin Rate ($)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editForm.half_twin_usd}
                        onChange={(e) => setEditForm({ ...editForm, half_twin_usd: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Single Room Rate ($)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editForm.single_usd}
                        onChange={(e) => setEditForm({ ...editForm, single_usd: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Base Standard Rates (Allows 1-click restore) */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  📌 Base Standard Tariffs (Used when you click "Reset to Standard"):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base INR (Half Twin):</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                      value={editForm.base_half_twin_inr}
                      onChange={(e) => setEditForm({ ...editForm, base_half_twin_inr: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base NPR (Half Twin):</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                      value={editForm.base_half_twin_npr}
                      onChange={(e) => setEditForm({ ...editForm, base_half_twin_npr: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base USD (Half Twin):</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                      value={editForm.base_half_twin_usd}
                      onChange={(e) => setEditForm({ ...editForm, base_half_twin_usd: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => { setIsAddingNew(false); setEditingHotelId(null); }} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} />
                  <span>{isAddingNew ? 'Create & Save to Supabase' : 'Save Updated Rates'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by hotel name, city or season note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          </div>

          {/* City Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCityFilter(c)}
                className={`btn btn-sm ${cityFilter === c ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '9999px' }}
              >
                {c === 'ALL' ? 'All Destinations' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Master Hotel Multi-Currency Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
              <Building2 size={18} />
            </div>
            <div>
              <div className="card-title">Hotel Directory & Multi-Currency Tariffs</div>
              <div className="card-subtitle">Showing {filteredHotels.length} hotels in database</div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Hotel & Location</th>
                <th style={{ width: '12%' }}>Tier / Meal</th>
                <th style={{ width: '15%', textAlign: 'right', background: '#eff6ff', color: '#1e40af' }}>
                  🇮🇳 INR (₹) <br/><span style={{ fontSize: '0.7rem', fontWeight: 400 }}>Half Twin | Single</span>
                </th>
                <th style={{ width: '15%', textAlign: 'right', background: '#ecfdf5', color: '#065f46' }}>
                  🇳🇵 NPR (Rs) <br/><span style={{ fontSize: '0.7rem', fontWeight: 400 }}>Half Twin | Single</span>
                </th>
                <th style={{ width: '14%', textAlign: 'right', background: '#fefce8', color: '#854d0e' }}>
                  🇺🇸 USD ($) <br/><span style={{ fontSize: '0.7rem', fontWeight: 400 }}>Half Twin | Single</span>
                </th>
                <th style={{ width: '14%' }}>Seasonality / Notes</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No hotels found. Try a different search term or click "Add New Hotel".
                  </td>
                </tr>
              ) : (
                filteredHotels.map((h) => {
                  const isModified = (
                    h.is_custom_rate || 
                    (h.base_half_twin_inr && Number(h.half_twin_inr) !== Number(h.base_half_twin_inr)) ||
                    (h.season_note && h.season_note !== 'Standard Tariff')
                  );

                  return (
                    <tr key={h.id} style={{ background: isModified ? '#fffbeb' : '#fff' }}>
                      {/* Hotel Name & City */}
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                          {h.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <span className="badge-city">{h.city || 'Kathmandu'}</span>
                          {isModified && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#fef3c7', color: '#b45309', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                              ⚡ Season Modified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tier / Meal Plan */}
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{h.category || 'Premier'}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Plan: {h.meal_plan || 'CP'}</div>
                      </td>

                      {/* INR (₹) Column */}
                      <td style={{ textAlign: 'right', background: '#f8fafc' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#1e40af', fontSize: '0.92rem' }}>
                          ₹{formatNum(h.half_twin_inr)}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          SGL: ₹{formatNum(h.single_inr)}
                        </div>
                      </td>

                      {/* NPR (Rs) Column */}
                      <td style={{ textAlign: 'right', background: '#f8fafc' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#065f46', fontSize: '0.92rem' }}>
                          Rs {formatNum(h.half_twin_npr)}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          SGL: Rs {formatNum(h.single_npr)}
                        </div>
                      </td>

                      {/* USD ($) Column */}
                      <td style={{ textAlign: 'right', background: '#f8fafc' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#854d0e', fontSize: '0.92rem' }}>
                          ${formatNum(h.half_twin_usd)}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          SGL: ${formatNum(h.single_usd)}
                        </div>
                      </td>

                      {/* Season / Validity Note */}
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: isModified ? '#b45309' : 'var(--text-muted)' }}>
                          <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />
                          {h.season_note || 'Standard Tariff'}
                        </div>
                        {h.notes && (
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                            {h.notes}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                          {/* Revert to Base Rate Button */}
                          {isModified && (
                            <button
                              type="button"
                              onClick={() => handleResetRate(h)}
                              className="btn btn-outline btn-sm"
                              style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
                              title={`Reset to standard tariff (₹${h.base_half_twin_inr || h.half_twin_inr})`}
                            >
                              <RotateCcw size={13} />
                              <span style={{ fontSize: '0.7rem' }}>Reset</span>
                            </button>
                          )}

                          {/* Edit Rates Button */}
                          <button
                            type="button"
                            onClick={() => startEdit(h)}
                            className="btn btn-outline btn-sm"
                            title="Edit Rates across INR / NPR / USD"
                          >
                            <Edit3 size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${h.name}" from database?`)) {
                                onDeleteHotel(h.id);
                              }
                            }}
                            className="btn-danger-ghost"
                            title="Delete Hotel"
                          >
                            <Trash2 size={14} />
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
      </div>
    </div>
  );
}
