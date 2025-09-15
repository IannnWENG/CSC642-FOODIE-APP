// 環境變數檢查工具
export const checkEnvironmentVariables = () => {
  const requiredVars = [
    'REACT_APP_GOOGLE_MAPS_API_KEY'
  ];
  
  const optionalVars = [
    'REACT_APP_AI_API_KEY',
    'REACT_APP_AI_API_URL',
    'REACT_APP_AI_MODEL'
  ];
  
  const missing = [];
  const present = [];
  
  // 檢查必要變數
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      present.push(varName);
    }
  });
  
  // 檢查可選變數
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    }
  });
  
  return {
    missing,
    present,
    isConfigured: missing.length === 0,
    summary: {
      required: requiredVars.length,
      optional: optionalVars.length,
      missing: missing.length,
      present: present.length
    }
  };
};

// 在開發環境中顯示環境變數狀態
if (process.env.NODE_ENV === 'development') {
  const envStatus = checkEnvironmentVariables();
  console.log('🔧 環境變數狀態:', envStatus);
  
  if (!envStatus.isConfigured) {
    console.warn('⚠️ 缺少必要的環境變數:', envStatus.missing);
    console.log('📝 請參考 env.example 檔案設定環境變數');
  } else {
    console.log('✅ 環境變數設定完成');
  }
}
