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
  FileCode2
} from 'lucide-react';
import { getStoredConfig, saveStoredConfig, testConnection, seedSupabaseHotels } from '../lib/supabase';

export default function SupabaseConfigModal({
  isOpen,
  onClose,
  onConfigSaved
}) {
  if (!isOpen) return null;

  const currentConfig = getStoredConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [key, setKey] = useState(currentConfig.key || '');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setStatus({ type: 'error', message: 'Please enter both Supabase URL and Anon Key' });
      return;
    }

    setTesting(true);
    setStatus({ type: null, message: '' });

    const result = await testConnection(url.trim(), key.trim());
    setTesting(false);

    if (result.success) {
      saveStoredConfig(url.trim(), key.trim());
      setStatus({ type: 'success', message: 'Connected to Supabase! Data is now live.' });
      onConfigSaved(true);
    } else {
      // Still save if user wants, but show warning
      saveStoredConfig(url.trim(), key.trim());
      setStatus({ 
        type: 'warning', 
        message: `Saved configuration, but table check returned: ${result.message}. (Did you run the SQL script in Supabase SQL Editor?)` 
      });
      onConfigSaved(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      await seedSupabaseHotels();
      setStatus({ type: 'success', message: 'Successfully seeded sample hotels to your Supabase `hotels` table!' });
      onConfigSaved(true);
    } catch (err) {
      setStatus({ type: 'error', message: `Seeding error: ${err.message}` });
    } finally {
      setSeeding(false);
    }
  };

  const handleClearToDemo = () => {
    saveStoredConfig('', '');
    setUrl('');
    setKey('');
    setStatus({ type: 'info', message: 'Switched back to Local / Demo Storage mode.' });
    onConfigSaved(false);
  };

  const sqlSchemaSnippet = `-- Run this in your Supabase SQL Editor (supabase.com -> SQL Editor):
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Kathmandu',
    category TEXT NOT NULL DEFAULT 'Premier',
    half_twin_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    single_room_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    meal_plan TEXT DEFAULT 'CP',
    star_rating INT DEFAULT 3,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon full access" ON public.hotels FOR ALL TO anon USING (true) WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Database size={22} style={{ color: 'var(--primary)' }} />
            <span>Supabase Connection Settings (No Backend)</span>
          </div>
          <button type="button" onClick={onClose} className="btn-danger-ghost">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="alert alert-info">
            <Sparkles size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Pure React + Supabase:</strong> Connect directly to your Supabase PostgreSQL instance using your Project URL and public `anon` key. No backend server required!
            </div>
          </div>

          {status.type && (
            <div className={`alert alert-${status.type === 'error' ? 'danger' : status.type}`}>
              {status.type === 'success' && <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />}
              {status.type === 'error' && <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />}
              {status.type === 'warning' && <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0 }} />}
              <div>{status.message}</div>
            </div>
          )}

          <form onSubmit={handleTestAndSave}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Supabase Project URL</label>
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
              <label className="form-label">Supabase Anon Public API Key</label>
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
                <span>{testing ? 'Testing Connection...' : 'Save & Connect to Supabase'}</span>
              </button>

              <button 
                type="button" 
                onClick={handleSeedDatabase} 
                disabled={seeding || !url} 
                className="btn btn-outline"
                title="Populates Wood Apple, Hotel Kausi, Trekkers Inn into your Supabase table"
              >
                {seeding ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
                <span>Seed Sample Hotels to Supabase</span>
              </button>

              <button type="button" onClick={handleClearToDemo} className="btn btn-outline" style={{ color: '#d97706' }}>
                Use Offline Demo Mode
              </button>
            </div>
          </form>

          {/* Quick SQL Helper */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
                <FileCode2 size={16} style={{ color: 'var(--primary)' }} />
                <span>Supabase SQL Migration Script</span>
              </div>
              <button type="button" onClick={handleCopySql} className="btn btn-outline btn-sm">
                {copiedSql ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            
            <div className="code-box">
              <pre><code>{sqlSchemaSnippet}</code></pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
