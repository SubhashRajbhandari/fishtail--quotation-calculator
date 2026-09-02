import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  Check, 
  Save, 
  Sparkles,
  MapPin,
  DollarSign
} from 'lucide-react';

export default function HotelManagerModal({
  isOpen,
  onClose,
  hotels,
  isLiveSupabase,
  onAddHotel,
  onUpdateHotel,
  onDeleteHotel
}) {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    city: 'Kathmandu',
    category: 'Premier',
    half_twin_price: 1500,
    single_room_price: 2500,
    currency: 'INR',
    meal_plan: 'CP',
    star_rating: 3,
    notes: ''
  });

  const handleStartEdit = (hotel) => {
    setEditingId(hotel.id);
    setIsAddingNew(false);
    setFormData({
      name: hotel.name,
      city: hotel.city || 'Kathmandu',
      category: hotel.category || 'Premier',
      half_twin_price: hotel.half_twin_price,
      single_room_price: hotel.single_room_price,
      currency: hotel.currency || 'INR',
      meal_plan: hotel.meal_plan || 'CP',
      star_rating: hotel.star_rating || 3,
      notes: hotel.notes || ''
    });
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      name: '',
      city: 'Kathmandu',
      category: 'Premier',
      half_twin_price: 1500,
      single_room_price: 2500,
      currency: 'INR',
      meal_plan: 'CP',
      star_rating: 3,
      notes: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a hotel name');
      return;
    }

    if (isAddingNew) {
      await onAddHotel(formData);
      setIsAddingNew(false);
    } else if (editingId) {
      await onUpdateHotel(editingId, formData);
      setEditingId(null);
    }
  };

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.city && h.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Building2 size={22} style={{ color: 'var(--primary)' }} />
            <span>Supabase Hotel Master Directory</span>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              background: isLiveSupabase ? '#ecfdf5' : '#fffbeb', 
              color: isLiveSupabase ? '#065f46' : '#92400e',
              border: `1px solid ${isLiveSupabase ? '#a7f3d0' : '#fde68a'}`,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              marginLeft: '0.5rem'
            }}>
              {isLiveSupabase ? 'Supabase Connected' : 'Local Mock Storage'}
            </span>
          </div>
          <button type="button" onClick={onClose} className="btn-danger-ghost">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Top action bar: Search & Add button */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '220px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search hotel by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.3rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>

            {!isAddingNew && !editingId && (
              <button type="button" onClick={handleStartAdd} className="btn btn-primary">
                <Plus size={16} />
                <span>Add New Hotel</span>
              </button>
            )}
          </div>

          {/* Add / Edit Form Card */}
          {(isAddingNew || editingId) && (
            <form onSubmit={handleSave} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#f8fafc', border: '1.5px solid var(--primary-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                  {isAddingNew ? 'Add New Hotel to Database' : 'Edit Hotel & Standard Rates'}
                </h4>
                <button type="button" onClick={() => { setIsAddingNew(false); setEditingId(null); }} className="btn btn-outline btn-sm">
                  Cancel
                </button>
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Hotel Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. HOTEL MARSYANGDI"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City / Destination</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Kathmandu, Pokhara, Chitwan"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Package Tier</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Premier">Premier</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Half Twin Rate (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    className="form-input"
                    value={formData.half_twin_price}
                    onChange={(e) => setFormData({ ...formData, half_twin_price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Single Room Rate (₹ INR)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className="form-input"
                    value={formData.single_room_price}
                    onChange={(e) => setFormData({ ...formData, single_room_price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Meal Plan</label>
                  <select
                    className="form-select"
                    value={formData.meal_plan}
                    onChange={(e) => setFormData({ ...formData, meal_plan: e.target.value })}
                  >
                    <option value="CP">CP (Bed & Breakfast)</option>
                    <option value="MAP">MAP (Breakfast & Dinner)</option>
                    <option value="AP">AP (Full Board / All Meals)</option>
                    <option value="EP">EP (Room Only)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Star Rating</label>
                  <select
                    className="form-select"
                    value={formData.star_rating}
                    onChange={(e) => setFormData({ ...formData, star_rating: parseInt(e.target.value) || 3 })}
                  >
                    <option value="2">2 Star</option>
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                    <option value="5">Heritage / Boutique</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} />
                  <span>{isAddingNew ? 'Create Hotel' : 'Save Rates'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Hotel List Table */}
          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Hotel Name</th>
                  <th>Location</th>
                  <th>Tier</th>
                  <th style={{ textAlign: 'right' }}>Half Twin (INR)</th>
                  <th style={{ textAlign: 'right' }}>Single (INR)</th>
                  <th>Meal Plan</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No hotels found matching "{searchTerm}".
                    </td>
                  </tr>
                ) : (
                  filteredHotels.map((h) => (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 600 }}>{h.name}</td>
                      <td>
                        <span className="badge-city">{h.city || 'Nepal'}</span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: h.category === 'Premier' ? '#b45309' : '#0369a1',
                          background: h.category === 'Premier' ? '#fef3c7' : '#e0f2fe',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px'
                        }}>
                          {h.category || 'Premier'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                        ₹{Number(h.half_twin_price).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
                        ₹{Number(h.single_room_price).toLocaleString()}
                      </td>
                      <td>{h.meal_plan || 'CP'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(h)}
                            className="btn btn-outline btn-sm"
                            title="Edit Rate"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${h.name}" from Supabase?`)) {
                                onDeleteHotel(h.id);
                              }
                            }}
                            className="btn-danger-ghost"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
