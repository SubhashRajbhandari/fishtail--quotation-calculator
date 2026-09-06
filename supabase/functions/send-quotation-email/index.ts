// Supabase Edge Function: send-quotation-email
// Deploy with: supabase functions deploy send-quotation-email
// Set Secrets with:
//   supabase secrets set AWS_ACCESS_KEY_ID=your_key AWS_SECRET_ACCESS_KEY=your_secret AWS_REGION=ap-south-1 SES_FROM_EMAIL=reservations@fishtail.org

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, cc, subject, html, quoteNumber, clientName, preparedBy } = await req.json();

    if (!to) {
      return new Response(
        JSON.stringify({ error: "Recipient email address ('to') is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const AWS_REGION = Deno.env.get("AWS_REGION") || "ap-south-1";
    const AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID");
    const AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    const SES_FROM_EMAIL = Deno.env.get("SES_FROM_EMAIL") || "reservations@fishtail.org";
    const SES_FROM_NAME = Deno.env.get("SES_FROM_NAME") || "FishTail Tours & Travels";

    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      return new Response(
        JSON.stringify({
          error: "AWS SES Credentials missing on Supabase Secrets. Please run: supabase secrets set AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=...",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format destination
    const toAddresses = Array.isArray(to) ? to : [to];
    const ccAddresses = cc ? (Array.isArray(cc) ? cc : [cc]) : [];

    const endpoint = `email.${AWS_REGION}.amazonaws.com`;
    const url = `https://${endpoint}/v2/email/outbound-emails`;

    const payload = {
      FromEmailAddress: `"${SES_FROM_NAME}" <${SES_FROM_EMAIL}>`,
      Destination: {
        ToAddresses: toAddresses,
        CcAddresses: ccAddresses.length > 0 ? ccAddresses : undefined,
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject || `Tour Quotation & Itinerary - ${quoteNumber}`,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: html,
              Charset: "UTF-8",
            },
          },
        },
      },
    };

    // SigV4 Signing for Deno
    const encoder = new TextEncoder();
    async function hmac(key: CryptoKey | ArrayBuffer, data: string): Promise<ArrayBuffer> {
      const cryptoKey = key instanceof ArrayBuffer 
        ? await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
        : key;
      return await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
    }

    async function sha256Hex(data: string): Promise<string> {
      const digest = await crypto.subtle.digest("SHA-256", encoder.encode(data));
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const payloadString = JSON.stringify(payload);
    const payloadHash = await sha256Hex(payloadString);

    const canonicalUri = "/v2/email/outbound-emails";
    const canonicalHeaders = `content-type:application/json\nhost:${endpoint}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "content-type;host;x-amz-date";
    const canonicalRequest = `POST\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${AWS_REGION}/ses/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256Hex(canonicalRequest)}`;

    const kSecret = await crypto.subtle.importKey(
      "raw",
      encoder.encode("AWS4" + AWS_SECRET_ACCESS_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const kDate = await hmac(kSecret, dateStamp);
    const kRegion = await hmac(kDate, AWS_REGION);
    const kService = await hmac(kRegion, "ses");
    const kSigning = await hmac(kService, "aws4_request");

    const signature = await hmac(kSigning, stringToSign);
    const signatureHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const authHeader = `${algorithm} Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;

    const awsRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Host": endpoint,
        "X-Amz-Date": amzDate,
        "Authorization": authHeader,
      },
      body: payloadString,
    });

    const responseText = await awsRes.text();
    let resData: Record<string, any> = {};
    try {
      resData = JSON.parse(responseText);
    } catch (_) {}

    if (!awsRes.ok) {
      return new Response(
        JSON.stringify({
          error: `AWS SES Error (${awsRes.status}): ${resData.message || resData.Message || responseText}`,
        }),
        { status: awsRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: resData.MessageId,
        quoteNumber,
        recipient: to,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
