import React from 'react';
import { Users, Plus, Search } from 'lucide-react';

export const UsersEmptyState: React.FC = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        There are no users matching your current filters. Try adjusting your search criteria or add new users to get started.
      </p>
      
      <div className="flex items-center justify-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
          <Search className="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </div>
  );
};