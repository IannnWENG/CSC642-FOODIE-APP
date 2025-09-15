import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, retryText = 'Retry' }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="bg-red-100 p-2 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-800">Error Occurred</h3>
          <p className="mt-2 text-sm text-red-700 font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              {retryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
