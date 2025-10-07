module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ALLOW_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, recommendations, userLocation, selectedRestaurant } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const model = process.env.AI_MODEL || 'glm-3-turbo';

    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfigured: missing AI_API_KEY' });
    }

    const payload = {
      model,
      messages: [
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
      metadata: {
        hasRecommendations: Array.isArray(recommendations) && recommendations.length > 0,
        hasUserLocation: !!userLocation,
        hasSelectedRestaurant: !!selectedRestaurant
      }
    };

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({ error: `Upstream error: ${upstream.status} ${text}` });
    }

    const data = await upstream.json();
    const responseText = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ response: responseText });
  } catch (err) {
    return res.status(500).json({ error: `Proxy error: ${err.message}` });
  }
}


