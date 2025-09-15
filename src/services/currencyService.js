class CurrencyService {
  constructor() {
    this.supportedCurrencies = [
      { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
      { code: 'TWD', name: '台幣', symbol: 'NT$', flag: '🇹🇼' },
      { code: 'EUR', name: '歐元', symbol: '€', flag: '🇪🇺' },
      { code: 'JPY', name: '日圓', symbol: '¥', flag: '🇯🇵' },
      { code: 'KRW', name: '韓圓', symbol: '₩', flag: '🇰🇷' },
      { code: 'CNY', name: '人民幣', symbol: '¥', flag: '🇨🇳' },
      { code: 'HKD', name: '港幣', symbol: 'HK$', flag: '🇭🇰' },
      { code: 'SGD', name: '新加坡幣', symbol: 'S$', flag: '🇸🇬' },
      { code: 'GBP', name: '英鎊', symbol: '£', flag: '🇬🇧' },
      { code: 'AUD', name: '澳幣', symbol: 'A$', flag: '🇦🇺' }
    ];
    this.exchangeRates = {
      USD: 1.0,
      TWD: 31.5,
      EUR: 0.85,
      JPY: 110.0,
      KRW: 1200.0,
      CNY: 6.45,
      HKD: 7.8,
      SGD: 1.35,
      GBP: 0.73,
      AUD: 1.35
    };

    this.currentCurrency = localStorage.getItem('preferredCurrency') || 'USD';
  }

  getSupportedCurrencies() {
    return this.supportedCurrencies;
  }

  getCurrentCurrency() {
    return this.currentCurrency;
  }

  setCurrentCurrency(currencyCode) {
    if (this.supportedCurrencies.find(c => c.code === currencyCode)) {
      this.currentCurrency = currencyCode;
      localStorage.setItem('preferredCurrency', currencyCode);
    }
  }

  getCurrentCurrencyInfo() {
    return this.supportedCurrencies.find(c => c.code === this.currentCurrency) || this.supportedCurrencies[0];
  }

  convertPrice(price, fromCurrency = 'USD', toCurrency = null) {
    if (!toCurrency) {
      toCurrency = this.currentCurrency;
    }

    if (fromCurrency === toCurrency) {
      return price;
    }

    const usdPrice = price / this.exchangeRates[fromCurrency];
    const convertedPrice = usdPrice * this.exchangeRates[toCurrency];

    return convertedPrice;
  }

  formatPrice(price, currencyCode = null) {
    if (!currencyCode) {
      currencyCode = this.currentCurrency;
    }

    const currencyInfo = this.supportedCurrencies.find(c => c.code === currencyCode);
    if (!currencyInfo) {
      return `$${price.toFixed(2)}`;
    }

    const formattedPrice = price.toFixed(2);
    
    
    if (currencyCode === 'JPY' || currencyCode === 'KRW') {
      return `${currencyInfo.symbol}${Math.round(price)}`;
    }

    return `${currencyInfo.symbol}${formattedPrice}`;
  }

  
  async updateExchangeRates() {
    try {
      
      console.log('匯率更新功能 - 目前使用模擬數據');
      return true;
    } catch (error) {
      console.error('更新匯率失敗:', error);
      return false;
    }
  }

  
  getExchangeRateInfo(fromCurrency = 'USD', toCurrency = null) {
    if (!toCurrency) {
      toCurrency = this.currentCurrency;
    }

    if (fromCurrency === toCurrency) {
      return { rate: 1, text: '相同貨幣' };
    }

    const rate = this.exchangeRates[toCurrency] / this.exchangeRates[fromCurrency];
    return {
      rate: rate,
      text: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`
    };
  }

  
  getCurrencyConverterData() {
    return {
      currentCurrency: this.currentCurrency,
      supportedCurrencies: this.supportedCurrencies,
      currentCurrencyInfo: this.getCurrentCurrencyInfo()
    };
  }
}


const currencyService = new CurrencyService();

export default currencyService;
