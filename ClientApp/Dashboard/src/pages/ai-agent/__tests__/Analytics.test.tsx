import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Analytics } from '../components/Analytics';
import { analyticsService, AIAgentAnalyticsService } from '../../../services/ai-agent/analytics';

// Mock the analytics service
jest.mock('../../../services/ai-agent/analytics');

// Type the mocked service
const mockAnalyticsService = analyticsService as jest.Mocked<AIAgentAnalyticsService>;

const mockAnalyticsOverview = {
  totalConversations: 1250,
  activeConversations: 45,
  satisfactionScore: 92.5,
  averageResponseTime: 1250,
  tokensUsed: 2500000,
  uptime: 99.8,
  errorRate: 0.2,
  periodStart: '2024-01-01T00:00:00Z',
  periodEnd: '2024-01-31T23:59:59Z'
};

describe('Analytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyticsService.getOverview.mockResolvedValue(mockAnalyticsOverview);
    mockAnalyticsService.exportAnalytics.mockResolvedValue(new Blob(['test data']));

    // Mock URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:test');
    globalThis.URL.revokeObjectURL = jest.fn();
  });

  it('renders analytics dashboard header', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.getByText('AI agent performance and insights')).toBeInTheDocument();
    });
  });

  it('displays total conversations metric', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('Total Conversations')).toBeInTheDocument();
    });
  });

  it('displays active conversations count', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('45 active')).toBeInTheDocument();
    });
  });

  it('displays satisfaction score', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('92.5%')).toBeInTheDocument();
      expect(screen.getByText('Satisfaction Score')).toBeInTheDocument();
    });
  });

  it('displays average response time', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/1250ms avg response/)).toBeInTheDocument();
    });
  });

  it('displays estimated cost', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('$25.00')).toBeInTheDocument();
      expect(screen.getByText('Estimated Cost')).toBeInTheDocument();
    });
  });

  it('displays token usage', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('2,500,000 tokens')).toBeInTheDocument();
    });
  });

  it('displays system uptime', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('99.8%')).toBeInTheDocument();
      expect(screen.getByText('System Uptime')).toBeInTheDocument();
    });
  });

  it('displays error rate', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('0.20% error rate')).toBeInTheDocument();
    });
  });

  it('changes date range', async () => {
    render(<Analytics />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '7d' } });
    });

    await waitFor(() => {
      expect(mockAnalyticsService.getOverview).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String)
        })
      );
    });
  });

  it('refreshes analytics data', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    jest.clearAllMocks();

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockAnalyticsService.getOverview).toHaveBeenCalled();
    });
  });

  it('exports analytics as CSV', async () => {
    render(<Analytics />);

    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.mouseEnter(exportButton.parentElement!);
    });

    await waitFor(() => {
      const csvButton = screen.getByText('Export CSV');
      fireEvent.click(csvButton);
    });

    await waitFor(() => {
      expect(mockAnalyticsService.exportAnalytics).toHaveBeenCalledWith('csv', expect.any(Object));
    });
  });

  it('exports analytics as PDF', async () => {
    render(<Analytics />);

    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.mouseEnter(exportButton.parentElement!);
    });

    await waitFor(() => {
      const pdfButton = screen.getByText('Export PDF');
      fireEvent.click(pdfButton);
    });

    await waitFor(() => {
      expect(mockAnalyticsService.exportAnalytics).toHaveBeenCalledWith('pdf', expect.any(Object));
    });
  });

  it('handles error loading analytics', async () => {
    mockAnalyticsService.getOverview.mockRejectedValue(
      new Error('Failed to load analytics')
    );

    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load analytics data/i)).toBeInTheDocument();
    });
  });

  it('handles export error', async () => {
    mockAnalyticsService.exportAnalytics.mockRejectedValue(
      new Error('Export failed')
    );

    render(<Analytics />);

    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.mouseEnter(exportButton.parentElement!);
    });

    await waitFor(() => {
      const csvButton = screen.getByText('Export CSV');
      fireEvent.click(csvButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to export analytics/i)).toBeInTheDocument();
    });
  });

  it('renders conversation chart', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/conversation/i)).toBeInTheDocument();
    });
  });

  it('renders agent performance chart', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/performance/i)).toBeInTheDocument();
    });
  });

  it('renders topic analysis', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/topic/i)).toBeInTheDocument();
    });
  });

  it('renders satisfaction trends chart', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/satisfaction/i)).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<Analytics />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('updates data when date range changes', async () => {
    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    jest.clearAllMocks();

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '90d' } });

    await waitFor(() => {
      expect(mockAnalyticsService.getOverview).toHaveBeenCalled();
    });
  });

  it('handles all time date range', async () => {
    render(<Analytics />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'all' } });
    });

    await waitFor(() => {
      expect(mockAnalyticsService.getOverview).toHaveBeenCalledWith({});
    });
  });

  it('disables export button while exporting', async () => {
    render(<Analytics />);

    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.mouseEnter(exportButton.parentElement!);
    });

    await waitFor(() => {
      const csvButton = screen.getByText('Export CSV');
      fireEvent.click(csvButton);
    });

    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeDisabled();
  });

  it('shows success message after export', async () => {
    render(<Analytics />);

    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.mouseEnter(exportButton.parentElement!);
    });

    await waitFor(() => {
      const csvButton = screen.getByText('Export CSV');
      fireEvent.click(csvButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/analytics exported as CSV/i)).toBeInTheDocument();
    });
  });
});
