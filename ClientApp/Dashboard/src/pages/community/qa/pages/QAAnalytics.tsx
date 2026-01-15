import React from 'react';
import { motion } from 'framer-motion';
import { QAAnalyticsComponent } from '@/components/qa';

export const QAAnalytics: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground">QA Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and analyze your question and answer platform performance
        </p>
      </div>

      {/* Analytics Component */}
      <QAAnalyticsComponent />
    </motion.div>
  );
};

export default QAAnalytics;