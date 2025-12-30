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
        debug: true, // Enable debug to see failed loads

        interpolation: {
            escapeValue: false, // React already safe from XSS
        },

        backend: {
            // Endpoint to fetch translations from ASP.NET Core Backend
            loadPath: 'http://localhost:5100/api/v4/shared/localization/resources/{{lng}}',

            // Parse the response because our backend returns a flat dictionary directly
            parse: (data: string) => {
                return JSON.parse(data);
            }
        },

        // React-specific options
        react: {
            useSuspense: true, // Enable suspense for loading
        }
    });

export default i18n;
