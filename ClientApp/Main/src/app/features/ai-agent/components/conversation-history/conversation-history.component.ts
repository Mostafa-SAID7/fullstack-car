import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIAgentService } from '../../services/ai-agent.service';
import { Conversation, ConversationListRequest, AgentType } from '../../models/ai-agent.models';

@Component({
  selector: 'app-conversation-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-history.component.html',
  styleUrls: ['./conversation-history.component.scss']
})
export class ConversationHistoryComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  loading = false;
  searchQuery = '';
  currentPage = 1;
  pageSize = 20;
  totalConversations = 0;
  hasMore = false;
  
  // Filter options
  showActiveOnly = true;
  selectedAgentFilter: AgentType | 'all' = 'all';
  
  // Agent types for filter
  agentTypes = [
    { value: 'all', label: 'All Agents', icon: 'fa-comments' },
    { value: AgentType.GENERAL, label: 'General Chat', icon: 'fa-comments' },
    { value: AgentType.MECHANIC, label: 'Mechanic', icon: 'fa-wrench' },
    { value: AgentType.BUYER_GUIDE, label: 'Buying Guide', icon: 'fa-shopping-cart' },
    { value: AgentType.SELLER_ASSISTANT, label: 'Selling Help', icon: 'fa-tag' },
    { value: AgentType.MODIFICATION_EXPERT, label: 'Modifications', icon: 'fa-cog' },
    { value: AgentType.COMMUNITY_HELPER, label: 'Community', icon: 'fa-users' }
  ];
  
  // Delete confirmation
  showDeleteConfirm = false;
  conversationToDelete: Conversation | null = null;
  
  // Export options
  showExportMenu = false;

  constructor(private aiAgentService: AIAgentService) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.loading = true;
    
    const request: ConversationListRequest = {
      userId: this.getUserId(),
      page: this.currentPage,
      limit: this.pageSize,
      isActive: this.showActiveOnly
    };

    this.aiAgentService.listConversations(request).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.conversations = response.conversations;
        } else {
          this.conversations = [...this.conversations, ...response.conversations];
        }
        this.totalConversations = response.total;
        this.hasMore = this.conversations.length < response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load conversations:', error);
        this.loading = false;
      }
    });
  }

  searchConversations(): void {
    if (!this.searchQuery.trim()) {
      this.currentPage = 1;
      this.loadConversations();
      return;
    }

    this.loading = true;
    
    this.aiAgentService.searchConversations(
      this.getUserId(),
      this.searchQuery,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.conversations = response.conversations;
        } else {
          this.conversations = [...this.conversations, ...response.conversations];
        }
        this.totalConversations = response.total;
        this.hasMore = this.conversations.length < response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to search conversations:', error);
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    if (this.searchQuery.trim()) {
      this.searchConversations();
    } else {
      this.loadConversations();
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadConversations();
  }

  loadMore(): void {
    if (!this.hasMore || this.loading) return;
    this.currentPage++;
    if (this.searchQuery.trim()) {
      this.searchConversations();
    } else {
      this.loadConversations();
    }
  }

  selectConversation(conversation: Conversation): void {
    this.loading = true;
    this.aiAgentService.getConversation(conversation.id).subscribe({
      next: (fullConversation) => {
        this.selectedConversation = fullConversation;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load conversation details:', error);
        this.loading = false;
      }
    });
  }

  closeDetail(): void {
    this.selectedConversation = null;
  }

  confirmDelete(conversation: Conversation): void {
    this.conversationToDelete = conversation;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.conversationToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteConversation(): void {
    if (!this.conversationToDelete) return;

    const conversationId = this.conversationToDelete.id;
    this.aiAgentService.deleteConversation(conversationId).subscribe({
      next: () => {
        // Remove from list
        this.conversations = this.conversations.filter(c => c.id !== conversationId);
        this.totalConversations--;
        
        // Close detail if it's the deleted conversation
        if (this.selectedConversation?.id === conversationId) {
          this.selectedConversation = null;
        }
        
        this.cancelDelete();
      },
      error: (error) => {
        console.error('Failed to delete conversation:', error);
        this.cancelDelete();
      }
    });
  }

  exportConversation(conversation: Conversation): void {
    const content = this.generateExportContent(conversation);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${conversation.id}-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.showExportMenu = false;
  }

  private generateExportContent(conversation: Conversation): string {
    let content = `Conversation: ${conversation.title}\n`;
    content += `Date: ${new Date(conversation.createdAt).toLocaleString()}\n`;
    content += `Messages: ${conversation.messages.length}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    conversation.messages.forEach((message, index) => {
      const timestamp = new Date(message.timestamp).toLocaleString();
      const role = message.role.toUpperCase();
      const agent = message.agentType ? ` (${message.agentType})` : '';
      
      content += `[${timestamp}] ${role}${agent}:\n`;
      content += `${message.content}\n\n`;
      
      if (index < conversation.messages.length - 1) {
        content += `${'-'.repeat(60)}\n\n`;
      }
    });

    return content;
  }

  shareConversation(conversation: Conversation): void {
    // Generate shareable link (in real app, this would create a public link via API)
    const shareUrl = `${window.location.origin}/ai-agent/shared/${conversation.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link:', err);
      // Fallback: show the link
      prompt('Share this link:', shareUrl);
    });
    
    this.showExportMenu = false;
  }

  getFilteredConversations(): Conversation[] {
    if (this.selectedAgentFilter === 'all') {
      return this.conversations;
    }
    
    return this.conversations.filter(conv => {
      // Check if any message in the conversation uses the selected agent
      return conv.messages.some(msg => msg.agentType === this.selectedAgentFilter);
    });
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  }

  getAgentIcon(agentType?: AgentType): string {
    const agent = this.agentTypes.find(a => a.value === agentType);
    return agent?.icon || 'fa-comments';
  }

  getAgentLabel(agentType?: AgentType): string {
    const agent = this.agentTypes.find(a => a.value === agentType);
    return agent?.label || 'General';
  }

  private getUserId(): string {
    // In real app, get from auth service
    return 'current-user-id';
  }

  getConversationPreview(conversation: Conversation): string {
    if (conversation.messages.length === 0) return 'No messages';
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '');
  }

  getPrimaryAgent(conversation: Conversation): AgentType | undefined {
    // Find the most used agent in the conversation
    const agentCounts = new Map<AgentType, number>();
    conversation.messages.forEach(msg => {
      if (msg.agentType) {
        agentCounts.set(msg.agentType, (agentCounts.get(msg.agentType) || 0) + 1);
      }
    });
    
    let maxCount = 0;
    let primaryAgent: AgentType | undefined;
    agentCounts.forEach((count, agent) => {
      if (count > maxCount) {
        maxCount = count;
        primaryAgent = agent;
      }
    });
    
    return primaryAgent;
  }
}
