import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Mail,
  Shield,
  User as UserIcon,
  CheckCircle,
  XCircle
} from 'lucide-react';
// import type { UserInfo as User } from '../../../types/auth/user';
import type { UsersTableProps } from '../../../types/pages/users';

export const UsersTable: React.FC<UsersTableProps> = ({ users, onUserAction }) => {
  const { t } = useTranslation();

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          {t('users_list', 'Users List')} ({users.length})
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('user', 'User')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('role', 'Role')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('status', 'Status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('email_status', 'Email Status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('joined_date', 'Joined Date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('actions', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.profileImageUrl ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profileImageUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.roles?.[0] || 'user')}`}>
                    <Shield className="w-3 h-3" />
                    {user.roles?.[0] || 'User'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.isActive ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-700">{t('active', 'Active')}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">{t('inactive', 'Inactive')}</span>
                      </>
                    )}
                  </div>
                </td>

                {/* Email Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.isEmailConfirmed ? (
                      <>
                        <Mail className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-700">{t('confirmed', 'Confirmed')}</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-yellow-700">{t('pending', 'Pending')}</span>
                      </>
                    )}
                  </div>
                </td>

                {/* Joined Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(user.createdAt || new Date().toISOString())}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onUserAction('view', user.id)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title={t('view_user', 'View User')}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onUserAction('edit', user.id)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title={t('edit_user', 'Edit User')}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onUserAction('delete', user.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title={t('delete_user', 'Delete User')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title={t('more_actions', 'More Actions')}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};