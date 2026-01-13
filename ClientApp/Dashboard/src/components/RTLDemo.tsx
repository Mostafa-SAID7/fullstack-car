import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { 
  RTLContainer, 
  RTLFlex, 
  RTLText, 
  RTLButton, 
  RTLCard, 
  RTLFormField 
} from './RTLUtils';
import { cn } from '../lib/utils';

interface RTLDemoProps {
  className?: string;
}

export const RTLDemo: React.FC<RTLDemoProps> = ({ className }) => {
  const { t, changeLanguage, currentLanguage, isRTL, supportedLanguages } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <RTLContainer className={cn('p-6 space-y-6', className)}>
      {/* Language Switcher */}
      <RTLCard header={
        <RTLText as="h2" className="text-xl font-semibold">
          RTL Layout System Demo
        </RTLText>
      }>
        <RTLFlex direction="row" justify="start" align="center" gap={4} className="mb-4">
          <RTLText className="font-medium">
            Current Language: {currentLanguage} ({isRTL ? 'RTL' : 'LTR'})
          </RTLText>
        </RTLFlex>
        
        <RTLFlex direction="row" justify="start" align="center" gap={2} wrap>
          {supportedLanguages.map((lang) => (
            <RTLButton
              key={lang.code}
              variant={currentLanguage === lang.code ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.nativeName || lang.name}
            </RTLButton>
          ))}
        </RTLFlex>
      </RTLCard>

      {/* Layout Examples */}
      <RTLCard header={
        <RTLText as="h3" className="text-lg font-semibold">
          Layout Examples
        </RTLText>
      }>
        {/* Flex Layout Example */}
        <div className="space-y-4">
          <RTLText as="h4" className="font-medium text-gray-700 dark:text-gray-300">
            Flex Layout (Auto-reversing)
          </RTLText>
          <RTLFlex direction="row" justify="between" align="center" className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <RTLText>First Item</RTLText>
            <RTLText>Middle Item</RTLText>
            <RTLText>Last Item</RTLText>
          </RTLFlex>
        </div>

        {/* Text Alignment Example */}
        <div className="space-y-4">
          <RTLText as="h4" className="font-medium text-gray-700 dark:text-gray-300">
            Text Alignment (Auto-adjusting)
          </RTLText>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <RTLText align="auto">
              This text automatically aligns based on the current language direction.
            </RTLText>
            <RTLText align="center">
              This text is always centered regardless of language direction.
            </RTLText>
          </div>
        </div>

        {/* Button with Icon Example */}
        <div className="space-y-4">
          <RTLText as="h4" className="font-medium text-gray-700 dark:text-gray-300">
            Buttons with Icons (Auto-positioning)
          </RTLText>
          <RTLFlex direction="row" justify="start" align="center" gap={4}>
            <RTLButton 
              variant="primary" 
              icon={<span>→</span>}
              iconPosition="auto"
            >
              Next
            </RTLButton>
            <RTLButton 
              variant="secondary" 
              icon={<span>←</span>}
              iconPosition="auto"
            >
              Previous
            </RTLButton>
          </RTLFlex>
        </div>
      </RTLCard>

      {/* Form Example */}
      <RTLCard header={
        <RTLText as="h3" className="text-lg font-semibold">
          Form Example
        </RTLText>
      }>
        <div className="space-y-4">
          <RTLFormField 
            label="Name" 
            required
            helpText="Enter your full name"
          >
            <input 
              type="text" 
              className="form-input w-full" 
              placeholder="Your name..."
            />
          </RTLFormField>

          <RTLFormField 
            label="Email" 
            required
          >
            <input 
              type="email" 
              className="form-input w-full" 
              placeholder="your.email@example.com"
            />
          </RTLFormField>

          <RTLFormField 
            label="Message"
          >
            <textarea 
              className="form-input w-full h-24 resize-none" 
              placeholder="Your message..."
            />
          </RTLFormField>

          <RTLFlex direction="row" justify="end" align="center" gap={2}>
            <RTLButton variant="outline">
              Cancel
            </RTLButton>
            <RTLButton variant="primary">
              Submit
            </RTLButton>
          </RTLFlex>
        </div>
      </RTLCard>

      {/* Direction Indicators */}
      <RTLCard header={
        <RTLText as="h3" className="text-lg font-semibold">
          Direction Indicators
        </RTLText>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <RTLText as="h5" className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Document Direction
            </RTLText>
            <RTLText className="text-blue-600 dark:text-blue-300">
              {document.documentElement.dir || 'not set'}
            </RTLText>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <RTLText as="h5" className="font-medium text-green-800 dark:text-green-200 mb-2">
              Body Classes
            </RTLText>
            <RTLText className="text-green-600 dark:text-green-300 text-sm">
              {document.body.className || 'no classes'}
            </RTLText>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <RTLText as="h5" className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              HTML Lang
            </RTLText>
            <RTLText className="text-purple-600 dark:text-purple-300">
              {document.documentElement.lang || 'not set'}
            </RTLText>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <RTLText as="h5" className="font-medium text-orange-800 dark:text-orange-200 mb-2">
              RTL Status
            </RTLText>
            <RTLText className="text-orange-600 dark:text-orange-300">
              {isRTL ? 'RTL Active' : 'LTR Active'}
            </RTLText>
          </div>
        </div>
      </RTLCard>

      {/* CSS Classes Demo */}
      <RTLCard header={
        <RTLText as="h3" className="text-lg font-semibold">
          CSS Classes Demo
        </RTLText>
      }>
        <div className="space-y-4">
          <RTLText as="h4" className="font-medium text-gray-700 dark:text-gray-300">
            Margin and Padding (RTL-aware)
          </RTLText>
          
          <div className="space-y-2">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <div className="ms-4 ps-4 bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                <RTLText>
                  This box has margin-start (ms-4) and padding-start (ps-4) - 
                  automatically adjusts for RTL
                </RTLText>
              </div>
            </div>
            
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <div className="me-4 pe-4 bg-green-100 dark:bg-green-900/30 p-2 rounded">
                <RTLText>
                  This box has margin-end (me-4) and padding-end (pe-4) - 
                  automatically adjusts for RTL
                </RTLText>
              </div>
            </div>
          </div>
        </div>
      </RTLCard>
    </RTLContainer>
  );
};

export default RTLDemo;