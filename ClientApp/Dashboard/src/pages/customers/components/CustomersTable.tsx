import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  User as UserIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { User } from '../../../types/auth';

interface CustomersTableProps {
  users: User[];
}

export const CustomersTable: React.FC<CustomersTableProps> = ({ users }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return t('active', 'Active');
      case 'inactive':
        return t('inactive', 'Inactive');
      case 'pending':
        return t('pending', 'Pending');
      case 'suspended':
        return t('suspended', 'Suspended');
      default:
        return status || t('unknown', 'Unknown');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('no_customers', 'No customers found')}
        </h3>
        <p className="text-muted-foreground">
          {t('no_customers_description', 'Start by adding your first customer to the system.')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          {t('customer_list', 'Customer List')} ({users.length})
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('customer', 'Customer')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('contact', 'Contact')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('status', 'Status')}
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
            {currentUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* Customer Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.name || user.email}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">
                        {user.name || t('unnamed_user', 'Unnamed User')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-foreground">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      {user.email}
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.phoneNumber}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status || 'active')}`}>
                    {getStatusText(user.status || 'active')}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(user.createdAt || new Date().toISOString())}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title={t('view_customer', 'View Customer')}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title={t('edit_customer', 'Edit Customer')}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title={t('delete_customer', 'Delete Customer')}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t('showing_results', 'Showing {{start}} to {{end}} of {{total}} results', {
                start: startIndex + 1,
                end: Math.min(endIndex, users.length),
                total: users.length
              })}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              
              <span className="px-3 py-1 text-sm text-foreground">
                {currentPage} / {totalPages}
              </span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};