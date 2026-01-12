import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

import { QAAnalyticsComponent } from '../QAAnalyticsComponent';
import { ModerationDashboardComponent } from '../ModerationDashboardComponent';
import { UserReputationManagementComponent } from '../UserReputationManagementComponent';
import { QAHealthMonitoringComponent } from '../QAHealthMonitoringComponent';

// Mock API service
const mockApiService = {
  get: jest.fn() as jest.MockedFunction<any>,
  post: jest.fn() as jest.MockedFunction<any>,
  put: jest.fn() as jest.MockedFunction<any>,
  delete: jest.fn() as jest.MockedFunction<any>,
};

// Mock SignalR service
const mockSignalRService = {
  connect: jest.fn() as jest.MockedFunction<any>,
  disconnect: jest.fn() as jest.MockedFunction<any>,
  on: jest.fn() as jest.MockedFunction<any>,
  off: jest.fn() as jest.MockedFunction<any>,
  invoke: jest.fn() as jest.MockedFunction<any>,
  connectionState: 'Connected',
};

// Mock hooks
jest.mock('../../../hooks/useQASignalRConnection', () => ({
  useQASignalRConnection: () => mockSignalRService,
}));

jest.mock('../../../services/api/ApiService', () => ({
  ApiService: mockApiService,
}));

/**
 * React Dashboard QA Integration Tests
 * Tests complete admin workflows in React Dashboard application
 * Validates component integration, real-time features, and admin operations
 */
