import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const OfflineSyncIndicator: React.FC = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSyncSuccess(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-amber-400 animate-in slide-in-from-bottom">
        <WifiOff className="w-4 h-4 flex-shrink-0" />
        <span>{t('offlineNotice')}</span>
      </div>
    );
  }

  if (showSyncSuccess) {
    return (
      <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border border-emerald-400 animate-in slide-in-from-bottom">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span>{t('onlineNotice')}</span>
      </div>
    );
  }

  return null;
};
