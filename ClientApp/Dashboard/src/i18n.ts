import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Local translations
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      users: 'Users',
      content: 'Content',
      ai_agent: 'AI Agent',
      system: 'System',
      settings: 'Settings',
      
      // Common
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      
      // Auth
      email: 'Email',
      password: 'Password',
      remember_me: 'Remember me',
      forgot_password: 'Forgot password?',
      sign_in: 'Sign In',
      sign_up: 'Sign Up',
      
      // Dashboard
      overview: 'Overview',
      statistics: 'Statistics',
      recent_activity: 'Recent Activity',
      
      // Errors
      error_occurred: 'An error occurred',
      try_again: 'Try again',
      page_not_found: 'Page not found'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already safe from XSS
    },

    // React-specific options
    react: {
      useSuspense: false, // Disable suspense to prevent loading issues
    }
  });

export default i18n;
