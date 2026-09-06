import React from 'react';
import { X, Printer, Compass, FileCheck, Eye } from 'lucide-react';
import PrintQuotation from './PrintQuotation';

export default function QuotationPreviewModal({
  isOpen,
  onClose,
  onPrint,
  quoteData = null,
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

  const effectiveTripInfo = quoteData ? {
    tripTitle: quoteData.trip_title || 'Nepal Tour Package',
    clientName: quoteData.client_name || 'Valued Client',
    preparedBy: quoteData.prepared_by || tripInfo?.preparedBy || 'Subhash Rajbhandari',
    quoteNumber: quoteData.quote_number || 'FT-2026-QUOTE',
    quoteDate: quoteData.quote_date || new Date().toISOString().split('T')[0],
    paxAdults: quoteData.pax_adults || 2,
    singleRoomsCount: quoteData.single_rooms_count || 0,
    usdToNprRate: Number(quoteData.usd_to_npr_rate) || 135.5
  } : tripInfo;

  const effectiveHotelRows = quoteData?.hotel_rows || hotelRows;
  const effectiveTransportItems = quoteData?.transport_items || transportItems;
  const effectiveAdditionalItems = quoteData?.additional_items || additionalItems;
  const effectiveGuideItems = quoteData?.guide_items || guideItems;
  const effectiveItineraryDays = quoteData?.itinerary_days || itineraryDays;
  const effectiveHotelCurrency = quoteData?.hotel_currency || hotelCurrency;
  const effectiveTransportCurrency = quoteData?.transport_currency || transportCurrency;
  const effectiveAdditionalCurrency = quoteData?.additional_currency || additionalCurrency;
  const effectiveGuideCurrency = quoteData?.guide_currency || guideCurrency;
  const effectiveNotes = quoteData?.notes !== undefined ? quoteData.notes : notes;
  const effectiveMarginPerPax = quoteData?.margin_per_pax !== undefined ? quoteData.margin_per_pax : marginPerPax;

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
                Ref: {effectiveTripInfo?.quoteNumber || 'FT-2026-QUOTE'} • Prepared by: {effectiveTripInfo?.preparedBy || 'Subhash Rajbhandari'}
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
            background: '#475569', 
            overflowY: 'auto', 
            flex: 1
          }}
        >
          <div 
            className="quotation-paper-sheet" 
            style={{ 
              background: '#ffffff', 
              width: '100%', 
              maxWidth: '820px', 
              margin: '0 auto 2.5rem auto',
              minHeight: '100%',
              height: 'fit-content',
              padding: '2.5rem 3rem', 
              boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.4), 0 10px 15px -5px rgba(0, 0, 0, 0.2)',
              borderRadius: '6px',
              boxSizing: 'border-box'
            }}
          >
            <PrintQuotation
              tripInfo={effectiveTripInfo}
              hotelRows={effectiveHotelRows}
              availableHotels={availableHotels}
              hotelCurrency={effectiveHotelCurrency}
              transportItems={effectiveTransportItems}
              transportCurrency={effectiveTransportCurrency}
              additionalItems={effectiveAdditionalItems}
              additionalCurrency={effectiveAdditionalCurrency}
              guideItems={effectiveGuideItems}
              guideCurrency={effectiveGuideCurrency}
              itineraryDays={effectiveItineraryDays}
              notes={effectiveNotes}
              marginPerPax={effectiveMarginPerPax}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#475569' }}>
            🎨 <strong>Color Print Tip:</strong> In your browser print dialog, ensure <strong>"Background graphics"</strong> is checked to print full colors.
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
