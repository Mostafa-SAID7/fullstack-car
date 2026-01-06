import React from 'react';
import { Users, Plus, Search } from 'lucide-react';

export const UsersEmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        There are no users matching your current filters. Try adjusting your search criteria or add new users to get started.
      </p>
      
      <div className="flex items-center justify-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Search className="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </div>
  );
};