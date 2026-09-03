const worker = {
  async fetch(request, env, ctx) {
    const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN || '*';
    const CORS_HEADERS = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ code: 405, message: 'Method not allowed' }, 405, CORS_HEADERS);
    }

    try {
      const data = await request.json();

      // Honeypot: if "website" field is filled, treat as bot
      if (data.website && String(data.website).trim()) {
        return jsonResponse({ code: 400, message: 'Invalid submission' }, 400, CORS_HEADERS);
      }

      const required = ['name', 'email', 'message'];
      const missing = required.filter(k => !data[k] || !String(data[k]).trim());
      if (missing.length) {
        return jsonResponse({ code: 400, message: 'Missing required fields: ' + missing.join(', ') }, 400, CORS_HEADERS);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return jsonResponse({ code: 400, message: 'Invalid email address' }, 400, CORS_HEADERS);
      }

      const resendKey = env.RESEND_API_KEY;
      if (!resendKey) {
        return jsonResponse({ code: 500, message: 'Server configuration error' }, 500, CORS_HEADERS);
      }

      const fromEmail = env.FROM_EMAIL || 'sales@safelift.de5.net';
      const toEmail = env.TO_EMAIL || 'sales@safelift.de5.net';
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const country = request.cf?.country || '';

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New SafeLift Inquiry</title></head>
<body style="font-family: Arial, sans-serif; color: #1a1a1a;">
  <h2 style="color: #f97316;">New Inquiry from SafeLift Website</h2>
  <table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;max-width:600px;">
    <tr><td style="background:#f5f5f5; font-weight:bold;">Name</td><td>${escapeHtml(data.name)}</td></tr>
    <tr><td style="background:#f5f5f5; font-weight:bold;">Company</td><td>${escapeHtml(data.company || '-')}</td></tr>
    <tr><td style="background:#f5f5f5; font-weight:bold;">Email</td><td>${escapeHtml(data.email)}</td></tr>
    <tr><td style="background:#f5f5f5; font-weight:bold;">Country / Region</td><td>${escapeHtml(data.country || '-')}</td></tr>
    <tr><td style="background:#f5f5f5; font-weight:bold;">Product of Interest</td><td>${escapeHtml(data.product || '-')}</td></tr>
    <tr><td style="background:#f5f5f5; font-weight:bold;">Quantity</td><td>${escapeHtml(data.quantity || '-')}</td></tr>
    <tr><td style="background:#f5f5f5; font-weight:bold;">Message</td><td>${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr>
    <tr><td style="background:#f5f5f5; font-weight:bold;">Visitor IP</td><td>${escapeHtml(ip)} ${country ? '(' + country + ')' : ''}</td></tr>
  </table>
  <p style="margin-top:20px; color:#666; font-size:12px;">Submitted via safelift.de5.net contact form</p>
</body>
</html>`;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + resendKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'SafeLift Inquiry <' + fromEmail + '>',
          to: [toEmail],
          reply_to: data.email,
          subject: 'New SafeLift Inquiry from ' + data.name + ' — ' + (data.product || 'General'),
          html: html
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Resend error', res.status, errText);
        return jsonResponse({ code: 502, message: 'Email service temporarily unavailable. Please try again later.' }, 502, CORS_HEADERS);
      }

      return jsonResponse({ code: 200, message: 'Inquiry sent successfully. Our sales team will reply within 24 hours.' }, 200, CORS_HEADERS);
    } catch (e) {
      console.error('Worker error', e);
      return jsonResponse({ code: 500, message: 'Server error: ' + e.message }, 500, CORS_HEADERS);
    }
  }
};


function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, cors || {})
  });
}

addEventListener('fetch', event => { event.respondWith(worker.fetch(event.request, globalThis, event)); });
