import React from 'react';
import { EnhancedPageHeader } from '../../../components/shared';
import { FileText } from 'lucide-react';

const PostsManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="Posts Management"
                description="Manage community posts and content"
                icon={FileText}
                iconGradient={{ from: 'from-blue-500', to: 'to-cyan-600' }}
                titleGradient={{ from: 'from-blue-600', to: 'to-cyan-600' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Posts management content coming soon...</p>
            </div>
        </div>
    );
};

export default PostsManagement;
