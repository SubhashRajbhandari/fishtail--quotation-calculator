import React from 'react';
import { X, Printer, Compass, FileCheck, Eye } from 'lucide-react';
import PrintQuotation from './PrintQuotation';

export default function QuotationPreviewModal({
  isOpen,
  onClose,
  onPrint,
  tripInfo,
  hotelRows,
  availableHotels,
  hotelCurrency = 'INR',
  transportItems,
  transportCurrency = 'INR',
  additionalItems,
  additionalCurrency = 'INR',
  guideItems,
  guideCurrency = 'INR',
  itineraryDays = [],
  notes,
  marginPerPax
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop no-print" onClick={onClose}>
      <div 
        className="modal-dialog quotation-preview-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px', width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', background: '#0f172a', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--gold-gradient)', padding: '0.4rem', borderRadius: '6px', color: '#000' }}>
              <Eye size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
                Quotation Document Preview
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Ref: {tripInfo?.quoteNumber || 'FT-2026-QUOTE'} • Ready for print or PDF download
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={onPrint} 
              className="btn btn-accent btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-icon" 
              style={{ color: '#94a3b8', background: 'transparent' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: A4 Paper Preview */}
        <div 
          className="modal-body quotation-preview-body" 
          style={{ 
            padding: '1.5rem', 
            background: '#64748b', 
            overflowY: 'auto', 
            flex: 1,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div 
            className="quotation-paper-sheet" 
            style={{ 
              background: '#ffffff', 
              width: '100%', 
              maxWidth: '800px', 
              padding: '2rem 2.5rem', 
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
              borderRadius: '4px'
            }}
          >
            <PrintQuotation
              tripInfo={tripInfo}
              hotelRows={hotelRows}
              availableHotels={availableHotels}
              hotelCurrency={hotelCurrency}
              transportItems={transportItems}
              transportCurrency={transportCurrency}
              additionalItems={additionalItems}
              additionalCurrency={additionalCurrency}
              guideItems={guideItems}
              guideCurrency={guideCurrency}
              itineraryDays={itineraryDays}
              notes={notes}
              marginPerPax={marginPerPax}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            💡 Tip: In the browser print dialog, set Destination to <strong>"Save as PDF"</strong> or your printer.
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Close Preview
            </button>
            <button type="button" onClick={onPrint} className="btn btn-accent btn-sm">
              <Printer size={14} />
              <span>Print Quotation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
