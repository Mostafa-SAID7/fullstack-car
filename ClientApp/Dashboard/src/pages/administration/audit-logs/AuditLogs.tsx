import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Download, Calendar, User, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AuditLogs: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-01-06 14:30:25',
      user: 'admin@example.com',
      action: 'User Login',
      resource: 'Authentication System',
      ipAddress: '192.168.1.100',
      status: 'Success',
      details: 'Successful login attempt'
    },
    {
      id: 2,
      timestamp: '2024-01-06 14:25:10',
      user: 'john.doe@example.com',
      action: 'Data Export',
      resource: 'User Management',
      ipAddress: '192.168.1.105',
      status: 'Success',
      details: 'Exported user list to CSV'
    },
    {
      id: 3,
      timestamp: '2024-01-06 14:20:45',
      user: 'system',
      action: 'System Backup',
      resource: 'Database',
      ipAddress: 'localhost',
      status: 'Success',
      details: 'Automated daily backup completed'
    },
    {
      id: 4,
      timestamp: '2024-01-06 14:15:30',
      user: 'unknown',
      action: 'Failed Login',
      resource: 'Authentication System',
      ipAddress: '203.0.113.45',
      status: 'Failed',
      details: 'Multiple failed login attempts detected'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {t('audit_logs', 'Audit Logs')}
            </h1>
            <p className="text-muted-foreground">
              {t('audit_logs_desc', 'System audit and security logs')}
            </p>
          </div>
        </div>
        
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          {t('export_logs', 'Export Logs')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={t('search_logs', 'Search logs...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">{t('all_actions', 'All Actions')}</option>
            <option value="login">{t('login_attempts', 'Login Attempts')}</option>
            <option value="data">{t('data_operations', 'Data Operations')}</option>
            <option value="system">{t('system_events', 'System Events')}</option>
          </select>
          
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <Calendar className="w-4 h-4" />
            {t('date_range', 'Date Range')}
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('timestamp', 'Timestamp')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('user', 'User')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('action', 'Action')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('resource', 'Resource')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('ip_address', 'IP Address')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('status', 'Status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/25 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {log.resource}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};