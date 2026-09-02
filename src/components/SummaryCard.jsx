import React from 'react';
import { 
  Calculator, 
  Users, 
  Percent, 
  Layers, 
  CreditCard, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export default function SummaryCard({
  hotelRows,
  tripInfo,
  currency,
  notes,
  onNotesChange
}) {
  // Calculations
  const calculatedRows = hotelRows.map((row) => {
    const halfTwinRate = Number(row.half_twin_price) || 0;
    const singleRate = Number(row.single_room_price) || 0;
    const nights = Number(row.nights) || 0;
    const singleRooms = Number(row.single_rooms !== undefined ? row.single_rooms : tripInfo.singleRoomsCount) || 0;

    const totalHalfTwin = halfTwinRate * nights;
    const totalSingle = singleRate * singleRooms * nights;
    const rowTotal = totalHalfTwin + totalSingle;

    return { totalHalfTwin, totalSingle, nights, rowTotal };
  });

  const totalNights = calculatedRows.reduce((sum, r) => sum + r.nights, 0);
  const totalHalfTwin = calculatedRows.reduce((sum, r) => sum + r.totalHalfTwin, 0);
  const totalSingle = calculatedRows.reduce((sum, r) => sum + r.totalSingle, 0);
  const grandTotal = totalHalfTwin + totalSingle;

  const paxCount = Math.max(1, tripInfo.paxAdults || 1);
  const costPerPaxHalfTwin = totalHalfTwin; // In hotel costing, Half Twin is per person rate x nights

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
      {/* Quotation Summary Breakdown */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Calculator size={18} />
            </div>
            <div>
              <div className="card-title">Quotation Summary Breakdown</div>
              <div className="card-subtitle">Per Pax and Group Pricing</div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Total Tour Duration:</span>
              <span style={{ fontWeight: 700 }}>{totalNights} Nights / {totalNights + 1} Days</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Total Travelers (Adults):</span>
              <span style={{ fontWeight: 700 }}>{paxCount} Pax</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Half Twin Cost (Per Pax):</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--primary)' }}>
                ₹{formatCurrency(costPerPaxHalfTwin)}
              </span>
            </div>

            {totalSingle > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Single Room Supplement:</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#d97706' }}>
                  ₹{formatCurrency(totalSingle)}
                </span>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '0.5rem', 
              padding: '0.85rem', 
              background: '#f8fafc', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)' 
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Total Package Cost (INR)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>For {paxCount} Pax (Premier)</div>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>
                ₹{formatCurrency(grandTotal)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusions, Exclusions & Quotation Notes */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon">
              <FileCheck size={18} />
            </div>
            <div>
              <div className="card-title">Quotation Terms & Meal Notes</div>
              <div className="card-subtitle">Includes CP/MAP plan notes & client remarks</div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-group">
            <textarea
              rows={5}
              className="form-textarea"
              placeholder="e.g. Inclusions: Accommodation on Twin sharing on CP basis (Bed & Breakfast), all applicable hotel taxes and service charges..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              style={{ fontSize: '0.85rem', lineHeight: '1.6' }}
            />
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge-city">Meal: CP (Breakfast Included)</span>
            <span className="badge-city">Tax: Included</span>
            <span className="badge-city">Currency: {currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
