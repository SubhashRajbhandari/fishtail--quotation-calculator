import React from 'react';
import { Compass, Calendar, User, CheckCircle2, XCircle, ShieldCheck, MapPin, Mail, Phone, Globe, Award, FileText } from 'lucide-react';

export default function PrintQuotation({
  tripInfo = {},
  hotelRows = [],
  availableHotels = [],
  hotelCurrency = 'INR',
  transportItems = [],
  transportCurrency = 'INR',
  additionalItems = [],
  additionalCurrency = 'INR',
  guideItems = [],
  guideCurrency = 'INR',
  itineraryDays = [],
  notes = '',
  marginPerPax = 0
}) {
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'NPR': return 'Rs ';
      case 'USD': return '$';
      case 'INR':
      default: return '₹';
    }
  };

  const paxCount = Math.max(1, Number(tripInfo.paxAdults) || 1);
  const singleRoomsCount = Number(tripInfo.singleRoomsCount) || 0;
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

  // Hotel calculations
  const calculatedHotels = hotelRows.map((row) => {
    const matched = availableHotels.find(h => h.id === row.hotel_id);
    const hotelName = row.hotel_name || matched?.name || 'Selected Hotel';
    const city = row.city || matched?.city || 'Nepal';
    const category = row.category || matched?.category || 'Premier';
    const mealPlan = row.meal_plan || matched?.meal_plan || 'CP';
    const starRating = row.star_rating || matched?.star_rating || 3;
    const halfTwinRate = Number(row.half_twin_price) || 0;
    const singleRate = Number(row.single_room_price) || 0;
    const nights = Number(row.nights) || 0;
    const singleRooms = Number(row.single_rooms !== undefined ? row.single_rooms : singleRoomsCount);

    const totalHalfTwin = halfTwinRate * nights;
    const totalSingle = singleRate * singleRooms * nights;
    return { 
      ...row, 
      hotelName, 
      city, 
      category, 
      mealPlan, 
      starRating, 
      halfTwinRate, 
      singleRate, 
      nights, 
      singleRooms, 
      totalHalfTwin, 
      totalSingle 
    };
  });

  const hotelTotalHalfTwin = calculatedHotels.reduce((sum, r) => sum + r.totalHalfTwin, 0);
  const hotelTotalSingle = calculatedHotels.reduce((sum, r) => sum + r.totalSingle, 0);
  const totalNights = calculatedHotels.reduce((sum, r) => sum + r.nights, 0);

  const transportTotal = transportItems.reduce((sum, it) => sum + (Number(it.rate_inr) || 0) * (Number(it.qty) || 1), 0);
  const additionalTotal = additionalItems.reduce((sum, it) => sum + (Number(it.unit_price_inr) || 0) * (Number(it.qty) || 1), 0);
  const guideTotal = guideItems.reduce((sum, it) => sum + (Number(it.rate_per_day_inr) || 0) * (Number(it.days) || 1), 0);

  const hotelPerPax = Math.round(hotelTotalHalfTwin);
  const transportPerPax = Math.round(transportTotal / paxCount);
  const additionalPerPax = Math.round(additionalTotal / paxCount);
  const guidePerPax = Math.round(guideTotal / paxCount);
  const margin = Number(marginPerPax) || 0;

  // NPR per pax
  const hotelPerPaxNpr = Math.round(hotelPerPax * hotelNprMultiplier);
  const transportPerPaxNpr = Math.round(transportPerPax * transportNprMultiplier);
  const additionalPerPaxNpr = Math.round(additionalPerPax * additionalNprMultiplier);
  const guidePerPaxNpr = Math.round(guidePerPax * guideNprMultiplier);
  const marginPerPaxNpr = margin;

  // Master Total Net Package Cost & Selling Price in NPR
  const netPackageCostPerAdultNpr = hotelPerPaxNpr + transportPerPaxNpr + additionalPerPaxNpr + guidePerPaxNpr;
  const finalAdultRateNpr = netPackageCostPerAdultNpr + marginPerPaxNpr;
  const finalTotalAdultGroupNpr = finalAdultRateNpr * paxCount;

  // Single supplement in NPR
  const singleSupplementNpr = Math.round((Number(hotelTotalSingle) || 0) * hotelNprMultiplier);
  const groupGrandTotalNpr = finalTotalAdultGroupNpr + singleSupplementNpr;

  // Child Pricing in NPR
  const childWithBedNpr = Math.round(finalAdultRateNpr * 0.75);
  const childNoBedNpr = Math.round(finalAdultRateNpr * 0.35);

  // INR and USD equivalents
  const finalAdultRateInr = Math.round(finalAdultRateNpr / 1.6);
  const finalAdultRateUsd = Math.round(finalAdultRateNpr / usdRate);
  const groupGrandTotalInr = Math.round(groupGrandTotalNpr / 1.6);
  const groupGrandTotalUsd = Math.round(groupGrandTotalNpr / usdRate);

  const formatCurrency = (val) => (Number(val) || 0).toLocaleString();

  return (
    <div id="print-quotation-root" className="print-only">
      <div className="quotation-print-document">
        {/* Top Header & Letterhead */}
        <div className="print-header">
          <div className="print-branding">
            <div className="print-logo-row">
              <div className="print-logo-icon">
                <Compass size={32} color="#1d4ed8" />
              </div>
              <div>
                <h1 className="print-company-name">FishTail Tours & Travels Pvt. Ltd.</h1>
                <p className="print-company-tagline">Specialist in Nepal, Tibet, Bhutan & Kailash Journeys</p>
              </div>
            </div>
            <div className="print-contact-info">
              <span><MapPin size={12} /> Tridevi Marg, Thamel, Kathmandu, Nepal</span>
              <span><Phone size={12} /> +977-1-4428521 / 4414430</span>
              <span><Mail size={12} /> quotation@fishtailtravels.com</span>
              <span><Globe size={12} /> www.fishtailtravels.com</span>
            </div>
          </div>

          <div className="print-meta-box">
            <div className="print-doc-badge">OFFICIAL TOUR QUOTATION</div>
            <table className="print-meta-table">
              <tbody>
                <tr>
                  <td className="meta-label">Quote Ref:</td>
                  <td className="meta-value">{tripInfo.quoteNumber || 'FT-2026-QUOTE'}</td>
                </tr>
                <tr>
                  <td className="meta-label">Quote Date:</td>
                  <td className="meta-value">{tripInfo.quoteDate || new Date().toISOString().split('T')[0]}</td>
                </tr>
                <tr>
                  <td className="meta-label">Validity:</td>
                  <td className="meta-value">15 Days from issue</td>
                </tr>
                <tr>
                  <td className="meta-label">Billing:</td>
                  <td className="meta-value font-bold">Nepalese Rupees (NPR / Rs)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Client & Itinerary Overview Card */}
        <div className="print-overview-card">
          <div className="overview-main">
            <div className="overview-label">Proposed Itinerary & Tour Title</div>
            <div className="overview-title">{tripInfo.tripTitle || 'Nepal Leisure & Cultural Experience'}</div>
            <div className="overview-client">
              Prepared for: <strong>{tripInfo.clientName || 'Valued Guest / Travel Partner'}</strong>
            </div>
          </div>
          <div className="overview-specs">
            <div className="spec-item">
              <span className="spec-label">Group Size:</span>
              <span className="spec-val"><strong>{paxCount} Adults</strong></span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Duration:</span>
              <span className="spec-val"><strong>{totalNights} Nights / {totalNights ? totalNights + 1 : 1} Days</strong></span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Single Rooms:</span>
              <span className="spec-val">{singleRoomsCount > 0 ? `${singleRoomsCount} Single Room(s)` : 'Twin Sharing'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Package Tier:</span>
              <span className="spec-val badge-tier">Premier 4-Star Selected</span>
            </div>
          </div>
        </div>

        {/* 1. Hotel Accommodations Schedule */}
        <div className="print-section">
          <h2 className="print-section-title">
            <span>1. Hotel Accommodation Breakdown</span>
            <span className="title-sub">(Currency: {hotelCurrency} • Meal Plan: CP - Bed & Breakfast)</span>
          </h2>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Destination & Hotel Name</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Category</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Plan</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Nights</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Per Pax Rate ({getCurrencySymbol(hotelCurrency)})</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Total ({getCurrencySymbol(hotelCurrency)})</th>
              </tr>
            </thead>
            <tbody>
              {calculatedHotels.length > 0 ? (
                calculatedHotels.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="table-main-text">{row.hotelName}</div>
                      <div className="table-sub-text">{row.city} • {'★'.repeat(Math.min(5, row.starRating))}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{row.category}</td>
                    <td style={{ textAlign: 'center' }}>{row.mealPlan}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.nights}</td>
                    <td style={{ textAlign: 'right' }}>{getCurrencySymbol(hotelCurrency)}{formatCurrency(row.halfTwinRate)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{getCurrencySymbol(hotelCurrency)}{formatCurrency(row.totalHalfTwin)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>No hotel accommodation specified</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ fontWeight: 700 }}>Total Hotel Accommodation ({hotelCurrency})</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{totalNights} Nts</td>
                <td colSpan="2" style={{ textAlign: 'right', fontWeight: 800, color: '#1e293b' }}>
                  {getCurrencySymbol(hotelCurrency)}{formatCurrency(hotelTotalHalfTwin)} {hotelCurrency !== 'NPR' && `(≈ Rs ${formatCurrency(hotelTotalHalfTwin * hotelNprMultiplier)})`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 2. Transportation & Sector Transfers */}
        <div className="print-section">
          <h2 className="print-section-title">
            <span>2. Private Transportation & Sector Transfers</span>
            <span className="title-sub">(Currency: {transportCurrency} • Dedicated Private A/C Vehicle)</span>
          </h2>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Sector / Route Itinerary</th>
                <th style={{ width: '20%' }}>Vehicle Allocation</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Total Cost ({getCurrencySymbol(transportCurrency)})</th>
              </tr>
            </thead>
            <tbody>
              {transportItems.length > 0 ? (
                transportItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="table-main-text">{item.name}</div>
                      {item.notes && <div className="table-sub-text">{item.notes}</div>}
                    </td>
                    <td>
                      {item.vehicle_type === 'scorpio' ? '4WD Scorpio / SUV' :
                       item.vehicle_type === 'hiace' ? 'Toyota Hiace Minibus' :
                       item.vehicle_type === 'coaster' ? 'Toyota Coaster Bus' :
                       item.vehicle_type === 'shuttle' ? 'Tourist Coach' :
                       'Private Sedan Car'}
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.qty || 1}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {getCurrencySymbol(transportCurrency)}{formatCurrency((Number(item.rate_inr) || 0) * (Number(item.qty) || 1))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#64748b' }}>No transportation sectors added</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ fontWeight: 700 }}>Total Transportation Cost ({transportCurrency})</td>
                <td style={{ textAlign: 'right', fontWeight: 800 }}>
                  {getCurrencySymbol(transportCurrency)}{formatCurrency(transportTotal)} {transportCurrency !== 'NPR' && `(≈ Rs ${formatCurrency(transportTotal * transportNprMultiplier)})`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 3. Activities, Sightseeing & Guide Services (if any) */}
        {(additionalItems.length > 0 || guideItems.length > 0) && (
          <div className="print-section">
            <h2 className="print-section-title">
              <span>3. Sightseeing, Flights, Activities & Guide Services</span>
            </h2>
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Description</th>
                  <th style={{ width: '20%' }}>Service Type</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Units</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {additionalItems.map((act, idx) => (
                  <tr key={'act-' + idx}>
                    <td>
                      <div className="table-main-text">{act.name}</div>
                    </td>
                    <td>{act.pricing_type || 'Activity / Flight'} ({additionalCurrency})</td>
                    <td style={{ textAlign: 'center' }}>Qty: {act.qty || 1}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {getCurrencySymbol(additionalCurrency)}{formatCurrency((Number(act.unit_price_inr) || 0) * (Number(act.qty) || 1))}
                    </td>
                  </tr>
                ))}
                {guideItems.map((g, idx) => (
                  <tr key={'g-' + idx}>
                    <td>
                      <div className="table-main-text">{g.name}</div>
                    </td>
                    <td>Licensed Tour Guide ({guideCurrency})</td>
                    <td style={{ textAlign: 'center' }}>{g.days || 1} Day(s)</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {getCurrencySymbol(guideCurrency)}{formatCurrency((Number(g.rate_per_day_inr) || 0) * (Number(g.days) || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Detailed Day-by-Day Tour Itinerary */}
        {itineraryDays && itineraryDays.length > 0 && (
          <div className="print-section">
            <h2 className="print-section-title">
              <span>{additionalItems.length > 0 || guideItems.length > 0 ? '4.' : '3.'} Day-by-Day Tour Itinerary & Schedule</span>
              <span className="title-sub">({itineraryDays.length} Days Customized Nepal Itinerary)</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
              {itineraryDays.map((day) => (
                <div 
                  key={day.id} 
                  style={{ 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '6px', 
                    padding: '0.6rem 0.85rem', 
                    background: '#f8fafc',
                    pageBreakInside: 'avoid'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        background: '#0f172a', 
                        color: '#ffffff', 
                        fontWeight: 800, 
                        fontSize: '0.75rem', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '4px' 
                      }}>
                        DAY {String(day.dayNumber).padStart(2, '0')}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{day.title}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem' }}>
                      {day.meals && (
                        <span style={{ background: '#ffedd5', color: '#9a3412', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 600 }}>
                          🍽️ {day.meals}
                        </span>
                      )}
                      {day.overnightStay && (
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 600 }}>
                          🏨 {day.overnightStay}
                        </span>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#334155', lineHeight: '1.45', margin: '0.2rem 0 0.35rem 0', whiteSpace: 'pre-line' }}>
                    {day.description}
                  </p>

                  {day.highlights && day.highlights.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.2rem' }}>
                      {day.highlights.map((h, hIdx) => (
                        <span key={hIdx} style={{ fontSize: '0.68rem', color: '#475569', background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.05rem 0.35rem', borderRadius: '3px' }}>
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Master Commercial Package Rates Box in NPR */}
        <div className="print-pricing-summary" style={{ background: '#0f172a' }}>
          <div className="pricing-summary-header">
            <div>
              <div className="pricing-headline">FINAL MASTER TOUR PACKAGE TARIFF SUMMARY (NPR)</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                Unified Grand Total in Nepalese Rupees (1 INR = 1.60 NPR • 1 USD = {usdRate} NPR)
              </div>
            </div>
            <div className="pricing-adult-rate">
              <span className="adult-label">NET RATE PER ADULT (TWIN SHARING):</span>
              <span className="adult-amount">Rs {formatCurrency(finalAdultRateNpr)}</span>
            </div>
          </div>

          <div className="pricing-grid">
            <div className="pricing-cell">
              <div className="cell-label">Group Total ({paxCount} Adults):</div>
              <div className="cell-val">Rs {formatCurrency(finalTotalAdultGroupNpr)}</div>
              <div className="cell-sub">≈ ₹{formatCurrency(Math.round(finalTotalAdultGroupNpr / 1.6))} | ${formatCurrency(Math.round(finalTotalAdultGroupNpr / usdRate))}</div>
            </div>
            <div className="pricing-cell">
              <div className="cell-label">Child With Bed (75% rate):</div>
              <div className="cell-val">Rs {formatCurrency(childWithBedNpr)} <span className="cell-sub">/ child</span></div>
            </div>
            <div className="pricing-cell">
              <div className="cell-label">Child Without Bed (35% rate):</div>
              <div className="cell-val">Rs {formatCurrency(childNoBedNpr)} <span className="cell-sub">/ child</span></div>
            </div>
            {singleSupplementNpr > 0 && (
              <div className="pricing-cell highlight-cell">
                <div className="cell-label">Single Room Supplement ({singleRoomsCount} Single):</div>
                <div className="cell-val">+Rs {formatCurrency(singleSupplementNpr)}</div>
              </div>
            )}
            <div className="pricing-cell" style={{ background: 'rgba(250, 204, 21, 0.2)', border: '1px solid #facc15' }}>
              <div className="cell-label" style={{ color: '#fef08a' }}>Total Group Package in NPR:</div>
              <div className="cell-val" style={{ color: '#facc15', fontWeight: 800 }}>Rs {formatCurrency(groupGrandTotalNpr)}</div>
              <div className="cell-sub" style={{ color: '#fef08a' }}>≈ ₹{formatCurrency(groupGrandTotalInr)} | ≈ ${formatCurrency(groupGrandTotalUsd)}</div>
            </div>
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="print-terms-container">
          <div className="print-column">
            <h3 className="terms-title text-green"><CheckCircle2 size={14} /> Package Inclusions</h3>
            <ul className="terms-list">
              <li>Accommodation on Twin Sharing basis at listed Premier hotels.</li>
              <li>Daily buffet breakfast at all hotel properties (CP Plan).</li>
              <li>Exclusive private A/C vehicle for all mentioned sector transfers & sightseeing.</li>
              <li>All highway toll charges, fuel, parking fees & chauffeur allowances.</li>
              <li>Assistance upon arrival and departure at airports.</li>
              <li>All prevailing Nepal Government taxes and VAT.</li>
            </ul>
          </div>

          <div className="print-column">
            <h3 className="terms-title text-red"><XCircle size={14} /> Package Exclusions</h3>
            <ul className="terms-list">
              <li>International & Domestic airfares unless itemized above.</li>
              <li>Nepal Entry Visa fee (obtainable on arrival at Kathmandu Airport).</li>
              <li>Monument entrance fees, cable car tickets & temple passes (unless specified).</li>
              <li>Lunch, Dinner, alcoholic & non-alcoholic beverages.</li>
              <li>Personal expenses, laundry, telephone calls, tips & travel insurance.</li>
              <li>Any costs arising from natural disasters, landslides or strikes.</li>
            </ul>
          </div>
        </div>

        {/* Remarks / Custom Notes */}
        {notes && (
          <div className="print-notes-box">
            <div className="notes-label"><FileText size={14} /> Special Remarks & Tour Notes:</div>
            <div className="notes-content">{notes}</div>
          </div>
        )}

        {/* Terms & Conditions and Signature Section */}
        <div className="print-footer-section">
          <div className="terms-small-text">
            <strong>Terms & Booking:</strong> 25% advance upon confirmation. Balance payable 7 days before tour departure. 
            Rates are based on current tariffs and subject to availability at time of actual booking.
          </div>

          <div className="signature-row">
            <div className="sign-block">
              <div className="sign-line"></div>
              <div className="sign-name">Guest / Client Acknowledgment</div>
              <div className="sign-title">Accepted & Confirmed</div>
            </div>

            <div className="sign-block text-right">
              <div className="sign-line"></div>
              <div className="sign-name">For FishTail Tours & Travels Pvt. Ltd.</div>
              <div className="sign-title">Authorized Quotation Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
