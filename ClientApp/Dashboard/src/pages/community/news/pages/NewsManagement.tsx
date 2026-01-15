import React from 'react';
import { EnhancedPageHeader } from '@/components/shared';
import { Newspaper } from 'lucide-react';

const NewsManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="News Management"
                description="Manage community news and updates"
                icon={Newspaper}
                iconGradient={{ from: 'from-red-500', to: 'to-rose-600' }}
                titleGradient={{ from: 'from-red-600', to: 'to-rose-600' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">News management content coming soon...</p>
            </div>
        </div>
    );
};

export default NewsManagement;
