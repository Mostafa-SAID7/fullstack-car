import React from 'react';
import { 
  QAAnalyticsComponent,
  ModerationDashboardComponent,
  UserReputationManagementComponent,
  QAConfigurationComponent
} from './index';

/**
 * Test component to verify all QA components can be imported and rendered
 * This component is for testing purposes only and should not be used in production
 */
const QAComponentsTest: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">QA Components Test</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">QA Analytics Component</h2>
          <QAAnalyticsComponent />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Moderation Dashboard Component</h2>
          <ModerationDashboardComponent />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">User Reputation Management Component</h2>
          <UserReputationManagementComponent />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">QA Configuration Component</h2>
          <QAConfigurationComponent />
        </section>
      </div>
    </div>
  );
};

export default QAComponentsTest;