import React from 'react';
import { EnhancedPageHeader } from '../../../components/shared';
import { Book } from 'lucide-react';

const GuidesManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="Guides Management"
                description="Manage community guides and resources"
                icon={Book}
                iconGradient={{ from: 'from-orange-500', to: 'to-red-600' }}
                titleGradient={{ from: 'from-orange-600', to: 'to-red-600' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Guides management content coming soon...</p>
            </div>
        </div>
    );
};

export default GuidesManagement;
