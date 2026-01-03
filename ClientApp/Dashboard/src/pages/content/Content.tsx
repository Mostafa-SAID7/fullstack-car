import React from 'react';
import { ContentHeader } from './components/ContentHeader';
import { ContentStats } from './components/ContentStats';
import { ContentSections } from './components/ContentSections';
import { ContentAnalytics } from './components/ContentAnalytics';

export const Content: React.FC = () => {
  return (
    <div className="space-y-6">
      <ContentHeader />
      <ContentStats />
      <ContentSections />
      <ContentAnalytics />
    </div>
  );
};