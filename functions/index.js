const { onRequest } = require('firebase-functions/v2/https');
const cors = require('cors');
const fetch = require('node-fetch');

// 設置 CORS
const corsHandler = cors({ origin: true });

/**
 * AI Proxy Cloud Function - Groq API
 * safely proxy AI API requests, protect API keys
 * support complete conversation history and System Message
 */
exports.aiProxy = onRequest(
  {
    cors: true,
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      // handle OPTIONS pre-flight requests
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }

      // only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
      }

      try {
        const { messages, message, metadata } = req.body || {};
        
        // support new format (messages array) and old format (single message string) for backward compatibility
        let finalMessages = [];
        
        if (Array.isArray(messages) && messages.length > 0) {
          // new format: complete conversation messages array (contains system, user, assistant)
          finalMessages = messages;
          console.log(` Received ${messages.length} messages (new format with conversation history)`);
        } else if (message) {
          // old format: single message string (backward compatibility)
          finalMessages = [{ role: 'user', content: message }];
          console.log(' Received single message (legacy format)');
        } else {
          res.status(400).json({ error: 'Missing messages or message' });
          return;
        }

        // get API settings from environment variables
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
          console.error(' Groq API Key not configured');
          res.status(500).json({ error: 'Server misconfigured: missing GROQ_API_KEY' });
          return;
        }

        const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

        // record metadata for debugging
        if (metadata) {
          console.log('📊 Request metadata:', JSON.stringify(metadata));
        }

        console.log('🤖 Calling Groq API with conversation history...');

        const payload = {
          model: 'llama-3.1-8b-instant',
          messages: finalMessages,
          max_tokens: 1500,
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
          console.error(' Groq API error:', upstream.status, text);
          res.status(upstream.status).json({ error: `Upstream error: ${upstream.status} ${text}` });
          return;
        }

        const data = await upstream.json();
        
        // parse Groq response format (OpenAI compatible)
        const responseText = data?.choices?.[0]?.message?.content || '';
        
        console.log(' Groq response received successfully');
        res.status(200).json({ response: responseText });
        
      } catch (err) {
        console.error(' AI Proxy Error:', err);
        res.status(500).json({ error: `Proxy error: ${err.message}` });
      }
    });
  }
);
