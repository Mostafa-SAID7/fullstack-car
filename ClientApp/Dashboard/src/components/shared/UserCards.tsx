import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Shield, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { User } from '../../pages/management/users/types/user';

export interface UserCardsProps {
  users: User[];
  loading?: boolean;
  onUserAction?: (action: string, user: User) => void;
  className?: string;
}

export const UserCards: React.FC<UserCardsProps> = ({
  users,
  loading = false,
  onUserAction,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {user.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">
                  {user.fullName || 'Unknown User'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles || 'User'}
                </p>
              </div>
            </div>
            
            {/* Actions Menu */}
            <div className="relative group/menu">
              <button className="p-1 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="absolute right-0 top-8 bg-popover border border-border rounded-lg shadow-lg py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10 min-w-[120px]">
                <button
                  onClick={() => onUserAction?.('edit', user)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => onUserAction?.('message', user)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  Message
                </button>
                <button
                  onClick={() => onUserAction?.('delete', user)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              user.isActive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate" title={user.email}>
                {user.email}
              </span>
            </div>
            
            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  {user.phoneNumber}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>

            {user.lastLoginAt && (
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Security Indicators */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            {user.isEmailConfirmed && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Email Confirmed" />
            )}
            {user.phoneNumberConfirmed && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" title="Phone Confirmed" />
            )}
            {user.twoFactorEnabled && (
              <div className="w-2 h-2 bg-purple-500 rounded-full" title="2FA Enabled" />
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {[
                user.isEmailConfirmed && 'Email',
                user.phoneNumberConfirmed && 'Phone',
                user.twoFactorEnabled && '2FA'
              ].filter(Boolean).join(' • ') || 'No verifications'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserCards;