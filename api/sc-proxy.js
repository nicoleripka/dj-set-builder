export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'missing url param' });

  // Only allow SoundCloud API URLs
  if (!url.startsWith('https://api.soundcloud.com/') && !url.startsWith('https://api-v2.soundcloud.com/')) {
    return res.status(400).json({ error: 'invalid url' });
  }

  try {
    const headers = {};
    if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;

    const r = await fetch(url, { headers });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
