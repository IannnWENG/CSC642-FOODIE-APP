export function checkEnvironmentVariables() {
  const requiredKeys = [
    'REACT_APP_GOOGLE_MAPS_API_KEY'
  ];

  const missing = requiredKeys.filter((key) => !process.env[key] || process.env[key].trim() === '');

  const isConfigured = missing.length === 0;

  return {
    isConfigured,
    missing
  };
}


