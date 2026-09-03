import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  FileCode2,
  Layers,
  Car,
  Hotel,
  ShieldCheck
} from 'lucide-react';
import { getStoredConfig, saveStoredConfig, testConnection, seedAllSupabaseData } from '../lib/supabase';

export default function SupabaseConfigModal({
  isOpen,
  onClose,
  onConfigSaved
}) {
  if (!isOpen) return null;

  const currentConfig = getStoredConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [key, setKey] = useState(currentConfig.key || '');
  const [status, setStatus] = useState({ type: null, message: '', tables: null });
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setStatus({ type: 'error', message: 'Please enter both Supabase URL and Anon Key', tables: null });
      return;
    }

    setTesting(true);
    setStatus({ type: null, message: '', tables: null });

    const result = await testConnection(url.trim(), key.trim());
    setTesting(false);

    if (result.success && !result.partial) {
      saveStoredConfig(url.trim(), key.trim());
      setStatus({ 
        type: 'success', 
        message: 'Connected to Supabase! All tables (hotels, transport_routes, itinerary_templates) are live.',
        tables: result.tables 
      });
      onConfigSaved(true);
    } else if (result.partial) {
      saveStoredConfig(url.trim(), key.trim());
      setStatus({ 
        type: 'warning', 
        message: result.message,
        tables: result.tables 
      });
      onConfigSaved(true);
    } else {
      saveStoredConfig(url.trim(), key.trim());
      setStatus({ 
        type: 'warning', 
        message: `Saved config, but table check returned: ${result.message}. (Did you execute the SQL script in your Supabase SQL Editor?)`,
        tables: result.tables 
      });
      onConfigSaved(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      await seedAllSupabaseData();
      setStatus({ 
        type: 'success', 
        message: 'Successfully seeded Master Hotels, Transportation Routes, and Multi-Variant Itinerary Templates to Supabase!',
        tables: { hotels: true, transport_routes: true, itinerary_templates: true }
      });
      onConfigSaved(true);
    } catch (err) {
      setStatus({ type: 'error', message: `Seeding error: ${err.message}`, tables: null });
    } finally {
      setSeeding(false);
    }
  };

  const handleClearToDemo = () => {
    saveStoredConfig('', '');
    setUrl('');
    setKey('');
    setStatus({ type: 'info', message: 'Switched back to Local / Demo Storage mode.', tables: null });
    onConfigSaved(false);
  };

  const handleCopySql = () => {
    const fullSql = `-- FishTail Quotation Calculator Complete Schema
-- Copy all text below and run in Supabase SQL Editor (supabase.com -> SQL Editor):

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Hotels Table
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Kathmandu',
    category TEXT NOT NULL DEFAULT 'Premier',
    meal_plan TEXT DEFAULT 'CP',
    star_rating INT DEFAULT 3,
    half_twin_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    single_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    half_twin_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    single_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    half_twin_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    single_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_half_twin_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_single_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_half_twin_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_single_npr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_half_twin_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    base_single_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    season_note TEXT DEFAULT 'Standard Tariff',
    is_custom_rate BOOLEAN DEFAULT FALSE,
    notes TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Transport Routes Table
CREATE TABLE IF NOT EXISTS public.transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Kathmandu',
    notes TEXT DEFAULT '',
    season_note TEXT DEFAULT 'Standard Tariff',
    is_custom_rate BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    car_npr NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    scorpio_npr NUMERIC(12, 2) NOT NULL DEFAULT 1500.00,
    hiace_npr NUMERIC(12, 2) NOT NULL DEFAULT 1750.00,
    coaster_npr NUMERIC(12, 2) NOT NULL DEFAULT 2250.00,
    shuttle_npr NUMERIC(12, 2) NOT NULL DEFAULT 2750.00,
    car_inr NUMERIC(12, 2) NOT NULL DEFAULT 625.00,
    scorpio_inr NUMERIC(12, 2) NOT NULL DEFAULT 938.00,
    hiace_inr NUMERIC(12, 2) NOT NULL DEFAULT 1094.00,
    coaster_inr NUMERIC(12, 2) NOT NULL DEFAULT 1406.00,
    shuttle_inr NUMERIC(12, 2) NOT NULL DEFAULT 1719.00,
    base_car_npr NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    base_scorpio_npr NUMERIC(12, 2) NOT NULL DEFAULT 1500.00,
    base_hiace_npr NUMERIC(12, 2) NOT NULL DEFAULT 1750.00,
    base_coaster_npr NUMERIC(12, 2) NOT NULL DEFAULT 2250.00,
    base_shuttle_npr NUMERIC(12, 2) NOT NULL DEFAULT 2750.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Itinerary Templates Table
CREATE TABLE IF NOT EXISTS public.itinerary_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_identifier TEXT NOT NULL,
    route_name TEXT NOT NULL,
    template_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights JSONB DEFAULT '[]'::jsonb,
    meals TEXT DEFAULT 'Breakfast (CP)',
    city TEXT DEFAULT 'Kathmandu',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and full anon access
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon full access on hotels" ON public.hotels FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on transport_routes" ON public.transport_routes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on itinerary_templates" ON public.itinerary_templates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Explicit Role Permissions (Required for Anon Web Client Access)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;`;

    navigator.clipboard.writeText(fullSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header" style={{ background: '#0f172a', color: '#ffffff' }}>
          <div className="modal-title" style={{ color: '#ffffff' }}>
            <Database size={22} style={{ color: '#facc15' }} />
            <span>Supabase Cloud Database Settings</span>
          </div>
          <button type="button" onClick={onClose} className="btn-icon" style={{ color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          <div className="alert alert-info">
            <Sparkles size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Pure React + Supabase Architecture:</strong> Connects directly from your browser to your Supabase PostgreSQL instance. All hotel rates, transportation fleet tariffs, and multi-variant itinerary templates sync in real-time.
            </div>
          </div>

          {status.type && (
            <div className={`alert alert-${status.type === 'error' ? 'danger' : status.type}`}>
              {status.type === 'success' && <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />}
              {status.type === 'error' && <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />}
              {status.type === 'warning' && <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0 }} />}
              <div>
                <div>{status.message}</div>
                {status.tables && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', background: status.tables.hotels ? '#dcfce7' : '#fee2e2', color: status.tables.hotels ? '#15803d' : '#b91c1c', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                      {status.tables.hotels ? '✓' : '✗'} hotels
                    </span>
                    <span style={{ fontSize: '0.72rem', background: status.tables.transport_routes ? '#dcfce7' : '#fee2e2', color: status.tables.transport_routes ? '#15803d' : '#b91c1c', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                      {status.tables.transport_routes ? '✓' : '✗'} transport_routes
                    </span>
                    <span style={{ fontSize: '0.72rem', background: status.tables.itinerary_templates ? '#dcfce7' : '#fee2e2', color: status.tables.itinerary_templates ? '#15803d' : '#b91c1c', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                      {status.tables.itinerary_templates ? '✓' : '✗'} itinerary_templates
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleTestAndSave}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Supabase Project URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  required
                  className="form-input"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Globe size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Supabase Anon Public API Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Key size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <button type="submit" disabled={testing} className="btn btn-primary">
                {testing ? <RefreshCw size={15} className="spin" /> : <CheckCircle2 size={15} />}
                <span>{testing ? 'Testing Connection...' : 'Save & Connect Live'}</span>
              </button>

              <button 
                type="button" 
                onClick={handleSeedDatabase} 
                disabled={seeding || !url} 
                className="btn btn-outline"
                style={{ color: '#047857', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                title="Populates all Master Hotels, Transport Fleet Rates, and Itinerary Templates into your Supabase database"
              >
                {seeding ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
                <span>Seed All Master Data (Hotels, Fleet & Itineraries)</span>
              </button>

              <button type="button" onClick={handleClearToDemo} className="btn btn-outline" style={{ color: '#d97706' }}>
                Switch to Offline Demo Mode
              </button>
            </div>
          </form>

          {/* Quick SQL Helper */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
                <FileCode2 size={16} style={{ color: 'var(--primary)' }} />
                <span>Complete Supabase SQL Schema</span>
              </div>
              <button type="button" onClick={handleCopySql} className="btn btn-outline btn-sm">
                {copiedSql ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
                <span>{copiedSql ? 'Copied Full SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
              Run this script once in your <strong>Supabase Dashboard → SQL Editor</strong> to create the tables (`hotels`, `transport_routes`, `itinerary_templates`, `quotations`) and enable Row Level Security (RLS).
            </p>

            <div className="code-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
              <pre><code>{`-- Open supabase.com -> SQL Editor -> Paste & Run:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: hotels (with INR, NPR, USD rates)
-- Table 2: transport_routes (with 5 vehicle allocations)
-- Table 3: itinerary_templates (with multi-variant narratives)
-- Table 4: quotations (quote history)

-- All RLS policies configured for public web app access.`}</code></pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '0.85rem 1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-primary btn-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
