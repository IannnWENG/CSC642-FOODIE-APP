import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Bot, 
  Heart, 
  History, 
  Star, 
  Navigation,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Target,
  Menu,
  Filter,
  Smartphone,
  Hand,
  ListFilter
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const OnboardingTour = ({ isOpen, onComplete, onSkip }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightPosition, setSpotlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop tour steps - memoized to prevent recreation on every render
  const desktopSteps = useMemo(() => [
    {
      id: 'welcome',
      target: null,
      title: t('tour.welcomeTitle'),
      description: t('tour.welcomeDesc'),
      icon: <Sparkles className="w-8 h-8" />,
      position: 'center'
    },
    {
      id: 'location',
      target: '[data-tour="location-btn"]',
      title: t('tour.step1Title'),
      description: t('tour.step1Desc'),
      icon: <MapPin className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'search-mode',
      target: '[data-tour="search-mode"]',
      title: t('tour.step2Title'),
      description: t('tour.step2Desc'),
      icon: <Search className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'filters',
      target: '[data-tour="filters"]',
      title: t('tour.step3Title'),
      description: t('tour.step3Desc'),
      icon: <Filter className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'search-btn',
      target: '[data-tour="search-btn"]',
      title: t('tour.step4Title'),
      description: t('tour.step4Desc'),
      icon: <Target className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'map',
      target: '[data-tour="map"]',
      title: t('tour.mapTitle'),
      description: t('tour.mapDesc'),
      icon: <Navigation className="w-6 h-6" />,
      position: 'left'
    },
    {
      id: 'recommendations',
      target: '[data-tour="recommendations"]',
      title: t('tour.recommendationsTitle'),
      description: t('tour.recommendationsDesc'),
      icon: <Star className="w-6 h-6" />,
      position: 'left'
    },
    {
      id: 'ai-assistant',
      target: '[data-tour="ai-btn"]',
      title: t('tour.aiAssistantTitle'),
      description: t('tour.aiAssistantDesc'),
      icon: <Bot className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'favorites',
      target: '[data-tour="favorites-btn"]',
      title: t('tour.favoritesTitle'),
      description: t('tour.favoritesDesc'),
      icon: <Heart className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'history',
      target: '[data-tour="history-btn"]',
      title: t('tour.historyTitle'),
      description: t('tour.historyDesc'),
      icon: <History className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'menu-feature',
      target: null,
      title: t('tour.menuFeatureTitle'),
      description: t('tour.menuFeatureDesc'),
      icon: <Menu className="w-6 h-6" />,
      position: 'center'
    },
    {
      id: 'complete',
      target: null,
      title: t('tour.completeTitle'),
      description: t('tour.completeDesc'),
      icon: <Sparkles className="w-8 h-8" />,
      position: 'center'
    }
  ], [t]);

  // Mobile-specific tour steps - memoized
  const mobileSteps = useMemo(() => [
    {
      id: 'welcome-mobile',
      target: null,
      title: t('tour.mobileWelcomeTitle'),
      description: t('tour.mobileWelcomeDesc'),
      icon: <Smartphone className="w-8 h-8" />,
      position: 'center',
      tip: t('tour.swipeToNavigate')
    },
    {
      id: 'mobile-gesture',
      target: null,
      title: t('tour.touchGesturesTitle'),
      description: t('tour.touchGesturesDesc'),
      icon: <Hand className="w-6 h-6" />,
      position: 'center'
    },
    {
      id: 'mobile-nav',
      target: '[data-tour="mobile-nav"]',
      title: t('tour.bottomNavTitle'),
      description: t('tour.bottomNavDesc'),
      icon: <Smartphone className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'mobile-location',
      target: '[data-tour="mobile-location-btn"]',
      title: t('tour.mobileLocationTitle'),
      description: t('tour.mobileLocationDesc'),
      icon: <MapPin className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'search-controls',
      target: '[data-tour="search-mode"]',
      title: t('tour.searchOptionsTitle'),
      description: t('tour.searchOptionsDesc'),
      icon: <Search className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'mobile-filters',
      target: '[data-tour="filters"]',
      title: t('tour.filterSearchTitle'),
      description: t('tour.filterSearchDesc'),
      icon: <Filter className="w-6 h-6" />,
      position: 'bottom'
    },
    {
      id: 'mobile-search-btn',
      target: '[data-tour="search-btn"]',
      title: t('tour.findPlacesTitle'),
      description: t('tour.findPlacesDesc'),
      icon: <Target className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'mobile-results',
      target: '[data-tour="recommendations"]',
      title: t('tour.swipeResultsTitle'),
      description: t('tour.swipeResultsDesc'),
      icon: <ListFilter className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'mobile-map',
      target: '[data-tour="map"]',
      title: t('tour.mobileMapTitle'),
      description: t('tour.mobileMapDesc'),
      icon: <Navigation className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'mobile-ai',
      target: '[data-tour="mobile-ai-btn"]',
      title: t('tour.mobileAiTitle'),
      description: t('tour.mobileAiDesc'),
      icon: <Bot className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'mobile-favorites',
      target: '[data-tour="mobile-favorites-btn"]',
      title: t('tour.mobileFavoritesTitle'),
      description: t('tour.mobileFavoritesDesc'),
      icon: <Heart className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'mobile-history',
      target: '[data-tour="mobile-history-btn"]',
      title: t('tour.mobileHistoryTitle'),
      description: t('tour.mobileHistoryDesc'),
      icon: <History className="w-6 h-6" />,
      position: 'top'
    },
    {
      id: 'mobile-tips',
      target: null,
      title: t('tour.proTipsTitle'),
      description: t('tour.proTipsDesc'),
      icon: <Sparkles className="w-6 h-6" />,
      position: 'center'
    },
    {
      id: 'complete-mobile',
      target: null,
      title: t('tour.readyTitle'),
      description: t('tour.readyDesc'),
      icon: <Sparkles className="w-8 h-8" />,
      position: 'center'
    }
  ], [t]);

  // Select appropriate steps based on device
  const tourSteps = isMobile ? mobileSteps : desktopSteps;
  const totalSteps = tourSteps.length;

  // Update spotlight position based on target element
  const updateSpotlight = useCallback(() => {
    if (currentStep >= tourSteps.length) return;
    
    const step = tourSteps[currentStep];
    
    if (!step || !step.target) {
      setSpotlightPosition({ top: 0, left: 0, width: 0, height: 0 });
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = isMobile ? 6 : 8;
      setSpotlightPosition({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2)
      });
    }
  }, [currentStep, tourSteps, isMobile]);

  useEffect(() => {
    if (isOpen) {
      // Reset to first step when opening
      setCurrentStep(0);
      setIsAnimating(false);
      
      // Delay spotlight update to ensure DOM is ready
      const timer = setTimeout(() => {
        updateSpotlight();
      }, 100);
      
      window.addEventListener('resize', updateSpotlight);
      window.addEventListener('scroll', updateSpotlight, true);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateSpotlight);
        window.removeEventListener('scroll', updateSpotlight, true);
      };
    }
  }, [isOpen]); // Only depend on isOpen

  // Update spotlight when step changes
  useEffect(() => {
    if (isOpen && !isAnimating) {
      updateSpotlight();
    }
  }, [currentStep, isOpen, isAnimating, updateSpotlight]);

  const handleNext = useCallback(() => {
    if (isAnimating) return; // Prevent multiple clicks
    
    if (currentStep < totalSteps - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      onComplete();
    }
  }, [currentStep, totalSteps, isAnimating, onComplete]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return; // Prevent multiple clicks
    
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  }, [currentStep, isAnimating]);

  const handleSkip = useCallback(() => {
    onSkip();
  }, [onSkip]);

  const handleStepClick = useCallback((index) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(index);
      setIsAnimating(false);
    }, 150);
  }, [isAnimating]);

  // Handle swipe gestures on mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const getTooltipStyle = useCallback(() => {
    if (currentStep >= tourSteps.length) return {};
    
    const step = tourSteps[currentStep];
    if (!step) return {};
    
    // For mobile, use fixed bottom positioning for most steps
    if (isMobile) {
      if (step.position === 'center' || !step.target) {
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      }

      const element = document.querySelector(step.target);
      if (!element) {
        return {
          position: 'fixed',
          bottom: '100px',
          left: '16px',
          right: '16px',
          transform: 'none',
        };
      }

      const rect = element.getBoundingClientRect();
      const tooltipHeight = 280;
      const padding = 12;
      const viewportHeight = window.innerHeight;

      // If element is in bottom half, show tooltip above
      if (rect.top > viewportHeight / 2) {
        return {
          position: 'fixed',
          top: Math.max(padding, rect.top - tooltipHeight - padding),
          left: '16px',
          right: '16px',
        };
      } else {
        // Element in top half, show tooltip below
        return {
          position: 'fixed',
          top: Math.min(rect.bottom + padding, viewportHeight - tooltipHeight - padding),
          left: '16px',
          right: '16px',
        };
      }
    }

    // Desktop positioning
    if (step.position === 'center' || !step.target) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const element = document.querySelector(step.target);
    if (!element) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const rect = element.getBoundingClientRect();
    const tooltipWidth = 340;
    const tooltipHeight = 280;
    const padding = 16;

    switch (step.position) {
      case 'bottom':
        return {
          position: 'fixed',
          top: rect.bottom + padding,
          left: Math.max(padding, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
        };
      case 'top':
        return {
          position: 'fixed',
          top: rect.top - tooltipHeight - padding,
          left: Math.max(padding, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
        };
      case 'left':
        return {
          position: 'fixed',
          top: Math.max(padding, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - padding)),
          left: Math.max(padding, rect.left - tooltipWidth - padding),
        };
      case 'right':
        return {
          position: 'fixed',
          top: Math.max(padding, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - padding)),
          left: rect.right + padding,
        };
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  }, [currentStep, tourSteps, isMobile]);

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  if (!step) return null;
  
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div 
      className="fixed inset-0 z-[9999]"
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
    >
      {/* Dark overlay with spotlight cutout */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: step.target 
            ? `radial-gradient(circle at ${spotlightPosition.left + spotlightPosition.width / 2}px ${spotlightPosition.top + spotlightPosition.height / 2}px, transparent ${Math.max(spotlightPosition.width, spotlightPosition.height) * 0.6}px, rgba(0, 0, 0, 0.88) ${Math.max(spotlightPosition.width, spotlightPosition.height) * 0.8}px)`
            : 'rgba(0, 0, 0, 0.9)'
        }}
        onClick={handleSkip}
      />

      {/* Spotlight border glow */}
      {step.target && spotlightPosition.width > 0 && (
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            top: spotlightPosition.top - 4,
            left: spotlightPosition.left - 4,
            width: spotlightPosition.width + 8,
            height: spotlightPosition.height + 8,
            borderRadius: isMobile ? '12px' : '16px',
            border: '3px solid rgba(249, 115, 22, 0.8)',
            boxShadow: '0 0 30px rgba(249, 115, 22, 0.5), 0 0 60px rgba(249, 115, 22, 0.3)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`z-10 transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${isMobile ? 'w-auto' : 'w-[340px] max-w-[calc(100vw-32px)]'}`}
        style={getTooltipStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Device indicator for mobile */}
          {isMobile && currentStep === 0 && (
            <div className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-100">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-orange-600">{t('tour.mobileOptimized')}</span>
            </div>
          )}

          {/* Header with icon */}
          <div className="relative pt-5 pb-4 px-5 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
            <div className="absolute top-3 right-3">
              <button
                onClick={handleSkip}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-lg transition-all active:scale-95"
                title={t('common.skip')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg`}>
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800 leading-tight`}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 leading-relaxed whitespace-pre-line`}>
              {step.description}
            </p>
            
            {/* Mobile tip */}
            {step.tip && (
              <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                <Hand className="w-4 h-4" />
                {step.tip}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className={`flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-100 ${isMobile ? 'gap-2' : ''}`}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0 || isAnimating}
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all active:scale-95 ${
                currentStep === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {!isMobile && 'Back'}
            </button>

            {/* Step dots - smaller on mobile */}
            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  disabled={isAnimating}
                  className={`rounded-full transition-all ${
                    index === currentStep 
                      ? `bg-orange-500 ${isMobile ? 'w-3 h-1.5' : 'w-4 h-2'}` 
                      : index < currentStep 
                        ? `bg-orange-300 ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`
                        : `bg-gray-300 ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg hover:from-orange-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 ${isMobile ? 'px-3' : ''}`}
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  {isMobile ? 'Start' : 'Get Started'}
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Swipe hint for mobile */}
          {isMobile && currentStep === 0 && (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-400 border-t border-gray-100">
              <ChevronLeft className="w-3 h-3" />
              <span>Swipe to navigate</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Skip link for first step */}
        {currentStep === 0 && (
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-xs text-white/70 hover:text-white/90 transition-colors underline underline-offset-2"
            >
              Already know how to use? Skip the tour
            </button>
          </div>
        )}
      </div>

      {/* Animated decorative elements for welcome/complete screens */}
      {(step.id.includes('welcome') || step.id.includes('complete')) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}

      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingTour;
