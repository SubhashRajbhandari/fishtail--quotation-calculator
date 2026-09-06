import React from 'react';
import { 
  Building2, 
  Database, 
  Printer, 
  Compass, 
  Settings, 
  RefreshCw, 
  FileSpreadsheet, 
  Layers, 
  Sparkles, 
  Eye, 
  Car,
  MapPin,
  Calendar,
  BookmarkCheck,
  Plus,
  Mail
} from 'lucide-react';

export default function Navbar({
  activeTab,
  onTabChange,
  isLiveSupabase,
  onOpenSupabaseConfig,
  onPreview,
  onPrint,
  onEmailQuote,
  onFinalizeQuote,
  onNewQuotation,
  isRefreshing,
  onRefresh,
  hotelCount = 0,
  transportRouteCount = 0,
  itineraryCount = 0,
  quotationCount = 0,
  materializedCount = 0
}) {
  return (
    <header className="navbar no-print">
      <div className="navbar-inner">
        {/* 1. Left Brand Identity */}
        <div 
          className="brand-logo" 
          onClick={() => onTabChange('quotation')} 
          title="FishTail Travels - Quotation Maker"
        >
          <div className="brand-icon-wrap">
            <Compass size={20} />
          </div>
          <div className="brand-text">
            <h1>FishTail Travels</h1>
            <span>Quotation & Tariff Engine</span>
          </div>
        </div>

        {/* 2. Center Segmented Navigation Tab Bar */}
        <nav className="nav-tab-container" aria-label="Main Navigation">
          <button
            type="button"
            onClick={() => onTabChange('quotation')}
            className={`nav-tab-btn ${activeTab === 'quotation' ? 'active' : ''}`}
            title="Quotation Costing Engine"
          >
            <FileSpreadsheet size={15} />
            <span>Quotation Maker</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('itinerary')}
            className={`nav-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            title="Tour Itinerary Planning & Day-wise Narrative"
          >
            <MapPin size={15} />
            <span>Itinerary</span>
            <span 
              className="nav-badge"
              style={{ 
                background: activeTab === 'itinerary' ? '#ffffff' : '#f59e0b', 
                color: activeTab === 'itinerary' ? '#b45309' : '#000000'
              }}
            >
              {itineraryCount}D
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            title={`${quotationCount} Total Saved Quotes (${materializedCount} Won deals)`}
          >
            <BookmarkCheck size={15} />
            <span>Past Quotes</span>
            <span 
              className="nav-badge"
              style={{ 
                background: activeTab === 'history' ? '#ffffff' : '#10b981', 
                color: activeTab === 'history' ? '#065f46' : '#ffffff'
              }}
            >
              {quotationCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('rates')}
            className={`nav-tab-btn ${activeTab === 'rates' ? 'active' : ''}`}
            title="Hotel Master Tariffs & Seasonality"
          >
            <Layers size={15} />
            <span>Hotels</span>
            <span 
              className="nav-badge"
              style={{ 
                background: activeTab === 'rates' ? '#ffffff' : '#3b82f6', 
                color: activeTab === 'rates' ? '#1d4ed8' : '#ffffff'
              }}
            >
              {hotelCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('transportRates')}
            className={`nav-tab-btn ${activeTab === 'transportRates' ? 'active' : ''}`}
            title="Vehicle Fleet & Sector Tariffs"
          >
            <Car size={15} />
            <span>Fleet</span>
            <span 
              className="nav-badge"
              style={{ 
                background: activeTab === 'transportRates' ? '#ffffff' : '#3b82f6', 
                color: activeTab === 'transportRates' ? '#1d4ed8' : '#ffffff'
              }}
            >
              {transportRouteCount}
            </span>
          </button>
        </nav>

        {/* 3. Right Action Controls & Status */}
        <div className="nav-actions">
          {/* Contextual primary actions for active tab */}
          {(activeTab === 'quotation' || activeTab === 'itinerary') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {onFinalizeQuote && (
                <button 
                  type="button" 
                  onClick={onFinalizeQuote} 
                  className="btn btn-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
                    color: '#ffffff',
                    border: '1px solid #10b981',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}
                  title="Finalize quote and save to past quotation records with status tag"
                >
                  <BookmarkCheck size={14} />
                  <span>Finalize</span>
                </button>
              )}

              <button 
                type="button" 
                onClick={onPreview} 
                className="btn btn-secondary btn-sm"
                title="Preview clean quotation sheet before printing"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Eye size={14} />
                <span>Preview</span>
              </button>

              <button 
                type="button" 
                onClick={onPrint} 
                className="btn btn-accent btn-sm"
                title="Print or export quotation directly to PDF"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Printer size={14} />
                <span>Print</span>
              </button>

              {onEmailQuote && (
                <button 
                  type="button" 
                  onClick={onEmailQuote} 
                  className="btn btn-sm"
                  title="Email executive quotation & itinerary to client via AWS SES"
                  style={{ 
                    background: 'linear-gradient(135deg, #0d9488 0%, #00bba4 100%)',
                    color: '#ffffff',
                    border: '1px solid #00bba4',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Mail size={14} />
                  <span>Email</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <button 
              type="button" 
              onClick={() => {
                if (onNewQuotation) onNewQuotation();
                else onTabChange('quotation');
              }} 
              className="btn btn-primary btn-sm"
              title="Create a new quotation from scratch"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Plus size={14} />
              <span>New Quote</span>
            </button>
          )}

          {/* Vertical divider */}
          <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 0.15rem' }} />

          {/* Supabase status badge */}
          <button 
            type="button" 
            onClick={onOpenSupabaseConfig}
            className={`status-pill ${isLiveSupabase ? 'live' : 'demo'}`}
            title="Click to configure Supabase Connection"
            style={{ cursor: 'pointer' }}
          >
            <span className="pulse-dot"></span>
            <span>{isLiveSupabase ? 'Supabase' : 'Demo'}</span>
            <Database size={12} style={{ marginLeft: 2 }} />
          </button>

          {/* Refresh rates & quotes button */}
          <button 
            type="button" 
            onClick={onRefresh} 
            className="btn btn-secondary btn-sm"
            title="Sync latest rates & quotations from Supabase"
            disabled={isRefreshing}
            style={{ padding: '0.4rem 0.65rem' }}
          >
            <RefreshCw size={13} className={isRefreshing ? 'spin' : ''} />
            <span>Sync</span>
          </button>

          {/* Supabase Config */}
          <button 
            type="button" 
            onClick={onOpenSupabaseConfig} 
            className="btn btn-secondary btn-sm"
            title="Open Supabase Configuration Settings"
            style={{ padding: '0.4rem 0.65rem' }}
          >
            <Settings size={13} />
            <span>Setup</span>
          </button>
        </div>
      </div>
    </header>
  );
}
