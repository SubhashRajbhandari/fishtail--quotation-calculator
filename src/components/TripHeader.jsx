import React from 'react';
import { 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  Users, 
  MapPin,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function TripHeader({ tripInfo, onChange, onFinalize }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon">
            <FileText size={18} />
          </div>
          <div>
            <div className="card-title">Tour Itinerary & Quotation Details</div>
            <div className="card-subtitle">General tour specs, traveler counts, and currency settings</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              REF:
            </span>
            <span style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontWeight: 700, 
              background: 'var(--bg-muted)', 
              padding: '0.2rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}>
              {tripInfo.quoteNumber}
            </span>
          </div>

          {onFinalize && (
            <button
              type="button"
              onClick={onFinalize}
              className="btn btn-sm"
              style={{ background: '#059669', color: '#ffffff', fontWeight: 700, padding: '0.25rem 0.75rem', fontSize: '0.78rem' }}
              title="Save & Finalize this Quotation"
            >
              Finalize Quote
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {/* Trip / Package Title */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Tour / Package Title</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={tripInfo.tripTitle}
                onChange={(e) => onChange('tripTitle', e.target.value)}
                placeholder="e.g. Kathmandu - Pokhara - Chitwan - Chandragiri 7D/6N"
                style={{ paddingLeft: '2.2rem' }}
              />
              <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Client / Agency Name */}
          <div className="form-group">
            <label className="form-label">Client / Agency Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={tripInfo.clientName}
                onChange={(e) => onChange('clientName', e.target.value)}
                placeholder="Client Name or Travel Agency"
                style={{ paddingLeft: '2.2rem' }}
              />
              <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Prepared By (Quotation & Itinerary Creator) */}
          <div className="form-group">
            <label className="form-label">Quotation & Itinerary Prepared By</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={tripInfo.preparedBy || ''}
                onChange={(e) => {
                  onChange('preparedBy', e.target.value);
                  try { localStorage.setItem('fishtail_agent_name', e.target.value); } catch (_) {}
                }}
                placeholder="Tour Consultant Name (e.g. Subhash)"
                style={{ paddingLeft: '2.2rem' }}
              />
              <UserCheck size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
            </div>
          </div>

          {/* Quotation Date */}
          <div className="form-group">
            <label className="form-label">Quotation Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="form-input"
                value={tripInfo.quoteDate}
                onChange={(e) => onChange('quoteDate', e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
              <Calendar size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Currency & Exchange Setting */}
          <div className="form-group">
            <label className="form-label">Global Exchange Rates (NPR Base)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', background: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>Fixed Peg:</span>
                <span>1 INR = 1.60 NPR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>USD Rate:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>1 USD =</span>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem', height: '22px', width: '65px', fontWeight: 800, textAlign: 'center', color: '#047857' }}
                    value={tripInfo.usdToNprRate || 135.5}
                    onChange={(e) => onChange('usdToNprRate', parseFloat(e.target.value) || 135.5)}
                    title="USD to NPR Exchange Rate"
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>NPR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Adults / Pax */}
          <div className="form-group">
            <label className="form-label">Number of Pax (Adults)</label>
            <input
              type="number"
              min="1"
              max="200"
              className="form-input"
              value={tripInfo.paxAdults}
              onChange={(e) => onChange('paxAdults', Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          {/* Single Rooms */}
          <div className="form-group">
            <label className="form-label">Single Rooms (If any)</label>
            <input
              type="number"
              min="0"
              max="50"
              className="form-input"
              value={tripInfo.singleRoomsCount}
              onChange={(e) => onChange('singleRoomsCount', Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
