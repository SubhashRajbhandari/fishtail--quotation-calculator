import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Hotel, 
  Car, 
  Plane, 
  Users, 
  TrendingUp, 
  Baby, 
  DollarSign, 
  Sparkles,
  FileCheck2
} from 'lucide-react';

export default function PackageGrandTotalCard({
  hotelTotalHalfTwin,
  hotelTotalSingle,
  hotelCurrency = 'INR',
  transportTotal,
  transportCurrency = 'INR',
  additionalTotal,
  additionalCurrency = 'INR',
  guideTotal,
  guideCurrency = 'INR',
  tripInfo,
  notes,
  onNotesChange,
  marginPerPax,
  onMarginChange
}) {
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'NPR': return 'Rs ';
      case 'USD': return '$';
      case 'INR':
      default: return '₹';
    }
  };

  const paxCount = Math.max(1, tripInfo.paxAdults || 1);
  const usdRate = Number(tripInfo?.usdToNprRate) || 135.5;

  // Currency multiplier to NPR
  const getMultiplierToNpr = (curr) => {
    if (curr === 'INR') return 1.6;
    if (curr === 'USD') return usdRate;
    return 1.0;
  };

  const hotelNprMultiplier = getMultiplierToNpr(hotelCurrency);
  const transportNprMultiplier = getMultiplierToNpr(transportCurrency);
  const additionalNprMultiplier = getMultiplierToNpr(additionalCurrency);
  const guideNprMultiplier = getMultiplierToNpr(guideCurrency);

  // Per Pax breakdown in native component currency
  const hotelPerPax = Math.round(hotelTotalHalfTwin);
  const transportPerPax = Math.round(transportTotal / paxCount);
  const additionalPerPax = Math.round(additionalTotal / paxCount);
  const guidePerPax = Math.round(guideTotal / paxCount);
  const margin = Number(marginPerPax) || 0; // Margin in NPR

  // Per Pax in NPR
  const hotelPerPaxNpr = Math.round(hotelPerPax * hotelNprMultiplier);
  const transportPerPaxNpr = Math.round(transportPerPax * transportNprMultiplier);
  const additionalPerPaxNpr = Math.round(additionalPerPax * additionalNprMultiplier);
  const guidePerPaxNpr = Math.round(guidePerPax * guideNprMultiplier);
  const marginPerPaxNpr = margin;

  // Master Total Net Package Cost & Selling Price per adult in NPR
  const netPackageCostPerAdultNpr = hotelPerPaxNpr + transportPerPaxNpr + additionalPerPaxNpr + guidePerPaxNpr;
  const finalAdultRateNpr = netPackageCostPerAdultNpr + marginPerPaxNpr;
  const finalTotalAdultGroupNpr = finalAdultRateNpr * paxCount;

  // Single room supplement in NPR
  const singleSupplementNpr = Math.round((Number(hotelTotalSingle) || 0) * hotelNprMultiplier);

  // Grand Total for entire group in NPR
  const groupGrandTotalNpr = finalTotalAdultGroupNpr + singleSupplementNpr;

  // Child Pricing in NPR
  const childWithBedPriceNpr = Math.round(finalAdultRateNpr * 0.75); // 75%
  const childNoBedPriceNpr = Math.round(finalAdultRateNpr * 0.35);    // 35%

  // Multi-currency equivalents
  const finalAdultRateInr = Math.round(finalAdultRateNpr / 1.6);
  const finalAdultRateUsd = Math.round(finalAdultRateNpr / usdRate);
  const groupGrandTotalInr = Math.round(groupGrandTotalNpr / 1.6);
  const groupGrandTotalUsd = Math.round(groupGrandTotalNpr / usdRate);

  const formatCurrency = (val) => (Number(val) || 0).toLocaleString();

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* 4 Cost Pillars Breakdown Table */}
      <div className="card" style={{ border: '2px solid #0f172a', overflow: 'hidden' }}>
        <div className="card-header" style={{ background: '#0f172a', color: '#ffffff' }}>
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'var(--gold-gradient)', color: '#000' }}>
              <Calculator size={18} />
            </div>
            <div>
              <div className="card-title" style={{ color: '#ffffff' }}>Total Tour Package Costing Matrix</div>
              <div className="card-subtitle" style={{ color: '#94a3b8' }}>
                Full breakdown across independent component currencies with automatic NPR master aggregation
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Section Currencies:</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #38bdf8' }}>
              🏨 {hotelCurrency}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', background: 'rgba(96, 165, 250, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #60a5fa' }}>
              🚗 {transportCurrency}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #fbbf24' }}>
              ✈️ {additionalCurrency}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #34d399' }}>
              👨‍✈️ {guideCurrency}
            </span>
          </div>
        </div>

        <div className="card-body" style={{ padding: '1.5rem' }}>
          {/* Itemized Cost Pillar Summary Grid (In each section's own currency) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Hotel Cost */}
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Hotel size={16} />
                  <span>1. Hotels ({hotelCurrency})</span>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                  {hotelCurrency}
                </span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
                {getCurrencySymbol(hotelCurrency)}{formatCurrency(hotelPerPax)} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>/ pax</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                ≈ Rs {formatCurrency(hotelPerPaxNpr)} in NPR
              </div>
            </div>

            {/* Transport Cost */}
            <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1d4ed8', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Car size={16} />
                  <span>2. Transport ({transportCurrency})</span>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                  {transportCurrency}
                </span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#1e40af' }}>
                {getCurrencySymbol(transportCurrency)}{formatCurrency(transportPerPax)} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>/ pax</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                ≈ Rs {formatCurrency(transportPerPaxNpr)} in NPR
              </div>
            </div>

            {/* Activities Cost */}
            <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Plane size={16} />
                  <span>3. Activities ({additionalCurrency})</span>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                  {additionalCurrency}
                </span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#92400e' }}>
                {getCurrencySymbol(additionalCurrency)}{formatCurrency(additionalPerPax)} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>/ pax</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                ≈ Rs {formatCurrency(additionalPerPaxNpr)} in NPR
              </div>
            </div>

            {/* Guide Cost */}
            <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Users size={16} />
                  <span>4. Guide ({guideCurrency})</span>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#d1fae5', color: '#065f46', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                  {guideCurrency}
                </span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#065f46' }}>
                {getCurrencySymbol(guideCurrency)}{formatCurrency(guidePerPax)} <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>/ pax</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                ≈ Rs {formatCurrency(guidePerPaxNpr)} in NPR
              </div>
            </div>

            {/* Profit Margin */}
            <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: 'var(--radius-md)', border: '1px solid #e9d5ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7e22ce', fontWeight: 700, fontSize: '0.85rem' }}>
                <TrendingUp size={16} />
                <span>5. Profit Margin (NPR / pax)</span>
              </div>
              <div style={{ marginTop: '0.3rem' }}>
                <input
                  type="number"
                  className="table-input"
                  style={{ textAlign: 'left', fontWeight: 800, color: '#7e22ce', fontSize: '1.1rem' }}
                  value={marginPerPax}
                  onChange={(e) => onMarginChange(parseFloat(e.target.value) || 0)}
                  title="Agency profit margin per adult pax in NPR"
                />
              </div>
            </div>
          </div>

          {/* Master Final Rate Matrix in NPR (Nepalese Rupees) */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid #a855f7',
            color: '#ffffff',
            boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.75rem' }}>🇳🇵</span>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f3e8ff', letterSpacing: '-0.01em' }}>
                    Master Tour Package Price in Nepalese Rupees (NPR / Rs)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                    <span>Conversion Logic:</span>
                    <span style={{ background: 'rgba(168, 85, 247, 0.25)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, color: '#f5d0fe', border: '1px solid #c084fc' }}>
                      1 INR = 1.60 NPR (Peg) • 1 USD = {usdRate} NPR
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e9d5ff' }}>
                  NET ADULT RATE IN NPR (TWIN SHARING)
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.4rem', fontWeight: 800, color: '#facc15', lineHeight: 1.1 }}>
                  Rs {formatCurrency(finalAdultRateNpr)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#e9d5ff', marginTop: '0.25rem' }}>
                  ≈ ₹{formatCurrency(finalAdultRateInr)} (INR) • ≈ ${formatCurrency(finalAdultRateUsd)} (USD)
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.07)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>Group Total ({paxCount} Adults):</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  Rs {formatCurrency(finalTotalAdultGroupNpr)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                  ≈ ₹{formatCurrency(Math.round(finalTotalAdultGroupNpr / 1.6))} | ${formatCurrency(Math.round(finalTotalAdultGroupNpr / usdRate))}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.07)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>Child With Bed (75%):</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.35rem', fontWeight: 800, color: '#fde047', marginTop: '0.2rem' }}>
                  Rs {formatCurrency(childWithBedPriceNpr)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                  75% of Adult Rate
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.07)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>Child Without Bed (35%):</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.35rem', fontWeight: 800, color: '#86efac', marginTop: '0.2rem' }}>
                  Rs {formatCurrency(childNoBedPriceNpr)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                  35% of Adult Rate
                </div>
              </div>

              {singleSupplementNpr > 0 && (
                <div style={{ background: 'rgba(255, 255, 255, 0.07)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>Single Supplement ({tripInfo.singleRoomsCount} Single):</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.35rem', fontWeight: 800, color: '#f472b6', marginTop: '0.2rem' }}>
                    +Rs {formatCurrency(singleSupplementNpr)}
                  </div>
                </div>
              )}

              <div style={{ background: 'rgba(250, 204, 21, 0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #facc15' }}>
                <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 700 }}>Total Group Package in NPR:</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.45rem', fontWeight: 900, color: '#facc15', marginTop: '0.2rem' }}>
                  Rs {formatCurrency(groupGrandTotalNpr)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#fef08a', marginTop: '0.15rem' }}>
                  ≈ ₹{formatCurrency(groupGrandTotalInr)} | ≈ ${formatCurrency(groupGrandTotalUsd)}
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Remarks & Terms Box */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <FileCheck2 size={16} style={{ color: '#2563eb' }} />
              <span>Quotation Inclusions, Terms & Meal Policy</span>
            </div>
            <textarea
              rows={4}
              className="form-textarea"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Enter tour inclusions, cancellation policy, payment terms..."
              style={{ fontSize: '0.85rem', lineHeight: '1.6' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
