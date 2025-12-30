import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en-US',
        ns: ['translation'],
        defaultNS: 'translation',
        backend: {
            loadPath: 'https://localhost:5101/api/v4.0/shared/localization/resources/{{lng}}',
            parse: (data: string) => {
                try {
                    const parsed = JSON.parse(data);
                    const translated: Record<string, string> = {};
                    Object.keys(parsed).forEach(key => {
                        // Strip 'admin.dashboard.' prefix to match frontend keys
                        const cleanKey = key.replace('admin.dashboard.', '');
                        translated[cleanKey] = parsed[key];
                    });
                    return translated;
                } catch (error) {
                    console.error('Failed to parse localization data', error);
                    return {};
                }
            }
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
