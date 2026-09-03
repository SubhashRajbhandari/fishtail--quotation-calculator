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
  Calendar
} from 'lucide-react';

export default function Navbar({
  activeTab,
  onTabChange,
  isLiveSupabase,
  onOpenSupabaseConfig,
  onPreview,
  onPrint,
  isRefreshing,
  onRefresh,
  hotelCount,
  transportRouteCount = 10,
  itineraryCount = 6
}) {
  return (
    <header className="navbar no-print">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-logo">
          <div className="brand-icon-wrap">
            <Compass size={24} />
          </div>
          <div className="brand-text">
            <h1>FishTail Travels</h1>
            <span>Quotation Maker & Multi-Currency Tariff Manager</span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={() => onTabChange('quotation')}
            className={`btn btn-sm ${activeTab === 'quotation' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <FileSpreadsheet size={15} />
            <span>Quotation Maker</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('itinerary')}
            className={`btn btn-sm ${activeTab === 'itinerary' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', position: 'relative' }}
          >
            <MapPin size={15} />
            <span>Itinerary Planner</span>
            <span style={{ 
              fontSize: '0.65rem', 
              background: activeTab === 'itinerary' ? '#ffffff' : '#f59e0b', 
              color: activeTab === 'itinerary' ? '#b45309' : '#000000',
              fontWeight: 800, 
              padding: '0.1rem 0.35rem', 
              borderRadius: '9999px',
              marginLeft: '0.35rem' 
            }}>
              {itineraryCount}D
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('rates')}
            className={`btn btn-sm ${activeTab === 'rates' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', position: 'relative' }}
          >
            <Layers size={15} />
            <span>Hotel Rates</span>
            <span style={{ 
              fontSize: '0.65rem', 
              background: activeTab === 'rates' ? '#ffffff' : '#3b82f6', 
              color: activeTab === 'rates' ? '#1d4ed8' : '#ffffff',
              fontWeight: 800,
              padding: '0.1rem 0.35rem', 
              borderRadius: '9999px',
              marginLeft: '0.35rem' 
            }}>
              {hotelCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('transportRates')}
            className={`btn btn-sm ${activeTab === 'transportRates' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', position: 'relative' }}
          >
            <Car size={15} />
            <span>Transport Fleet</span>
            <span style={{ 
              fontSize: '0.65rem', 
              background: activeTab === 'transportRates' ? '#ffffff' : '#3b82f6', 
              color: activeTab === 'transportRates' ? '#1d4ed8' : '#ffffff',
              fontWeight: 800,
              padding: '0.1rem 0.35rem', 
              borderRadius: '9999px',
              marginLeft: '0.35rem' 
            }}>
              {transportRouteCount}
            </span>
          </button>
        </div>

        {/* Action Controls & DB Status */}
        <div className="nav-actions">
          {/* Supabase status badge */}
          <button 
            type="button" 
            onClick={onOpenSupabaseConfig}
            className={`status-pill ${isLiveSupabase ? 'live' : 'demo'}`}
            title="Click to configure Supabase Connection"
            style={{ cursor: 'pointer', background: isLiveSupabase ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', border: '1px solid currentColor' }}
          >
            <span className="pulse-dot"></span>
            <span>{isLiveSupabase ? 'Supabase Live' : 'Demo / Local Mode'}</span>
            <Database size={13} style={{ marginLeft: 4 }} />
          </button>

          {/* Refresh rates button */}
          <button 
            type="button" 
            onClick={onRefresh} 
            className="btn btn-secondary btn-sm"
            title="Sync latest rates from Supabase"
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
            <span>Sync</span>
          </button>

          {/* Supabase Config */}
          <button 
            type="button" 
            onClick={onOpenSupabaseConfig} 
            className="btn btn-secondary btn-sm"
          >
            <Settings size={14} />
            <span>Supabase Setup</span>
          </button>

          {/* Preview & Print / Export Buttons */}
          {(activeTab === 'quotation' || activeTab === 'itinerary') && (
            <>
              <button 
                type="button" 
                onClick={onPreview} 
                className="btn btn-secondary btn-sm"
                title="Preview clean quotation sheet before printing"
              >
                <Eye size={14} />
                <span>Preview Quote</span>
              </button>

              <button 
                type="button" 
                onClick={onPrint} 
                className="btn btn-accent btn-sm"
                title="Print or export quotation directly to PDF"
              >
                <Printer size={14} />
                <span>Print Quote</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
