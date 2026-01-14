import React from 'react';
import { EnhancedPageHeader } from '../../../components/shared';
import { Layout } from 'lucide-react';

const PagesManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="Community Pages"
                description="Manage community pages and layouts"
                icon={Layout}
                iconGradient={{ from: 'from-violet-500', to: 'to-purple-600' }}
                titleGradient={{ from: 'from-violet-600', to: 'to-purple-600' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Pages management content coming soon...</p>
            </div>
        </div>
    );
};

export default PagesManagement;
