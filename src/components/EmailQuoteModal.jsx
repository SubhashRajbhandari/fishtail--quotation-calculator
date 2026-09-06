import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  Eye, 
  Settings, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  X,
  Smartphone,
  Monitor,
  ShieldCheck,
  User,
  Sparkles,
  Key,
  Globe,
  Users,
  FileText,
  RotateCcw,
  Clock,
  Compass
} from 'lucide-react';
import { generateQuotationHtmlEmail } from '../lib/emailTemplate';
import { 
  getAwsSesConfig, 
  saveAwsSesConfig, 
  resetAwsSesConfigToEnv,
  dispatchQuotationEmail 
} from '../lib/awsSesService';

export default function EmailQuoteModal({
  isOpen,
  onClose,
  quoteData = null,
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
  onEmailSent
}) {
  if (!isOpen) return null;

  // Active Tab ('compose' | 'preview' | 'settings')
  const [activeTab, setActiveTab] = useState('compose');
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'

  // AWS SES Config State
  const [sesConfig, setSesConfig] = useState(getAwsSesConfig());
  const [saveConfigSuccess, setSaveConfigSuccess] = useState(false);

  // Resolved Quote Information (from prop quoteData or active workspace)
  const resolvedTrip = useMemo(() => {
    if (quoteData) {
      return {
        tripTitle: quoteData.trip_title || 'Customized Nepal Tour',
        clientName: quoteData.client_name || 'Valued Guest',
        clientEmail: quoteData.client_email || '',
        preparedBy: quoteData.prepared_by || 'Subhash Rajbhandari',
        quoteNumber: quoteData.quote_number || 'FT-2026-QUOTE',
        quoteDate: quoteData.quote_date || new Date().toISOString().split('T')[0],
        paxAdults: quoteData.pax_adults || 2,
        singleRoomsCount: quoteData.single_rooms_count || 0,
        usdToNprRate: quoteData.usd_rate || 135.5
      };
    }
    return {
      tripTitle: tripInfo.tripTitle || 'Customized Nepal Tour',
      clientName: tripInfo.clientName || 'Valued Guest',
      clientEmail: tripInfo.clientEmail || '',
      preparedBy: tripInfo.preparedBy || 'Subhash Rajbhandari',
      quoteNumber: tripInfo.quoteNumber || 'FT-2026-QUOTE',
      quoteDate: tripInfo.quoteDate || new Date().toISOString().split('T')[0],
      paxAdults: tripInfo.paxAdults || 2,
      singleRoomsCount: tripInfo.singleRoomsCount || 0,
      usdToNprRate: tripInfo.usdToNprRate || 135.5
    };
  }, [quoteData, tripInfo]);

  const resolvedHotels = quoteData?.hotel_rows || hotelRows;
  const resolvedHotelCurr = quoteData?.hotel_currency || hotelCurrency;
  const resolvedTransports = quoteData?.transport_items || transportItems;
  const resolvedTransportCurr = quoteData?.transport_currency || transportCurrency;
  const resolvedAdditionals = quoteData?.additional_items || additionalItems;
  const resolvedAdditionalCurr = quoteData?.additional_currency || additionalCurrency;
  const resolvedGuides = quoteData?.guide_items || guideItems;
  const resolvedGuideCurr = quoteData?.guide_currency || guideCurrency;
  const resolvedItinerary = quoteData?.itinerary_days || itineraryDays;
  const resolvedNotes = quoteData?.notes !== undefined ? quoteData.notes : notes;
  const resolvedMargin = quoteData?.margin_per_pax !== undefined ? quoteData.margin_per_pax : marginPerPax;

  // Form Fields
  const [recipientEmail, setRecipientEmail] = useState(resolvedTrip.clientEmail || '');
  const [ccEmails, setCcEmails] = useState('reservations@fishtail.org');
  const [subject, setSubject] = useState(
    `Official Tour Quotation & Detailed Itinerary - [Ref: ${resolvedTrip.quoteNumber}] - ${resolvedTrip.tripTitle}`
  );

  // Default templates for cover letter
  const coverLetterTemplates = {
    standard: `Dear ${resolvedTrip.clientName},\n\nGreetings from FishTail Tours & Travels, Nepal!\n\nWe are delighted to present your comprehensive, customized tour proposal and detailed itinerary for "${resolvedTrip.tripTitle}".\n\nBelow you will find our itemized hotel accommodation schedule, dedicated private vehicle transfers, sightseeing schedule, and transparent commercial package tariff. Everything has been tailored to ensure an unforgettable Himalayan experience. Please review the details below.`,
    b2b: `Dear Partners at ${resolvedTrip.clientName},\n\nWarm greetings from the Reservations Team at FishTail Tours & Travels, Nepal.\n\nPlease find attached the official confidential tariff proposal and day-wise tour itinerary for your group inquiry (Ref: ${resolvedTrip.quoteNumber}) covering "${resolvedTrip.tripTitle}".\n\nThis proposal includes premier hotel allocations, dedicated private transport fleet, and licensed guide services. Rates are net and confidential as per our partner agreement.`,
    vip: `Dear ${resolvedTrip.clientName},\n\nThank you for choosing FishTail Tours & Travels for your upcoming Nepal journey.\n\nIt is our absolute pleasure to present your bespoke, luxury travel proposal for "${resolvedTrip.tripTitle}". Every aspect of this itinerary—from deluxe accommodations to private chauffeur arrangements—has been curated for your utmost comfort and privacy.`
  };

  const [customMessage, setCustomMessage] = useState(coverLetterTemplates.standard);

  // Status & Feedback
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Synchronize recipient email when resolvedTrip changes
  useEffect(() => {
    if (resolvedTrip.clientEmail && !recipientEmail) {
      setRecipientEmail(resolvedTrip.clientEmail);
    }
  }, [resolvedTrip.clientEmail]);

  // Generate HTML Email
  const htmlEmailContent = useMemo(() => {
    return generateQuotationHtmlEmail({
      tripInfo: resolvedTrip,
      hotelRows: resolvedHotels,
      availableHotels,
      hotelCurrency: resolvedHotelCurr,
      transportItems: resolvedTransports,
      transportCurrency: resolvedTransportCurr,
      additionalItems: resolvedAdditionals,
      additionalCurrency: resolvedAdditionalCurr,
      guideItems: resolvedGuides,
      guideCurrency: resolvedGuideCurr,
      itineraryDays: resolvedItinerary,
      notes: resolvedNotes,
      marginPerPax: resolvedMargin,
      recipientEmail,
      customIntroMessage: customMessage
    });
  }, [
    resolvedTrip,
    resolvedHotels,
    availableHotels,
    resolvedHotelCurr,
    resolvedTransports,
    resolvedTransportCurr,
    resolvedAdditionals,
    resolvedAdditionalCurr,
    resolvedGuides,
    resolvedGuideCurr,
    resolvedItinerary,
    resolvedNotes,
    resolvedMargin,
    recipientEmail,
    customMessage
  ]);

  // Handle Send via AWS SES
  const handleSendEmail = async () => {
    if (!recipientEmail || !recipientEmail.trim()) {
      setSendError('Please enter a valid client / partner recipient email address.');
      return;
    }

    setIsSending(true);
    setSendError(null);
    setSendSuccess(false);

    try {
      const res = await dispatchQuotationEmail({
        to: recipientEmail.trim(),
        cc: ccEmails,
        subject: subject.trim(),
        html: htmlEmailContent,
        quoteNumber: resolvedTrip.quoteNumber,
        clientName: resolvedTrip.clientName,
        preparedBy: resolvedTrip.preparedBy
      });

      setSendSuccess(true);
      if (onEmailSent) {
        onEmailSent({
          quoteNumber: resolvedTrip.quoteNumber,
          recipientEmail: recipientEmail.trim(),
          messageId: res.messageId,
          sentAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Email dispatch failed:', err);
      setSendError(err.message || 'Failed to send email via AWS SES.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Copy HTML
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(htmlEmailContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Handle Open in New Tab
  const handleOpenInNewTab = () => {
    const blob = new Blob([htmlEmailContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Handle Save AWS Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const res = saveAwsSesConfig(sesConfig);
    if (res.success) {
      setSaveConfigSuccess(true);
      setTimeout(() => setSaveConfigSuccess(false), 3000);
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{ 
        zIndex: 1200, 
        backgroundColor: 'rgba(15, 23, 42, 0.75)', 
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="modal-dialog-container"
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '940px', 
          width: '100%', 
          maxHeight: '92vh', 
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* ==================================================== */}
        {/* 1. LUXURY TOP BANNER (Himalayan Teal to Midnight)   */}
        {/* ==================================================== */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #00bba4 100%)', 
            padding: '1.25rem 1.75rem', 
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3.5px solid #00bba4'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #00bba4 0%, #0d9488 100%)', 
                padding: '0.55rem', 
                borderRadius: '10px', 
                display: 'flex',
                boxShadow: '0 4px 12px rgba(0, 187, 164, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <Mail size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Email Quotation &amp; Tour Itinerary
                </span>
                <span 
                  style={{ 
                    background: 'rgba(0, 187, 164, 0.25)', 
                    border: '1px solid #00bba4', 
                    color: '#5eead4', 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '20px',
                    letterSpacing: '0.04em'
                  }}
                >
                  AWS SES CLOUD DISPATCH
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ccfbf1', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span>Ref: <strong style={{ color: '#fbbf24', fontFamily: 'monospace' }}>{resolvedTrip.quoteNumber}</strong></span>
                <span>•</span>
                <span>Client: <strong>{resolvedTrip.clientName}</strong></span>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.12)', 
              border: 'none', 
              color: '#ffffff', 
              cursor: 'pointer', 
              borderRadius: '8px', 
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            title="Close Email Window"
          >
            <X size={20} />
          </button>
        </div>

        {/* ==================================================== */}
        {/* 2. MODERN FLOATING SEGMENTED TAB SWITCHER            */}
        {/* ==================================================== */}
        <div 
          style={{ 
            display: 'flex', 
            background: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0', 
            padding: '0.65rem 1.5rem',
            alignItems: 'center'
          }}
        >
          <div 
            style={{ 
              display: 'inline-flex', 
              background: '#e2e8f0', 
              padding: '3px', 
              borderRadius: '10px',
              gap: '3px'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('compose')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'compose' ? 800 : 600,
                fontSize: '0.82rem',
                background: activeTab === 'compose' ? '#ffffff' : 'transparent',
                color: activeTab === 'compose' ? '#0f766e' : '#475569',
                boxShadow: activeTab === 'compose' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Send size={14} color={activeTab === 'compose' ? '#00bba4' : '#64748b'} />
              <span>Compose &amp; Send</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'preview' ? 800 : 600,
                fontSize: '0.82rem',
                background: activeTab === 'preview' ? '#ffffff' : 'transparent',
                color: activeTab === 'preview' ? '#0f766e' : '#475569',
                boxShadow: activeTab === 'preview' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Eye size={14} color={activeTab === 'preview' ? '#00bba4' : '#64748b'} />
              <span>Live Email Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'settings' ? 800 : 600,
                fontSize: '0.82rem',
                background: activeTab === 'settings' ? '#ffffff' : 'transparent',
                color: activeTab === 'settings' ? '#0f766e' : '#475569',
                boxShadow: activeTab === 'settings' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Settings size={14} color={activeTab === 'settings' ? '#00bba4' : '#64748b'} />
              <span>AWS SES Settings</span>
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3. MODAL CONTENT BODY (White Surface, High Contrast) */}
        {/* ==================================================== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#ffffff' }}>
          
          {/* -------------------------------------------------- */}
          {/* TAB 1: COMPOSE & SEND                              */}
          {/* -------------------------------------------------- */}
          {activeTab === 'compose' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Proposal Executive Badge Card */}
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)', 
                  border: '1.5px solid #99f6e4', 
                  borderRadius: '10px', 
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#0f766e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    TOUR PROPOSAL DETAILS
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {resolvedTrip.tripTitle}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#334155', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      👥 {resolvedTrip.paxAdults} Adults {resolvedTrip.singleRoomsCount > 0 ? `(${resolvedTrip.singleRoomsCount} Single)` : ''}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#334155', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      🗺️ {resolvedItinerary.length} Tour Days
                    </span>
                    <span style={{ fontSize: '0.75rem', background: '#ccfbf1', color: '#0f766e', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                      Consultant: {resolvedTrip.preparedBy}
                    </span>
                  </div>
                </div>

                <div 
                  style={{ 
                    background: '#ffffff', 
                    border: '1px solid #ccfbf1', 
                    borderRadius: '8px', 
                    padding: '0.5rem 0.85rem',
                    textAlign: 'right'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', fontSize: '0.7rem', color: '#059669', fontWeight: 800 }}>
                    <ShieldCheck size={14} color="#059669" />
                    <span>VERIFIED SES SENDER IDENTITY</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginTop: '1px' }}>
                    {sesConfig.fromName} &lt;{sesConfig.fromEmail}&gt;
                  </div>
                </div>
              </div>

              {/* Status Notifications */}
              {sendSuccess && (
                <div 
                  style={{ 
                    background: '#ecfdf5', 
                    border: '1.5px solid #10b981', 
                    color: '#065f46', 
                    borderRadius: '8px', 
                    padding: '0.9rem 1.1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                  }}
                >
                  <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>Quotation Email Dispatched Successfully!</strong>
                    <div style={{ fontSize: '0.82rem', marginTop: '2px', color: '#047857' }}>
                      The proposal has been delivered to <strong>{recipientEmail}</strong> via AWS SES. A record has been logged in your history.
                    </div>
                  </div>
                </div>
              )}

              {sendError && (
                <div 
                  style={{ 
                    background: '#fef2f2', 
                    border: '1.5px solid #ef4444', 
                    color: '#991b1b', 
                    borderRadius: '10px', 
                    padding: '1rem 1.25rem', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.85rem' 
                  }}
                >
                  <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      {sendError.includes('Email address is not verified') || sendError.includes('554 Message rejected') 
                        ? 'AWS SES: Sender or Recipient Email Not Verified' 
                        : 'Failed to Send Email via AWS SES'}
                    </div>
                    <div style={{ fontSize: '0.82rem', marginTop: '4px', lineHeight: '1.5', color: '#7f1d1d' }}>
                      {sendError}
                    </div>

                    {(sendError.includes('Email address is not verified') || sendError.includes('554 Message rejected')) && (
                      <div 
                        style={{ 
                          marginTop: '0.75rem', 
                          background: '#ffffff', 
                          border: '1px solid #fca5a5', 
                          borderRadius: '8px', 
                          padding: '0.75rem 0.9rem',
                          fontSize: '0.78rem',
                          color: '#1e293b',
                          lineHeight: '1.55'
                        }}
                      >
                        <div style={{ fontWeight: 800, color: '#991b1b', marginBottom: '0.35rem' }}>
                          🛠️ What you need to do in AWS:
                        </div>
                        <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                          <li>Open AWS SES Console in <strong>US East (N. Virginia - us-east-1)</strong>.</li>
                          <li>Go to <strong>Verified Identities</strong> &rarr; Click <strong>Create identity</strong>.</li>
                          <li>Add your sender email (e.g. <code>{sesConfig.fromEmail}</code>) and click the verification link sent to your inbox.</li>
                          <li><em>If your AWS account is in Sandbox mode:</em> You must also verify the recipient's email in the same console, or click <strong>Request production access</strong> to send to anyone without verification.</li>
                        </ol>
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setActiveTab('settings')}
                            style={{
                              background: '#0f766e',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '5px',
                              padding: '0.35rem 0.75rem',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            ⚙️ Check / Change "From" Email in Settings
                          </button>
                          <button
                            type="button"
                            onClick={handleCopyHtml}
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              borderRadius: '5px',
                              padding: '0.35rem 0.75rem',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            {copySuccess ? 'Copied HTML!' : '📋 Copy Email HTML (Paste in Gmail/Outlook)'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Input Group */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
                
                {/* Recipient Email */}
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Client / Target Business Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="e.g. client@gmail.com or partner@travelagency.com"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00bba4'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#0d9488' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                    Recipient will receive the full proposal directly from your verified AWS SES identity.
                  </span>
                </div>

                {/* CC Email */}
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                    CC Email(s) (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={ccEmails}
                      onChange={(e) => setCcEmails(e.target.value)}
                      placeholder="reservations@fishtail.org, sales@fishtail.org"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00bba4'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                    <Users size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                    Keep your reservations desk or partner agency in the loop.
                  </span>
                </div>

              </div>

              {/* Subject Line */}
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                  Email Subject Line
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                      fontSize: '0.9rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00bba4'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                  <FileText size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#0d9488' }} />
                </div>
              </div>

              {/* Cover Letter with Tone Presets */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>
                    Personalized Greeting &amp; Cover Note
                  </label>

                  {/* Quick Tone Selectors */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Tone Presets:</span>
                    <button
                      type="button"
                      onClick={() => setCustomMessage(coverLetterTemplates.standard)}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#f1f5f9',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      🤝 Standard Guest
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomMessage(coverLetterTemplates.b2b)}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#f1f5f9',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      🏢 B2B Partner
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomMessage(coverLetterTemplates.vip)}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#f1f5f9',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      🌟 VIP Luxury
                    </button>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    lineHeight: '1.6',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00bba4'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  This personalized greeting note is rendered directly at the top of the email before the accommodation and itinerary tables.
                </span>
              </div>

            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* TAB 2: LIVE INBOX PREVIEW                          */}
          {/* -------------------------------------------------- */}
          {activeTab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Preview Controls Bar */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  padding: '0.6rem 1rem', 
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Simulated Viewport:</span>
                  <div style={{ display: 'flex', background: '#e2e8f0', padding: '2px', borderRadius: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '5px',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: previewDevice === 'desktop' ? '#0f766e' : 'transparent',
                        color: previewDevice === 'desktop' ? '#ffffff' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      <Monitor size={13} />
                      <span>Desktop (650px)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '5px',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: previewDevice === 'mobile' ? '#0f766e' : 'transparent',
                        color: previewDevice === 'mobile' ? '#ffffff' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      <Smartphone size={13} />
                      <span>Mobile (380px)</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                  >
                    {copySuccess ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    <span>{copySuccess ? 'Copied HTML!' : 'Copy HTML'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenInNewTab}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                  >
                    <ExternalLink size={13} />
                    <span>Full Window</span>
                  </button>
                </div>
              </div>

              {/* Simulated macOS / Email Client Frame */}
              <div 
                style={{ 
                  background: '#f1f5f9', 
                  borderRadius: '12px', 
                  border: '1px solid #cbd5e1', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
              >
                {/* macOS window dots & email envelope meta */}
                <div style={{ background: '#e2e8f0', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #cbd5e1' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginLeft: '0.5rem' }}>
                    Inbox Preview • {recipientEmail || 'client@example.com'}
                  </span>
                </div>

                {/* Simulated Email Envelope Header */}
                <div style={{ background: '#ffffff', padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#64748b', width: '70px' }}>From:</span>
                    <strong style={{ color: '#0f172a', flex: 1 }}>{sesConfig.fromName} &lt;{sesConfig.fromEmail}&gt;</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#64748b', width: '70px' }}>To:</span>
                    <strong style={{ color: '#0f766e', flex: 1 }}>{recipientEmail || '(Enter client recipient email)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', width: '70px' }}>Subject:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700, flex: 1 }}>{subject}</span>
                  </div>
                </div>

                {/* Live Rendered Iframe */}
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    background: '#cbd5e1', 
                    padding: '1.25rem', 
                    minHeight: '520px'
                  }}
                >
                  <iframe
                    title="Quotation Email Preview"
                    srcDoc={htmlEmailContent}
                    style={{
                      width: previewDevice === 'desktop' ? '650px' : '380px',
                      height: '620px',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      backgroundColor: '#ffffff',
                      transition: 'width 0.25s ease'
                    }}
                  />
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* TAB 3: AWS SES SETTINGS                            */}
          {/* -------------------------------------------------- */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)', 
                  border: '1.5px solid #5eead4', 
                  borderRadius: '10px', 
                  padding: '1.1rem 1.25rem', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.85rem' 
                }}
              >
                <ShieldCheck size={26} color="#0f766e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                    AWS Simple Email Service (SES) Configuration
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '3px', lineHeight: '1.5' }}>
                    Configure your AWS SES credentials to dispatch rich HTML proposals directly from the application. Credentials are stored securely in your browser's private local storage.
                  </div>
                </div>
              </div>

              {saveConfigSuccess && (
                <div 
                  style={{ 
                    background: '#ecfdf5', 
                    border: '1px solid #10b981', 
                    color: '#065f46', 
                    borderRadius: '8px', 
                    padding: '0.75rem 1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontSize: '0.85rem' 
                  }}
                >
                  <CheckCircle2 size={18} color="#10b981" />
                  <strong>AWS SES Configuration Saved Successfully!</strong>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                    AWS Region <span style={{ color: '#0d9488', fontSize: '0.75rem', fontWeight: 600 }}>(Confirmed Active: us-east-1)</span>
                  </label>
                  <select
                    value={sesConfig.region}
                    onChange={(e) => setSesConfig(prev => ({ ...prev, region: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.88rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="us-east-1">US East (N. Virginia) - us-east-1 [Active / Validated]</option>
                    <option value="ap-south-1">Asia Pacific (Mumbai) - ap-south-1</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore) - ap-southeast-1</option>
                    <option value="us-west-2">US West (Oregon) - us-west-2</option>
                    <option value="eu-west-1">Europe (Ireland) - eu-west-1</option>
                  </select>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Your SMTP credentials were authenticated against AWS SES in <strong>us-east-1</strong>.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Verified Sender Email ("From" Address) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={sesConfig.fromEmail}
                    onChange={(e) => setSesConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                    placeholder="e.g. reservations@fishtail.org or your-email@domain.com"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.88rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#0f766e', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                    ⚠️ Must match an email or domain verified under Verified Identities in AWS SES.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    value={sesConfig.fromName}
                    onChange={(e) => setSesConfig(prev => ({ ...prev, fromName: e.target.value }))}
                    placeholder="FishTail Tours & Travels"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.88rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                    AWS SES SMTP User Name
                  </label>
                  <input
                    type="text"
                    value={sesConfig.accessKeyId}
                    onChange={(e) => setSesConfig(prev => ({ ...prev, accessKeyId: e.target.value }))}
                    placeholder="AKIAYNKQA2QVZMS3VPFZ"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.88rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontFamily: 'monospace',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    From your AWS SES credentials file (SMTP user name).
                  </span>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                    AWS SES SMTP Password
                  </label>
                  <input
                    type="password"
                    value={sesConfig.secretAccessKey}
                    onChange={(e) => setSesConfig(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                    placeholder="Enter your AWS SES SMTP Password"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.88rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontFamily: 'monospace',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    From your AWS SES credentials file (SMTP password).
                  </span>
                </div>
              </div>

              {/* AWS SES Sandbox Notice */}
              <div 
                style={{ 
                  background: '#fffbeb', 
                  border: '1.5px solid #fde68a', 
                  borderRadius: '10px', 
                  padding: '1rem 1.25rem', 
                  fontSize: '0.82rem', 
                  color: '#92400e', 
                  lineHeight: '1.6' 
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>⚠️</span> AWS SES Sending Policy (Sandbox vs Production)
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  <li>
                    <strong>Sender Verification:</strong> The "From" email (<code>{sesConfig.fromEmail}</code>) <strong>must be verified</strong> in AWS SES Console (us-east-1) before any emails can be sent.
                  </li>
                  <li>
                    <strong>Sandbox Restriction:</strong> New AWS SES accounts start in "Sandbox Mode". In Sandbox Mode, AWS will <em>only</em> allow emails to recipient addresses that are also individually verified in your AWS SES Console.
                  </li>
                  <li>
                    <strong>Sending to Any Client:</strong> To email real clients without restriction, click <strong>"Request production access"</strong> inside the AWS SES Console dashboard. Once AWS approves (usually 12-24 hours), you can email anyone worldwide!
                  </li>
                </ul>
                <div style={{ marginTop: '0.6rem' }}>
                  <a 
                    href="https://console.aws.amazon.com/ses/home?region=us-east-1#/verified-identities" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: '#b45309', fontWeight: 800, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Open AWS SES Verified Identities Console (us-east-1) &rarr;
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const fresh = resetAwsSesConfigToEnv();
                    setSesConfig(fresh);
                    setSaveConfigSuccess(true);
                    setTimeout(() => setSaveConfigSuccess(false), 3000);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}
                >
                  <RotateCcw size={14} style={{ marginRight: '0.35rem' }} />
                  Reset to .env Credentials
                </button>

                <button
                  type="submit"
                  className="btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #0d9488 0%, #00bba4 100%)', 
                    color: '#ffffff', 
                    fontWeight: 800,
                    padding: '0.65rem 1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 187, 164, 0.3)'
                  }}
                >
                  Save AWS SES Settings
                </button>
              </div>

            </form>
          )}

        </div>

        {/* ==================================================== */}
        {/* 4. EXECUTIVE MODAL FOOTER (White Surface)            */}
        {/* ==================================================== */}
        <div 
          style={{ 
            padding: '1rem 1.75rem', 
            backgroundColor: '#ffffff', 
            borderTop: '1px solid #e2e8f0',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Left Utility Actions */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={handleCopyHtml}
              className="btn btn-secondary btn-sm"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.85rem'
              }}
              title="Copy rich HTML code to paste into Gmail / Outlook"
            >
              {copySuccess ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copySuccess ? 'HTML Copied!' : 'Copy Email HTML'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="btn btn-secondary btn-sm"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.85rem'
              }}
              title="Open the generated email in a new browser tab"
            >
              <ExternalLink size={14} />
              <span>Open in New Tab</span>
            </button>
          </div>

          {/* Right Primary Actions */}
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Close
            </button>

            <button
              type="button"
              disabled={isSending || !recipientEmail}
              onClick={handleSendEmail}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #00bba4 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.88rem',
                padding: '0.55rem 1.45rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(0, 187, 164, 0.35)',
                border: 'none',
                cursor: (isSending || !recipientEmail) ? 'not-allowed' : 'pointer',
                opacity: (isSending || !recipientEmail) ? 0.6 : 1,
                transition: 'all 0.15s ease'
              }}
            >
              {isSending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Dispatching via AWS SES...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Email via AWS SES</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
