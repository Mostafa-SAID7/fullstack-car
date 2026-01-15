import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KnowledgeBase } from '../components/KnowledgeBase';
import { knowledgeService } from '../../../services/ai-agent';
import { KnowledgeEntry } from '../../../types/ai-agent';

// Mock the knowledge service
jest.mock('../../../services/ai-agent');

const mockKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: '1',
    content: 'Regular oil changes are essential for engine longevity.',
    category: 'maintenance',
    source: 'Manual',
    verified: true,
    metadata: {},
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    content: 'Check tire pressure monthly.',
    category: 'maintenance',
    source: 'Expert',
    verified: false,
    metadata: {},
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
];

const mockStats = {
  total: 2,
  verified: 1,
  byCategory: { maintenance: 2 }
};

describe('KnowledgeBase Component', () => {
  const mockedService = knowledgeService as jest.Mocked<typeof knowledgeService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedService.search.mockResolvedValue({ results: mockKnowledgeEntries });
    mockedService.getStats.mockResolvedValue(mockStats);
    mockedService.addEntry.mockResolvedValue(mockKnowledgeEntries[0]);
    mockedService.updateEntry.mockResolvedValue(mockKnowledgeEntries[0]);
    mockedService.deleteEntry.mockResolvedValue(undefined);
    mockedService.verifyEntry.mockResolvedValue(mockKnowledgeEntries[0]);
  });

  it('renders correctly', async () => {
    render(<KnowledgeBase />);
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Regular oil changes/)).toBeInTheDocument();
    });
  });

  it('displays stats', async () => {
    render(<KnowledgeBase />);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total
      expect(screen.getByText('1')).toBeInTheDocument(); // Verified
    });
  });

  it('filters by search query', async () => {
    render(<KnowledgeBase />);
    const searchInput = screen.getByPlaceholderText(/search knowledge base/i);
    fireEvent.change(searchInput, { target: { value: 'oil' } });

    await waitFor(() => {
      expect(mockedService.search).toHaveBeenCalledWith(expect.objectContaining({
        query: 'oil'
      }));
    });
  });

  it('filters by category', async () => {
    render(<KnowledgeBase />);
    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'diagnostics' } });

    await waitFor(() => {
      expect(mockedService.search).toHaveBeenCalledWith(expect.objectContaining({
        category: 'diagnostics'
      }));
    });
  });

  it('toggles verified only filter', async () => {
    render(<KnowledgeBase />);
    const verifiedButton = screen.getByText(/verified only/i);
    fireEvent.click(verifiedButton);

    await waitFor(() => {
      expect(mockedService.search).toHaveBeenCalledWith(expect.objectContaining({
        verified: true
      }));
    });
  });

  it('opens add form modal', async () => {
    render(<KnowledgeBase />);
    const addButton = screen.getByText(/add entry/i);
    fireEvent.click(addButton);

    expect(screen.getByText(/add knowledge entry/i)).toBeInTheDocument();
  });

  it('opens upload modal', async () => {
    render(<KnowledgeBase />);
    const uploadButton = screen.getByText(/upload documents/i);
    fireEvent.click(uploadButton);

    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });

  it('refreshes entries when refresh button is clicked', async () => {
    render(<KnowledgeBase />);
    await waitFor(() => {
      expect(screen.getByText(/knowledge base/i)).toBeInTheDocument();
    });

    jest.clearAllMocks();
    const refreshButton = screen.getByRole('button', { name: /refresh entries/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockedService.search).toHaveBeenCalled();
    });
  });
});