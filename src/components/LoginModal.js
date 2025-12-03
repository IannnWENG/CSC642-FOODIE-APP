import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, canClose = true }) => {
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      setEmail('');
      setPassword('');
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setError(result.error || t('login.loginFailed'));
      }
    } catch (err) {
      setError(err.message || t('login.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-overlay flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-soft-xl animate-slideUp sm:animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 pb-4">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 right-0 h-24 gradient-brand-soft rounded-t-3xl -z-10" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 gradient-brand rounded-2xl flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {canClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-soft active:scale-95 transition-all"
              >
                <X className="w-4 h-4 text-surface-500" />
              </button>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold font-display text-surface-800">{t('login.welcomeBack')}</h2>
            <p className="text-sm text-surface-500 mt-1">{t('login.signInContinue')}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4 safe-area-bottom">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-fadeIn">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
              {t('login.email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-surface-400" />
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern pl-10"
                placeholder={t('login.emailPlaceholder')}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
              {t('login.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-surface-400" />
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern pl-10"
                placeholder={t('login.passwordPlaceholder')}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Test Account Info */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3">
            <p className="font-semibold text-brand-700 text-xs mb-1">{t('login.demoAccount')}</p>
            <p className="text-brand-600 text-xs">test@example.com / test123</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('login.signingIn')}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('login.signIn')}</span>
              </>
            )}
          </button>

          {/* Switch to Register */}
          <div className="text-center pt-2">
            <p className="text-sm text-surface-500">
              {t('login.newHere')}{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="text-brand-600 hover:text-brand-700 font-semibold"
              >
                {t('login.createAccount')}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
