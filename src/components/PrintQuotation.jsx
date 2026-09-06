import React from 'react';
import { 
  Compass, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Award, 
  FileText,
  UserCheck,
  ArrowRight
} from 'lucide-react';

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

  // Transportation calculations
  const transportTotal = transportItems.reduce(
    (sum, it) => sum + (Number(it.rate_inr) || 0) * (Number(it.qty) || 1), 
    0
  );

  // Additional services & activities
  const additionalTotal = additionalItems.reduce(
    (sum, it) => sum + (Number(it.unit_price_inr) || 0) * (Number(it.qty) || 1), 
    0
  );

  // Guide services
  const guideTotal = guideItems.reduce(
    (sum, it) => sum + (Number(it.rate_per_day_inr) || 0) * (Number(it.days) || 1), 
    0
  );

  // Per pax aggregates in NPR
  const hotelPerPax = Math.round(hotelTotalHalfTwin);
  const transportPerPax = Math.round(transportTotal / paxCount);
  const additionalPerPax = Math.round(additionalTotal / paxCount);
  const guidePerPax = Math.round(guideTotal / paxCount);

  const hotelPerPaxNpr = Math.round(hotelPerPax * hotelNprMultiplier);
  const transportPerPaxNpr = Math.round(transportPerPax * transportNprMultiplier);
  const additionalPerPaxNpr = Math.round(additionalPerPax * additionalNprMultiplier);
  const guidePerPaxNpr = Math.round(guidePerPax * guideNprMultiplier);

  const netPackageCostPerAdultNpr = hotelPerPaxNpr + transportPerPaxNpr + additionalPerPaxNpr + guidePerPaxNpr;
  const margin = Number(marginPerPax) || 0;
  const finalAdultRateNpr = netPackageCostPerAdultNpr + margin;
  const finalTotalAdultGroupNpr = finalAdultRateNpr * paxCount;

  // Single supplement calculation
  const singleSupplementNpr = Math.round(hotelTotalSingle * hotelNprMultiplier);
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

        {/* ==================================================== */}
        {/* PAGE 1: COMMERCIAL COSTING & MASTER TARIFF MATRIX    */}
        {/* ==================================================== */}
        <div className="quotation-print-page print-page-costing">
          
          {/* Top Letterhead with Himalayan Teal Branding */}
          <div className="print-header">
            <div className="print-branding">
              <div className="print-logo-row">
                <div className="print-logo-icon">
                  <Compass size={34} color="#00bba4" />
                </div>
                <div>
                  <h1 className="print-company-name">FishTail Tours & Travels Pvt. Ltd.</h1>
                  <p className="print-company-tagline">Specialist in Nepal, Tibet, Bhutan & Kailash Journeys • Estd. 1990</p>
                </div>
              </div>
              <div className="print-contact-info">
                <span><MapPin size={12} color="#00bba4" /> Tridevi Marg, Thamel, Kathmandu, Nepal</span>
                <span><Phone size={12} color="#00bba4" /> +977-1-4428521 / 4414430</span>
                <span><Mail size={12} color="#00bba4" /> quotation@fishtailtravels.com</span>
                <span><Globe size={12} color="#00bba4" /> www.fishtailtravels.com</span>
              </div>
            </div>

            <div className="print-meta-box">
              <div className="print-doc-badge">OFFICIAL TOUR COSTING</div>
              <table className="print-meta-table">
                <tbody>
                  <tr>
                    <td className="meta-label">Quote Ref:</td>
                    <td className="meta-value font-mono">{tripInfo.quoteNumber || 'FT-2026-QUOTE'}</td>
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
                    <td className="meta-label">Base Currency:</td>
                    <td className="meta-value font-bold text-teal">NPR (Nepalese Rupees)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Client & Itinerary Overview Card (Teal Themed) */}
          <div className="print-overview-card">
            <div className="overview-main">
              <div className="overview-label">Proposed Itinerary & Tour Title</div>
              <div className="overview-title">{tripInfo.tripTitle || 'Nepal Leisure & Cultural Experience'}</div>
              <div className="overview-client-row">
                <div>
                  Prepared For: <strong>{tripInfo.clientName || 'Valued Guest / Travel Partner'}</strong>
                </div>
                <div className="consultant-pill">
                  <UserCheck size={13} />
                  <span>Tour Consultant: <strong>{tripInfo.preparedBy || 'Subhash Rajbhandari'}</strong></span>
                </div>
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
                <span className="spec-label">Room Allocation:</span>
                <span className="spec-val">{singleRoomsCount > 0 ? `${singleRoomsCount} Single, Twin Share` : 'Twin Sharing'}</span>
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
                  <th style={{ width: '40%' }}>Destination & Hotel Name</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>Category</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Plan</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>Nights</th>
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
                  <td colSpan="2" style={{ textAlign: 'right', fontWeight: 800 }}>
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
                  <th style={{ width: '22%' }}>Vehicle Allocation</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>Qty</th>
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

          {/* 3. Activities, Sightseeing & Guide Services (if present) */}
          {(additionalItems.length > 0 || guideItems.length > 0) && (
            <div className="print-section">
              <h2 className="print-section-title">
                <span>3. Sightseeing, Flights, Activities & Guide Services</span>
              </h2>
              <table className="print-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Description</th>
                    <th style={{ width: '22%' }}>Service Type</th>
                    <th style={{ width: '13%', textAlign: 'center' }}>Units</th>
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

          {/* MASTER COMMERCIAL PACKAGE RATES BOX (Page 1 Grand Total Banner) */}
          <div className="print-pricing-summary">
            <div className="pricing-summary-header">
              <div>
                <div className="pricing-headline">FINAL MASTER TOUR PACKAGE TARIFF SUMMARY (NPR)</div>
                <div className="pricing-subheadline">
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
              <div className="pricing-cell group-grand-cell">
                <div className="cell-label">Total Group Package in NPR:</div>
                <div className="cell-val group-grand-val">Rs {formatCurrency(groupGrandTotalNpr)}</div>
                <div className="cell-sub group-grand-sub">≈ ₹{formatCurrency(groupGrandTotalInr)} | ≈ ${formatCurrency(groupGrandTotalUsd)}</div>
              </div>
            </div>
          </div>

          {/* Page 1 Bottom Footer & Navigation Notice */}
          <div className="print-page-nav-footer">
            <span>📄 Page 1 of {itineraryDays?.length > 0 ? '2' : '1'} • Official Commercial Tariff Matrix</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#00bba4', fontWeight: 700 }}>
              <span>Detailed Day-by-Day Tour Itinerary & Program continues on Page 2</span>
              <ArrowRight size={13} />
            </span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* PAGE 2 ONWARDS: DAY-BY-DAY ITINERARY & TERMS         */}
        {/* ==================================================== */}
        {itineraryDays && itineraryDays.length > 0 && (
          <div className="quotation-print-page print-page-itinerary print-page-break">
            
            {/* Page 2 Elegant Top Sub-Header */}
            <div className="print-page-sub-header">
              <div className="sub-header-branding">
                <Compass size={20} color="#00bba4" />
                <span className="sub-header-company">FishTail Tours & Travels Pvt. Ltd.</span>
                <span className="sub-header-tag">• Day-by-Day Tour Program & Booking Terms</span>
              </div>
              <div className="sub-header-meta">
                <span>Ref: <strong>{tripInfo.quoteNumber || 'FT-2026-QUOTE'}</strong></span>
                <span>Client: <strong>{tripInfo.clientName || 'Valued Guest'}</strong></span>
              </div>
            </div>

            {/* 4. Detailed Day-by-Day Tour Itinerary */}
            <div className="print-section">
              <h2 className="print-section-title">
                <span>4. Day-by-Day Tour Itinerary & Schedule</span>
                <span className="title-sub">({itineraryDays.length} Days Customized Nepal Itinerary)</span>
              </h2>

              <div className="itinerary-days-container">
                {itineraryDays.map((day) => (
                  <div key={day.id} className="print-itinerary-day-card">
                    <div className="day-card-header">
                      <div className="day-card-title-group">
                        <span className="day-pill">
                          DAY {String(day.dayNumber).padStart(2, '0')}
                        </span>
                        <strong className="day-title">{day.title}</strong>
                      </div>

                      <div className="day-card-badges">
                        {day.meals && (
                          <span className="day-badge-meals">
                            🍽️ {day.meals}
                          </span>
                        )}
                        {day.overnightStay && (
                          <span className="day-badge-hotel">
                            🏨 {day.overnightStay}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="day-description">
                      {day.description}
                    </p>

                    {day.highlights && day.highlights.length > 0 && (
                      <div className="day-highlights-row">
                        {day.highlights.map((h, hIdx) => (
                          <span key={hIdx} className="day-highlight-pill">
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="print-terms-container">
              <div className="print-column">
                <h3 className="terms-title text-green"><CheckCircle2 size={14} /> Package Inclusions</h3>
                <ul className="terms-list">
                  <li>Accommodation on Twin Sharing basis at listed Premier category hotels.</li>
                  <li>Daily buffet breakfast at all hotel properties (CP Plan).</li>
                  <li>Exclusive dedicated private A/C vehicle for all mentioned sector transfers & sightseeing.</li>
                  <li>All highway toll charges, fuel costs, parking fees & chauffeur allowances.</li>
                  <li>Traditional airport meet, greet & representative assistance on arrivals/departures.</li>
                  <li>All prevailing Nepal Government taxes, tourist fees and service charges.</li>
                </ul>
              </div>

              <div className="print-column">
                <h3 className="terms-title text-red"><XCircle size={14} /> Package Exclusions</h3>
                <ul className="terms-list">
                  <li>International & Domestic airfares unless itemized in Section 3 above.</li>
                  <li>Nepal Entry Visa fee (obtainable easily upon arrival at Kathmandu Airport).</li>
                  <li>Monument entrance tickets, cable car passes & temple fees (unless specified).</li>
                  <li>Lunches, Dinners, alcoholic & non-alcoholic beverages.</li>
                  <li>Personal expenses, laundry, telephone calls, tips & personal travel insurance.</li>
                  <li>Any extra expenses arising from flight cancellations, natural hazards or landslides.</li>
                </ul>
              </div>
            </div>

            {/* Remarks / Custom Notes */}
            {notes && (
              <div className="print-notes-box">
                <div className="notes-label"><FileText size={14} /> Special Remarks & Consultant Notes:</div>
                <div className="notes-content">{notes}</div>
              </div>
            )}

            {/* Terms & Conditions and Signature Section */}
            <div className="print-footer-section">
              <div className="terms-small-text">
                <strong>Booking & Payment Terms:</strong> 25% booking advance required upon confirmation. Balance payable 7 days prior to departure. 
                Rates are subject to room and vehicle availability at the time of final confirmation.
              </div>

              <div className="signature-row">
                <div className="sign-block">
                  <div className="sign-line"></div>
                  <div className="sign-name">Guest / Partner Agency Acceptance</div>
                  <div className="sign-title">Accepted & Confirmed by Client</div>
                </div>

                <div className="sign-block text-right">
                  <div className="sign-line"></div>
                  <div className="sign-name">{tripInfo.preparedBy || 'Subhash Rajbhandari'}</div>
                  <div className="sign-title">Tour Consultant • FishTail Tours & Travels</div>
                </div>
              </div>
            </div>

            {/* Page 2 Bottom Footer */}
            <div className="print-page-nav-footer">
              <span>📄 Page 2 of 2 • Detailed Tour Schedule & Legal Conditions</span>
              <span>FishTail Tours & Travels Pvt. Ltd. (Govt. Regd. Lic. No. 128/046/047)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
