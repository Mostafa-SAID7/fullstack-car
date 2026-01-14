import React from 'react';
import { EnhancedPageHeader } from '../../../components/shared';
import { Star } from 'lucide-react';

const ReviewsManagement: React.FC = () => {
    return (
        <div className="space-y-6">
            <EnhancedPageHeader
                title="Reviews Management"
                description="Manage community reviews and ratings"
                icon={Star}
                iconGradient={{ from: 'from-yellow-400', to: 'to-orange-500' }}
                titleGradient={{ from: 'from-yellow-500', to: 'to-orange-500' }}
            />
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Reviews management content coming soon...</p>
            </div>
        </div>
    );
};

export default ReviewsManagement;
