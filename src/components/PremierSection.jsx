import React, { useState } from 'react';
import {
  Hotel,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Info,
  Tag,
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function PremierSection({
  hotelRows,
  availableHotels,
  currency = 'INR',
  onCurrencyChange,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onDuplicateRow,
  onHotelSelect,
  tripInfo
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'NPR': return 'Rs ';
      case 'USD': return '$';
      case 'INR':
      default:
        return '₹';
    }
  };

  const currSymbol = getCurrencySymbol(currency);

  // Calculations
  const calculatedRows = hotelRows.map((row) => {
    const halfTwinRate = Number(row.half_twin_price) || 0;
    const singleRate = Number(row.single_room_price) || 0;
    const nights = Number(row.nights) || 0;
    const singleRooms = Number(row.single_rooms !== undefined ? row.single_rooms : tripInfo.singleRoomsCount) || 0;

    const totalHalfTwin = halfTwinRate * nights;
    const totalSingle = singleRate * singleRooms * nights;
    const rowTotal = totalHalfTwin + totalSingle;

    return {
      ...row,
      halfTwinRate,
      singleRate,
      nights,
      singleRooms,
      totalHalfTwin,
      totalSingle,
      rowTotal
    };
  });

  const grandTotalNights = calculatedRows.reduce((sum, r) => sum + r.nights, 0);
  const grandTotalHalfTwinRate = calculatedRows.reduce((sum, r) => sum + r.halfTwinRate, 0);
  const grandTotalSingleRate = calculatedRows.reduce((sum, r) => sum + r.singleRate, 0);
  const grandTotalHalfTwin = calculatedRows.reduce((sum, r) => sum + r.totalHalfTwin, 0);
  const grandTotalSingle = calculatedRows.reduce((sum, r) => sum + r.totalSingle, 0);
  const premierGrandTotal = grandTotalHalfTwin + grandTotalSingle;

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(val);
  };

  // Helper to extract correct currency rate for dropdown label
  const getHotelRateLabel = (hotel) => {
    if (currency === 'NPR') return `Rs ${formatCurrency(hotel.half_twin_npr || hotel.half_twin_inr * 1.6)}`;
    if (currency === 'USD') return `$${formatCurrency(hotel.half_twin_usd || hotel.half_twin_inr / 75)}`;
    return `₹${formatCurrency(hotel.half_twin_inr || hotel.half_twin_price || 0)}`;
  };

  return (
    <div className="card" style={{ border: '2px solid #e2e8f0', transition: 'all 0.2s ease' }}>
      {/* Premier Section Banner - Clickable Accordion Header */}
      <div 
        className="premier-banner" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        title={isCollapsed ? 'Click to expand Hotel Costing' : 'Click to minimize Hotel Costing'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="premier-badge">
            <Sparkles size={14} />
            PREMIER PACKAGE
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Hotel Accommodation Costing</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '0.15rem 0.5rem', borderRadius: '12px', color: '#e2e8f0' }}>
              {isCollapsed ? `▼ ${grandTotalNights} Nts • ${currSymbol}${formatCurrency(premierGrandTotal)}` : `▲ ${grandTotalNights} Nts`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
          {/* Section Currency Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>Hotel Currency:</span>
            <select
              className="form-select"
              value={currency}
              onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.2rem 0.5rem',
                border: '1px solid #fbbf24',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="NPR">NPR (Rs - Nepalese Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
            </select>
          </div>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            color: '#38bdf8'
          }}>
            Supabase `hotels` ({availableHotels.length})
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.2rem 0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>
      </div>

      {!isCollapsed && (
      <div className="card-body" style={{ padding: '1.25rem' }}>
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Premier Hotel (Supabase)</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Half Twin ({currSymbol})</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Single Room ({currSymbol})</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Nights</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Total Half Twin</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Total Single</th>
                <th style={{ width: '4%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {calculatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No hotels added yet. Click <strong>"Add Hotel Row"</strong> below to select from Supabase.
                  </td>
                </tr>
              ) : (
                calculatedRows.map((row, index) => {
                  const selectedHotel = availableHotels.find(h => h.id === row.hotel_id || h.name === row.hotel_name);

                  return (
                    <tr key={row.id || index} className="hotel-row">
                      {/* Hotel dropdown */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <select
                            className="form-select"
                            value={row.hotel_id || ''}
                            onChange={(e) => onHotelSelect(row.id, e.target.value)}
                            style={{ fontWeight: 600, fontSize: '0.88rem' }}
                          >
                            <option value="">-- Select Hotel from Supabase --</option>
                            {availableHotels.map((hotel) => (
                              <option key={hotel.id} value={hotel.id}>
                                {hotel.name} ({hotel.city || 'Nepal'}) — {getHotelRateLabel(hotel)}
                              </option>
                            ))}
                          </select>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            {selectedHotel && (
                              <>
                                <span className="badge-city">{selectedHotel.city}</span>
                                <span>• Meal: {selectedHotel.meal_plan || 'CP'}</span>
                                {selectedHotel.season_note && selectedHotel.season_note !== 'Standard Tariff' && (
                                  <span style={{ color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <Tag size={10} /> {selectedHotel.season_note}
                                  </span>
                                )}
                              </>
                            )}
                            {row.custom_price && (
                              <span style={{ color: '#2563eb', fontWeight: 600 }}>• Custom Override</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Half Twin Standard Price (Auto-populated from Supabase or editable) */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          className="table-input"
                          value={row.half_twin_price}
                          onChange={(e) => onUpdateRow(row.id, 'half_twin_price', parseFloat(e.target.value) || 0, true)}
                          title={`Half Twin price per night in ${currency}`}
                        />
                      </td>

                      {/* Single Room Price */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          className="table-input"
                          value={row.single_room_price}
                          onChange={(e) => onUpdateRow(row.id, 'single_room_price', parseFloat(e.target.value) || 0, true)}
                          title={`Single room price per night in ${currency}`}
                        />
                      </td>

                      {/* Nights */}
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          className="table-input"
                          style={{ textAlign: 'center', fontWeight: 700 }}
                          value={row.nights}
                          onChange={(e) => onUpdateRow(row.id, 'nights', parseInt(e.target.value) || 1)}
                        />
                      </td>

                      {/* Total Half Twin */}
                      <td className="price-cell highlight">
                        {currSymbol}{formatCurrency(row.totalHalfTwin)}
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          ({currSymbol}{formatCurrency(row.halfTwinRate)} × {row.nights}n)
                        </div>
                      </td>

                      {/* Total Single Room */}
                      <td className="price-cell">
                        {currSymbol}{formatCurrency(row.totalSingle)}
                        {row.singleRooms > 0 && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            ({row.singleRooms} rm × {row.nights}n)
                          </div>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                          <button
                            type="button"
                            onClick={() => onDuplicateRow(row.id)}
                            className="btn btn-outline btn-sm"
                            title="Duplicate Row"
                            style={{ padding: '0.3rem' }}
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRow(row.id)}
                            className="btn-danger-ghost"
                            title="Delete Hotel"
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

            {/* Total summary footer matching Excel */}
            <tfoot>
              <tr style={{ background: '#f1f5f9', borderTop: '2px solid #94a3b8' }}>
                <td style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  Total Cost in {currency}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  {currSymbol}{formatCurrency(grandTotalHalfTwinRate)}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  {currSymbol}{formatCurrency(grandTotalSingleRate)}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                  {grandTotalNights} Nights
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1.05rem', color: '#166534' }}>
                  {currSymbol}{formatCurrency(grandTotalHalfTwin)}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1e293b' }}>
                  {currSymbol}{formatCurrency(grandTotalSingle)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button
            type="button"
            onClick={onAddRow}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Hotel Row</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Info size={15} style={{ color: 'var(--primary)' }} />
            <span>Rates automatically adjust to <strong>{currency}</strong>. Formula: <strong>Half Twin × Nights</strong> + <strong>Single × Rooms × Nights</strong></span>
          </div>
        </div>

        {/* Premier Total Highlight Box */}
        <div className="grand-total-banner">
          <div>
            <div className="grand-total-label">PREMIER HOTEL TOTAL COSTING ({currency})</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="grand-total-amount grand-total-highlight">
                {currSymbol}{formatCurrency(premierGrandTotal)}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                for {grandTotalNights} Nights (1 Pax)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Half Twin Share</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff' }}>
                {currSymbol}{formatCurrency(grandTotalHalfTwin)}
              </div>
            </div>

            {grandTotalSingle > 0 && (
              <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Single Supplement</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#fbbf24' }}>
                  {currSymbol}{formatCurrency(grandTotalSingle)}
                </div>
              </div>
            )}

            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Avg / Night</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#38bdf8' }}>
                {currSymbol}{formatCurrency(grandTotalNights > 0 ? premierGrandTotal / grandTotalNights : 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
