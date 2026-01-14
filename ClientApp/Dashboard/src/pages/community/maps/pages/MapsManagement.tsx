import React from 'react';
import { EnhancedPageHeader } from '../../../components/shared';
import { Map } from 'lucide-react';

const MapsManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="Maps Management"
                description="Manage community maps and locations"
                icon={Map}
                iconGradient={{ from: 'from-blue-400', to: 'to-indigo-500' }}
                titleGradient={{ from: 'from-blue-500', to: 'to-indigo-500' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Maps management content coming soon...</p>
            </div>
        </div>
    );
};

export default MapsManagement;
