import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp,
  Star,
  Crown,
  Medal,
  Target,
  Edit3,
  Plus,
  Minus,
  RefreshCw,
  Eye,
  History
} from 'lucide-react';
import { Card } from '../layout/cards/Card';
import { Button } from '../forms/buttons/Button';
import { Input } from '../forms/inputs/Input';
import { DataTable } from '../shared/DataTable';
import { StatsCards } from '../shared';
import { Badge } from '../data-display/badges/Badge';
import { Avatar } from '../data-display/avatars/Avatar';
import { Modal } from '../layout/modals/Modal';
import { cn } from '../../lib/utils';
import type { 
  UserReputation
} from '../../types/qa/api-types';

interface UserReputationManagementComponentProps {
  className?: string;
}

export const UserReputationManagementComponent: React.FC<UserReputationManagementComponentProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserReputation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'reputation' | 'questions' | 'answers'>('reputation');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserReputation | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Mock data for demonstration
  const mockUsers: UserReputation[] = [
    {
      userId: '1',
      userName: 'Sarah Johnson',
      reputationScore: 15420,
      questionsAsked: 45,
      answersGiven: 234,
      acceptedAnswers: 189,
      upvotesReceived: 892,
      downvotesReceived: 23,
      badgesEarned: ['Expert', 'Helpful', 'Consistent', 'Top Contributor'],
      expertiseAreas: ['JavaScript', 'React', 'Node.js'],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      userId: '2',
      userName: 'Mike Chen',
      reputationScore: 18750,
      questionsAsked: 32,
      answersGiven: 198,
      acceptedAnswers: 167,
      upvotesReceived: 1045,
      downvotesReceived: 15,
      badgesEarned: ['Master', 'Guru', 'Reliable', 'Community Leader'],
      expertiseAreas: ['Python', 'Machine Learning', 'Data Science'],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      userId: '3',
      userName: 'Alex Rodriguez',
      reputationScore: 8930,
      questionsAsked: 67,
      answersGiven: 156,
      acceptedAnswers: 98,
      upvotesReceived: 543,
      downvotesReceived: 34,
      badgesEarned: ['Active', 'Helpful', 'Curious'],
      expertiseAreas: ['CSS', 'HTML', 'Frontend'],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    }
  ];

  const mockReputationStats = [
    {
      label: 'Total Users',
      value: '1,247',
      icon: Users,
      change: '+23',
      changeType: 'positive' as const,
      color: 'text-blue-600'
    },
    {
      label: 'Expert Users',
      value: '89',
      icon: Crown,
      change: '+5',
      changeType: 'positive' as const,
      color: 'text-purple-600'
    },
    {
      label: 'Avg Reputation',
      value: '2,340',
      icon: Star,
      change: '+120',
      changeType: 'positive' as const,
      color: 'text-yellow-600'
    },
    {
      label: 'Badges Awarded',
      value: '3,456',
      icon: Medal,
      change: '+67',
      changeType: 'positive' as const,
      color: 'text-green-600'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const filtered = users.filter(user => 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.expertiseAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'reputation':
          return b.reputationScore - a.reputationScore;
        case 'questions':
          return b.questionsAsked - a.questionsAsked;
        case 'answers':
          return b.answersGiven - a.answersGiven;
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, searchTerm, sortBy]);

  const handleAdjustReputation = async () => {
    if (!selectedUser || adjustmentAmount === 0 || !adjustmentReason.trim()) return;

    console.log('Adjusting reputation:', {
      userId: selectedUser.userId,
      amount: adjustmentAmount,
      reason: adjustmentReason
    });

    // Update user reputation locally
    setUsers(prev => prev.map(user => 
      user.userId === selectedUser.userId 
        ? { ...user, reputationScore: user.reputationScore + adjustmentAmount }
        : user
    ));

    // Reset form
    setShowAdjustModal(false);
    setSelectedUser(null);
    setAdjustmentAmount(0);
    setAdjustmentReason('');
  };

  const getReputationLevel = (score: number) => {
    if (score >= 15000) return { level: 'Master', color: 'text-purple-600', icon: Crown };
    if (score >= 10000) return { level: 'Expert', color: 'text-blue-600', icon: Star };
    if (score >= 5000) return { level: 'Advanced', color: 'text-green-600', icon: Award };
    if (score >= 1000) return { level: 'Intermediate', color: 'text-yellow-600', icon: Medal };
    return { level: 'Beginner', color: 'text-gray-600', icon: Target };
  };

  const tableColumns = [
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (value: string, row: UserReputation) => {
        const level = getReputationLevel(row.reputationScore);
        return (
          <div className="flex items-center gap-3">
            <Avatar size="sm" />
            <div>
              <p className="font-medium">{value}</p>
              <div className="flex items-center gap-1">
                <level.icon className={`w-3 h-3 ${level.color}`} />
                <span className={`text-xs ${level.color}`}>{level.level}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'reputationScore',
      label: 'Reputation',
      sortable: true,
      render: (value: number) => (
        <div className="font-semibold text-lg">
          {value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'questionsAsked',
      label: 'Questions',
      sortable: true
    },
    {
      key: 'answersGiven',
      label: 'Answers',
      sortable: true,
      render: (value: number, row: UserReputation) => (
        <div>
          <span className="font-medium">{value}</span>
          <span className="text-sm text-muted-foreground ml-1">
            ({row.acceptedAnswers} accepted)
          </span>
        </div>
      )
    },
    {
      key: 'badgesEarned',
      label: 'Badges',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((badge, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
          {value.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 3}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'expertiseAreas',
      label: 'Expertise',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((area, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {area}
            </Badge>
          ))}
          {value.length > 2 && (
            <span className="text-xs text-muted-foreground">+{value.length - 2}</span>
          )}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: 'View Profile',
      action: 'view',
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'Adjust Reputation',
      action: 'adjust',
      icon: <Edit3 className="w-4 h-4" />
    },
    {
      label: 'View History',
      action: 'history',
      icon: <History className="w-4 h-4" />
    },
    {
      label: 'Award Badge',
      action: 'badge',
      icon: <Medal className="w-4 h-4" />
    }
  ];

  const handleRowAction = (action: string, user: UserReputation) => {
    switch (action) {
      case 'adjust':
        setSelectedUser(user);
        setShowAdjustModal(true);
        break;
      case 'view':
        console.log('Viewing user profile:', user.userId);
        break;
      case 'history':
        console.log('Viewing reputation history:', user.userId);
        break;
      case 'badge':
        console.log('Awarding badge to user:', user.userId);
        break;
    }
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Reputation Management
          </h2>
          <p className="text-muted-foreground">Manage user reputation scores, badges, and expert status</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button>
            <Medal className="w-4 h-4 mr-2" />
            Award Badges
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={mockReputationStats} loading={false} />

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search users by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="reputation">Sort by Reputation</option>
            <option value="questions">Sort by Questions</option>
            <option value="answers">Sort by Answers</option>
          </select>
        </div>

        {/* Data Table */}
        <DataTable
          columns={tableColumns}
          data={filteredUsers}
          loading={false}
          onRowAction={handleRowAction}
          actions={tableActions}
          showToggleColumns={true}
        />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" />
            Top Contributors
          </h3>
          <p className="text-muted-foreground mb-4">
            Users with highest reputation scores this month
          </p>
          <Button variant="outline" className="w-full">
            View Leaderboard
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-yellow-600" />
            Badge Management
          </h3>
          <p className="text-muted-foreground mb-4">
            Create and award badges to recognize achievements
          </p>
          <Button variant="outline" className="w-full">
            Manage Badges
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Reputation Trends
          </h3>
          <p className="text-muted-foreground mb-4">
            Analyze reputation changes and user engagement
          </p>
          <Button variant="outline" className="w-full">
            View Analytics
          </Button>
        </Card>
      </div>

      {/* Reputation Adjustment Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title="Adjust User Reputation"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar size="md" />
              <div>
                <p className="font-medium">{selectedUser.userName}</p>
                <p className="text-sm text-muted-foreground">
                  Current reputation: {selectedUser.reputationScore.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adjustment Amount</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdjustmentAmount(prev => prev - 10)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                  className="text-center"
                  placeholder="0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdjustmentAmount(prev => prev + 10)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                New reputation: {(selectedUser.reputationScore + adjustmentAmount).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason for Adjustment</label>
              <textarea
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                rows={3}
                placeholder="Explain the reason for this reputation adjustment..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAdjustModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdjustReputation}
                disabled={adjustmentAmount === 0 || !adjustmentReason.trim()}
              >
                Apply Adjustment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserReputationManagementComponent;