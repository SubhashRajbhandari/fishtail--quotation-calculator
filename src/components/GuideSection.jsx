import React from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Compass,
  Sparkles,
  Info
} from 'lucide-react';
import { MASTER_GUIDE_OPTIONS } from '../lib/mockData';

export default function GuideSection({
  guideItems,
  onUpdateGuideItems,
  tripInfo,
  currency = 'NPR',
  onCurrencyChange
}) {
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'NPR': return 'Rs ';
      case 'USD': return '$';
      case 'INR':
      default: return '₹';
    }
  };

  const currSymbol = getCurrencySymbol(currency);
  const usdRate = Number(tripInfo?.usdToNprRate) || 135.5;
  const paxCount = Math.max(1, tripInfo.paxAdults || 1);

  // Helper to extract correct currency rate for guide (base is NPR)
  const getGuideRate = (guide, curr = currency) => {
    if (!guide) return 2000;
    const baseNpr = guide.rate_per_day_npr || guide.rate_per_day_inr || 2000;
    if (curr === 'INR') return guide.rate_per_day_inr || Math.round(baseNpr / 1.6);
    if (curr === 'USD') return guide.rate_per_day_usd || Math.round(baseNpr / usdRate);
    return baseNpr;
  };

  const handleAddGuide = () => {
    const defaultGuide = MASTER_GUIDE_OPTIONS[0];
    const newRate = getGuideRate(defaultGuide, currency);
    const newItem = {
      id: 'gi-' + Date.now(),
      guide_id: defaultGuide.id,
      name: defaultGuide.name,
      rate_per_day_inr: newRate,
      days: 1,
      notes: 'Sightseeing tour guide'
    };
    onUpdateGuideItems([...guideItems, newItem]);
  };

  const handleGuideChange = (itemId, guideId) => {
    const matched = MASTER_GUIDE_OPTIONS.find(g => g.id === guideId);
    if (!matched) return;
    const newRate = getGuideRate(matched, currency);

    const updated = guideItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          guide_id: guideId,
          name: matched.name,
          rate_per_day_inr: newRate
        };
      }
      return item;
    });
    onUpdateGuideItems(updated);
  };

  const handleUpdateItem = (itemId, field, value) => {
    const updated = guideItems.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateGuideItems(updated);
  };

  const handleDeleteItem = (itemId) => {
    onUpdateGuideItems(guideItems.filter(item => item.id !== itemId));
  };

  // Calculations
  const calculatedItems = guideItems.map(item => {
    const dailyRate = Number(item.rate_per_day_inr) || 0;
    const days = Number(item.days) || 1;
    const total = dailyRate * days;
    return { ...item, dailyRate, days, total };
  });

  const grandTotalDays = calculatedItems.reduce((sum, it) => sum + it.days, 0);
  const grandTotalDailyRate = calculatedItems.reduce((sum, it) => sum + it.dailyRate, 0);
  const totalGuideCost = calculatedItems.reduce((sum, it) => sum + it.total, 0);
  const guideCostPerPax = Math.round(totalGuideCost / paxCount);

  const formatCurrency = (val) => (Number(val) || 0).toLocaleString();

  return (
    <div className="card" style={{ border: '2px solid #e2e8f0', marginTop: '1.5rem', overflow: 'hidden' }}>
      {/* Premier Section Banner matching Hotel Accommodation */}
      <div className="premier-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="premier-badge">
            <Sparkles size={14} />
            TOUR GUIDE SERVICES
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
            Professional Licensed Guide & Tour Escort Costing
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Section Currency Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>Guide Currency:</span>
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
            Available Guides ({MASTER_GUIDE_OPTIONS.length})
          </span>
        </div>
      </div>

      <div className="card-body" style={{ padding: '1.25rem' }}>
        {/* Table of guides */}
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '42%' }}>Guide Service Option</th>
                <th style={{ width: '18%', textAlign: 'center' }}>City / Region Scope</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Daily Rate ({currSymbol})</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Days</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Total ({currSymbol})</th>
                <th style={{ width: '4%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No guide services included. Click <strong>"Add Guide Service"</strong> below.
                  </td>
                </tr>
              ) : (
                calculatedItems.map((item, index) => {
                  const matched = MASTER_GUIDE_OPTIONS.find(g => g.id === item.guide_id);
                  return (
                    <tr key={item.id || index} className="hotel-row">
                      {/* Guide Selector */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <select
                            className="form-select"
                            value={item.guide_id || ''}
                            onChange={(e) => handleGuideChange(item.id, e.target.value)}
                            style={{ fontWeight: 600, fontSize: '0.88rem' }}
                          >
                            {MASTER_GUIDE_OPTIONS.map(g => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            className="table-input text-left"
                            placeholder="Guide notes (e.g. Kathmandu sightseeing)..."
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', color: 'var(--text-muted)' }}
                            value={item.notes || ''}
                            onChange={(e) => handleUpdateItem(item.id, 'notes', e.target.value)}
                          />
                        </div>
                      </td>

                      {/* City Scope Badge */}
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge-city" style={{ background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '0.25rem 0.6rem' }}>
                          {matched?.city || 'Nepal'}
                        </span>
                      </td>

                      {/* Daily Rate */}
                      <td>
                        <input
                          type="number"
                          className="table-input"
                          value={item.dailyRate}
                          onChange={(e) => handleUpdateItem(item.id, 'rate_per_day_inr', parseFloat(e.target.value) || 0)}
                        />
                      </td>

                      {/* Days */}
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          className="table-input"
                          style={{ textAlign: 'center' }}
                          value={item.days}
                          onChange={(e) => handleUpdateItem(item.id, 'days', parseInt(e.target.value) || 1)}
                        />
                      </td>

                      {/* Total */}
                      <td className="price-cell highlight" style={{ textAlign: 'right', fontWeight: 700 }}>
                        {currSymbol}{formatCurrency(item.total)}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn-danger-ghost"
                          title="Delete guide service"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Total summary footer matching Premier Section */}
            <tfoot>
              <tr style={{ background: '#f1f5f9', borderTop: '2px solid #94a3b8' }}>
                <td style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  Total Guide Services in {currency}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: '#047857', fontSize: '0.85rem' }}>
                  {calculatedItems.length} Assignment(s)
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  {currSymbol}{formatCurrency(grandTotalDailyRate)}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                  {grandTotalDays} Days
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1.05rem', color: '#166534' }}>
                  {currSymbol}{formatCurrency(totalGuideCost)}
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
            onClick={handleAddGuide}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Guide Service</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Info size={15} style={{ color: 'var(--primary)' }} />
            <span>Rates automatically adjust to <strong>{currency}</strong>. Formula: <strong>Daily Rate × Number of Days</strong></span>
          </div>
        </div>

        {/* Premier Style Total Highlight Box */}
        <div className="grand-total-banner">
          <div>
            <div className="grand-total-label">GUIDE SERVICES TOTAL COSTING ({currency})</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="grand-total-amount grand-total-highlight">
                {currSymbol}{formatCurrency(totalGuideCost)}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                for {grandTotalDays} Days Guide Service ({tripInfo.paxAdults} Pax)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Per Pax Share</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff' }}>
                {currSymbol}{formatCurrency(guideCostPerPax)}
              </div>
            </div>

            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Assignments</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#fbbf24' }}>
                {calculatedItems.length} Guides
              </div>
            </div>

            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Days</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#38bdf8' }}>
                {grandTotalDays} Days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
