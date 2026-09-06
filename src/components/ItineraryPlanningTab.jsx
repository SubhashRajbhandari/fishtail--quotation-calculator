import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Calendar, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  RotateCcw, 
  Sparkles, 
  Car, 
  Utensils, 
  Hotel, 
  CheckCircle2, 
  Printer, 
  Eye, 
  ArrowLeft, 
  Tag, 
  Clock, 
  FileText,
  Compass,
  AlertCircle,
  BookmarkPlus,
  Layers,
  Save,
  X,
  Edit3,
  BookmarkCheck,
  Mail
} from 'lucide-react';
import { MASTER_TRANSPORT_ROUTES, MASTER_ITINERARY_TEMPLATES } from '../lib/mockData';

export default function ItineraryPlanningTab({
  itineraryDays = [],
  onUpdateItineraryDays,
  transportItems = [],
  availableTransportRoutes = MASTER_TRANSPORT_ROUTES,
  availableHotels = [],
  hotelRows = [],
  availableItineraryTemplates = MASTER_ITINERARY_TEMPLATES,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  tripInfo = {},
  onNavigateToCosting,
  onPreview,
  onPrint,
  onEmailQuote,
  onSyncWithTransport,
  onFinalize
}) {
  const [saveModalDay, setSaveModalDay] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [filterCatalogRoute, setFilterCatalogRoute] = useState('ALL');

  const routes = availableTransportRoutes || MASTER_TRANSPORT_ROUTES;
  const templates = availableItineraryTemplates && availableItineraryTemplates.length > 0 
    ? availableItineraryTemplates 
    : MASTER_ITINERARY_TEMPLATES;

  // Extract unique hotels currently selected in Quotation Maker (hotelRows)
  const selectedQuotationHotels = useMemo(() => {
    const list = [];
    const seen = new Set();

    (hotelRows || []).forEach(row => {
      const matched = (availableHotels || []).find(
        h => h.id === row.hotel_id || (row.hotel_name && h.name?.toLowerCase() === row.hotel_name?.toLowerCase())
      );
      const hotelName = row.hotel_name || matched?.name;
      const city = row.city || matched?.city || '';

      if (hotelName && hotelName.trim() && hotelName !== '-- Select Hotel from Supabase --') {
        const key = `${hotelName.trim().toLowerCase()}|||${city.trim().toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          const formattedValue = city ? `${city} (${hotelName.trim()})` : hotelName.trim();
          list.push({
            id: row.hotel_id || row.id,
            name: hotelName.trim(),
            city: city.trim(),
            nights: row.nights,
            value: formattedValue,
            display: city ? `${hotelName.trim()} (${city})` : hotelName.trim()
          });
        }
      }
    });

    return list;
  }, [hotelRows, availableHotels]);

  // Helper to match current overnightStay string to available options
  const resolveOvernightValue = (currentValue) => {
    if (!currentValue) return '';
    // Exact match by value
    const match = selectedQuotationHotels.find(h => h.value === currentValue);
    if (match) return match.value;

    // Match standard status options
    const standardOptions = [
      'Flight Home / Departure',
      'Overnight Journey / In Transit',
      'No Overnight Stay / Day Tour'
    ];
    if (standardOptions.includes(currentValue)) return currentValue;

    // Loose match by hotel name
    const looseMatch = selectedQuotationHotels.find(h => {
      const curLower = currentValue.toLowerCase();
      const nameLower = h.name.toLowerCase();
      return curLower.includes(nameLower) || nameLower.includes(curLower);
    });
    if (looseMatch) return looseMatch.value;

    return currentValue;
  };

  // Meal Options
  const mealOptions = [
    'Breakfast (CP)',
    'Breakfast & Dinner (MAP)',
    'Full Board - B/L/D (AP)',
    'Room Only (EP)',
    'On Direct Payment'
  ];

  // Update a single field on a day
  const handleUpdateDay = (dayId, field, value) => {
    const updated = itineraryDays.map(day => {
      if (day.id === dayId) {
        return { ...day, [field]: value };
      }
      return day;
    });
    onUpdateItineraryDays(updated);
  };

  // Add a new custom day
  const handleAddDay = () => {
    const nextDayNum = itineraryDays.length + 1;
    const defaultHotel = selectedQuotationHotels[0]?.value || 'Flight Home / Departure';
    const newDay = {
      id: 'day-custom-' + Date.now(),
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum}: Sightseeing & Leisure`,
      transportRouteId: '',
      transportRouteName: 'Custom Sector / Free Exploration',
      description: 'Morning breakfast at hotel. Spend the day exploring local cultural sights, markets, and scenic viewpoints at your own leisure.',
      highlights: ['Sightseeing', 'Leisure & Photography'],
      meals: 'Breakfast (CP)',
      overnightStay: defaultHotel,
      city: 'Kathmandu'
    };
    onUpdateItineraryDays([...itineraryDays, newDay]);
  };

  // Delete a day
  const handleDeleteDay = (dayId) => {
    const filtered = itineraryDays.filter(d => d.id !== dayId);
    const reindexed = filtered.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    onUpdateItineraryDays(reindexed);
  };

  // Duplicate a day
  const handleDuplicateDay = (dayId) => {
    const target = itineraryDays.find(d => d.id === dayId);
    if (!target) return;
    const newDay = {
      ...target,
      id: 'day-' + Date.now(),
      title: `${target.title} (Extended)`
    };
    const targetIndex = itineraryDays.findIndex(d => d.id === dayId);
    const updated = [...itineraryDays];
    updated.splice(targetIndex + 1, 0, newDay);
    const reindexed = updated.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    onUpdateItineraryDays(reindexed);
  };

  // Move day up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...itineraryDays];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    onUpdateItineraryDays(reindexed);
  };

  // Move day down
  const handleMoveDown = (index) => {
    if (index === itineraryDays.length - 1) return;
    const updated = [...itineraryDays];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    const reindexed = updated.map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    onUpdateItineraryDays(reindexed);
  };

  // Get all templates matching a route
  const getTemplatesForRoute = (routeId, routeName) => {
    return templates.filter(t => 
      (t.route_identifier && t.route_identifier === routeId) ||
      (t.route_id && t.route_id === routeId) ||
      (t.route_name && (t.route_name === routeName || t.route_name.toLowerCase().includes(routeName?.toLowerCase())))
    );
  };

  // Apply a specific template preset to a day
  const handleApplyTemplatePreset = (dayId, templateId) => {
    const matchedTemplate = templates.find(t => t.id === templateId);
    if (!matchedTemplate) return;

    const updated = itineraryDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          selectedTemplateId: matchedTemplate.id,
          title: matchedTemplate.title,
          description: matchedTemplate.description,
          highlights: matchedTemplate.highlights || [],
          meals: matchedTemplate.meals || day.meals || 'Breakfast (CP)',
          city: matchedTemplate.city || day.city || 'Kathmandu'
        };
      }
      return day;
    });
    onUpdateItineraryDays(updated);
  };

  // Route selector change
  const handleRouteChange = (dayId, routeId) => {
    const matchedRoute = routes.find(r => r.id === routeId);
    if (!matchedRoute) return;

    const routeTemplates = getTemplatesForRoute(matchedRoute.id, matchedRoute.name);
    const defaultTemplate = routeTemplates.find(t => t.is_default) || routeTemplates[0];

    const updated = itineraryDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          transportRouteId: matchedRoute.id,
          transportRouteName: matchedRoute.name,
          selectedTemplateId: defaultTemplate ? defaultTemplate.id : '',
          title: defaultTemplate?.title || matchedRoute.default_itinerary_title || matchedRoute.name,
          description: defaultTemplate?.description || matchedRoute.default_itinerary_desc || day.description,
          highlights: defaultTemplate?.highlights || matchedRoute.default_highlights || [matchedRoute.name],
          meals: defaultTemplate?.meals || matchedRoute.default_meals || day.meals,
          city: defaultTemplate?.city || matchedRoute.default_city || 'Kathmandu'
        };
      }
      return day;
    });
    onUpdateItineraryDays(updated);
  };

  // Save current day customized text as new reusable template in database
  const handleSaveDayAsNewTemplate = async (e) => {
    e.preventDefault();
    if (!saveModalDay || !newTemplateName.trim()) return;

    const payload = {
      route_identifier: saveModalDay.transportRouteId || 'custom',
      route_name: saveModalDay.transportRouteName || 'Custom Route',
      template_name: newTemplateName.trim(),
      title: saveModalDay.title,
      description: saveModalDay.description,
      highlights: saveModalDay.highlights || [],
      meals: saveModalDay.meals || 'Breakfast (CP)',
      city: saveModalDay.city || 'Kathmandu',
      is_default: false
    };

    if (onCreateTemplate) {
      await onCreateTemplate(payload);
    }
    setSaveModalDay(null);
    setNewTemplateName('');
  };

  // Add highlight tag to day
  const handleAddHighlight = (dayId, tagText) => {
    if (!tagText.trim()) return;
    const updated = itineraryDays.map(day => {
      if (day.id === dayId) {
        const currentHighlights = day.highlights || [];
        if (!currentHighlights.includes(tagText.trim())) {
          return { ...day, highlights: [...currentHighlights, tagText.trim()] };
        }
      }
      return day;
    });
    onUpdateItineraryDays(updated);
  };

  // Remove highlight tag
  const handleRemoveHighlight = (dayId, tagIndex) => {
    const updated = itineraryDays.map(day => {
      if (day.id === dayId) {
        const currentHighlights = [...(day.highlights || [])];
        currentHighlights.splice(tagIndex, 1);
        return { ...day, highlights: currentHighlights };
      }
      return day;
    });
    onUpdateItineraryDays(updated);
  };

  return (
    <div className="itinerary-planning-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Navigation Breadcrumb */}
      <div className="card" style={{ border: '2px solid #0f172a', background: '#0f172a', color: '#ffffff', overflow: 'hidden' }}>
        <div className="card-body" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ 
                background: 'var(--gold-gradient)', 
                color: '#000', 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px', 
                letterSpacing: '0.05em' 
              }}>
                STEP 2 OF 2
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Ref: {tripInfo?.quoteNumber} • {tripInfo?.paxAdults || 2} Adults
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              Tour Itinerary Planning & Day-Wise Narrative
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '0.35rem 0 0 0', maxWidth: '750px' }}>
              Select from pre-defined sightseeing schedules from the database or customize and save new templates for your team to reuse.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onNavigateToCosting}
              className="btn btn-secondary"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Costing</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="btn btn-secondary"
              title="Manage and browse all saved itinerary templates in the database"
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid #fbbf24' }}
            >
              <Layers size={15} />
              <span>Templates Library ({templates.length})</span>
            </button>

            <button
              type="button"
              onClick={onSyncWithTransport}
              className="btn btn-secondary"
              title="Regenerate/sync all days based on active transportation package sectors"
              style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid #38bdf8' }}
            >
              <RefreshCw size={15} />
              <span>Sync with Transport ({transportItems.length})</span>
            </button>

            {onFinalize && (
              <button
                type="button"
                onClick={onFinalize}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', border: '1px solid #10b981' }}
                title="Finalize quote and save to past quotation records with status tag"
              >
                <BookmarkCheck size={16} />
                <span>Finalize Quote</span>
              </button>
            )}

            <button
              type="button"
              onClick={onPreview}
              className="btn btn-secondary"
            >
              <Eye size={16} />
              <span>Preview Quote</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="btn btn-accent"
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>

            {onEmailQuote && (
              <button
                type="button"
                onClick={onEmailQuote}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #00bba4 100%)',
                  color: '#ffffff',
                  border: '1px solid #00bba4',
                  fontWeight: 700
                }}
                title="Email executive quotation & itinerary to client"
              >
                <Mail size={16} />
                <span>Email Quote</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div style={{ 
          background: '#1e293b', 
          padding: '0.75rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Total Days: </span>
              <strong style={{ color: '#facc15', fontFamily: 'JetBrains Mono', fontSize: '0.95rem' }}>{itineraryDays.length} Days</strong>
            </div>
            <div style={{ color: '#475569' }}>|</div>
            <div>
              <span style={{ color: '#94a3b8' }}>Transport Sectors: </span>
              <strong style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono' }}>{transportItems.length} Allocated</strong>
            </div>
            <div style={{ color: '#475569' }}>|</div>
            <div>
              <span style={{ color: '#94a3b8' }}>Tour Title: </span>
              <strong style={{ color: '#ffffff' }}>{tripInfo?.tripTitle}</strong>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddDay}
              className="btn btn-sm btn-primary"
              style={{ fontSize: '0.8rem' }}
            >
              <Plus size={14} />
              <span>Add Custom Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Days List */}
      {itineraryDays.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', border: '2px dashed var(--border-color)' }}>
          <Compass size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>No Itinerary Days Defined Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem auto' }}>
            Click below to automatically generate a day-by-day tour schedule pre-filled with rich descriptions corresponding to your {transportItems.length} transportation sectors.
          </p>
          <button
            type="button"
            onClick={onSyncWithTransport}
            className="btn btn-primary"
            style={{ margin: '0 auto' }}
          >
            <Sparkles size={16} />
            <span>Generate Itinerary from Transport Package</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {itineraryDays.map((day, index) => {
            const routeTemplates = getTemplatesForRoute(day.transportRouteId, day.transportRouteName);

            return (
              <div 
                key={day.id} 
                className="card itinerary-day-card" 
                style={{ 
                  border: '1px solid var(--border-color)', 
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Day Header Row */}
                <div 
                  style={{ 
                    background: '#f8fafc', 
                    padding: '0.85rem 1.25rem', 
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Day Number Pill */}
                    <div style={{ 
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                      color: '#ffffff', 
                      fontWeight: 800, 
                      fontSize: '0.82rem', 
                      padding: '0.3rem 0.75rem', 
                      borderRadius: 'var(--radius-sm)',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <Calendar size={13} style={{ color: '#facc15' }} />
                      <span>DAY {String(day.dayNumber).padStart(2, '0')}</span>
                    </div>

                    {/* Sector Link Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Car size={15} style={{ color: '#2563eb' }} />
                      <select
                        className="form-select"
                        value={day.transportRouteId || ''}
                        onChange={(e) => handleRouteChange(day.id, e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '0.25rem 0.6rem', fontWeight: 600, color: '#1e40af', background: '#eff6ff', border: '1px solid #bfdbfe' }}
                      >
                        <option value="">-- Custom / No Linked Sector --</option>
                        {routes.map(r => (
                          <option key={r.id} value={r.id}>
                            🚗 {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Multi-Variant Itinerary Preset Dropdown */}
                    {routeTemplates.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fffbeb', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}>
                        <Sparkles size={13} style={{ color: '#d97706' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>Preset Plan:</span>
                        <select
                          className="form-select"
                          value={day.selectedTemplateId || ''}
                          onChange={(e) => handleApplyTemplatePreset(day.id, e.target.value)}
                          style={{ fontSize: '0.78rem', padding: '0.15rem 0.4rem', fontWeight: 700, color: '#b45309', background: '#ffffff', border: '1px solid #fcd34d' }}
                        >
                          <option value="">-- Choose Pre-Defined Variant ({routeTemplates.length} Options) --</option>
                          {routeTemplates.map(tpl => (
                            <option key={tpl.id} value={tpl.id}>
                              ✨ {tpl.template_name} {tpl.is_default ? '(Default)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Day Actions & Save Preset Trigger */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {/* Save customized day text as new template */}
                    <button
                      type="button"
                      onClick={() => {
                        setSaveModalDay(day);
                        setNewTemplateName(`${day.transportRouteName || 'Custom'} - Variant ${routeTemplates.length + 1}`);
                      }}
                      className="btn btn-sm btn-secondary"
                      title="Save this day's customized narrative as a reusable preset template in the database"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0' }}
                    >
                      <BookmarkPlus size={13} />
                      <span>Save as Preset</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="btn-icon btn-sm"
                      title="Move Day Up"
                      style={{ opacity: index === 0 ? 0.3 : 1, padding: '0.3rem' }}
                    >
                      <ArrowUp size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === itineraryDays.length - 1}
                      className="btn-icon btn-sm"
                      title="Move Day Down"
                      style={{ opacity: index === itineraryDays.length - 1 ? 0.3 : 1, padding: '0.3rem' }}
                    >
                      <ArrowDown size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicateDay(day.id)}
                      className="btn-icon btn-sm"
                      title="Duplicate Day"
                      style={{ padding: '0.3rem' }}
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDay(day.id)}
                      className="btn-icon btn-sm btn-danger-hover"
                      title="Delete Day"
                      style={{ padding: '0.3rem', color: '#ef4444' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Day Content Form */}
                <div style={{ padding: '1.25rem' }}>
                  {/* Title Input */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Day Headline / Activity Title:
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={day.title || ''}
                      onChange={(e) => handleUpdateDay(day.id, 'title', e.target.value)}
                      placeholder="e.g. Kathmandu Valley UNESCO Cultural Exploration"
                      style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)' }}
                    />
                  </div>

                  {/* Narrative / Description Input */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Detailed Day Schedule & Sightseeing Narrative:
                      </label>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        💡 Pick a preset variant above to auto-fill or tweak text directly
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      className="form-textarea"
                      value={day.description || ''}
                      onChange={(e) => handleUpdateDay(day.id, 'description', e.target.value)}
                      placeholder="Describe the day's itinerary, stops, scenic viewpoints, lunch spots, and leisure activities..."
                      style={{ fontSize: '0.88rem', lineHeight: '1.6' }}
                    />
                  </div>

                  {/* Highlights Tags */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Key Highlights & Landmarks:
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                      {(day.highlights || []).map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          style={{ 
                            background: '#f1f5f9', 
                            color: '#334155', 
                            fontSize: '0.78rem', 
                            fontWeight: 600, 
                            padding: '0.2rem 0.55rem', 
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Tag size={11} style={{ color: '#0284c7' }} />
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(day.id, tIdx)}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', padding: 0, lineHeight: 1 }}
                            title="Remove tag"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Add Tag Inline */}
                      <input
                        type="text"
                        placeholder="+ Add landmark tag (Press Enter)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddHighlight(day.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{ 
                          fontSize: '0.78rem', 
                          padding: '0.2rem 0.5rem', 
                          border: '1px dashed var(--border-color)', 
                          borderRadius: '4px',
                          outline: 'none',
                          background: '#ffffff',
                          minWidth: '180px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Metadata Row: Meals Included & Overnight Accommodation */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    {/* Meals Included */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                        <Utensils size={13} style={{ color: '#ea580c' }} />
                        <span>Meals Included:</span>
                      </label>
                      <select
                        className="form-select"
                        value={day.meals || 'Breakfast (CP)'}
                        onChange={(e) => handleUpdateDay(day.id, 'meals', e.target.value)}
                        style={{ fontSize: '0.85rem', background: '#ffffff' }}
                      >
                        {mealOptions.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Overnight Stay */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                          <Hotel size={13} style={{ color: '#0284c7' }} />
                          <span>Overnight Stay / Hotel:</span>
                        </label>
                        {selectedQuotationHotels.length > 0 ? (
                          <span style={{ fontSize: '0.68rem', color: '#0284c7', background: '#e0f2fe', padding: '0.05rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                            {selectedQuotationHotels.length} Quote Hotel{selectedQuotationHotels.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', color: '#dc2626', background: '#fee2e2', padding: '0.05rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                            No hotels in quote
                          </span>
                        )}
                      </div>

                      <select
                        className="form-select"
                        value={resolveOvernightValue(day.overnightStay || '')}
                        onChange={(e) => handleUpdateDay(day.id, 'overnightStay', e.target.value)}
                        style={{ fontSize: '0.85rem', background: '#ffffff', fontWeight: 600, color: '#0f172a' }}
                      >
                        <option value="">-- Select Overnight Stay / Hotel --</option>
                        
                        {selectedQuotationHotels.length > 0 && (
                          <optgroup label={`Hotels Selected in Quotation Maker (${selectedQuotationHotels.length})`}>
                            {selectedQuotationHotels.map((h, hIdx) => (
                              <option key={'q-hotel-' + hIdx} value={h.value}>
                                🏨 {h.city ? `${h.city}: ` : ''}{h.name}{h.nights ? ` (${h.nights} nt${h.nights > 1 ? 's' : ''})` : ''}
                              </option>
                            ))}
                          </optgroup>
                        )}

                        <optgroup label="Standard Travel & Departure Options">
                          <option value="Flight Home / Departure">✈️ Flight Home / Departure</option>
                          <option value="Overnight Journey / In Transit">🚌 Overnight Journey / In Transit</option>
                          <option value="No Overnight Stay / Day Tour">☀️ No Overnight Stay / Day Tour</option>
                        </optgroup>

                        {/* Preserve existing custom value if not present in options */}
                        {day.overnightStay && 
                          !selectedQuotationHotels.some(h => h.value === day.overnightStay || resolveOvernightValue(day.overnightStay) === h.value) &&
                          !['Flight Home / Departure', 'Overnight Journey / In Transit', 'No Overnight Stay / Day Tour', ''].includes(day.overnightStay) && (
                            <optgroup label="Custom / Previously Saved">
                              <option value={day.overnightStay}>📌 {day.overnightStay}</option>
                            </optgroup>
                        )}
                      </select>

                      {selectedQuotationHotels.length === 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#b91c1c', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>⚠️ No hotels added in Quotation Maker.</span>
                          <button
                            type="button"
                            onClick={onNavigateToCosting}
                            style={{ background: 'none', border: 'none', color: '#0284c7', textDecoration: 'underline', padding: 0, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}
                          >
                            Select hotels in Quotation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Day Button at bottom */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
            <button
              type="button"
              onClick={handleAddDay}
              className="btn btn-secondary"
              style={{ border: '2px dashed var(--border-color)', padding: '0.75rem 2rem', fontSize: '0.9rem', color: 'var(--primary)' }}
            >
              <Plus size={18} />
              <span>Add Another Itinerary Day</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Card */}
      <div className="card" style={{ border: '2px solid #0f172a', background: '#0f172a', color: '#ffffff', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#facc15' }}>
              Itinerary Ready for Client Quotation Proposal
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Your {itineraryDays.length}-Day itinerary is seamlessly bundled with the financial costing matrix in the PDF proposal.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onNavigateToCosting}
              className="btn btn-secondary"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
            >
              <ArrowLeft size={16} />
              <span>Review Costing</span>
            </button>

            <button
              type="button"
              onClick={onPreview}
              className="btn btn-secondary"
            >
              <Eye size={16} />
              <span>Preview Proposal</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="btn btn-accent"
              style={{ padding: '0.6rem 1.5rem', fontWeight: 800 }}
            >
              <Printer size={18} />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Save Custom Day as Reusable Template in Database */}
      {saveModalDay && (
        <div className="modal-backdrop no-print" onClick={() => setSaveModalDay(null)}>
          <div 
            className="modal-dialog" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '600px', width: '90vw' }}
          >
            <div className="modal-header" style={{ background: '#0f172a', color: '#ffffff', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookmarkPlus size={18} style={{ color: '#facc15' }} />
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Save Narrative as Reusable Template</div>
              </div>
              <button 
                type="button" 
                onClick={() => setSaveModalDay(null)} 
                className="btn-icon" 
                style={{ color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDayAsNewTemplate} style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                Save this day's narrative into the template library for <strong>{saveModalDay.transportRouteName || 'this sector'}</strong> so any team member can pick it with 1 click.
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Template Variant Name:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Option 2: Cultural Monasteries & Peace Pagoda"
                  required
                  style={{ fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Headline / Title:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={saveModalDay.title}
                  readOnly
                  style={{ background: '#f8fafc', color: '#334155' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Narrative Preview:
                </label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={saveModalDay.description}
                  readOnly
                  style={{ background: '#f8fafc', color: '#334155', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSaveModalDay(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Save size={15} />
                  <span>Save to Database Library</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Templates Library Catalog Manager */}
      {isCatalogOpen && (
        <div className="modal-backdrop no-print" onClick={() => setIsCatalogOpen(false)}>
          <div 
            className="modal-dialog" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '850px', width: '92vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
          >
            <div className="modal-header" style={{ background: '#0f172a', color: '#ffffff', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: '#facc15' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Itinerary Templates Catalog</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {templates.length} Pre-defined day schedule variants saved in database
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCatalogOpen(false)} 
                className="btn-icon" 
                style={{ color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{ padding: '0.85rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Filter by Transport Sector:</span>
              <select
                className="form-select"
                value={filterCatalogRoute}
                onChange={(e) => setFilterCatalogRoute(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '0.25rem 0.6rem', maxWidth: '350px' }}
              >
                <option value="ALL">-- All Transport Routes ({templates.length} Templates) --</option>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Catalog List */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {templates
                .filter(t => filterCatalogRoute === 'ALL' || t.route_identifier === filterCatalogRoute || t.route_id === filterCatalogRoute)
                .map((tpl) => (
                  <div 
                    key={tpl.id} 
                    style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '1rem', 
                      background: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                            🚗 {tpl.route_name}
                          </span>
                          <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{tpl.template_name}</strong>
                          {tpl.is_default && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              Default
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginTop: '0.2rem' }}>
                          {tpl.title}
                        </div>
                      </div>

                      {onDeleteTemplate && (
                        <button
                          type="button"
                          onClick={() => onDeleteTemplate(tpl.id)}
                          className="btn-icon btn-sm"
                          title="Delete Template"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.5', margin: '0.4rem 0 0.5rem 0' }}>
                      {tpl.description}
                    </p>

                    {tpl.highlights && tpl.highlights.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                        {tpl.highlights.map((h, hIdx) => (
                          <span key={hIdx} style={{ fontSize: '0.7rem', color: '#334155', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '0.85rem 1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setIsCatalogOpen(false)} 
                className="btn btn-secondary btn-sm"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
