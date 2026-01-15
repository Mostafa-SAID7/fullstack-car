import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ConversationHistoryComponent } from './conversation-history.component';
import { AIAgentService } from '../../services/ai-agent.service';
import { Conversation, ConversationListResponse, AgentType } from '../../models/ai-agent.models';

describe('ConversationHistoryComponent', () => {
  let component: ConversationHistoryComponent;
  let fixture: ComponentFixture<ConversationHistoryComponent>;
  let aiAgentService: jasmine.SpyObj<AIAgentService>;

  const mockConversations: Conversation[] = [
    {
      id: 'conv-1',
      userId: 'user-1',
      title: 'Car Maintenance Question',
      messages: [],
      createdAt: new Date('2025-01-01').toISOString(),
      updatedAt: new Date('2025-01-01').toISOString(),
      isActive: true,
      metadata: { agent: AgentType.MECHANIC }
    },
    {
      id: 'conv-2',
      userId: 'user-1',
      title: 'Looking for SUV',
      messages: [],
      createdAt: new Date('2025-01-02').toISOString(),
      updatedAt: new Date('2025-01-02').toISOString(),
      isActive: true,
      metadata: { agent: AgentType.BUYER_GUIDE }
    },
    {
      id: 'conv-3',
      userId: 'user-1',
      title: 'Selling my car',
      messages: [],
      createdAt: new Date('2025-01-03').toISOString(),
      updatedAt: new Date('2025-01-03').toISOString(),
      isActive: false,
      metadata: { agent: AgentType.SELLER_ASSISTANT }
    }
  ];

  const mockListResponse: ConversationListResponse = {
    conversations: mockConversations.slice(0, 2),
    total: 2,
    page: 1,
    limit: 20
  };

  beforeEach(async () => {
    const aiAgentServiceSpy = jasmine.createSpyObj('AIAgentService', [
      'listConversations',
      'searchConversations',
      'getConversation',
      'deleteConversation'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ConversationHistoryComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: AIAgentService, useValue: aiAgentServiceSpy }
      ]
    }).compileComponents();

    aiAgentService = TestBed.inject(AIAgentService) as jasmine.SpyObj<AIAgentService>;
    fixture = TestBed.createComponent(ConversationHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.conversations).toEqual([]);
      expect(component.selectedConversation).toBeNull();
      expect(component.loading).toBe(false);
      expect(component.searchQuery).toBe('');
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(20);
      expect(component.showActiveOnly).toBe(true);
      expect(component.selectedAgentFilter).toBe('all');
    });

    it('should load conversations on init', fakeAsync(() => {
      aiAgentService.listConversations.and.returnValue(of(mockListResponse));
      
      fixture.detectChanges();
      tick();
      
      expect(aiAgentService.listConversations).toHaveBeenCalled();
      expect(component.conversations.length).toBe(2);
      expect(component.totalConversations).toBe(2);
    }));

    it('should have all agent types in filter', () => {
      expect(component.agentTypes.length).toBe(7); // all + 6 agent types
      expect(component.agentTypes[0].value).toBe('all');
    });
  });

  describe('Loading Conversations', () => {
    beforeEach(() => {
      aiAgentService.listConversations.and.returnValue(of(mockListResponse));
    });

    it('should load conversations successfully', fakeAsync(() => {
      component.loadConversations();
      tick();
      
      expect(component.loading).toBe(false);
      expect(component.conversations.length).toBe(2);
      expect(component.totalConversations).toBe(2);
      expect(component.hasMore).toBe(false);
    }));

    it('should set loading state while fetching', () => {
      component.loadConversations();
      expect(component.loading).toBe(true);
    });

    it('should handle API error', fakeAsync(() => {
      aiAgentService.listConversations.and.returnValue(
        throwError(() => new Error('API Error'))
      );
      spyOn(console, 'error');
      
      component.loadConversations();
      tick();
      
      expect(component.loading).toBe(false);
      expect(console.error).toHaveBeenCalled();
    }));

    it('should pass correct parameters to API', fakeAsync(() => {
      component.currentPage = 2;
      component.pageSize = 10;
      component.showActiveOnly = false;
      
      component.loadConversations();
      tick();
      
      expect(aiAgentService.listConversations).toHaveBeenCalledWith(
        jasmine.objectContaining({
          page: 2,
          limit: 10,
          isActive: false
        })
      );
    }));

    it('should calculate hasMore correctly', fakeAsync(() => {
      const responseWithMore: ConversationListResponse = {
        conversations: mockConversations.slice(0, 2),
        total: 5,
        page: 1,
        limit: 2
      };
      aiAgentService.listConversations.and.returnValue(of(responseWithMore));
      
      component.loadConversations();
      tick();
      
      expect(component.hasMore).toBe(true);
    }));
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      aiAgentService.searchConversations.and.returnValue(of(mockListResponse));
      aiAgentService.listConversations.and.returnValue(of(mockListResponse));
    });

    it('should search conversations with query', fakeAsync(() => {
      component.searchQuery = 'maintenance';
      component.searchConversations();
      tick();
      
      expect(aiAgentService.searchConversations).toHaveBeenCalledWith(
        jasmine.any(String),
        'maintenance',
        1,
        20
      );
      expect(component.conversations.length).toBe(2);
    }));

    it('should load all conversations when search is empty', fakeAsync(() => {
      component.searchQuery = '';
      component.searchConversations();
      tick();
      
      expect(aiAgentService.listConversations).toHaveBeenCalled();
      expect(aiAgentService.searchConversations).not.toHaveBeenCalled();
    }));

    it('should reset page on search change', () => {
      component.currentPage = 3;
      component.searchQuery = 'test';
      
      component.onSearchChange();
      
      expect(component.currentPage).toBe(1);
    });

    it('should trigger search when query changes', fakeAsync(() => {
      component.searchQuery = 'SUV';
      component.onSearchChange();
      tick();
      
      expect(aiAgentService.searchConversations).toHaveBeenCalled();
    }));

    it('should load all when search query is cleared', fakeAsync(() => {
      component.searchQuery = '';
      component.onSearchChange();
      tick();
      
      expect(aiAgentService.listConversations).toHaveBeenCalled();
    }));
  });

  describe('Pagination', () => {
    beforeEach(() => {
      const responseWithMore: ConversationListResponse = {
        conversations: mockConversations.slice(0, 2),
        total: 5,
        page: 1,
        limit: 2
      };
      aiAgentService.listConversations.and.returnValue(of(responseWithMore));
    });

    it('should load more conversations', fakeAsync(() => {
      component.loadConversations();
      tick();
      
      expect(component.currentPage).toBe(1);
      expect(component.hasMore).toBe(true);
      
      const page2Response: ConversationListResponse = {
        conversations: [mockConversations[2]],
        total: 5,
        page: 2,
        limit: 2
      };
      aiAgentService.listConversations.and.returnValue(of(page2Response));
      
      component.loadMore();
      tick();
      
      expect(component.currentPage).toBe(2);
      expect(component.conversations.length).toBe(3);
    }));

    it('should not load more when already loading', () => {
      component.loading = true;
      component.hasMore = true;
      const initialPage = component.currentPage;
      
      component.loadMore();
      
      expect(component.currentPage).toBe(initialPage);
    });

    it('should not load more when no more data', () => {
      component.hasMore = false;
      const initialPage = component.currentPage;
      
      component.loadMore();
      
      expect(component.currentPage).toBe(initialPage);
    });

    it('should append conversations on pagination', fakeAsync(() => {
      component.loadConversations();
      tick();
      
      const initialCount = component.conversations.length;
      
      const page2Response: ConversationListResponse = {
        conversations: [mockConversations[2]],
        total: 5,
        page: 2,
        limit: 2
      };
      aiAgentService.listConversations.and.returnValue(of(page2Response));
      
      component.loadMore();
      tick();
      
      expect(component.conversations.length).toBe(initialCount + 1);
    }));
  });

  describe('Filter Functionality', () => {
    beforeEach(() => {
      aiAgentService.listConversations.and.returnValue(of(mockListResponse));
    });

    it('should reset page on filter change', () => {
      component.currentPage = 3;
      component.onFilterChange();
      
      expect(component.currentPage).toBe(1);
    });

    it('should reload conversations on filter change', fakeAsync(() => {
      component.onFilterChange();
      tick();
      
      expect(aiAgentService.listConversations).toHaveBeenCalled();
    }));

    it('should filter by active status', fakeAsync(() => {
      component.showActiveOnly = false;
      component.loadConversations();
      tick();
      
      expect(aiAgentService.listConversations).toHaveBeenCalledWith(
        jasmine.objectContaining({
          isActive: false
        })
      );
    }));
  });

  describe('Conversation Selection', () => {
    beforeEach(() => {
      const fullConversation: Conversation = {
        ...mockConversations[0],
        messages: [
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            role: 'user',
            content: 'Test message',
            agentType: AgentType.MECHANIC,
            timestamp: new Date().toISOString(),
            metadata: {}
          }
        ]
      };
      aiAgentService.getConversation.and.returnValue(of(fullConversation));
    });

    it('should select and load conversation details', fakeAsync(() => {
      component.selectConversation(mockConversations[0]);
      tick();
      
      expect(aiAgentService.getConversation).toHaveBeenCalledWith('conv-1');
      expect(component.selectedConversation).toBeTruthy();
      expect(component.selectedConversation?.id).toBe('conv-1');
    }));

    it('should set loading state while fetching details', () => {
      component.selectConversation(mockConversations[0]);
      expect(component.loading).toBe(true);
    });

    it('should handle error loading conversation details', fakeAsync(() => {
      aiAgentService.getConversation.and.returnValue(
        throwError(() => new Error('API Error'))
      );
      spyOn(console, 'error');
      
      component.selectConversation(mockConversations[0]);
      tick();
      
      expect(component.loading).toBe(false);
      expect(console.error).toHaveBeenCalled();
    }));

    it('should close detail view', () => {
      component.selectedConversation = mockConversations[0];
      component.closeDetail();
      
      expect(component.selectedConversation).toBeNull();
    });
  });

  describe('Conversation Deletion', () => {
    beforeEach(() => {
      aiAgentService.listConversations.and.returnValue(of(mockListResponse));
      aiAgentService.deleteConversation.and.returnValue(of({ success: true }));
    });

    it('should show delete confirmation', () => {
      component.confirmDelete(mockConversations[0]);
      
      expect(component.showDeleteConfirm).toBe(true);
      expect(component.conversationToDelete).toBe(mockConversations[0]);
    });

    it('should cancel delete', () => {
      component.conversationToDelete = mockConversations[0];
      component.showDeleteConfirm = true;
      
      component.cancelDelete();
      
      expect(component.showDeleteConfirm).toBe(false);
      expect(component.conversationToDelete).toBeNull();
    });

    it('should delete conversation successfully', fakeAsync(() => {
      component.conversations = [...mockConversations];
      component.conversationToDelete = mockConversations[0];
      component.showDeleteConfirm = true;
      
      component.deleteConversation();
      tick();
      
      expect(aiAgentService.deleteConversation).toHaveBeenCalledWith('conv-1');
      expect(component.conversations.length).toBe(2);
      expect(component.conversations.find(c => c.id === 'conv-1')).toBeUndefined();
      expect(component.showDeleteConfirm).toBe(false);
    }));

    it('should close detail if deleted conversation is selected', fakeAsync(() => {
      component.conversations = [...mockConversations];
      component.selectedConversation = mockConversations[0];
      component.conversationToDelete = mockConversations[0];
      
      component.deleteConversation();
      tick();
      
      expect(component.selectedConversation).toBeNull();
    }));

    it('should handle delete error', fakeAsync(() => {
      aiAgentService.deleteConversation.and.returnValue(
        throwError(() => new Error('Delete failed'))
      );
      spyOn(console, 'error');
      
      component.conversationToDelete = mockConversations[0];
      component.deleteConversation();
      tick();
      
      expect(console.error).toHaveBeenCalled();
      expect(component.showDeleteConfirm).toBe(false);
    }));

    it('should not delete without conversation to delete', () => {
      component.conversationToDelete = null;
      component.deleteConversation();
      
      expect(aiAgentService.deleteConversation).not.toHaveBeenCalled();
    });

    it('should update total count after deletion', fakeAsync(() => {
      component.conversations = [...mockConversations];
      component.totalConversations = 3;
      component.conversationToDelete = mockConversations[0];
      
      component.deleteConversation();
      tick();
      
      expect(component.totalConversations).toBe(2);
    }));
  });

  describe('Export Functionality', () => {
    it('should export conversation as text file', () => {
      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');
      spyOn(window.URL, 'revokeObjectURL');
      const linkClickSpy = jasmine.createSpy('click');
      spyOn(document, 'createElement').and.returnValue({
        click: linkClickSpy,
        href: '',
        download: ''
      } as any);
      
      component.exportConversation(mockConversations[0]);
      
      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(linkClickSpy).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalled();
      expect(component.showExportMenu).toBe(false);
    });
  });
});
