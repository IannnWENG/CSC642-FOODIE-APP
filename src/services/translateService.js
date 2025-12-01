/**
 * Translation Service
 * Uses AI to translate text to English
 */

class TranslateService {
  constructor() {
    this.cache = new Map();
    this.proxyUrl = process.env.REACT_APP_AI_PROXY_URL || null;
  }

  /**
   * Detect if text contains non-English characters
   */
  isNonEnglish(text) {
    if (!text) return false;
    // Check for common non-English character ranges
    const nonEnglishPattern = /[^\x00-\x7F\s.,!?'"()-]/;
    // Check for Chinese, Japanese, Korean, Arabic, Hebrew, Thai, etc.
    const asianPattern = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af\u0600-\u06ff\u0590-\u05ff\u0e00-\u0e7f]/;
    return nonEnglishPattern.test(text) || asianPattern.test(text);
  }

  /**
   * Get cached translation
   */
  getCached(text) {
    const key = this.hashText(text);
    return this.cache.get(key);
  }

  /**
   * Cache translation
   */
  setCache(text, translation) {
    const key = this.hashText(text);
    this.cache.set(key, translation);
  }

  /**
   * Simple hash for cache key
   */
  hashText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  /**
   * Translate text to English using AI
   */
  async translateToEnglish(text) {
    if (!text || !this.isNonEnglish(text)) {
      return { translated: text, isTranslated: false };
    }

    // Check cache first
    const cached = this.getCached(text);
    if (cached) {
      return { translated: cached, isTranslated: true, fromCache: true };
    }

    try {
      const prompt = `Translate the following text to English. Only provide the translation, no explanations or additional text.

Text to translate:
"${text}"

English translation:`;

      const translation = await this.callTranslateAPI(prompt);
      
      if (translation) {
        // Clean up the translation
        const cleanTranslation = translation
          .replace(/^["']|["']$/g, '') // Remove surrounding quotes
          .replace(/^Translation:\s*/i, '') // Remove "Translation:" prefix
          .replace(/^English translation:\s*/i, '') // Remove "English translation:" prefix
          .trim();
        
        this.setCache(text, cleanTranslation);
        return { translated: cleanTranslation, isTranslated: true };
      }
      
      return { translated: text, isTranslated: false };
    } catch (error) {
      console.error('Translation failed:', error);
      return { translated: text, isTranslated: false, error: error.message };
    }
  }

  /**
   * Call AI API for translation
   */
  async callTranslateAPI(prompt) {
    // Try external proxy first
    if (this.proxyUrl) {
      try {
        const response = await fetch(this.proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.response || data.text || data.message;
        }
      } catch (error) {
        console.warn('External proxy failed, trying Firebase:', error);
      }
    }

    // Try Firebase function
    try {
      const firebaseUrl = '/api/ai-proxy';
      const response = await fetch(firebaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response || data.text;
      }
    } catch (error) {
      console.warn('Firebase proxy failed:', error);
    }

    // Try Vercel function
    try {
      const vercelUrl = '/api/ai';
      const response = await fetch(vercelUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response || data.text;
      }
    } catch (error) {
      console.warn('Vercel proxy failed:', error);
    }

    throw new Error('All translation endpoints failed');
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(texts) {
    const results = await Promise.all(
      texts.map(text => this.translateToEnglish(text))
    );
    return results;
  }
}

export default new TranslateService();

