import React from 'react';
import { EnhancedPageHeader } from '../../../components/shared';
import { UserCheck } from 'lucide-react';

const FriendsManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="Friends Management"
                description="Manage user connections and friend requests"
                icon={UserCheck}
                iconGradient={{ from: 'from-green-500', to: 'to-emerald-600' }}
                titleGradient={{ from: 'from-green-600', to: 'to-emerald-600' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Friends management content coming soon...</p>
            </div>
        </div>
    );
};

export default FriendsManagement;
