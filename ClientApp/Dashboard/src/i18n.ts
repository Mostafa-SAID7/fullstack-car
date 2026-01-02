import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en-US',
        debug: false, // Disable debug to prevent console spam

        interpolation: {
            escapeValue: false, // React already safe from XSS
        },

        backend: {
            // Endpoint to fetch translations from ASP.NET Core Backend
            loadPath: 'http://localhost:5101/api/v4/shared/localization/resources/{{lng}}',

            // Parse the response because our backend returns a flat dictionary directly
            parse: (data: string) => {
                try {
                    return JSON.parse(data);
                } catch (error) {
                    console.warn('Failed to parse translation data:', error);
                    return {};
                }
            }
        },

        // React-specific options
        react: {
            useSuspense: false, // Disable suspense to prevent loading issues
        }
    });

export default i18n;
