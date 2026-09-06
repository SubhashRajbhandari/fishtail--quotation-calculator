import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  BookmarkCheck, 
  Calendar, 
  User, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  FileCheck,
  AlertCircle,
  HelpCircle,
  XCircle,
  Send,
  UserCheck
} from 'lucide-react';

export default function FinalizeQuoteModal({
  isOpen,
  onClose,
  onSave,
  tripInfo,
  groupGrandTotalNpr,
  finalAdultRateNpr,
  hotelCurrency,
  transportCurrency,
  additionalCurrency,
  guideCurrency,
  notes
}) {
  if (!isOpen) return null;

  const [status, setStatus] = useState('materialized');
  const [preparedBy, setPreparedBy] = useState(tripInfo?.preparedBy || localStorage.getItem('fishtail_agent_name') || 'Subhash Rajbhandari');
  const [remarks, setRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const usdRate = Number(tripInfo?.usdToNprRate) || 135.5;
  const groupGrandTotalInr = Math.round(groupGrandTotalNpr / 1.6);
  const groupGrandTotalUsd = Math.round(groupGrandTotalNpr / usdRate);
  const finalAdultRateInr = Math.round(finalAdultRateNpr / 1.6);
  const finalAdultRateUsd = Math.round(finalAdultRateNpr / usdRate);

  const formatNumber = (num) => (Number(num) || 0).toLocaleString();

  const statusOptions = [
    {
      id: 'materialized',
      title: 'Materialized / Won',
      subtitle: 'Client confirmed & booked! Marks quote as won deal.',
      icon: Sparkles,
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#10b981',
      badgeText: '🎉 MATERIALIZED'
    },
    {
      id: 'pending',
      title: 'Pending Decision',
      subtitle: 'Finalized quote sent to client; awaiting approval/feedback.',
      icon: Clock,
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#f59e0b',
      badgeText: '⏳ PENDING'
    },
    {
      id: 'negotiation',
      title: 'In Negotiation',
      subtitle: 'Active discussion on discounts, dates, or itinerary tweaks.',
      icon: MessageSquare,
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#3b82f6',
      badgeText: '💬 NEGOTIATING'
    },
    {
      id: 'draft',
      title: 'Saved Draft',
      subtitle: 'Internal draft quotation saved for later completion.',
      icon: FileCheck,
      color: '#64748b',
      bgColor: '#f8fafc',
      borderColor: '#94a3b8',
      badgeText: '📝 DRAFT'
    },
    {
      id: 'lost',
      title: 'Lost / Cancelled',
      subtitle: 'Client chose another agency or cancelled the trip.',
      icon: XCircle,
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#ef4444',
      badgeText: '❌ LOST'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSaving(true);

    try {
      if (preparedBy.trim()) {
        try { localStorage.setItem('fishtail_agent_name', preparedBy.trim()); } catch (_) {}
      }
      await onSave({
        status,
        remarks,
        prepared_by: preparedBy.trim() || 'Subhash Rajbhandari',
        materialized_at: status === 'materialized' ? new Date().toISOString() : null
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save quotation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop no-print" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '650px', width: '92vw', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--gold-gradient)', padding: '0.45rem', borderRadius: '8px', color: '#000' }}>
              <BookmarkCheck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
                Finalize & Save Quotation Record
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Store in persistent records with tag status for tracking conversion & materialization
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-icon" 
            style={{ color: '#94a3b8', background: 'transparent' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {errorMsg && (
              <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quotation Quick Summary Card */}
            <div style={{ 
              background: '#f8fafc', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid #e2e8f0', 
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                    Quotation Reference
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {tripInfo.quoteNumber || 'FT-2026-XXXX'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                    Total Group Selling Price
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                    Rs {formatNumber(groupGrandTotalNpr)} NPR
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    ≈ ₹{formatNumber(groupGrandTotalInr)} INR • ${formatNumber(groupGrandTotalUsd)} USD
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Client: </span>
                  <strong style={{ color: '#1e293b' }}>{tripInfo.clientName || 'Direct Guest'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Pax: </span>
                  <strong style={{ color: '#1e293b' }}>{tripInfo.paxAdults || 2} Adults</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Per Adult: </span>
                  <strong style={{ color: '#0284c7' }}>Rs {formatNumber(finalAdultRateNpr)}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                <strong>Tour:</strong> {tripInfo.tripTitle || 'Custom Nepal Tour Package'}
              </div>
            </div>

            {/* Author / Prepared By Field */}
            <div className="form-group" style={{ marginBottom: '0.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Quotation & Itinerary Prepared By:</span>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Stored in quotation record</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  placeholder="Tour Consultant / Agent Name (e.g. Subhash)"
                  style={{ paddingLeft: '2.2rem', fontWeight: 700, fontSize: '0.85rem' }}
                />
                <UserCheck size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
              </div>
            </div>

            {/* Select Status Tag */}
            <div>
              <label className="form-label" style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>1. Select Quotation Status Tag (Materialization Index)</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Required</span>
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {statusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = status === opt.id;
                  return (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? `2px solid ${opt.borderColor}` : '1px solid #e2e8f0',
                        background: isSelected ? opt.bgColor : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? `0 2px 8px ${opt.color}20` : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="radio"
                          name="quoteStatus"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setStatus(opt.id)}
                          style={{ accentColor: opt.color, width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <div style={{ background: isSelected ? opt.color : '#f1f5f9', color: isSelected ? '#ffffff' : opt.color, padding: '0.35rem', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: isSelected ? 800 : 600, color: isSelected ? opt.color : '#1e293b', fontSize: '0.88rem' }}>
                            {opt.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {opt.subtitle}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: isSelected ? opt.color : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b'
                      }}>
                        {opt.badgeText}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Optional Agent Remarks / Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                2. Internal Agent Notes / Booking Remarks (Optional)
              </label>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="e.g., Client confirmed advance payment via Wire Transfer; or Discount promised 5% if confirmed by Friday..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '1rem 1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary btn-sm"
              disabled={isSaving}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSaving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, padding: '0.6rem 1.5rem' }}
            >
              {isSaving ? (
                <>
                  <span className="pulse-dot"></span>
                  <span>Saving Quotation...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Save Record as {status.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
