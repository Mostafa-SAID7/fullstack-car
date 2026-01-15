import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Users, UserPlus, List } from 'lucide-react';
import { FriendListComponent, FriendRequestsComponent } from '../components';
import { useFriends, useFriendRequests } from '../hooks';

const FriendsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { friends } = useFriends({ pageNumber: 1, pageSize: 100 });
    const { requests } = useFriendRequests(1);

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <UserCheck className="w-4 h-4" />
        },
        {
            id: 'friends',
            label: 'All Friends',
            icon: <List className="w-4 h-4" />
        },
        {
            id: 'requests',
            label: 'Friend Requests',
            icon: <UserPlus className="w-4 h-4" />,
            badge: requests?.totalCount || 0
        }
    ];

    const activeFriends = friends?.items.filter(f => f.status === 2).length || 0;
    const pendingFriends = friends?.items.filter(f => f.status === 1).length || 0;

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
                                            <p className="text-sm font-medium text-muted-foreground">Total Friends</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {friends?.totalCount || 0}
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
                                            <p className="text-sm font-medium text-muted-foreground">Active</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {activeFriends}
                                            </p>
                                        </div>
                                        <UserCheck className="w-8 h-8 text-success" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {pendingFriends}
                                            </p>
                                        </div>
                                        <UserPlus className="w-8 h-8 text-warning" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Requests</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {requests?.totalCount || 0}
                                            </p>
                                        </div>
                                        <UserPlus className="w-8 h-8 text-info" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Friend Requests */}
                        {requests && requests.items.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-foreground">Recent Friend Requests</h3>
                                    <p className="text-sm text-muted-foreground">Latest pending requests</p>
                                </div>
                                <div className="card-body">
                                    <div className="space-y-4">
                                        {requests.items.slice(0, 5).map((request) => (
                                            <div key={request.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                                {request.senderProfileImageUrl && (
                                                    <img
                                                        src={request.senderProfileImageUrl}
                                                        alt={`${request.senderFirstName} ${request.senderLastName}`}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {request.senderFirstName} {request.senderLastName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(request.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Friends */}
                        {friends && friends.items.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-foreground">Recent Friends</h3>
                                    <p className="text-sm text-muted-foreground">Latest connections</p>
                                </div>
                                <div className="card-body">
                                    <div className="space-y-4">
                                        {friends.items
                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                            .slice(0, 5)
                                            .map((friend) => (
                                                <div key={friend.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                                    {friend.friendProfileImageUrl && (
                                                        <img
                                                            src={friend.friendProfileImageUrl}
                                                            alt={`${friend.friendFirstName} ${friend.friendLastName}`}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground">
                                                            {friend.friendFirstName} {friend.friendLastName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {friend.acceptedAt 
                                                                ? new Date(friend.acceptedAt).toLocaleDateString()
                                                                : new Date(friend.createdAt).toLocaleDateString()
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'friends':
                return <FriendListComponent />;
            case 'requests':
                return <FriendRequestsComponent />;
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
                <h1 className="text-3xl font-bold text-foreground">Friends Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage user connections and friend requests
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
                                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm relative
                                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            {tab.badge !== undefined && tab.badge > 0 && (
                                <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>{renderTabContent()}</div>
        </motion.div>
    );
};

export default FriendsManagement;
