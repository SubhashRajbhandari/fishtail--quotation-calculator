import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  XCircle, 
  FileText, 
  DollarSign, 
  Eye, 
  Printer, 
  Copy, 
  Trash2, 
  Calendar, 
  User, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  Tag,
  Hotel,
  Car,
  Compass,
  Award,
  Check,
  UserCheck,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuotationsHistoryTab({
  quotations = [],
  isLiveSupabase,
  onUpdateStatus,
  onDeleteQuote,
  onDelete,
  onLoadQuoteIntoWorkspace,
  onLoadIntoWorkspace,
  onCloneQuote,
  onClone,
  onPreviewQuote,
  onPreview,
  onPrintQuote,
  onPrint,
  onRefresh,
  onNavigateToNewQuote,
  onNewQuotation
}) {
  const handleDelete = onDeleteQuote || onDelete;
  const handleLoad = onLoadQuoteIntoWorkspace || onLoadIntoWorkspace;
  const handleClone = onCloneQuote || onClone;
  const handlePreview = onPreviewQuote || onPreview;
  const handlePrint = onPrintQuote || onPrint;
  const handleNewQuote = onNavigateToNewQuote || onNewQuotation;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');
  const [displayCurrency, setDisplayCurrency] = useState('NPR'); // NPR | INR | USD
  const [statusUpdateSuccessId, setStatusUpdateSuccessId] = useState(null);

  // Status definitions with colors and icons
  const STATUS_CONFIG = {
    materialized: {
      label: 'Materialized / Booked',
      badgeClass: 'badge-materialized',
      bg: '#ecfdf5',
      border: '#6ee7b7',
      color: '#047857',
      icon: CheckCircle2,
      description: 'Confirmed booking with advance received'
    },
    pending: {
      label: 'Sent / Pending',
      badgeClass: 'badge-pending',
      bg: '#eff6ff',
      border: '#93c5fd',
      color: '#1d4ed8',
      icon: Clock,
      description: 'Quotation sent to client, awaiting decision'
    },
    negotiation: {
      label: 'In Negotiation',
      badgeClass: 'badge-negotiation',
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#b45309',
      icon: MessageSquare,
      description: 'Client requested tweaks or price negotiation'
    },
    lost: {
      label: 'Lost / Cancelled',
      badgeClass: 'badge-lost',
      bg: '#fef2f2',
      border: '#fca5a5',
      color: '#b91c1c',
      icon: XCircle,
      description: 'Trip cancelled or booked elsewhere'
    },
    draft: {
      label: 'Draft / Unsent',
      badgeClass: 'badge-draft',
      bg: '#f8fafc',
      border: '#cbd5e1',
      color: '#475569',
      icon: FileText,
      description: 'Internal draft not yet sent to client'
    }
  };

  // KPI Analytics Computations
  const stats = useMemo(() => {
    const total = quotations.length;
    const materializedList = quotations.filter(q => q.status === 'materialized');
    const pendingList = quotations.filter(q => q.status === 'pending');
    const negotiationList = quotations.filter(q => q.status === 'negotiation');
    const lostList = quotations.filter(q => q.status === 'lost');
    const draftList = quotations.filter(q => q.status === 'draft');

    const totalMaterializedAmountNpr = materializedList.reduce((sum, q) => sum + (Number(q.group_grand_total_npr) || 0), 0);
    const totalPipelineAmountNpr = [...pendingList, ...negotiationList].reduce((sum, q) => sum + (Number(q.group_grand_total_npr) || 0), 0);

    const conversionRate = total > 0 ? Math.round((materializedList.length / total) * 100) : 0;

    return {
      total,
      materializedCount: materializedList.length,
      pendingCount: pendingList.length,
      negotiationCount: negotiationList.length,
      lostCount: lostList.length,
      draftCount: draftList.length,
      totalMaterializedAmountNpr,
      totalPipelineAmountNpr,
      conversionRate
    };
  }, [quotations]);

  // Handle live status toggle with celebration if materialized
  const handleStatusChange = async (quoteId, newStatus) => {
    if (onUpdateStatus) {
      await onUpdateStatus(quoteId, newStatus);
      setStatusUpdateSuccessId(quoteId);
      setTimeout(() => setStatusUpdateSuccessId(null), 2000);

      if (newStatus === 'materialized') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Filter and Sort quotes
  const filteredQuotations = useMemo(() => {
    return quotations
      .filter(q => {
        const matchesSearch = 
          (q.quote_number && q.quote_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.client_name && q.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.prepared_by && q.prepared_by.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.trip_title && q.trip_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.notes && q.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.quote_date || b.created_at || 0) - new Date(a.quote_date || a.created_at || 0);
        }
        if (sortBy === 'date_asc') {
          return new Date(a.quote_date || a.created_at || 0) - new Date(b.quote_date || b.created_at || 0);
        }
        if (sortBy === 'amount_desc') {
          return (Number(b.group_grand_total_npr) || 0) - (Number(a.group_grand_total_npr) || 0);
        }
        if (sortBy === 'amount_asc') {
          return (Number(a.group_grand_total_npr) || 0) - (Number(b.group_grand_total_npr) || 0);
        }
        if (sortBy === 'client') {
          return (a.client_name || '').localeCompare(b.client_name || '');
        }
        return 0;
      });
  }, [quotations, searchTerm, statusFilter, sortBy]);

  // Format currency helper
  const formatCurrency = (valNpr) => {
    const num = Number(valNpr) || 0;
    if (displayCurrency === 'INR') {
      return `₹${Math.round(num / 1.6).toLocaleString()}`;
    }
    if (displayCurrency === 'USD') {
      return `$${Math.round(num / 135.5).toLocaleString()}`;
    }
    return `Rs ${num.toLocaleString()}`;
  };

  return (
    <div className="quotations-history-tab" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header Banner */}
      <div className="card" style={{ border: '2px solid #0f172a', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', overflow: 'hidden' }}>
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
                QUOTATION RECORD ARCHIVE
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                background: isLiveSupabase ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isLiveSupabase ? '#34d399' : '#fbbf24',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid currentColor',
                fontWeight: 700
              }}>
                {isLiveSupabase ? '● Live Supabase Sync' : '● Local Offline Backup'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              Past Quotations & Materialized Bookings Tracker
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '0.35rem 0 0 0', maxWidth: '750px' }}>
              Browse finalized client proposals, monitor sales conversion rates, switch statuses between <strong>Materialized (Won)</strong>, <strong>Pending</strong>, or <strong>Lost</strong>, and reload any quote into your active workspace.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onRefresh}
              className="btn btn-secondary"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <RotateCcw size={15} />
              <span>Sync All</span>
            </button>

            <button
              type="button"
              onClick={handleNewQuote}
              className="btn btn-accent"
              style={{ padding: '0.6rem 1.25rem', fontWeight: 800 }}
            >
              <FileSpreadsheet size={16} />
              <span>Create New Quotation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* KPI 1: Materialized Bookings */}
        <div className="card" style={{ padding: '1.25rem', border: '2px solid #10b981', background: '#ecfdf5', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Materialized Bookings
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46', marginTop: '0.2rem', fontFamily: 'Outfit' }}>
                {stats.materializedCount} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#047857' }}>/ {stats.total} Quotes</span>
              </div>
            </div>
            <div style={{ background: '#10b981', color: '#ffffff', padding: '0.5rem', borderRadius: '10px' }}>
              <Award size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: '#065f46', fontWeight: 700 }}>Conversion Rate:</span>
            <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
              {stats.conversionRate}% Won
            </span>
          </div>
        </div>

        {/* KPI 2: Total Materialized Revenue */}
        <div className="card" style={{ padding: '1.25rem', border: '2px solid #3b82f6', background: '#eff6ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Materialized Revenue
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e3a8a', marginTop: '0.2rem', fontFamily: 'Outfit' }}>
                Rs {stats.totalMaterializedAmountNpr.toLocaleString()}
              </div>
            </div>
            <div style={{ background: '#2563eb', color: '#ffffff', padding: '0.5rem', borderRadius: '10px' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#1e40af' }}>
            ≈ ₹{Math.round(stats.totalMaterializedAmountNpr / 1.6).toLocaleString()} (INR) • ≈ ${Math.round(stats.totalMaterializedAmountNpr / 135.5).toLocaleString()} (USD)
          </div>
        </div>

        {/* KPI 3: Pipeline / Pending Deals */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #cbd5e1', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending & Negotiation
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem', fontFamily: 'Outfit' }}>
                {stats.pendingCount + stats.negotiationCount} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Active</span>
              </div>
            </div>
            <div style={{ background: '#f1f5f9', color: '#475569', padding: '0.5rem', borderRadius: '10px' }}>
              <Clock size={22} />
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#64748b' }}>
            Pipeline Value: <strong>Rs {stats.totalPipelineAmountNpr.toLocaleString()}</strong>
          </div>
        </div>

        {/* KPI 4: Status Breakdown Summary */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #cbd5e1', background: '#ffffff' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Status Breakdown
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
            <div style={{ color: '#047857' }}>
              <strong>{stats.materializedCount}</strong> Materialized
            </div>
            <div style={{ color: '#1d4ed8' }}>
              <strong>{stats.pendingCount}</strong> Pending
            </div>
            <div style={{ color: '#b45309' }}>
              <strong>{stats.negotiationCount}</strong> Negotiation
            </div>
            <div style={{ color: '#b91c1c' }}>
              <strong>{stats.lostCount}</strong> Lost / Cancelled
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search, Filter & Sort Controls */}
      <div className="card" style={{ padding: '1rem 1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by quote ref, client name, destination, or remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          </div>

          {/* Currency Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Display:</span>
            <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
              {['NPR', 'INR', 'USD'].map(curr => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setDisplayCurrency(curr)}
                  style={{
                    background: displayCurrency === curr ? '#2563eb' : '#ffffff',
                    color: displayCurrency === curr ? '#ffffff' : '#475569',
                    border: 'none',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Sort:</span>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', width: 'auto' }}
            >
              <option value="date_desc">Latest Quote Date</option>
              <option value="date_asc">Oldest Quote Date</option>
              <option value="amount_desc">Highest Grand Total</option>
              <option value="amount_asc">Lowest Grand Total</option>
              <option value="client">Client Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
          >
            All Quotes ({quotations.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('materialized')}
            className={`btn btn-sm ${statusFilter === 'materialized' ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              borderRadius: '9999px', 
              fontSize: '0.75rem',
              borderColor: '#10b981', 
              color: statusFilter === 'materialized' ? '#ffffff' : '#047857',
              background: statusFilter === 'materialized' ? '#10b981' : '#ecfdf5'
            }}
          >
            ⭐ Materialized ({stats.materializedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              borderRadius: '9999px', 
              fontSize: '0.75rem',
              borderColor: '#3b82f6', 
              color: statusFilter === 'pending' ? '#ffffff' : '#1d4ed8',
              background: statusFilter === 'pending' ? '#3b82f6' : '#eff6ff'
            }}
          >
            ⏳ Pending ({stats.pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('negotiation')}
            className={`btn btn-sm ${statusFilter === 'negotiation' ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              borderRadius: '9999px', 
              fontSize: '0.75rem',
              borderColor: '#f59e0b', 
              color: statusFilter === 'negotiation' ? '#ffffff' : '#b45309',
              background: statusFilter === 'negotiation' ? '#f59e0b' : '#fffbeb'
            }}
          >
            💬 Negotiation ({stats.negotiationCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`btn btn-sm ${statusFilter === 'draft' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
          >
            📝 Draft ({stats.draftCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('lost')}
            className={`btn btn-sm ${statusFilter === 'lost' ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              borderRadius: '9999px', 
              fontSize: '0.75rem',
              borderColor: '#ef4444', 
              color: statusFilter === 'lost' ? '#ffffff' : '#b91c1c',
              background: statusFilter === 'lost' ? '#ef4444' : '#fef2f2'
            }}
          >
            ❌ Lost ({stats.lostCount})
          </button>
        </div>
      </div>

      {/* 4. Quotations List Table / Cards */}
      {filteredQuotations.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem auto', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <Search size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            No Quotations Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
            {searchTerm 
              ? `No quotation records match your search keyword "${searchTerm}"${statusFilter !== 'ALL' ? ` under "${statusFilter}" status` : ''}.`
              : `There are currently 0 quotations categorized under the "${statusFilter}" status.`}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {(searchTerm || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                className="btn btn-secondary"
                style={{ padding: '0.55rem 1.15rem' }}
              >
                <RotateCcw size={15} />
                <span>Reset Filters & Show All</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleNewQuote}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem' }}
            >
              <Plus size={16} />
              <span>Create New Quotation</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuotations.map((quote) => {
            const statusConfig = STATUS_CONFIG[quote.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            const isMaterialized = quote.status === 'materialized';
            const totalNights = quote.total_nights || (quote.hotel_rows ? quote.hotel_rows.reduce((sum, r) => sum + (Number(r.nights) || 0), 0) : 0);
            const hotelCount = quote.hotel_rows ? quote.hotel_rows.length : 0;
            const transportCount = quote.transport_items ? quote.transport_items.length : 0;
            const itineraryCount = quote.itinerary_days ? quote.itinerary_days.length : 0;
            const pax = Math.max(1, Number(quote.pax_adults || 1));
            const perAdultRateNpr = quote.final_adult_rate_npr 
              ? Number(quote.final_adult_rate_npr) 
              : Math.round(Number(quote.group_grand_total_npr || 0) / pax);

            return (
              <div 
                key={quote.id} 
                className="card quote-record-card"
                style={{ 
                  border: isMaterialized ? '2px solid #10b981' : '1px solid var(--border-color)',
                  background: isMaterialized ? '#fafdfb' : '#ffffff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Card Top Row: Header & Status Selector */}
                <div style={{ 
                  padding: '1rem 1.25rem', 
                  borderBottom: '1px solid #f1f5f9',
                  background: isMaterialized ? '#f0fdf4' : '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  {/* Quote Number, Date, Client, and Prepared By Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <div style={{ 
                      fontFamily: 'JetBrains Mono', 
                      fontWeight: 800, 
                      fontSize: '0.95rem', 
                      color: '#0f172a',
                      background: '#ffffff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1'
                    }}>
                      {quote.quote_number}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <Calendar size={14} />
                      <span>{quote.quote_date || quote.created_at?.split('T')[0]}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <User size={14} />
                      <span>Client: <strong style={{ color: '#1e293b' }}>{quote.client_name}</strong></span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.3rem', 
                      fontSize: '0.78rem', 
                      color: '#047857', 
                      background: '#ecfdf5', 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '4px', 
                      border: '1px solid #a7f3d0' 
                    }}>
                      <UserCheck size={13} />
                      <span>Prepared By: <strong style={{ color: '#065f46' }}>{quote.prepared_by || 'FishTail Specialist'}</strong></span>
                    </div>
                  </div>

                  {/* Interactive Status Tag Switcher */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Status Tag:
                    </span>
                    <select
                      className="form-select"
                      value={quote.status || 'pending'}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: statusConfig.bg,
                        color: statusConfig.color,
                        border: `1.5px solid ${statusConfig.border}`,
                        cursor: 'pointer'
                      }}
                      title="Click to update quotation status"
                    >
                      <option value="materialized">⭐ Materialized / Won</option>
                      <option value="pending">⏳ Sent / Pending</option>
                      <option value="negotiation">💬 In Negotiation</option>
                      <option value="draft">📝 Draft</option>
                      <option value="lost">❌ Lost / Cancelled</option>
                    </select>

                    {statusUpdateSuccessId === quote.id && (
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Check size={14} /> Saved!
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Main Body */}
                <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  {/* Left Column: Tour Details & Inclusions */}
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                      {quote.trip_title}
                    </h3>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="badge-city">
                        👥 {quote.pax_adults} Adults {quote.single_rooms_count > 0 ? `• ${quote.single_rooms_count} SGL` : ''}
                      </span>
                      <span className="badge-city">
                        🌙 {totalNights} Nights / {totalNights + 1} Days
                      </span>
                      {hotelCount > 0 && (
                        <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#334155', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          🏨 {hotelCount} Hotel{hotelCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {transportCount > 0 && (
                        <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#334155', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          🚗 {transportCount} Sector{transportCount > 1 ? 's' : ''}
                        </span>
                      )}
                      {itineraryCount > 0 && (
                        <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#334155', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          🗺️ {itineraryCount}D Itinerary
                        </span>
                      )}
                    </div>

                    {/* Materialized Confirmation Note or Remarks */}
                    {isMaterialized && (
                      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '0.5rem 0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#065f46' }}>
                        <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
                        <span>
                          <strong>Materialized:</strong> Booking confirmed {quote.materialized_at ? `on ${new Date(quote.materialized_at).toLocaleDateString()}` : ''}
                        </span>
                      </div>
                    )}

                    {quote.notes && (
                      <div style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px dashed #cbd5e1', fontStyle: 'italic' }}>
                        "{quote.notes}"
                      </div>
                    )}
                  </div>

                  {/* Right Column: Pricing & Commercial Matrix */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                          Per Adult Rate (Twin):
                        </span>
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.05rem', color: '#1e40af' }}>
                          {formatCurrency(perAdultRateNpr)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px dashed #cbd5e1' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Margin / Pax:
                        </span>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#7e22ce', fontWeight: 700 }}>
                          +Rs {Number(quote.margin_per_pax || 0).toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a' }}>
                            Group Grand Total:
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            for {quote.pax_adults} Pax
                          </div>
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontSize: '1.45rem', fontWeight: 900, color: isMaterialized ? '#059669' : '#0f172a' }}>
                          {formatCurrency(quote.group_grand_total_npr)}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                      {/* Preview & Print */}
                      <button
                        type="button"
                        onClick={() => handlePreview && handlePreview(quote)}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        title="Open clean printable document preview"
                      >
                        <Eye size={13} />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrint && handlePrint(quote)}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        title="Print directly to PDF"
                      >
                        <Printer size={13} />
                        <span>Print</span>
                      </button>

                      {/* Load into Workspace */}
                      <button
                        type="button"
                        onClick={() => handleLoad && handleLoad(quote)}
                        className="btn btn-sm btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        title="Load this quotation into active Quotation Maker & Itinerary Planner to edit"
                      >
                        <RotateCcw size={13} />
                        <span>Load in Workspace</span>
                      </button>

                      {/* Clone */}
                      <button
                        type="button"
                        onClick={() => handleClone && handleClone(quote)}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        title="Clone into a new quotation with a new quote reference"
                      >
                        <Copy size={13} />
                        <span>Clone</span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete quotation "${quote.quote_number}" (${quote.client_name})?`)) {
                            if (handleDelete) handleDelete(quote.id);
                          }
                        }}
                        className="btn-danger-ghost"
                        style={{ padding: '0.3rem', marginLeft: 'auto' }}
                        title="Delete quotation"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
