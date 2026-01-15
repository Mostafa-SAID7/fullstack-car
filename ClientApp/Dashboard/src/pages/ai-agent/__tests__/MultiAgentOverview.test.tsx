import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiAgentOverview } from '../components/MultiAgentOverview';
import { agentManagementService } from '../../../services/ai-agent';
import { AgentStatus } from '../../../types/ai-agent';

// Mock the agents service
jest.mock('../../../services/ai-agent');

const mockAgents: AgentStatus[] = [
  {
    agentType: 'general',
    isActive: true,
    totalConversations: 150,
    averageSatisfaction: 0.92,
    lastUsed: '2024-01-15T10:00:00Z'
  },
  {
    agentType: 'mechanic',
    isActive: true,
    totalConversations: 85,
    averageSatisfaction: 0.95,
    lastUsed: '2024-01-15T10:00:00Z'
  },
  {
    agentType: 'buyer_guide',
    isActive: true,
    totalConversations: 120,
    averageSatisfaction: 0.88,
    lastUsed: '2024-01-15T10:00:00Z'
  }
];

describe('MultiAgentOverview Component', () => {
  const mockedService = agentManagementService as jest.Mocked<typeof agentManagementService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedService.listAgents.mockResolvedValue({ agents: mockAgents });
  });

  it('renders loading state initially', () => {
    render(<MultiAgentOverview />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays all agents after loading', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      expect(screen.getByText('General Agent')).toBeInTheDocument();
      expect(screen.getByText('Mechanic Agent')).toBeInTheDocument();
      expect(screen.getByText('Buyer\'s Guide')).toBeInTheDocument();
    });
  });

  it('displays overall metrics correctly', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      expect(screen.getByText('355')).toBeInTheDocument(); // Total conversations (150+85+120)
      expect(screen.getByText('35/355')).toBeInTheDocument(); // Active conversations estimate (10% of 355 = 35)
      expect(screen.getByText('92%')).toBeInTheDocument(); // Average satisfaction score (0.92+0.95+0.88)/3 = 0.916... -> 92%
    });
  });

  it('shows agent status indicators', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      const statusBadges = screen.getAllByText('Active');
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });

  it('displays agent metrics', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      expect(screen.getByText('150 conversations')).toBeInTheDocument();
      expect(screen.getByText('85 conversations')).toBeInTheDocument();
      expect(screen.getByText('120 conversations')).toBeInTheDocument();
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      expect(screen.getByText('General Agent')).toBeInTheDocument();
    });

    // Clear previous calls
    jest.clearAllMocks();

    // Click refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    // Verify services were called again
    await waitFor(() => {
      expect(mockedService.listAgents).toHaveBeenCalled();
    });
  });

  it('handles error state gracefully', async () => {
    mockedService.listAgents.mockRejectedValue(new Error('Failed to fetch agents'));

    render(<MultiAgentOverview />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('displays satisfaction rate with color coding', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      const satisfactionElements = screen.getAllByText(/95%|92%|88%/);
      expect(satisfactionElements.length).toBeGreaterThan(0);
    });
  });

  it('shows response time metrics', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      expect(screen.getByText(/1\.2s|1\.5s|1\.3s/)).toBeInTheDocument();
    });
  });

  it('displays token usage', async () => {
    render(<MultiAgentOverview />);

    await waitFor(() => {
      expect(screen.getByText(/50,000|35,000|45,000/)).toBeInTheDocument();
    });
  });
});
