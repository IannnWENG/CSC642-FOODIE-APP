const { onRequest } = require('firebase-functions/v2/https');
const cors = require('cors');
const fetch = require('node-fetch');

// 設置 CORS
const corsHandler = cors({ origin: true });

/**
 * AI Proxy Cloud Function - Groq API
 * 安全地代理 AI API 請求，保護 API 金鑰
 */
exports.aiProxy = onRequest(
  {
    cors: true,
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      // 處理 OPTIONS 預檢請求
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }

      // 只允許 POST 請求
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
      }

      try {
        const { message, recommendations, userLocation, selectedRestaurant } = req.body || {};
        
        if (!message) {
          res.status(400).json({ error: 'Missing message' });
          return;
        }

        // 從環境變數獲取 API 設定
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
          console.error('Groq API Key not configured');
          res.status(500).json({ error: 'Server misconfigured: missing GROQ_API_KEY' });
          return;
        }

        const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

        console.log('Calling Groq API...');

        const payload = {
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
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
          console.error('Groq API error:', upstream.status, text);
          res.status(upstream.status).json({ error: `Upstream error: ${upstream.status} ${text}` });
          return;
        }

        const data = await upstream.json();
        
        // 解析 Groq 回應格式 (OpenAI 相容)
        const responseText = data?.choices?.[0]?.message?.content || '';
        
        console.log('Groq response received successfully');
        res.status(200).json({ response: responseText });
        
      } catch (err) {
        console.error('AI Proxy Error:', err);
        res.status(500).json({ error: `Proxy error: ${err.message}` });
      }
    });
  }
);
