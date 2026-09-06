/**
 * Executive HTML Email Template Generator for FishTail Tours & Travels
 * Built with bulletproof inline CSS and responsive tables compatible with
 * Gmail, Microsoft Outlook, Apple Mail, Yahoo Mail, and Mobile Email Clients.
 */

export function generateQuotationHtmlEmail({
  tripInfo = {},
  hotelRows = [],
  availableHotels = [],
  hotelCurrency = 'INR',
  transportItems = [],
  transportCurrency = 'NPR',
  additionalItems = [],
  additionalCurrency = 'NPR',
  guideItems = [],
  guideCurrency = 'NPR',
  itineraryDays = [],
  notes = '',
  marginPerPax = 2500,
  recipientEmail = '',
  customIntroMessage = ''
}) {
  const paxCount = Math.max(1, Number(tripInfo.paxAdults) || 1);
  const singleRoomsCount = Number(tripInfo.singleRoomsCount) || 0;
  const usdRate = Number(tripInfo?.usdToNprRate) || 135.5;

  const getMultiplierToNpr = (curr) => {
    if (curr === 'INR') return 1.6;
    if (curr === 'USD') return usdRate;
    return 1.0;
  };

  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case 'NPR': return 'Rs ';
      case 'USD': return '$';
      case 'INR':
      default: return '₹';
    }
  };

  const formatNumber = (num) => (Number(num) || 0).toLocaleString();

  // Hotel calculations
  const calculatedHotels = hotelRows.map((row) => {
    const matched = availableHotels.find(h => h.id === row.hotel_id);
    const hotelName = row.hotel_name || matched?.name || 'Selected Hotel';
    const city = row.city || matched?.city || 'Nepal';
    const category = row.category || matched?.category || 'Premier';
    const mealPlan = row.meal_plan || matched?.meal_plan || 'CP';
    const starRating = row.star_rating || matched?.star_rating || 3;
    const halfTwinRate = Number(row.half_twin_price) || 0;
    const nights = Number(row.nights) || 0;
    const singleRooms = Number(row.single_rooms !== undefined ? row.single_rooms : singleRoomsCount);
    const singleRate = Number(row.single_room_price) || 0;

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
      totalHalfTwin: halfTwinRate * nights,
      totalSingle: singleRate * singleRooms * nights
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

  const hotelMultiplier = getMultiplierToNpr(hotelCurrency);
  const transportMultiplier = getMultiplierToNpr(transportCurrency);
  const additionalMultiplier = getMultiplierToNpr(additionalCurrency);
  const guideMultiplier = getMultiplierToNpr(guideCurrency);

  const hotelPerPaxNpr = Math.round(hotelTotalHalfTwin * hotelMultiplier);
  const transportPerPaxNpr = Math.round((transportTotal / paxCount) * transportMultiplier);
  const additionalPerPaxNpr = Math.round((additionalTotal / paxCount) * additionalMultiplier);
  const guidePerPaxNpr = Math.round((guideTotal / paxCount) * guideMultiplier);

  const netPackageCostPerAdultNpr = hotelPerPaxNpr + transportPerPaxNpr + additionalPerPaxNpr + guidePerPaxNpr;
  const margin = Number(marginPerPax) || 0;
  const finalAdultRateNpr = netPackageCostPerAdultNpr + margin;
  const finalTotalAdultGroupNpr = finalAdultRateNpr * paxCount;
  const singleSupplementNpr = Math.round(hotelTotalSingle * hotelMultiplier);
  const groupGrandTotalNpr = finalTotalAdultGroupNpr + singleSupplementNpr;

  // Currency converted aggregates
  const finalAdultRateInr = Math.round(finalAdultRateNpr / 1.6);
  const finalAdultRateUsd = Math.round(finalAdultRateNpr / usdRate);
  const groupGrandTotalInr = Math.round(groupGrandTotalNpr / 1.6);
  const groupGrandTotalUsd = Math.round(groupGrandTotalNpr / usdRate);

  const childWithBedNpr = Math.round(finalAdultRateNpr * 0.75);
  const childNoBedNpr = Math.round(finalAdultRateNpr * 0.35);

  const consultantName = tripInfo.preparedBy || 'Subhash Rajbhandari';
  const clientName = tripInfo.clientName || 'Valued Guest';
  const quoteRef = tripInfo.quoteNumber || `FT-${new Date().getFullYear()}-001`;
  const tourTitle = tripInfo.tripTitle || 'Customized Nepal Private Tour';
  const quoteDate = tripInfo.quoteDate || new Date().toISOString().split('T')[0];

  // Default intro text if none provided
  const introGreeting = customIntroMessage.trim() || 
    `Dear ${clientName},\n\n` +
    `Greetings from FishTail Tours & Travels, Nepal! We are pleased to present your comprehensive, customized tour proposal and detailed itinerary for "${tourTitle}".\n\n` +
    `Below you will find our itemized accommodation matrix, dedicated private transportation breakdown, complete day-by-day sightseeing schedule, and transparent commercial package tariff. Please review the details below.`;

  const formattedIntroHtml = introGreeting
    .split('\n\n')
    .map(p => `<p style="margin: 0 0 12px 0; line-height: 1.6; color: #334155; font-size: 14px;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Tour Quotation & Itinerary - ${quoteRef}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    /* Client-specific Resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    
    /* Responsive rules */
    @media screen and (max-width: 640px) {
      .email-container { width: 100% !important; margin: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
      .mobile-padding { padding-left: 15px !important; padding-right: 15px !important; }
      .mobile-hide { display: none !important; }
      .mobile-center { text-align: center !important; }
      .pricing-rate-large { font-size: 26px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #f1f5f9;">

  <!-- PREHEADER TEXT (Visible in Email Inbox Preview) -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
    Official Tour Quotation & Detailed Itinerary from FishTail Tours & Travels - Ref: ${quoteRef} for ${clientName} - Rate: Rs ${formatNumber(finalAdultRateNpr)} / Adult.
  </div>

  <!-- MAIN EMAIL CONTAINER (640px centered table) -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="640" class="email-container" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">

    <!-- TOP BRANDING & LETTERHEAD HEADER -->
    <tr>
      <td style="background: linear-gradient(135deg, #042f2e 0%, #0f766e 100%); padding: 28px 32px; border-bottom: 4px solid #00bba4;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td valign="middle" style="text-align: left;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right: 14px;">
                    <div style="width: 44px; height: 44px; border-radius: 10px; background-color: #00bba4; text-align: center; line-height: 44px; font-size: 22px; color: #ffffff; font-weight: bold;">
                      🧭
                    </div>
                  </td>
                  <td valign="middle">
                    <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; line-height: 1.1;">
                      FISHTAIL TOURS &amp; TRAVELS
                    </div>
                    <div style="font-size: 12px; color: #5eead4; font-weight: 600; letter-spacing: 0.05em; margin-top: 3px;">
                      GOVT. REGD. LIC. NO. 128/046/047 • NATTA / NTB MEMBER
                    </div>
                  </td>
                </tr>
              </table>
            </td>
            <td valign="middle" align="right" class="mobile-hide" style="text-align: right;">
              <span style="display: inline-block; background-color: rgba(0, 187, 164, 0.25); border: 1px solid #00bba4; color: #ffffff; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.08em;">
                OFFICIAL PROPOSAL
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- PROPOSAL TITLE & METADATA OVERVIEW BANNER -->
    <tr>
      <td style="background-color: #f0fdfa; padding: 22px 32px; border-bottom: 1px solid #ccfbf1;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td>
              <div style="font-size: 11px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
                CONFIDENTIAL TOUR QUOTATION &amp; ITINERARY
              </div>
              <div style="font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.25; margin-bottom: 14px;">
                ${tourTitle}
              </div>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 10px;">
                    <div style="font-size: 12px; color: #64748b; line-height: 1.8;">
                      <strong style="color: #0f172a;">Reference No:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0f766e;">${quoteRef}</span><br/>
                      <strong style="color: #0f172a;">Prepared For:</strong> ${clientName}<br/>
                      <strong style="color: #0f172a;">Quotation Date:</strong> ${quoteDate}
                    </div>
                  </td>
                  <td width="50%" valign="top">
                    <div style="font-size: 12px; color: #64748b; line-height: 1.8;">
                      <strong style="color: #0f172a;">Group Size:</strong> ${paxCount} Adults ${singleRoomsCount > 0 ? `(${singleRoomsCount} Single)` : ''}<br/>
                      <strong style="color: #0f172a;">Duration:</strong> ${totalNights} Nights / ${totalNights + 1} Days<br/>
                      <strong style="color: #0f172a;">Consultant:</strong> <span style="color: #0d9488; font-weight: bold;">${consultantName}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- INTRODUCTORY GREETING & COVER LETTER -->
    <tr>
      <td style="padding: 24px 32px 16px 32px;" class="mobile-padding">
        ${formattedIntroHtml}
      </td>
    </tr>

    <!-- SECTION 1: HOTEL ACCOMMODATION MATRIX -->
    <tr>
      <td style="padding: 10px 32px;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td style="border-bottom: 2px solid #00bba4; padding-bottom: 8px; margin-bottom: 12px;">
              <span style="font-size: 15px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.04em;">
                🏨 1. Selected Hotel Accommodation Schedule
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="background-color: #0f766e; color: #ffffff;">
                    <th style="padding: 8px 10px; text-align: left; border-top-left-radius: 6px;">City &amp; Property</th>
                    <th style="padding: 8px 10px; text-align: center;">Category</th>
                    <th style="padding: 8px 10px; text-align: center;">Meal Plan</th>
                    <th style="padding: 8px 10px; text-align: center; border-top-right-radius: 6px;">Nights</th>
                  </tr>
                </thead>
                <tbody>
                  ${calculatedHotels.length > 0 ? calculatedHotels.map((h, i) => `
                    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f0fdfa'}; border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 10px; color: #0f172a;">
                        <strong style="color: #0f172a; font-size: 13px;">${h.hotelName}</strong><br/>
                        <span style="color: #64748b; font-size: 11px;">📍 ${h.city} • ${'★'.repeat(Math.min(5, h.starRating))}</span>
                      </td>
                      <td style="padding: 9px 10px; text-align: center; color: #475569;">${h.category}</td>
                      <td style="padding: 9px 10px; text-align: center; font-weight: 600; color: #0f766e;">
                        ${h.mealPlan === 'CP' ? 'CP (Breakfast)' : h.mealPlan === 'MAP' ? 'MAP (Bkf + Din)' : h.mealPlan === 'AP' ? 'AP (Full Board)' : 'EP (Room Only)'}
                      </td>
                      <td style="padding: 9px 10px; text-align: center; font-weight: 800; color: #0f172a;">${h.nights}</td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="4" style="padding: 12px; text-align: center; color: #64748b;">No hotels specified</td></tr>
                  `}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f8fafc; font-weight: bold; border-top: 2px solid #5eead4;">
                    <td colspan="3" style="padding: 8px 10px; color: #0f766e;">Total Tour Lodging Duration</td>
                    <td style="padding: 8px 10px; text-align: center; color: #0f766e; font-size: 13px;">${totalNights} Nights</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SECTION 2: DEDICATED PRIVATE TRANSPORTATION -->
    <tr>
      <td style="padding: 10px 32px;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td style="border-bottom: 2px solid #00bba4; padding-bottom: 8px;">
              <span style="font-size: 15px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.04em;">
                🚗 2. Dedicated Private Vehicle Fleet &amp; Transfers
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="background-color: #0f766e; color: #ffffff;">
                    <th style="padding: 8px 10px; text-align: left; border-top-left-radius: 6px;">Sector / Route Description</th>
                    <th style="padding: 8px 10px; text-align: left; border-top-right-radius: 6px;">Vehicle Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  ${transportItems.length > 0 ? transportItems.map((t, i) => `
                    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f0fdfa'}; border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 10px; color: #0f172a;">
                        <strong style="color: #0f172a;">${t.name}</strong>
                        ${t.notes ? `<br/><span style="color: #64748b; font-size: 11px;">${t.notes}</span>` : ''}
                      </td>
                      <td style="padding: 9px 10px; color: #0d9488; font-weight: 600;">
                        ${t.vehicle_type === 'scorpio' ? '4WD Scorpio / SUV' :
                          t.vehicle_type === 'hiace' ? 'Toyota Hiace Minibus (A/C)' :
                          t.vehicle_type === 'coaster' ? 'Toyota Coaster Bus' :
                          'Private Deluxe Sedan / Car'}
                      </td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="2" style="padding: 12px; text-align: center; color: #64748b;">Private transfers as per itinerary</td></tr>
                  `}
                </tbody>
              </table>
              <div style="font-size: 11px; color: #0f766e; margin-top: 6px; font-style: italic;">
                ✓ Dedicated private A/C vehicle throughout tour • Fuel, toll taxes, parking fees, chauffeur allowances included.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SECTION 3: SIGHTSEEING, FLIGHTS & GUIDES (If any) -->
    ${(additionalItems.length > 0 || guideItems.length > 0) ? `
    <tr>
      <td style="padding: 10px 32px;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td style="border-bottom: 2px solid #00bba4; padding-bottom: 8px;">
              <span style="font-size: 15px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.04em;">
                🎟️ 3. Included Sightseeing, Flights &amp; Tour Escort
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="background-color: #0f766e; color: #ffffff;">
                    <th style="padding: 8px 10px; text-align: left; border-top-left-radius: 6px;">Item Description</th>
                    <th style="padding: 8px 10px; text-align: right; border-top-right-radius: 6px;">Scope</th>
                  </tr>
                </thead>
                <tbody>
                  ${additionalItems.map((a, i) => `
                    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f0fdfa'}; border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 10px; color: #0f172a; font-weight: 600;">${a.name}</td>
                      <td style="padding: 9px 10px; text-align: right; color: #64748b;">Included (Qty: ${a.qty || 1})</td>
                    </tr>
                  `).join('')}
                  ${guideItems.map((g, i) => `
                    <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f0fdfa'}; border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 9px 10px; color: #0f172a; font-weight: 600;">${g.name} (Licensed Tour Guide)</td>
                      <td style="padding: 9px 10px; text-align: right; color: #64748b;">Included (${g.days || 1} Days)</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- SECTION 4: MASTER COMMERCIAL PACKAGE TARIFF (THE HIGHLIGHT BOX) -->
    <tr>
      <td style="padding: 10px 32px;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #042f2e 0%, #0f766e 100%); border-radius: 10px; border: 2px solid #00bba4; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(0, 187, 164, 0.25);">
          <tr>
            <td style="padding: 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td valign="middle">
                    <div style="font-size: 11px; font-weight: 800; color: #5eead4; text-transform: uppercase; letter-spacing: 0.08em;">
                      ★ MASTER COMMERCIAL TOUR TARIFF
                    </div>
                    <div style="font-size: 13px; color: #ccfbf1; margin-top: 2px;">
                      Fixed Package Price (All Inclusive per Adult on Twin Sharing)
                    </div>
                  </td>
                  <td valign="middle" align="right">
                    <div style="font-size: 12px; color: #99f6e4; font-weight: 600;">
                      NET RATE PER ADULT:
                    </div>
                    <div class="pricing-rate-large" style="font-size: 32px; font-weight: 900; color: #fbbf24; line-height: 1.1; letter-spacing: -0.02em;">
                      Rs ${formatNumber(finalAdultRateNpr)}
                    </div>
                    <div style="font-size: 12px; color: #ccfbf1; margin-top: 2px;">
                      ≈ ₹${formatNumber(finalAdultRateInr)} INR &nbsp;|&nbsp; ≈ $${formatNumber(finalAdultRateUsd)} USD
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Detailed pricing matrix grid -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 18px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 14px;">
                <tr>
                  <td width="33%" valign="top" style="padding-right: 10px;">
                    <div style="font-size: 11px; color: #99f6e4;">Group Total (${paxCount} Adults):</div>
                    <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-top: 2px;">
                      Rs ${formatNumber(finalTotalAdultGroupNpr)}
                    </div>
                    <div style="font-size: 11px; color: #ccfbf1;">
                      ≈ ₹${formatNumber(Math.round(finalTotalAdultGroupNpr / 1.6))} | $${formatNumber(Math.round(finalTotalAdultGroupNpr / usdRate))}
                    </div>
                  </td>
                  <td width="33%" valign="top" style="padding-right: 10px;">
                    <div style="font-size: 11px; color: #99f6e4;">Child With Bed (75%):</div>
                    <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 2px;">
                      Rs ${formatNumber(childWithBedNpr)} <span style="font-size: 10px; color: #ccfbf1;">/ child</span>
                    </div>
                  </td>
                  <td width="33%" valign="top">
                    <div style="font-size: 11px; color: #99f6e4;">Child No Bed (35%):</div>
                    <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-top: 2px;">
                      Rs ${formatNumber(childNoBedNpr)} <span style="font-size: 10px; color: #ccfbf1;">/ child</span>
                    </div>
                  </td>
                </tr>
                ${singleSupplementNpr > 0 ? `
                <tr>
                  <td colspan="3" style="padding-top: 10px;">
                    <div style="background-color: rgba(251, 191, 36, 0.15); border-left: 3px solid #fbbf24; padding: 6px 10px; border-radius: 4px; font-size: 12px; color: #fbbf24;">
                      <strong>Single Room Supplement (${singleRoomsCount} Single):</strong> +Rs ${formatNumber(singleSupplementNpr)}
                    </div>
                  </td>
                </tr>
                ` : ''}
              </table>

              <!-- Grand Total Banner -->
              <div style="background: rgba(0, 187, 164, 0.28); border: 1.5px solid #00bba4; border-radius: 6px; padding: 10px 14px; margin-top: 14px; text-align: center;">
                <span style="font-size: 12px; color: #ccfbf1; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">
                  GRAND TOTAL GROUP PACKAGE IN NPR:
                </span>
                <span style="font-size: 18px; font-weight: 900; color: #5eead4; margin-left: 8px;">
                  Rs ${formatNumber(groupGrandTotalNpr)} NPR
                </span>
                <span style="font-size: 12px; color: #ffffff; margin-left: 8px;">
                  (≈ ₹${formatNumber(groupGrandTotalInr)} INR &nbsp;|&nbsp; ≈ $${formatNumber(groupGrandTotalUsd)} USD)
                </span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SECTION 5: COMPLETE DAY-BY-DAY TOUR ITINERARY -->
    <tr>
      <td style="padding: 10px 32px;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td style="border-bottom: 2px solid #00bba4; padding-bottom: 8px; margin-bottom: 12px;">
              <span style="font-size: 15px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.04em;">
                🗺️ 5. Day-by-Day Customized Tour Itinerary
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 12px;">
              ${itineraryDays.length > 0 ? itineraryDays.map(day => `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #ccfbf1; border-radius: 8px; margin-bottom: 12px; overflow: hidden;">
                  <tr>
                    <td style="background-color: #f0fdfa; padding: 10px 14px; border-bottom: 1px solid #ccfbf1;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td valign="middle">
                            <span style="display: inline-block; background-color: #0f766e; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-right: 8px;">
                              DAY ${String(day.dayNumber).padStart(2, '0')}
                            </span>
                            <strong style="font-size: 14px; color: #0f172a;">${day.title}</strong>
                          </td>
                          <td valign="middle" align="right" class="mobile-hide">
                            ${day.meals ? `<span style="font-size: 11px; color: #0d9488; font-weight: 600; margin-right: 8px;">🍽️ ${day.meals}</span>` : ''}
                            ${day.overnightStay ? `<span style="font-size: 11px; color: #0f766e; font-weight: 600;">🏨 ${day.overnightStay}</span>` : ''}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 14px;">
                      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #334155;">
                        ${day.description}
                      </p>
                      ${day.highlights && day.highlights.length > 0 ? `
                        <div style="margin-top: 8px;">
                          ${day.highlights.map(h => `
                            <span style="display: inline-block; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 11px; color: #0f766e; padding: 2px 8px; border-radius: 12px; margin-right: 6px; margin-top: 4px;">
                              ✓ ${h}
                            </span>
                          `).join('')}
                        </div>
                      ` : ''}
                    </td>
                  </tr>
                </table>
              `).join('') : `
                <div style="padding: 16px; text-align: center; color: #64748b; font-size: 13px;">
                  Detailed day-by-day itinerary will be customized upon booking confirmation.
                </div>
              `}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SECTION 6: INCLUSIONS & EXCLUSIONS -->
    <tr>
      <td style="padding: 10px 32px;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td style="border-bottom: 2px solid #00bba4; padding-bottom: 8px;">
              <span style="font-size: 15px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.04em;">
                ⚖️ 6. Package Inclusions &amp; Exclusions
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 14px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <!-- Inclusions Column -->
                  <td width="50%" valign="top" class="stack-column" style="padding-right: 10px;">
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px;">
                      <div style="font-size: 13px; font-weight: 800; color: #166534; margin-bottom: 10px;">
                        ✓ Included in Package:
                      </div>
                      <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #166534; line-height: 1.7;">
                        <li>Twin-sharing accommodation in listed Premier hotels.</li>
                        <li>Daily buffet breakfast (CP Plan) at all hotels.</li>
                        <li>Private dedicated A/C vehicle for all mentioned sector transfers &amp; sightseeing.</li>
                        <li>All toll charges, fuel, parking fees &amp; driver allowance.</li>
                        <li>Airport meet, greet &amp; representative assistance.</li>
                        <li>All applicable Nepal Govt. taxes &amp; service charges.</li>
                      </ul>
                    </div>
                  </td>

                  <!-- Exclusions Column -->
                  <td width="50%" valign="top" class="stack-column" style="padding-left: 10px;">
                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px;">
                      <div style="font-size: 13px; font-weight: 800; color: #991b1b; margin-bottom: 10px;">
                        ✕ Not Included (Excluded):
                      </div>
                      <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #991b1b; line-height: 1.7;">
                        <li>International &amp; domestic airfares (unless listed in Sec 3).</li>
                        <li>Nepal Entry Visa fee (obtainable on airport arrival).</li>
                        <li>Monument entrance fees &amp; temple tickets.</li>
                        <li>Lunches, dinners, alcoholic &amp; soft drinks.</li>
                        <li>Personal expenses, laundry, tips &amp; travel insurance.</li>
                        <li>Costs arising from landslides, roadblocks or flight delays.</li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SECTION 7: BOOKING PROCESS & PAYMENT TERMS -->
    <tr>
      <td style="padding: 10px 32px;" class="mobile-padding">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
            💳 Booking, Payment &amp; Confirmation Policy:
          </div>
          <div style="font-size: 12px; color: #475569; line-height: 1.6;">
            • <strong>Booking Advance:</strong> 25% advance payment required upon confirmation to secure hotel room blocks and transport allocation.<br/>
            • <strong>Final Balance:</strong> Remaining 75% payable 7 days prior to arrival or via wire transfer.<br/>
            • <strong>Payment Modes:</strong> Direct Bank SWIFT Wire Transfer, Online Card Payment, or INR Bank Transfer.<br/>
            • <strong>Tariff Validity:</strong> Rates quoted are valid for 30 days from the date of issue.
          </div>
        </div>
      </td>
    </tr>

    <!-- SPECIAL NOTES (If any) -->
    ${notes ? `
    <tr>
      <td style="padding: 0 32px 14px 32px;" class="mobile-padding">
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px;">
          <div style="font-size: 12px; font-weight: 800; color: #92400e; margin-bottom: 4px;">
            📝 Consultant Remarks &amp; Special Conditions:
          </div>
          <div style="font-size: 12px; color: #78350f; line-height: 1.5;">
            ${notes.replace(/\n/g, '<br/>')}
          </div>
        </div>
      </td>
    </tr>
    ` : ''}

    <!-- SECTION 8: TOUR CONSULTANT CONTACT CARD & CALL TO ACTION -->
    <tr>
      <td style="padding: 10px 32px 28px 32px;" class="mobile-padding">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0fdfa; border: 1.5px solid #5eead4; border-radius: 10px; padding: 20px;">
          <tr>
            <td width="65%" valign="middle" class="stack-column">
              <div style="font-size: 11px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 0.05em;">
                YOUR DEDICATED TOUR CONSULTANT
              </div>
              <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin-top: 2px;">
                ${consultantName}
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                Senior Travel Specialist • FishTail Tours &amp; Travels Pvt. Ltd.
              </div>
              <div style="font-size: 12px; color: #334155; margin-top: 8px; line-height: 1.6;">
                📞 <strong>Hotline:</strong> +977 1 4419200 / +977 9851020304<br/>
                ✉️ <strong>Email:</strong> reservations@fishtail.org / subhash@fishtail.org<br/>
                🌐 <strong>Website:</strong> <a href="https://fishtail.org" target="_blank" style="color: #0d9488; text-decoration: none; font-weight: bold;">www.fishtail.org</a>
              </div>
            </td>
            <td width="35%" valign="middle" align="right" class="stack-column" style="padding-top: 10px;">
              <!-- Direct WhatsApp Button -->
              <a href="https://wa.me/9779851020304?text=Hi%20${encodeURIComponent(consultantName)},%20I%20am%20inquiring%20about%20Quotation%20${encodeURIComponent(quoteRef)}" 
                 target="_blank" 
                 style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 800; padding: 11px 20px; border-radius: 6px; box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3); text-align: center; margin-bottom: 8px; width: 150px;">
                💬 Chat on WhatsApp
              </a>
              <br/>
              <!-- Confirm / Email Back Button -->
              <a href="mailto:reservations@fishtail.org?subject=${encodeURIComponent('Acceptance & Confirmation for Quote ' + quoteRef + ' - ' + clientName)}" 
                 style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 800; padding: 11px 20px; border-radius: 6px; box-shadow: 0 2px 8px rgba(15, 118, 110, 0.3); text-align: center; width: 150px;">
                ✓ Confirm Booking
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER & LEGAL NOTICE -->
    <tr>
      <td style="background-color: #0f172a; padding: 24px 32px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
        <div style="font-weight: 800; color: #ffffff; font-size: 13px; margin-bottom: 4px;">
          FishTail Tours &amp; Travels (P) Ltd.
        </div>
        <div>
          Heritage Plaza II, Kamaladi, Post Box: 5657, Kathmandu, Nepal<br/>
          Government Registered License No: 128/046/047 • Central Bank Foreign Exchange License No: 102<br/>
          Active Member: NATTA (Nepal Association of Tour &amp; Travel Agents) • NTB (Nepal Tourism Board) • PATA
        </div>
        <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #334155; font-size: 10px; color: #64748b;">
          This official quotation is confidential and intended solely for ${clientName}. Rates and hotel rooms are subject to operational availability at the time of final confirmation.
        </div>
      </td>
    </tr>

  </table>
</body>
</html>`;
}
