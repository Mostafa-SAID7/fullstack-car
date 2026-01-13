import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from './LanguageSwitcher';

export const TranslationTest: React.FC = () => {
  const { t, ready, currentLanguage, isRTL, error } = useTranslation();

  if (!ready) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Loading translations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Translation Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Translation Test
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Language Switcher:</span>
          <LanguageSwitcher />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Current Language:</strong> {currentLanguage}
          </div>
          <div>
            <strong>RTL Mode:</strong> {isRTL ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Direction:</strong> {document.documentElement.dir || 'ltr'}
          </div>
          <div>
            <strong>Ready:</strong> {ready ? 'Yes' : 'No'}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Sample Translations:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Dashboard:</strong> {t('dashboard', 'Dashboard')}</div>
            <div><strong>Settings:</strong> {t('settings', 'Settings')}</div>
            <div><strong>Welcome:</strong> {t('welcome', 'Welcome')}</div>
            <div><strong>Login:</strong> {t('login', 'Login')}</div>
            <div><strong>Save:</strong> {t('save', 'Save')}</div>
            <div><strong>Cancel:</strong> {t('cancel', 'Cancel')}</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">RTL Test Text:</h3>
          <p className="text-lg" dir={isRTL ? 'rtl' : 'ltr'}>
            {isRTL ? 'هذا نص تجريبي باللغة العربية لاختبار الاتجاه من اليمين إلى اليسار' : 'This is test text in English for left-to-right direction'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TranslationTest;