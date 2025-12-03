import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Search, 
  Eye, 
  MessageSquare, 
  Menu, 
  Navigation, 
  Heart, 
  Star, 
  Trophy, 
  Flame,
  Clock,
  TrendingUp,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import userStatsService from '../services/userStatsService';
import favoritesService from '../services/favoritesService';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (isOpen && user) {
      const userStats = userStatsService.getStats();
      setStats(userStats);
      setFavorites(favoritesService.getFavorites());
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const topCategories = userStatsService.getTopCategories(5);
  const recentActivity = userStatsService.getRecentActivity(10);
  const accountAgeDays = userStatsService.getAccountAgeDays();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('profile.justNow');
    if (diffMins < 60) return `${diffMins} ${t('profile.minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('profile.hoursAgo')}`;
    if (diffDays < 7) return `${diffDays} ${t('profile.daysAgo')}`;
    return formatDate(dateString);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Calculate level based on total activity
  const totalActivity = (stats?.totalSearches || 0) + (stats?.totalPlacesViewed || 0) + (stats?.totalAIChats || 0);
  const level = Math.floor(totalActivity / 10) + 1;
  const levelProgress = (totalActivity % 10) * 10;

  const getLevelTitle = (lvl) => {
    if (lvl >= 50) return t('profile.levelMaster');
    if (lvl >= 30) return t('profile.levelExpert');
    if (lvl >= 15) return t('profile.levelExplorer');
    if (lvl >= 5) return t('profile.levelFoodie');
    return t('profile.levelNewbie');
  };

  return (
    <div className="fixed inset-0 backdrop-overlay flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp sm:animate-scaleIn shadow-soft-xl">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-brand-500 via-purple-500 to-pink-500 p-6 pb-16">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                {user.name || user.email?.split('@')[0]}
              </h2>
              <p className="text-white/70 text-sm truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-medium">
                  Lv.{level} {getLevelTitle(level)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="px-6 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-surface-600">
                {t('profile.level')} {level}
              </span>
              <span className="text-xs text-surface-400">
                {levelProgress}% → Lv.{level + 1}
              </span>
            </div>
            <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 p-1 bg-surface-100 rounded-xl">
            {['overview', 'activity', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-brand-600 shadow-soft'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {t(`profile.tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[40vh] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Search className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-xl font-bold text-blue-700">{stats?.totalSearches || 0}</div>
                  <div className="text-xs text-blue-500">{t('profile.searches')}</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <Eye className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-xl font-bold text-purple-700">{stats?.totalPlacesViewed || 0}</div>
                  <div className="text-xs text-purple-500">{t('profile.placesViewed')}</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-3 text-center">
                  <Heart className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                  <div className="text-xl font-bold text-pink-700">{favorites.length}</div>
                  <div className="text-xs text-pink-500">{t('profile.favorites')}</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <MessageSquare className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <div className="text-xl font-bold text-orange-700">{stats?.totalAIChats || 0}</div>
                  <div className="text-xs text-orange-500">{t('profile.aiChats')}</div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-surface-50 rounded-xl p-4">
                <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('profile.accountInfo')}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {t('profile.email')}
                    </span>
                    <span className="text-surface-700 font-medium truncate ml-4">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('profile.memberSince')}
                    </span>
                    <span className="text-surface-700 font-medium">
                      {formatDate(stats?.accountCreatedDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t('profile.accountAge')}
                    </span>
                    <span className="text-surface-700 font-medium">
                      {accountAgeDays} {t('profile.days')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              {topCategories.length > 0 && (
                <div className="bg-surface-50 rounded-xl p-4">
                  <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t('profile.topCategories')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {topCategories.map((cat, index) => (
                      <span 
                        key={cat.category}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          index === 0 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-surface-200 text-surface-600'
                        }`}
                      >
                        {index === 0 && '🏆 '}
                        {cat.category} ({cat.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {/* Login Streak */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-surface-600">{t('profile.loginStreak')}</div>
                      <div className="text-2xl font-bold text-orange-600">{stats?.loginStreak || 0} {t('profile.days')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-surface-400">{t('profile.best')}</div>
                    <div className="text-lg font-bold text-surface-600">{stats?.longestStreak || 0}</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold text-surface-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('profile.recentActivity')}
                </h3>
                {recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activity.type === 'search' 
                            ? 'bg-blue-100 text-blue-500' 
                            : 'bg-purple-100 text-purple-500'
                        }`}>
                          {activity.type === 'search' ? <Search className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-surface-700 truncate">
                            {activity.description}
                          </div>
                          <div className="text-xs text-surface-400">
                            {formatRelativeTime(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-surface-400">
                    <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>{t('profile.noActivity')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              {/* Achievements Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* First Search */}
                <div className={`p-4 rounded-xl border-2 ${
                  stats?.totalSearches >= 1 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-surface-50 border-surface-200 opacity-50'
                }`}>
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="font-semibold text-sm">{t('profile.achievementFirstSearch')}</div>
                  <div className="text-xs text-surface-500">{t('profile.achievementFirstSearchDesc')}</div>
                </div>

                {/* Explorer - 10 searches */}
                <div className={`p-4 rounded-xl border-2 ${
                  stats?.totalSearches >= 10 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-surface-50 border-surface-200 opacity-50'
                }`}>
                  <div className="text-2xl mb-2">🗺️</div>
                  <div className="font-semibold text-sm">{t('profile.achievementExplorer')}</div>
                  <div className="text-xs text-surface-500">{t('profile.achievementExplorerDesc')}</div>
                </div>

                {/* Collector - 5 favorites */}
                <div className={`p-4 rounded-xl border-2 ${
                  favorites.length >= 5 
                    ? 'bg-pink-50 border-pink-200' 
                    : 'bg-surface-50 border-surface-200 opacity-50'
                }`}>
                  <div className="text-2xl mb-2">💖</div>
                  <div className="font-semibold text-sm">{t('profile.achievementCollector')}</div>
                  <div className="text-xs text-surface-500">{t('profile.achievementCollectorDesc')}</div>
                </div>

                {/* AI Friend - 10 AI chats */}
                <div className={`p-4 rounded-xl border-2 ${
                  stats?.totalAIChats >= 10 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-surface-50 border-surface-200 opacity-50'
                }`}>
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-semibold text-sm">{t('profile.achievementAIFriend')}</div>
                  <div className="text-xs text-surface-500">{t('profile.achievementAIFriendDesc')}</div>
                </div>

                {/* Navigator - 5 navigations */}
                <div className={`p-4 rounded-xl border-2 ${
                  stats?.totalNavigations >= 5 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-surface-50 border-surface-200 opacity-50'
                }`}>
                  <div className="text-2xl mb-2">🧭</div>
                  <div className="font-semibold text-sm">{t('profile.achievementNavigator')}</div>
                  <div className="text-xs text-surface-500">{t('profile.achievementNavigatorDesc')}</div>
                </div>

                {/* Streak Master - 7 day streak */}
                <div className={`p-4 rounded-xl border-2 ${
                  stats?.longestStreak >= 7 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-surface-50 border-surface-200 opacity-50'
                }`}>
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-semibold text-sm">{t('profile.achievementStreakMaster')}</div>
                  <div className="text-xs text-surface-500">{t('profile.achievementStreakMasterDesc')}</div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">{t('profile.achievementsUnlocked')}</span>
                  <span className="font-bold text-brand-600">
                    {[
                      stats?.totalSearches >= 1,
                      stats?.totalSearches >= 10,
                      favorites.length >= 5,
                      stats?.totalAIChats >= 10,
                      stats?.totalNavigations >= 5,
                      stats?.longestStreak >= 7
                    ].filter(Boolean).length} / 6
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-100 bg-surface-50 safe-area-bottom">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            {t('common.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

