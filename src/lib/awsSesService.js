/**
 * AWS SES Client Service for FishTail Travel Quotations
 * 
 * Supports:
 * 1. Vite Local Server SES SMTP Relay (`/api/send-email`) - Direct Node SMTP via port 465 (Zero CORS)
 * 2. Supabase Edge Function dispatch (`send-quotation-email`) - For cloud production
 * 3. Local configuration persistence & diagnostics
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'fishtail_aws_ses_config';

// Load stored or environment configuration
export function getAwsSesConfig() {
  let stored = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch (_) {}

  // If stored region was old default 'ap-south-1', migrate to confirmed 'us-east-1'
  const region = (stored.region && stored.region !== 'ap-south-1') 
    ? stored.region 
    : (import.meta.env.VITE_AWS_SES_REGION || 'us-east-1');

  return {
    region,
    fromEmail: stored.fromEmail || import.meta.env.VITE_AWS_SES_FROM_EMAIL || 'reservations@fishtail.org',
    fromName: stored.fromName || import.meta.env.VITE_AWS_SES_FROM_NAME || 'FishTail Tours & Travels',
    accessKeyId: stored.accessKeyId || import.meta.env.VITE_AWS_SES_SMTP_USER || 'AKIAYNKQA2QVZMS3VPFZ',
    secretAccessKey: stored.secretAccessKey || import.meta.env.VITE_AWS_SES_SMTP_PASS || 'BN1R9SxNky+61bRQ8MbSV1qxpE9eBv5PHKZyKYCpjb4g',
    useEdgeFunction: stored.useEdgeFunction !== undefined ? stored.useEdgeFunction : isSupabaseConfigured(),
    edgeFunctionUrl: stored.edgeFunctionUrl || import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL || ''
  };
}

// Reset configuration back to .env values
export function resetAwsSesConfigToEnv() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
  return getAwsSesConfig();
}

// Save configuration to localStorage
export function saveAwsSesConfig(config) {
  try {
    const existing = getAwsSesConfig();
    const updated = { ...existing, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, config: updated };
  } catch (err) {
    console.error('Failed to save AWS SES config:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send Email via Supabase Edge Function (`send-quotation-email`)
 */
export async function sendEmailViaSupabase({
  to,
  cc = [],
  subject,
  html,
  quoteNumber,
  clientName,
  preparedBy
}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please configure your Supabase URL & Anon Key.');
  }

  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Failed to initialize Supabase client.');
  }

  const { data, error } = await client.functions.invoke('send-quotation-email', {
    body: {
      to,
      cc,
      subject,
      html,
      quoteNumber,
      clientName,
      preparedBy
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to dispatch email via Supabase Edge Function');
  }

  return {
    success: true,
    messageId: data?.messageId || `SUPABASE-${Date.now()}`,
    mode: 'supabase_edge'
  };
}

/**
 * Unified Dispatcher
 * Dispatches via Local Node SES SMTP Relay or Supabase Edge Function
 */
export async function dispatchQuotationEmail({
  to,
  cc,
  subject,
  html,
  quoteNumber,
  clientName,
  preparedBy
}) {
  const config = getAwsSesConfig();

  // Tier 1: Try Local Server SES SMTP Relay
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        cc,
        subject,
        html,
        fromEmail: config.fromEmail,
        fromName: config.fromName,
        region: config.region || 'us-east-1',
        smtpUser: config.accessKeyId,
        smtpPass: config.secretAccessKey
      })
    });

    let resData = {};
    try {
      resData = await res.json();
    } catch (_) {}

    if (res.ok && resData.success) {
      return {
        success: true,
        messageId: resData.messageId,
        mode: 'ses_smtp_relay'
      };
    }

    if (!res.ok) {
      const errorMsg = resData.error || `HTTP ${res.status}: Failed to send email via SES relay.`;
      
      // Clean, actionable error translation for the user
      if (errorMsg.includes('Email address is not verified') || errorMsg.includes('554 Message rejected')) {
        throw new Error(
          `AWS SES Sandbox Rejection: In AWS SES Sandbox mode, the sender ("${config.fromEmail}") AND recipient ("${to}") must be verified under "Verified Identities" in AWS SES Console (us-east-1). Details: ${errorMsg}`
        );
      }
      if (errorMsg.includes('Authentication Credentials Invalid') || errorMsg.includes('535')) {
        throw new Error(
          `AWS SES Authentication Invalid: Check your SMTP User and SMTP Password in settings. Verified region is us-east-1.`
        );
      }
      throw new Error(errorMsg);
    }
  } catch (relayErr) {
    // If local relay returned an AWS SES error, bubble it up so user sees why AWS rejected it
    if (relayErr.message && (relayErr.message.includes('AWS SES') || relayErr.message.includes('Message rejected'))) {
      throw relayErr;
    }

    console.warn('[Local SES relay unavailable, checking Supabase]:', relayErr.message);

    // If local relay was unreachable (e.g. deployed statically), try Supabase Edge Function
    if (config.useEdgeFunction && isSupabaseConfigured()) {
      return await sendEmailViaSupabase({
        to,
        cc,
        subject,
        html,
        quoteNumber,
        clientName,
        preparedBy
      });
    }

    throw relayErr;
  }
}
