import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConversationMonitor } from '../components/ConversationMonitor';
import { useConversationMonitor } from '../../../hooks/ai-agent/useConversationMonitor';
import { AIConversation } from '../../../types/ai-agent';

// Mock the custom hook
jest.mock('../../../hooks/ai-agent/useConversationMonitor');

const mockConversations: AIConversation[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Car maintenance question',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:05:00Z',
    messages: [
      { id: 'm1', role: 'user', content: 'How do I change oil?', timestamp: '2024-01-15T10:00:00Z' },
      { id: 'm2', role: 'assistant', content: 'You need a wrench.', timestamp: '2024-01-15T10:01:00Z' }
    ],
    metadata: {
      agentType: 'mechanic',
      model: 'gpt-4',
      totalTokens: 150,
      totalMessages: 2
    }
  },
  {
    id: '2',
    userId: 'user2',
    title: 'Buying a new car',
    isActive: true,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:05:00Z',
    messages: [
      { id: 'm3', role: 'user', content: 'What is a good SUV?', timestamp: '2024-01-15T11:00:00Z' }
    ],
    metadata: {
      agentType: 'buyer_guide',
      model: 'gpt-4',
      totalTokens: 50,
      totalMessages: 1
    }
  }
];

describe('ConversationMonitor Component', () => {
  const mockUseConversationMonitor = useConversationMonitor as jest.MockedFunction<typeof useConversationMonitor>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseConversationMonitor.mockReturnValue({
      conversations: mockConversations,
      loading: false,
      error: null,
      refreshConversations: jest.fn()
    });
  });

  it('renders correctly with conversations', () => {
    render(<ConversationMonitor />);
    expect(screen.getByText('Live Conversation Monitor')).toBeInTheDocument();
    expect(screen.getByText('Car maintenance question')).toBeInTheDocument();
    expect(screen.getByText('Buying a new car')).toBeInTheDocument();
  });

  it('displays correct stats', () => {
    render(<ConversationMonitor />);
    expect(screen.getByText('2')).toBeInTheDocument(); // Active count
    expect(screen.getByText('3')).toBeInTheDocument(); // Total messages (2+1)
  });

  it('filters conversations by search query', async () => {
    render(<ConversationMonitor />);

    const searchInput = screen.getByPlaceholderText(/search conversations/i);
    fireEvent.change(searchInput, { target: { value: 'maintenance' } });

    expect(screen.getByText('Car maintenance question')).toBeInTheDocument();
    expect(screen.queryByText('Buying a new car')).not.toBeInTheDocument();
  });

  it('filters conversations by agent type', async () => {
    render(<ConversationMonitor />);

    const agentSelect = screen.getByRole('combobox');
    fireEvent.change(agentSelect, { target: { value: 'buyer_guide' } });

    expect(screen.getByText('Buying a new car')).toBeInTheDocument();
    expect(screen.queryByText('Car maintenance question')).not.toBeInTheDocument();
  });

  it('selects a conversation and shows details', async () => {
    render(<ConversationMonitor />);

    const conversationCard = screen.getByText('Car maintenance question');
    fireEvent.click(conversationCard);

    await waitFor(() => {
      expect(screen.getByText('How do I change oil?')).toBeInTheDocument();
      expect(screen.getByText('You need a wrench.')).toBeInTheDocument();
    });
  });

  it('toggles auto-refresh', () => {
    render(<ConversationMonitor />);

    const toggleButton = screen.getByText('Live');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument(); // Stats card refresh rate
  });

  it('calls refreshConversations when refresh button is clicked', () => {
    const refreshConversations = jest.fn();
    mockUseConversationMonitor.mockReturnValue({
      conversations: mockConversations,
      loading: false,
      error: null,
      refreshConversations
    });

    render(<ConversationMonitor />);

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(refreshConversations).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    mockUseConversationMonitor.mockReturnValue({
      conversations: [],
      loading: true,
      error: null,
      refreshConversations: jest.fn()
    });

    render(<ConversationMonitor />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state', () => {
    mockUseConversationMonitor.mockReturnValue({
      conversations: [],
      loading: false,
      error: 'Failed to fetch',
      refreshConversations: jest.fn()
    });

    render(<ConversationMonitor />);
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });
});