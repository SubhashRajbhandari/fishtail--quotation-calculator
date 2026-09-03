import React, { useState } from 'react';
import {
  Car,
  Plus,
  Trash2,
  Zap,
  Info,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Truck,
  ExternalLink,
  Layers
} from 'lucide-react';
import { MASTER_TRANSPORT_ROUTES } from '../lib/mockData';

export default function TransportationSection({
  transportItems,
  onUpdateTransportItems,
  tripInfo,
  currency = 'NPR',
  onCurrencyChange,
  availableTransportRoutes = MASTER_TRANSPORT_ROUTES,
  onOpenTransportRates
}) {
  const [vehicleType, setVehicleType] = useState('car'); // car, scorpio, hiace, coaster, shuttle
  const [acSupplementPercent, setAcSupplementPercent] = useState(20); // default 20%
  const [enableAcSupplement, setEnableAcSupplement] = useState(true);

  const routes = availableTransportRoutes && availableTransportRoutes.length > 0
    ? availableTransportRoutes
    : MASTER_TRANSPORT_ROUTES;

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

  const vehicleOptions = [
    { id: 'car', name: 'Private Sedan Car', paxLabel: '1 - 2 Pax', key_npr: 'car_npr', key_inr: 'car_inr' },
    { id: 'scorpio', name: '4WD Scorpio / SUV', paxLabel: '3 - 4 Pax', key_npr: 'scorpio_npr', key_inr: 'scorpio_inr' },
    { id: 'hiace', name: 'Toyota Hiace Minibus', paxLabel: '5 - 13 Pax', key_npr: 'hiace_npr', key_inr: 'hiace_inr' },
    { id: 'coaster', name: 'Toyota Coaster Bus', paxLabel: '13 - 20 Pax', key_npr: 'coaster_npr', key_inr: 'coaster_inr' },
    { id: 'shuttle', name: 'Large Tourist Coach', paxLabel: '21+ Pax', key_npr: 'shuttle_npr', key_inr: 'shuttle_inr' }
  ];

  // Helper to get route standard price based on specified vehicle and active currency (base is NPR)
  const getItemRoutePrice = (routeId, vehType = vehicleType) => {
    const route = routes.find(r => r.id === routeId);
    if (!route) return 1000;
    const selectedVeh = vehicleOptions.find(v => v.id === vehType) || vehicleOptions[0];
    const keyNpr = selectedVeh ? selectedVeh.key_npr : 'car_npr';
    const baseNpr = route[keyNpr] || route.car_npr || route.car_inr || 1000;

    if (currency === 'INR') return route[`${selectedVeh.id}_inr`] || Math.round(baseNpr / 1.6);
    if (currency === 'USD') return Math.round(baseNpr / usdRate);
    return baseNpr;
  };

  // Add route item
  const handleAddRoute = () => {
    const defaultRoute = routes[0] || MASTER_TRANSPORT_ROUTES[0];
    const newRate = getItemRoutePrice(defaultRoute.id, vehicleType);
    const newItem = {
      id: 'tr-' + Date.now(),
      route_id: defaultRoute.id,
      name: defaultRoute.name,
      vehicle_type: vehicleType,
      rate_inr: newRate,
      qty: 1,
      notes: 'Standard sector transfer'
    };
    onUpdateTransportItems([...transportItems, newItem]);
  };

  // Route selection change
  const handleRouteChange = (itemId, routeId) => {
    const matchedRoute = routes.find(r => r.id === routeId);
    if (!matchedRoute) return;
    const currentItem = transportItems.find(it => it.id === itemId);
    const currentVeh = currentItem?.vehicle_type || vehicleType;
    const newRate = getItemRoutePrice(routeId, currentVeh);

    const updated = transportItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          route_id: routeId,
          name: matchedRoute.name,
          rate_inr: newRate
        };
      }
      return item;
    });
    onUpdateTransportItems(updated);
  };

  // Switch vehicle type individually for a specific row
  const handleItemVehicleChange = (itemId, newVehType) => {
    const updated = transportItems.map(item => {
      if (item.id === itemId) {
        const newRate = getItemRoutePrice(item.route_id, newVehType);
        return {
          ...item,
          vehicle_type: newVehType,
          rate_inr: newRate
        };
      }
      return item;
    });
    onUpdateTransportItems(updated);
  };

  // Switch global default vehicle type and auto-update route prices
  const handleVehicleChange = (newVehType) => {
    setVehicleType(newVehType);

    const updated = transportItems.map(item => {
      const newRate = getItemRoutePrice(item.route_id, newVehType);
      return {
        ...item,
        vehicle_type: newVehType,
        rate_inr: newRate
      };
    });
    onUpdateTransportItems(updated);
  };

  // Edit custom rate
  const handleRateChange = (itemId, newRate) => {
    const updated = transportItems.map(item => {
      if (item.id === itemId) {
        return { ...item, rate_inr: parseFloat(newRate) || 0 };
      }
      return item;
    });
    onUpdateTransportItems(updated);
  };

  // Edit qty
  const handleQtyChange = (itemId, newQty) => {
    const updated = transportItems.map(item => {
      if (item.id === itemId) {
        return { ...item, qty: Math.max(1, parseInt(newQty) || 1) };
      }
      return item;
    });
    onUpdateTransportItems(updated);
  };

  const handleUpdateItem = (itemId, field, value) => {
    const updated = transportItems.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateTransportItems(updated);
  };

  // Delete transport row
  const handleDeleteItem = (itemId) => {
    onUpdateTransportItems(transportItems.filter(item => item.id !== itemId));
  };

  // Calculations
  const calculatedItems = transportItems.map(item => {
    const rate = Number(item.rate_inr) || 0;
    const qty = Number(item.qty) || 1;
    const total = rate * qty;
    return { ...item, rate, qty, total };
  });

  const grandTotalSectorsQty = calculatedItems.reduce((sum, it) => sum + it.qty, 0);
  const subtotalTransport = calculatedItems.reduce((sum, it) => sum + it.total, 0);
  const grandTotalBaseRate = calculatedItems.reduce((sum, it) => sum + it.rate, 0);
  const acSupplementAmount = enableAcSupplement ? Math.round(subtotalTransport * (acSupplementPercent / 100)) : 0;
  const totalTransport = subtotalTransport + acSupplementAmount;
  const paxCount = Math.max(1, tripInfo.paxAdults || 1);
  const transportPerPax = Math.round(totalTransport / paxCount);

  const formatCurrency = (val) => (Number(val) || 0).toLocaleString();
  const selectedVehicleObj = vehicleOptions.find(v => v.id === vehicleType) || vehicleOptions[0];

  return (
    <div className="card" style={{ border: '2px solid #e2e8f0', marginTop: '1.5rem', overflow: 'hidden' }}>
      {/* Premier Section Banner matching Hotel Accommodation */}
      <div className="premier-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="premier-badge">
            <Sparkles size={14} />
            TRANSPORTATION PACKAGE
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
            Private Vehicle Routing & Sector Transfers Costing
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Quick jump to master tariffs tab */}
          {onOpenTransportRates && (
            <button
              type="button"
              onClick={onOpenTransportRates}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.75rem',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.2rem 0.6rem'
              }}
              title="Click to view and edit default vehicle charges"
            >
              <Layers size={13} />
              <span>Change Default Rates ↗</span>
            </button>
          )}

          {/* Section Currency Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>Transport Currency:</span>
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
            Master Routes ({routes.length})
          </span>
        </div>
      </div>

      <div className="card-body" style={{ padding: '1.25rem' }}>
        {/* Vehicle Selection Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          background: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Car size={16} style={{ color: '#1d4ed8' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Select Vehicle Allocation:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {vehicleOptions.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleVehicleChange(v.id)}
                className={`btn btn-sm ${vehicleType === v.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', borderRadius: '9999px', padding: '0.25rem 0.75rem' }}
              >
                <strong>{v.name}</strong> ({v.paxLabel})
              </button>
            ))}
          </div>
        </div>

        {/* Table of transport sectors */}
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '42%' }}>Sector / Route Itinerary</th>
                <th style={{ width: '18%', textAlign: 'center' }}>Vehicle Allocation</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Sector Cost ({currSymbol})</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Total ({currSymbol})</th>
                <th style={{ width: '4%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No transport routes added. Click <strong>"Add Sector Transfer"</strong> below.
                  </td>
                </tr>
              ) : (
                calculatedItems.map((item, index) => (
                  <tr key={item.id || index} className="hotel-row">
                    {/* Route selector */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <select
                          className="form-select"
                          value={item.route_id || ''}
                          onChange={(e) => handleRouteChange(item.id, e.target.value)}
                          style={{ fontWeight: 600, fontSize: '0.88rem' }}
                        >
                          {routes.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="table-input text-left"
                          placeholder="Sector notes (e.g. via Manakamana)..."
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', color: 'var(--text-muted)' }}
                          value={item.notes || ''}
                          onChange={(e) => handleUpdateItem(item.id, 'notes', e.target.value)}
                        />
                      </div>
                    </td>

                    {/* Vehicle Allocation Dropdown */}
                    <td style={{ textAlign: 'center' }}>
                      <select
                        className="form-select"
                        value={item.vehicle_type || vehicleType}
                        onChange={(e) => handleItemVehicleChange(item.id, e.target.value)}
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          padding: '0.3rem 0.5rem',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          borderRadius: 'var(--radius-sm)',
                          width: '100%',
                          cursor: 'pointer'
                        }}
                        title="Change vehicle allocation for this specific sector"
                      >
                        {vehicleOptions.map(v => (
                          <option key={v.id} value={v.id}>
                            🚗 {v.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Sector Cost */}
                    <td>
                      <input
                        type="number"
                        className="table-input"
                        value={item.rate}
                        onChange={(e) => handleRateChange(item.id, e.target.value)}
                      />
                    </td>

                    {/* Qty */}
                    <td>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="table-input"
                        style={{ textAlign: 'center' }}
                        value={item.qty}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      />
                    </td>

                    {/* Line Total */}
                    <td className="price-cell highlight" style={{ textAlign: 'right', fontWeight: 700 }}>
                      {currSymbol}{formatCurrency(item.total)}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="btn-danger-ghost"
                        title="Delete route"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Total summary footer matching Premier Section */}
            <tfoot>
              <tr style={{ background: '#f1f5f9', borderTop: '2px solid #94a3b8' }}>
                <td style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  Total Base Sector Cost in {currency}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: '#1e40af', fontSize: '0.85rem' }}>
                  {selectedVehicleObj.name}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                  {currSymbol}{formatCurrency(grandTotalBaseRate)}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                  {grandTotalSectorsQty} Sectors
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1.05rem', color: '#166534' }}>
                  {currSymbol}{formatCurrency(subtotalTransport)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section Actions & A/C Supplement */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleAddRoute}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Add Sector Transfer</span>
            </button>

            {/* A/C Supplement Checkbox Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#eff6ff', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#1e40af', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableAcSupplement}
                  onChange={(e) => setEnableAcSupplement(e.target.checked)}
                />
                <span>A/C Supplement ({acSupplementPercent}%):</span>
              </label>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '0.88rem', color: enableAcSupplement ? '#1d4ed8' : '#94a3b8' }}>
                {currSymbol}{formatCurrency(acSupplementAmount)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Info size={15} style={{ color: 'var(--primary)' }} />
            <span>Transport rates adjust to <strong>{currency}</strong>. Formula: <strong>Sector Cost × Qty</strong> {enableAcSupplement && '+ A/C Supplement'}</span>
          </div>
        </div>

        {/* Premier Style Total Highlight Box */}
        <div className="grand-total-banner">
          <div>
            <div className="grand-total-label">TRANSPORTATION TOTAL COSTING ({currency})</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="grand-total-amount grand-total-highlight">
                {currSymbol}{formatCurrency(totalTransport)}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                for {calculatedItems.length} Sector Transfers ({tripInfo.paxAdults} Pax)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Per Pax Share</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff' }}>
                {currSymbol}{formatCurrency(transportPerPax)}
              </div>
            </div>

            {enableAcSupplement && (
              <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>A/C Surcharge</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#fbbf24' }}>
                  {currSymbol}{formatCurrency(acSupplementAmount)}
                </div>
              </div>
            )}

            <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Vehicle Selected</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.15rem', color: '#38bdf8' }}>
                {selectedVehicleObj.name.split(' ')[0]} ({selectedVehicleObj.paxLabel})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
