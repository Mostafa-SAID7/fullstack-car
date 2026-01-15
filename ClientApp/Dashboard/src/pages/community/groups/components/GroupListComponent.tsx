import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, MoreVertical, Trash2, Edit, AlertCircle, Shield, Lock, Globe } from 'lucide-react';
import { useGroups } from '../hooks';
import { groupManagementService } from '../services';
import { GroupPrivacy } from '@/types/community/group';

export const GroupListComponent: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const { groups, loading, error, refetch } = useGroups({ pageNumber, pageSize: 20 });

  const handleDelete = async (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        await groupManagementService.deleteGroup(groupId);
        refetch();
      } catch (err) {
        console.error('Failed to delete group:', err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGroups.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedGroups.length} groups?`)) {
      try {
        await groupManagementService.bulkDelete(selectedGroups);
        setSelectedGroups([]);
        refetch();
      } catch (err) {
        console.error('Failed to delete groups:', err);
      }
    }
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedGroups.length === groups?.items.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups?.items.map(g => g.id) || []);
    }
  };

  const getPrivacyIcon = (privacy: GroupPrivacy) => {
    switch (privacy) {
      case GroupPrivacy.Public:
        return <Globe className="w-4 h-4 text-green-500" />;
      case GroupPrivacy.Private:
        return <Lock className="w-4 h-4 text-yellow-500" />;
      case GroupPrivacy.Secret:
        return <Shield className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPrivacyLabel = (privacy: GroupPrivacy) => {
    switch (privacy) {
      case GroupPrivacy.Public:
        return 'Public';
      case GroupPrivacy.Private:
        return 'Private';
      case GroupPrivacy.Secret:
        return 'Secret';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!groups || groups.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No groups found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedGroups.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">
            {selectedGroups.length} group{selectedGroups.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="btn btn-sm btn-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Groups Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedGroups.length === groups.items.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Group</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Owner</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Privacy</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Stats</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.items.map((group) => (
                <motion.tr
                  key={group.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroupSelection(group.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-start space-x-3">
                      {group.imageUrl && (
                        <img
                          src={group.imageUrl}
                          alt={group.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{group.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{group.description.substring(0, 60)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {group.ownerProfileImageUrl && (
                        <img
                          src={group.ownerProfileImageUrl}
                          alt={`${group.ownerFirstName} ${group.ownerLastName}`}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-foreground">
                        {group.ownerFirstName} {group.ownerLastName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getPrivacyIcon(group.privacy)}
                      <span className="text-sm text-foreground">{getPrivacyLabel(group.privacy)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {group.membersCount}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        {group.postsCount}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="btn btn-sm btn-ghost">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="btn btn-sm btn-ghost text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing {groups.items.length} of {groups.totalCount} groups
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={!groups.hasPreviousPage}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {groups.pageNumber} of {groups.totalPages}
            </span>
            <button
              onClick={() => setPageNumber(p => p + 1)}
              disabled={!groups.hasNextPage}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