describe('QA React Dashboard Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default API responses
    mockApiService.get.mockImplementation((url: string) => {
      if (url.includes('/api/v7/qa/analytics/dashboard')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              totalQuestions: 1250,
              totalAnswers: 3420,
              totalUsers: 890,
              averageResponseTime: 145,
              topCategories: [
                { name: 'Web Development', questionCount: 450, answerRate: 0.85 },
                { name: 'Database Design', questionCount: 320, answerRate: 0.78 },
                { name: 'DevOps & Cloud', questionCount: 280, answerRate: 0.82 }
              ],
              recentActivity: [
                {
                  id: '1',
                  type: 'QuestionCreated',
                  title: 'How to optimize React performance?',
                  user: 'john.doe',
                  timestamp: new Date().toISOString()
                }
              ]
            }
          }
        });
      }
      
      if (url.includes('/api/v7/qa/reputation/leaderboard')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              items: [
                {
                  userId: 'user1',
                  username: 'ExpertDev',
                  reputation: 2850,
                  questionsAsked: 12,
                  answersGiven: 45,
                  acceptedAnswers: 28,
                  badges: ['Expert', 'Knowledgeable']
                },
                {
                  userId: 'user2', 
                  username: 'SeniorDev',
                  reputation: 1920,
                  questionsAsked: 8,
                  answersGiven: 32,
                  acceptedAnswers: 19,
                  badges: ['Knowledgeable', 'Helpful']
                }
              ],
              totalCount: 2
            }
          }
        });
      }

      if (url.includes('/api/v7/qa/questions/moderation-queue')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              items: [
                {
                  id: 'q1',
                  title: 'Flagged question requiring review',
                  content: 'This question has been flagged for review',
                  flags: ['inappropriate', 'spam'],
                  flagCount: 3,
                  author: 'suspicious.user'
                }
              ],
              totalCount: 1
            }
          }
        });
      }

      if (url.includes('/api/v7/qa/health/metrics')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              systemHealth: 'Healthy',
              responseTime: 145,
              errorRate: 0.02,
              activeConnections: 234,
              queueLength: 5,
              lastUpdated: new Date().toISOString()
            }
          }
        });
      }

      return Promise.resolve({ data: { success: true, data: {} } });
    });
  });

  describe('Complete Admin Workflow - Analytics and Monitoring', () => {
    it('should display comprehensive QA analytics dashboard', async () => {
      render(<QAAnalyticsComponent />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('1,250')).toBeInTheDocument(); // Total questions
        expect(screen.getByText('3,420')).toBeInTheDocument(); // Total answers
        expect(screen.getByText('890')).toBeInTheDocument(); // Total users
        expect(screen.getByText('145ms')).toBeInTheDocument(); // Average response time
      });

      // Verify category performance metrics
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument(); // Question count
      expect(screen.getByText('85%')).toBeInTheDocument(); // Answer rate

      // Verify recent activity
      expect(screen.getByText('How to optimize React performance?')).toBeInTheDocument();
      expect(screen.getByText('john.doe')).toBeInTheDocument();
    });

    it('should handle real-time analytics updates', async () => {
      render(<QAAnalyticsComponent />);

      await waitFor(() => {
        expect(screen.getByText('1,250')).toBeInTheDocument();
      });

      // Simulate real-time update
      act(() => {
        const updateCallback = mockSignalRService.on.mock.calls
          .find((call: any[]) => call[0] === 'AnalyticsUpdate')?.[1];
        
        if (updateCallback && typeof updateCallback === 'function') {
          updateCallback({
            totalQuestions: 1251,
            totalAnswers: 3421,
            recentActivity: [
              {
                id: '2',
                type: 'AnswerCreated',
                title: 'New answer posted',
                user: 'expert.user',
                timestamp: new Date().toISOString()
              }
            ]
          });
        }
      });

      // Verify real-time updates
      await waitFor(() => {
        expect(screen.getByText('1,251')).toBeInTheDocument();
        expect(screen.getByText('3,421')).toBeInTheDocument();
        expect(screen.getByText('New answer posted')).toBeInTheDocument();
      });
    });
  });

  describe('User Reputation Management Workflow', () => {
    it('should display and manage user reputation leaderboard', async () => {
      render(<UserReputationManagementComponent />);

      // Wait for leaderboard data
      await waitFor(() => {
        expect(screen.getByText('ExpertDev')).toBeInTheDocument();
        expect(screen.getByText('2,850')).toBeInTheDocument();
        expect(screen.getByText('SeniorDev')).toBeInTheDocument();
        expect(screen.getByText('1,920')).toBeInTheDocument();
      });

      // Verify badges are displayed
      expect(screen.getByText('Expert')).toBeInTheDocument();
      expect(screen.getByText('Knowledgeable')).toBeInTheDocument();
      expect(screen.getByText('Helpful')).toBeInTheDocument();

      // Test reputation adjustment
      const adjustButton = screen.getByText('Adjust Reputation');
      fireEvent.click(adjustButton);

      // Verify adjustment modal opens
      await waitFor(() => {
        expect(screen.getByText('Adjust User Reputation')).toBeInTheDocument();
      });
    });

    it('should handle bulk reputation operations', async () => {
      mockApiService.post.mockResolvedValueOnce({
        data: { success: true, message: 'Bulk operation completed' }
      });

      render(<UserReputationManagementComponent />);

      await waitFor(() => {
        expect(screen.getByText('ExpertDev')).toBeInTheDocument();
      });

      // Select multiple users
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      // Perform bulk operation
      const bulkButton = screen.getByText('Bulk Award Badge');
      fireEvent.click(bulkButton);

      // Verify API call
      await waitFor(() => {
        expect(mockApiService.post).toHaveBeenCalledWith(
          '/api/v7/qa/reputation/bulk-award-badge',
          expect.objectContaining({
            userIds: expect.arrayContaining(['user1', 'user2']),
            badgeType: expect.any(String)
          })
        );
      });
    });
  });

  describe('Content Moderation Workflow', () => {
    it('should display moderation queue and handle content review', async () => {
      render(<ModerationDashboardComponent />);

      // Wait for moderation queue data
      await waitFor(() => {
        expect(screen.getByText('Flagged question requiring review')).toBeInTheDocument();
        expect(screen.getByText('suspicious.user')).toBeInTheDocument();
        expect(screen.getByText('3 flags')).toBeInTheDocument();
      });

      // Verify flag types are displayed
      expect(screen.getByText('inappropriate')).toBeInTheDocument();
      expect(screen.getByText('spam')).toBeInTheDocument();

      // Test moderation action
      mockApiService.post.mockResolvedValueOnce({
        data: { success: true, message: 'Content moderated successfully' }
      });

      const approveButton = screen.getByText('Approve');
      fireEvent.click(approveButton);

      // Verify moderation API call
      await waitFor(() => {
        expect(mockApiService.post).toHaveBeenCalledWith(
          '/api/v7/qa/moderation/approve',
          expect.objectContaining({
            contentId: 'q1',
            action: 'approve'
          })
        );
      });
    });

    it('should handle bulk moderation operations', async () => {
      mockApiService.post.mockResolvedValueOnce({
        data: { success: true, message: 'Bulk moderation completed' }
      });

      render(<ModerationDashboardComponent />);

      await waitFor(() => {
        expect(screen.getByText('Flagged question requiring review')).toBeInTheDocument();
      });

      // Select content for bulk action
      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      // Perform bulk moderation
      const bulkRejectButton = screen.getByText('Bulk Reject');
      fireEvent.click(bulkRejectButton);

      // Verify bulk moderation API call
      await waitFor(() => {
        expect(mockApiService.post).toHaveBeenCalledWith(
          '/api/v7/qa/moderation/bulk-action',
          expect.objectContaining({
            contentIds: ['q1'],
            action: 'reject',
            reason: expect.any(String)
          })
        );
      });
    });
  });

  describe('System Health Monitoring Workflow', () => {
    it('should display system health metrics and alerts', async () => {
      render(<QAHealthMonitoringComponent />);

      // Wait for health metrics
      await waitFor(() => {
        expect(screen.getByText('Healthy')).toBeInTheDocument();
        expect(screen.getByText('145ms')).toBeInTheDocument(); // Response time
        expect(screen.getByText('0.02%')).toBeInTheDocument(); // Error rate
        expect(screen.getByText('234')).toBeInTheDocument(); // Active connections
      });

      // Verify health status indicator
      const healthIndicator = screen.getByTestId('health-status');
      expect(healthIndicator).toHaveClass('status-healthy');
    });

    it('should handle system alerts and notifications', async () => {
      render(<QAHealthMonitoringComponent />);

      await waitFor(() => {
        expect(screen.getByText('Healthy')).toBeInTheDocument();
      });

      // Simulate system alert
      act(() => {
        const alertCallback = mockSignalRService.on.mock.calls
          .find((call: any[]) => call[0] === 'SystemAlert')?.[1];
        
        if (alertCallback && typeof alertCallback === 'function') {
          alertCallback({
            type: 'warning',
            message: 'High response time detected',
            metric: 'responseTime',
            value: 850,
            threshold: 500,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Verify alert is displayed
      await waitFor(() => {
        expect(screen.getByText('High response time detected')).toBeInTheDocument();
        expect(screen.getByText('850ms')).toBeInTheDocument();
      });

      // Verify alert styling
      const alertElement = screen.getByTestId('system-alert');
      expect(alertElement).toHaveClass('alert-warning');
    });

    it('should handle performance monitoring and optimization suggestions', async () => {
      // Mock performance data with issues
      mockApiService.get.mockImplementation((url: string) => {
        if (url.includes('/api/v7/qa/health/performance')) {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                slowQueries: [
                  {
                    query: 'SELECT * FROM Questions WHERE...',
                    averageTime: 1200,
                    executionCount: 450,
                    suggestion: 'Add index on Category column'
                  }
                ],
                memoryUsage: 85,
                cpuUsage: 72,
                recommendations: [
                  'Consider adding database indexes',
                  'Implement query result caching',
                  'Optimize SignalR connection pooling'
                ]
              }
            }
          });
        }
        return Promise.resolve({ data: { success: true, data: {} } });
      });

      render(<QAHealthMonitoringComponent />);

      // Click performance tab
      const performanceTab = screen.getByText('Performance');
      fireEvent.click(performanceTab);

      // Wait for performance data
      await waitFor(() => {
        expect(screen.getByText('Add index on Category column')).toBeInTheDocument();
        expect(screen.getByText('Consider adding database indexes')).toBeInTheDocument();
      });

      // Verify performance metrics
      expect(screen.getByText('85%')).toBeInTheDocument(); // Memory usage
      expect(screen.getByText('72%')).toBeInTheDocument(); // CPU usage
    });
  });

  describe('Real-time Dashboard Updates', () => {
    it('should synchronize data across multiple dashboard components', async () => {
      render(
        <div>
          <QAAnalyticsComponent />
          <ModerationDashboardComponent />
        </div>
      );

      // Wait for initial data
      await waitFor(() => {
        expect(screen.getByText('1,250')).toBeInTheDocument();
        expect(screen.getByText('Flagged question requiring review')).toBeInTheDocument();
      });

      // Simulate real-time update affecting both components
      act(() => {
        const analyticsCallback = mockSignalRService.on.mock.calls
          .find((call: any[]) => call[0] === 'AnalyticsUpdate')?.[1];
        const moderationCallback = mockSignalRService.on.mock.calls
          .find((call: any[]) => call[0] === 'ModerationUpdate')?.[1];
        
        if (analyticsCallback && typeof analyticsCallback === 'function') {
          analyticsCallback({
            totalQuestions: 1251,
            totalAnswers: 3421
          });
        }

        if (moderationCallback && typeof moderationCallback === 'function') {
          moderationCallback({
            newFlaggedContent: {
              id: 'q2',
              title: 'Another flagged question',
              flags: ['spam'],
              flagCount: 1
            }
          });
        }
      });

      // Verify both components updated
      await waitFor(() => {
        expect(screen.getByText('1,251')).toBeInTheDocument();
        expect(screen.getByText('Another flagged question')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle API errors gracefully', async () => {
      mockApiService.get.mockRejectedValueOnce(new Error('Network error'));

      render(<QAAnalyticsComponent />);

      // Verify error state is displayed
      await waitFor(() => {
        expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      // Test retry functionality
      mockApiService.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            totalQuestions: 1250,
            totalAnswers: 3420,
            totalUsers: 890,
            averageResponseTime: 145
          }
        }
      });

      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      // Verify data loads after retry
      await waitFor(() => {
        expect(screen.getByText('1,250')).toBeInTheDocument();
      });
    });

    it('should handle SignalR connection issues', async () => {
      // Simulate connection lost
      mockSignalRService.connectionState = 'Disconnected';

      render(<QAHealthMonitoringComponent />);

      // Verify offline indicator
      await waitFor(() => {
        expect(screen.getByText('Connection Lost')).toBeInTheDocument();
        expect(screen.getByText('Attempting to reconnect...')).toBeInTheDocument();
      });

      // Simulate reconnection
      act(() => {
        mockSignalRService.connectionState = 'Connected';
        const reconnectCallback = mockSignalRService.on.mock.calls
          .find((call: any[]) => call[0] === 'Reconnected')?.[1];
        
        if (reconnectCallback && typeof reconnectCallback === 'function') {
          reconnectCallback();
        }
      });

      // Verify connection restored
      await waitFor(() => {
        expect(screen.getByText('Connected')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
        userId: `user${i}`,
        username: `User${i}`,
        reputation: Math.floor(Math.random() * 5000),
        questionsAsked: Math.floor(Math.random() * 50),
        answersGiven: Math.floor(Math.random() * 100),
        acceptedAnswers: Math.floor(Math.random() * 30),
        badges: ['Contributor']
      }));

      mockApiService.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            items: largeUserList,
            totalCount: 1000
          }
        }
      });

      const startTime = performance.now();
      render(<UserReputationManagementComponent />);

      await waitFor(() => {
        expect(screen.getByText('User0')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Verify rendering performance
      expect(renderTime).toBeLessThan(2000); // Should render within 2 seconds

      // Verify virtualization or pagination is working
      const visibleRows = screen.getAllByTestId('user-row');
      expect(visibleRows.length).toBeLessThanOrEqual(50); // Should limit visible rows
    });
  });
});