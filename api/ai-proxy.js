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
    const { messages, message, metadata } = req.body || {};
    
    // support new format (messages array) and old format (single message string) for backward compatibility
    let finalMessages = [];
    
    if (Array.isArray(messages) && messages.length > 0) {
      // new format: complete conversation messages array
      finalMessages = messages;
      console.log(` Received ${messages.length} messages (new format)`);
    } else if (message) {
      // old format: single message string (backward compatibility)
      finalMessages = [{ role: 'user', content: message }];
      console.log(' Received single message (legacy format)');
    } else {
      return res.status(400).json({ error: 'Missing messages or message' });
    }

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const model = process.env.AI_MODEL || 'glm-3-turbo';

    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfigured: missing AI_API_KEY' });
    }

    // record metadata for debugging
    if (metadata) {
      console.log(' Request metadata:', JSON.stringify(metadata));
    }

    const payload = {
      model,
      messages: finalMessages,
      max_tokens: 1500,
      temperature: 0.7,
      stream: false
    };

    console.log(` Calling AI API with model: ${model}`);

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
      console.error(` AI API error: ${upstream.status}`, text);
      return res.status(upstream.status).json({ error: `Upstream error: ${upstream.status} ${text}` });
    }

    const data = await upstream.json();
    const responseText = data?.choices?.[0]?.message?.content || '';
    
    console.log(' AI response received successfully');
    return res.status(200).json({ response: responseText });
  } catch (err) {
    console.error(' Proxy error:', err);
    return res.status(500).json({ error: `Proxy error: ${err.message}` });
  }
}


