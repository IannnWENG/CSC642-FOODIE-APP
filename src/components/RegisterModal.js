import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, canClose = true }) => {
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(email, password, name);
      if (result.success) {
        onClose();
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
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
          <div className="absolute top-0 left-0 right-0 h-24 gradient-mint rounded-t-3xl opacity-20 -z-10" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 gradient-mint rounded-2xl flex items-center justify-center shadow-glow-mint">
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
            <h2 className="text-2xl font-bold font-display text-surface-800">Create account</h2>
            <p className="text-sm text-surface-500 mt-1">Start discovering amazing food spots</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-3 safe-area-bottom">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-fadeIn">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="register-name" className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-surface-400" />
              </div>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-modern pl-10"
                placeholder="Your name"
                required
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="register-email" className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-surface-400" />
              </div>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern pl-10"
                placeholder="you@example.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="register-password" className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-surface-400" />
              </div>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern pl-10"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-surface-400" />
              </div>
              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-modern pl-10"
                placeholder="Confirm password"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-mint text-white font-semibold py-3 rounded-xl shadow-glow-mint hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-2">
            <p className="text-sm text-surface-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="text-accent-mint hover:text-emerald-600 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
