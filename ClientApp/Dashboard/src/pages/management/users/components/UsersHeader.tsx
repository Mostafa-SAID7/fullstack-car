import React from 'react';
import { RefreshCw, Plus, Download, Filter } from 'lucide-react';

interface UsersHeaderProps {
  onRefresh: () => void;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>
    </div>
  );
};