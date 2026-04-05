module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { client_id, client_secret, code, redirect_uri, code_verifier } = req.body || {};
  if (!client_id || !client_secret || !code) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    const r = await fetch('https://secure.soundcloud.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id, client_secret, grant_type: 'authorization_code', code, redirect_uri, code_verifier }),
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
