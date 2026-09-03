import React, { useState } from 'react';
import { 
  Plane, 
  Plus, 
  Trash2, 
  Ticket, 
  Sparkles, 
  Info, 
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MASTER_ADDITIONAL_ACTIVITIES } from '../lib/mockData';

export default function AdditionalCostsSection({
  additionalItems,
  onUpdateAdditionalItems,
  tripInfo,
  currency = 'NPR',
  onCurrencyChange
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  // Helper to extract correct currency price for activity (base is NPR)
  const getActivityPrice = (act, curr = currency) => {
    if (!act) return 1000;
    const baseNpr = act.unit_price_npr || act.unit_price_inr || 1000;
    if (curr === 'INR') return act.unit_price_inr || Math.round(baseNpr / 1.6);
    if (curr === 'USD') return act.unit_price_usd || Math.round(baseNpr / usdRate);
    return baseNpr;
  };

  // Add new activity
  const handleAddItem = () => {
    const defaultAct = MASTER_ADDITIONAL_ACTIVITIES[0];
    const newRate = getActivityPrice(defaultAct, currency);
    const newItem = {
      id: 'act-' + Date.now(),
      activity_id: defaultAct.id,
      name: defaultAct.name,
      unit_price_inr: newRate,
      qty: 1,
      pricing_type: defaultAct.pricing_type || 'per_pax'
    };
    onUpdateAdditionalItems([...additionalItems, newItem]);
  };

  // Activity selection change
  const handleActivityChange = (itemId, actId) => {
    const matched = MASTER_ADDITIONAL_ACTIVITIES.find(a => a.id === actId);
    if (!matched) return;
    const newRate = getActivityPrice(matched, currency);

    const updated = additionalItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          activity_id: actId,
          name: matched.name,
          unit_price_inr: newRate,
          pricing_type: matched.pricing_type || 'per_pax',
          qty: matched.pricing_type === 'per_pax' ? paxCount : 1
        };
      }
      return item;
    });
    onUpdateAdditionalItems(updated);
  };

  const handleUpdateItem = (itemId, field, value) => {
    const updated = additionalItems.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateAdditionalItems(updated);
  };

  const handleDeleteItem = (itemId) => {
    onUpdateAdditionalItems(additionalItems.filter(item => item.id !== itemId));
  };

  // Calculations
  const calculatedItems = additionalItems.map(item => {
    const unitPrice = Number(item.unit_price_inr) || 0;
    const qty = Number(item.qty) || 1;
    const total = unitPrice * qty;
    return { ...item, unitPrice, qty, total };
  });

  const grandTotalItemsQty = calculatedItems.reduce((sum, it) => sum + it.qty, 0);
  const grandTotalUnitPrice = calculatedItems.reduce((sum, it) => sum + it.unitPrice, 0);
  const totalAdditionalCost = calculatedItems.reduce((sum, it) => sum + it.total, 0);
  const additionalCostPerPax = Math.round(totalAdditionalCost / paxCount);

  const formatCurrency = (val) => (Number(val) || 0).toLocaleString();

  return (
    <div className="card" style={{ border: '2px solid #e2e8f0', marginTop: '1.5rem', overflow: 'hidden' }}>
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
        title={isCollapsed ? 'Click to expand Activities Costing' : 'Click to minimize Activities Costing'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="premier-badge">
            <Sparkles size={14} />
            ACTIVITIES & FLIGHTS
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Domestic Flights, Sightseeing Activities & Permits Costing</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '0.15rem 0.5rem', borderRadius: '12px', color: '#e2e8f0' }}>
              {isCollapsed ? `▼ ${calculatedItems.length} Activities • ${currSymbol}${formatCurrency(totalAdditionalCost)}` : `▲ ${calculatedItems.length} Activities`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
          {/* Section Currency Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>Activities Currency:</span>
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
            Available Catalog ({MASTER_ADDITIONAL_ACTIVITIES.length})
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
        {/* Table of activities */}
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '42%' }}>Activity / Service Item</th>
                <th style={{ width: '18%', textAlign: 'center' }}>Billing Basis</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Unit Rate ({currSymbol})</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Qty / Pax</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Total ({currSymbol})</th>
                <th style={{ width: '4%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No additional flights or activities added. Click <strong>"Add Activity / Flight"</strong> below.
                  </td>
                </tr>
              ) : (
                calculatedItems.map((item, index) => {
                  const matched = MASTER_ADDITIONAL_ACTIVITIES.find(a => a.id === item.activity_id);
                  return (
                    <tr key={item.id || index} className="hotel-row">
                      {/* Activity Selector */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <select
                            className="form-select"
                            value={item.activity_id || ''}
                            onChange={(e) => handleActivityChange(item.id, e.target.value)}
                            style={{ fontWeight: 600, fontSize: '0.88rem' }}
                          >
                            {MASTER_ADDITIONAL_ACTIVITIES.map(a => (
                              <option key={a.id} value={a.id}>
                                {a.name} ({a.category})
                              </option>
                            ))}
                          </select>
                          {matched?.notes && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {matched.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Pricing Type */}
                      <td style={{ textAlign: 'center' }}>
                        <select
                          className="form-select"
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', fontWeight: 600 }}
                          value={item.pricing_type}
                          onChange={(e) => handleUpdateItem(item.id, 'pricing_type', e.target.value)}
                        >
                          <option value="per_pax">Per Pax (Individual)</option>
                          <option value="per_group">Per Group (Flat Rate)</option>
                        </select>
                      </td>

                      {/* Unit Rate */}
                      <td>
                        <input
                          type="number"
                          className="table-input"
                          value={item.unit_price_inr}
                          onChange={(e) => handleUpdateItem(item.id, 'unit_price_inr', parseFloat(e.target.value) || 0)}
                        />
                      </td>

                      {/* Qty */}
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          className="table-input"
                          style={{ textAlign: 'center' }}
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
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
                          title="Delete activity"
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
                  Total Activities & Flights in {currency}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: '#b45309', fontSize: '0.85rem' }}>
                  {calculatedItems.length} Activities
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  {currSymbol}{formatCurrency(grandTotalUnitPrice)}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                  {grandTotalItemsQty} Units
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1.05rem', color: '#166534' }}>
                  {currSymbol}{formatCurrency(totalAdditionalCost)}
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
            onClick={handleAddItem}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Activity / Flight / Permit</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Info size={15} style={{ color: 'var(--primary)' }} />
            <span>Rates automatically adjust to <strong>{currency}</strong>. Formula: <strong>Unit Rate × Qty</strong> (billed Per Pax or Flat Per Group)</span>
          </div>
        </div>

        {/* Premier Style Total Highlight Box */}
        <div className="grand-total-banner">
          <div>
            <div className="grand-total-label">ACTIVITIES & FLIGHTS TOTAL COSTING ({currency})</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="grand-total-amount grand-total-highlight">
                {currSymbol}{formatCurrency(totalAdditionalCost)}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                for {calculatedItems.length} Activities / Flights ({tripInfo.paxAdults} Pax)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Per Pax Share</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff' }}>
                {currSymbol}{formatCurrency(additionalCostPerPax)}
              </div>
            </div>

            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Configured Items</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#fbbf24' }}>
                {calculatedItems.length} Items
              </div>
            </div>

            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Units</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#38bdf8' }}>
                {grandTotalItemsQty} Pax/Units
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
