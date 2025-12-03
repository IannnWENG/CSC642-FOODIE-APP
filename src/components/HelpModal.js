import React from 'react';
import { X, MapPin, Search, Heart, Star, Clock, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HelpModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  const steps = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-500" />,
      title: t('help.step1Title'),
      description: t('help.step1Desc')
    },
    {
      icon: <Search className="w-6 h-6 text-green-500" />,
      title: t('help.step2Title'),
      description: t('help.step2Desc')
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: t('help.step3Title'),
      description: t('help.step3Desc')
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: t('help.step4Title'),
      description: t('help.step4Desc')
    },
    {
      icon: <Navigation className="w-6 h-6 text-purple-500" />,
      title: t('help.step5Title'),
      description: t('help.step5Desc')
    }
  ];

  const features = [
    {
      title: t('help.feature1Title'),
      description: t('help.feature1Desc')
    },
    {
      title: t('help.feature2Title'),
      description: t('help.feature2Desc')
    },
    {
      title: t('help.feature3Title'),
      description: t('help.feature3Desc')
    },
    {
      title: t('help.feature4Title'),
      description: t('help.feature4Desc')
    },
    {
      title: t('help.feature5Title'),
      description: t('help.feature5Desc')
    },
    {
      title: t('help.feature6Title'),
      description: t('help.feature6Desc')
    }
  ];

  const tips = [
    t('help.tip1'),
    t('help.tip2'),
    t('help.tip3'),
    t('help.tip4'),
    t('help.tip5'),
    t('help.tip6')
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden animate-slideUp sm:animate-fadeInUp flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{t('help.userGuide')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto overscroll-contain flex-1">
          {/* Quick Start */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('help.quickStart')}</h3>
            <div className="space-y-2 sm:space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 scale-75 sm:scale-100 origin-top-left">
                    {step.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 text-sm sm:text-base">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-base leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('help.features')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-xl bg-white">
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Usage Tips */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('help.usageTips')}</h3>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-xs sm:text-base">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation Score Explanation */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('help.recommendationScore')}</h3>
            <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
              <p className="text-gray-700 mb-2 sm:mb-3 text-xs sm:text-base">
                {t('help.scoreExplanation')}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">{t('help.rating')}</div>
                  <p className="text-gray-600 text-xs">{t('help.ratingDesc')}</p>
                </div>
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">{t('help.distance')}</div>
                  <p className="text-gray-600 text-xs">{t('help.distanceDesc')}</p>
                </div>
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">{t('help.priceLabel')}</div>
                  <p className="text-gray-600 text-xs">{t('help.priceDesc')}</p>
                </div>
                <div className="bg-white/50 p-2 sm:p-3 rounded-lg">
                  <div className="font-semibold text-gray-800 mb-1">{t('help.reviews')}</div>
                  <p className="text-gray-600 text-xs">{t('help.reviewsDesc')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Map Legend */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('help.mapLegend')}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">{t('map.yourLocation')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">{t('map.high')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">{t('map.medium')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">{t('map.low')}</span>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('help.importantNotes')}</h3>
            <div className="bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-xl">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li>• {t('help.note1')}</li>
                <li>• {t('help.note2')}</li>
                <li>• {t('help.note3')}</li>
                <li>• {t('help.note4')}</li>
                <li>• {t('help.note5')}</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Bottom button */}
        <div className="flex justify-end p-4 sm:p-6 border-t bg-gray-50 safe-area-bottom">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
          >
            {t('help.getStarted')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
