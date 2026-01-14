import React from 'react';
import { useTranslation, useRTL } from '../../hooks/useTranslation';
import { Card } from '../layout/cards/Card';
import { Button } from '../forms/buttons/Button';
import { cn } from '../../lib/utils';

export const LocalizationTestComponent: React.FC = () => {
  const { t, changeLanguage, currentLanguage, supportedLanguages } = useTranslation('qa');
  const { isRTL, getRTLClass } = useRTL();

  return (
    <div className={cn('p-6 space-y-4')} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="p-6">
        <h2 className={cn(
          'text-xl font-bold mb-4',
          getRTLClass('text-left', 'text-right')
        )}>
          {t('moderation.title', 'Content Moderation')} - Localization Test
        </h2>
        
        <div className="space-y-4">
          <p>Current Language: {currentLanguage}</p>
          <p>Is RTL: {isRTL ? 'Yes' : 'No'}</p>
          
          <div className={cn(
            'flex gap-2 flex-wrap',
            getRTLClass('', 'flex-row-reverse')
          )}>
            {supportedLanguages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? 'primary' : 'outline'}
                size="sm"
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.nativeName}
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">{t('moderation.stats.pending_reviews', 'Pending Reviews')}</h3>
            <p>{t('moderation.description', 'Review and moderate flagged content across your platform')}</p>
            <p>{t('moderation.stats.today_change', { count: 5 })}</p>
            <p>{t('moderation.bulk.items_selected', { count: 3, s: 's' })}</p>
          </div>
          
          <div className={cn(
            'flex gap-2',
            getRTLClass('', 'flex-row-reverse')
          )}>
            <Button variant="outline">
              {t('moderation.actions.approve', 'Approve')}
            </Button>
            <Button variant="destructive">
              {t('moderation.actions.delete', 'Delete')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LocalizationTestComponent;