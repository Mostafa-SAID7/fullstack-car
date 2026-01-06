import React, { useState } from 'react';
import { MoreHorizontal, Shield, Ban, Trash2, Mail, Eye, UserCheck } from 'lucide-react';
import type { User } from '../types/user';

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onUserAction?: (action: string, userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading = false,
  onUserAction
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Suspended: 'bg-yellow-100 text-yellow-800',
      Banned: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    );
  };

  const getRoleBadges = (roles: string[]) => {
    const roleColors = {
      Admin: 'bg-red-100 text-red-800',
      Moderator: 'bg-blue-100 text-blue-800',
      Premium: 'bg-purple-100 text-purple-800',
      ServiceProvider: 'bg-indigo-100 text-indigo-800',
      User: 'bg-gray-100 text-gray-800'
    };

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {role}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                Bulk Actions
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 text-sm text-primary hover:text-primary/80"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Activity
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium text-foreground">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4">
                  {getRoleBadges(user.roles || [])}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatDate(user.joinDate)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  <div className="flex items-center gap-4">
                    <span>Posts: {user.postsCount || 0}</span>
                    <span>Groups: {user.groupsCount || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                      className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {actionMenuOpen === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg z-10 border border-border">
                        <div className="py-1">
                          <button 
                            onClick={() => {
                              onUserAction?.('view', user.id);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted w-full text-left"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button 
                            onClick={() => {
                              onUserAction?.('message', user.id);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted w-full text-left"
                          >
                            <Mail className="w-4 h-4" />
                            Send Message
                          </button>
                          <button 
                            onClick={() => {
                              onUserAction?.('roles', user.id);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted w-full text-left"
                          >
                            <UserCheck className="w-4 h-4" />
                            Manage Roles
                          </button>
                          <div className="border-t border-border my-1"></div>
                          <button 
                            onClick={() => {
                              onUserAction?.('suspend', user.id);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 w-full text-left"
                          >
                            <Shield className="w-4 h-4" />
                            Suspend User
                          </button>
                          <button 
                            onClick={() => {
                              onUserAction?.('ban', user.id);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left"
                          >
                            <Ban className="w-4 h-4" />
                            Ban User
                          </button>
                          <button 
                            onClick={() => {
                              onUserAction?.('delete', user.id);
                              setActionMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};