import React from 'react';
import { EnhancedPageHeader } from '../../../components/shared';
import { Users } from 'lucide-react';

const GroupsManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="Groups Management"
                description="Manage community groups and memberships"
                icon={Users}
                iconGradient={{ from: 'from-purple-500', to: 'to-pink-600' }}
                titleGradient={{ from: 'from-purple-600', to: 'to-pink-600' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Groups management content coming soon...</p>
            </div>
        </div>
    );
};

export default GroupsManagement;
