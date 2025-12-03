import React, { useState } from 'react';
import { Globe, Check, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ isOpen, onClose }) => {
  const { languages, currentLanguage, changeLanguage, confirmLanguageSelection, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(currentLanguage);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (langCode) => {
    setSelectedLang(langCode);
    changeLanguage(langCode);
  };

  const handleContinue = () => {
    setIsAnimating(true);
    confirmLanguageSelection();
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div 
        className={`relative max-w-md w-full transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 text-center">
            {/* Logo Animation */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display">
              {selectedLang === 'zh-TW' ? '選擇語言' : 'Select Language'}
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              {selectedLang === 'zh-TW' ? '選擇您偏好的語言' : 'Choose your preferred language'}
            </p>
          </div>

          {/* Language Options */}
          <div className="px-6 sm:px-8 pb-4 space-y-3">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${
                  selectedLang === lang.code
                    ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-2 border-orange-400/50 shadow-lg shadow-orange-500/20'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-white/20'
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                {/* Flag */}
                <span className="text-3xl">{lang.flag}</span>
                
                {/* Language Info */}
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white text-lg">
                    {lang.nativeName}
                  </div>
                  <div className="text-white/50 text-sm">
                    {lang.name}
                  </div>
                </div>
                
                {/* Selection Indicator */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedLang === lang.code
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 scale-100'
                    : 'bg-white/10 scale-90 group-hover:scale-100'
                }`}>
                  {selectedLang === lang.code && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <div className="p-6 sm:p-8 pt-4">
            <button
              onClick={handleContinue}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>{selectedLang === 'zh-TW' ? '繼續' : 'Continue'}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center mt-6">
          <p className="text-white/40 text-sm font-medium">
            🍽️ Foodie Tracker
          </p>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;

