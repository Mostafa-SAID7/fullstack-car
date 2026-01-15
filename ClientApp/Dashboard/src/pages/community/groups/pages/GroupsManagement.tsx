import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, List, TrendingUp } from 'lucide-react';
import { GroupAnalyticsComponent, GroupListComponent } from '../components';
import { useGroups } from '../hooks';

const GroupsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { groups } = useGroups({ pageNumber: 1, pageSize: 100 });

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <BarChart3 className="w-4 h-4" />
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            id: 'groups',
            label: 'All Groups',
            icon: <List className="w-4 h-4" />
        }
    ];

    const totalMembers = groups?.items.reduce((sum, g) => sum + g.membersCount, 0) || 0;
    const totalPosts = groups?.items.reduce((sum, g) => sum + g.postsCount, 0) || 0;
    const avgMembersPerGroup = groups && groups.items.length > 0 
        ? (totalMembers / groups.items.length).toFixed(1) 
        : 0;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Groups</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {groups?.totalCount || 0}
                                            </p>
                                        </div>
                                        <Users className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalMembers.toLocaleString()}
                                            </p>
                                        </div>
                                        <Users className="w-8 h-8 text-success" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalPosts.toLocaleString()}
                                            </p>
                                        </div>
                                        <BarChart3 className="w-8 h-8 text-info" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Avg Members</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {avgMembersPerGroup}
                                            </p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-warning" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Groups */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-foreground">Recent Groups</h3>
                                <p className="text-sm text-muted-foreground">Latest groups in your community</p>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {groups?.items
                                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                        .slice(0, 5)
                                        .map((group) => (
                                            <div key={group.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                                {group.imageUrl && (
                                                    <img
                                                        src={group.imageUrl}
                                                        alt={group.name}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {group.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        By {group.ownerFirstName} {group.ownerLastName} • {new Date(group.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return <GroupAnalyticsComponent />;
            case 'groups':
                return <GroupListComponent />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="border-b border-border pb-6">
                <h1 className="text-3xl font-bold text-foreground">Groups Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and monitor community groups and memberships
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>{renderTabContent()}</div>
        </motion.div>
    );
};

export default GroupsManagement;
