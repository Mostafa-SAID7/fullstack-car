import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Award,
  Activity,
  Clock,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { LineChart, PieChart } from '../charts';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../data-display/tables/Table';
import { Button } from '../forms';
import { StatsCards } from '../shared';
import { Card } from '../layout/cards/Card';
import { cn } from '../../lib/utils';
import type { QAAnalytics } from '../../types/qa/api-types';

interface QAAnalyticsComponentProps {
  className?: string;
}

export const QAAnalyticsComponent: React.FC<QAAnalyticsComponentProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<QAAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration - in real implementation, this would come from API
  const mockAnalytics: QAAnalytics = {
    totalQuestions: 1247,
    totalAnswers: 3891,
    totalVotes: 15623,
    totalUsers: 892,
    averageResponseTime: 4.2,
    topCategories: [
      { name: 'Technical Support', count: 342 },
      { name: 'Product Features', count: 289 },
      { name: 'Troubleshooting', count: 234 },
      { name: 'General Questions', count: 198 },
      { name: 'Bug Reports', count: 184 }
    ],
    topTags: [
      { name: 'javascript', count: 156 },
      { name: 'react', count: 134 },
      { name: 'api', count: 98 },
      { name: 'database', count: 87 },
      { name: 'authentication', count: 76 }
    ],
    topExperts: [
      {
        userId: '1',
        userName: 'Sarah Johnson',
        category: 'Technical Support',
        expertiseLevel: 'Expert',
        answerCount: 234,
        acceptedAnswerCount: 189,
        averageRating: 4.8,
        responseRate: 95,
        reputationScore: 15420,
        badgesEarned: ['Expert', 'Helpful', 'Consistent']
      },
      {
        userId: '2',
        userName: 'Mike Chen',
        category: 'Product Features',
        expertiseLevel: 'Master',
        answerCount: 198,
        acceptedAnswerCount: 167,
        averageRating: 4.9,
        responseRate: 98,
        reputationScore: 18750,
        badgesEarned: ['Master', 'Guru', 'Reliable']
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'question_created',
        userId: 'user1',
        userName: 'John Doe',
        contentId: 'q1',
        contentTitle: 'How to implement OAuth2 authentication?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        type: 'answer_accepted',
        userId: 'user2',
        userName: 'Jane Smith',
        contentId: 'a1',
        contentTitle: 'Database connection pooling best practices',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      }
    ],
    trendingQuestions: [
      {
        id: '1',
        title: 'Best practices for React state management',
        category: 'Technical Support',
        tags: ['react', 'state', 'redux'],
        viewCount: 1234,
        voteScore: 45,
        answerCount: 8,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user1',
        userName: 'Developer123',
        userReputation: 2340,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ],
    unansweredQuestions: [
      {
        id: '2',
        title: 'Integration with third-party payment gateway',
        category: 'Product Features',
        tags: ['payment', 'integration', 'api'],
        viewCount: 89,
        voteScore: 12,
        answerCount: 0,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user3',
        userName: 'NewUser',
        userReputation: 150,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
      }
    ],
    flaggedContent: [
      {
        id: '1',
        contentId: 'q123',
        contentType: 'Question',
        contentTitle: 'Inappropriate question title',
        flagReason: 'Spam',
        flaggedBy: 'moderator1',
        flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        status: 'pending'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const loadAnalytics = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics(mockAnalytics);
      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // Export analytics data
    console.log('Exporting analytics data...');
  };

  const statsCards = useMemo(() => {
    if (!analytics) return [];
    
    return [
      {
        label: 'Total Questions',
        value: analytics.totalQuestions.toLocaleString(),
        icon: HelpCircle,
        change: '+12.5%',
        changeType: 'positive' as const,
        color: 'text-blue-600'
      },
      {
        label: 'Total Answers',
        value: analytics.totalAnswers.toLocaleString(),
        icon: MessageSquare,
        change: '+8.3%',
        changeType: 'positive' as const,
        color: 'text-green-600'
      },
      {
        label: 'Total Votes',
        value: analytics.totalVotes.toLocaleString(),
        icon: ThumbsUp,
        change: '+15.7%',
        changeType: 'positive' as const,
        color: 'text-purple-600'
      },
      {
        label: 'Active Users',
        value: analytics.totalUsers.toLocaleString(),
        icon: Users,
        change: '+5.2%',
        changeType: 'positive' as const,
        color: 'text-orange-600'
      }
    ];
  }, [analytics]);

  const categoryChartData = useMemo(() => {
    if (!analytics) return [];
    return analytics.topCategories.map(cat => ({
      label: cat.name,
      value: cat.count,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
  }, [analytics]);

  const activityChartData = useMemo(() => {
    // Mock time series data for activity
    return [
      { x: 'Mon', y: 45 },
      { x: 'Tue', y: 52 },
      { x: 'Wed', y: 38 },
      { x: 'Thu', y: 61 },
      { x: 'Fri', y: 55 },
      { x: 'Sat', y: 32 },
      { x: 'Sun', y: 28 }
    ];
  }, []);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load analytics data</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">QA Analytics</h2>
          <p className="text-muted-foreground">Monitor question and answer activity across your platform</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </Button>
          
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={statsCards} loading={false} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Weekly Activity
          </h3>
          <LineChart
            data={activityChartData}
            width={400}
            height={200}
            title=""
            color="#3b82f6"
          />
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Questions by Category
          </h3>
          <PieChart
            data={categoryChartData}
            width={400}
            height={200}
            showLegend={true}
            title=""
          />
        </Card>

        {/* Top Experts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Experts
          </h3>
          <div className="space-y-3">
            {analytics.topExperts.map((expert, index) => (
              <div key={expert.userId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{expert.userName}</p>
                    <p className="text-sm text-muted-foreground">{expert.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{expert.reputationScore.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{expert.acceptedAnswerCount} accepted</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span>
                    {' '}
                    {activity.type === 'question_created' && 'asked a question'}
                    {activity.type === 'answer_created' && 'posted an answer'}
                    {activity.type === 'answer_accepted' && 'accepted an answer'}
                    {activity.type === 'vote_cast' && 'voted on content'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{activity.contentTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trending Questions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Trending Questions
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Answers</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.trendingQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <div>
                    <p className="font-medium truncate max-w-xs">{question.title}</p>
                    <p className="text-sm text-muted-foreground">by {question.userName}</p>
                  </div>
                </TableCell>
                <TableCell>{question.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {question.viewCount}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {question.voteScore}
                  </div>
                </TableCell>
                <TableCell>{question.answerCount}</TableCell>
                <TableCell>
                  {question.hasAcceptedAnswer ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Answered
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="w-4 h-4" />
                      Open
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default QAAnalyticsComponent;