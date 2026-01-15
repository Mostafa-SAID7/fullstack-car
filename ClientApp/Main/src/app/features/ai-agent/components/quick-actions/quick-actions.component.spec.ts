import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickActionsComponent, QuickAction, QuickActionEvent } from './quick-actions.component';
import { AgentType } from '../../models/ai-agent.models';

describe('QuickActionsComponent', () => {
  let component: QuickActionsComponent;
  let fixture: ComponentFixture<QuickActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with 6 quick actions', () => {
      expect(component.quickActions.length).toBe(6);
    });

    it('should have all required action properties', () => {
      component.quickActions.forEach(action => {
        expect(action.id).toBeTruthy();
        expect(action.label).toBeTruthy();
        expect(action.icon).toBeTruthy();
        expect(action.description).toBeTruthy();
        expect(action.agentMode).toBeTruthy();
        expect(action.prompt).toBeTruthy();
        expect(action.color).toBeTruthy();
      });
    });

    it('should have unique action IDs', () => {
      const ids = component.quickActions.map(action => action.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Find a Car Action', () => {
    let findCarAction: QuickAction;

    beforeEach(() => {
      findCarAction = component.quickActions.find(a => a.id === 'find-car')!;
    });

    it('should have correct properties', () => {
      expect(findCarAction.label).toBe('Find a Car');
      expect(findCarAction.agentMode).toBe(AgentType.BUYER_GUIDE);
      expect(findCarAction.icon).toBe('fa-shopping-cart');
      expect(findCarAction.color).toBe('#0d6efd');
    });

    it('should have descriptive prompt', () => {
      expect(findCarAction.prompt).toContain('buy a car');
      expect(findCarAction.prompt.length).toBeGreaterThan(20);
    });

    it('should emit correct event when clicked', (done) => {
      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event.action.id).toBe('find-car');
        expect(event.agentMode).toBe(AgentType.BUYER_GUIDE);
        expect(event.message).toBe(findCarAction.prompt);
        done();
      });

      component.onActionClick(findCarAction);
    });
  });

  describe('Check Maintenance Action', () => {
    let maintenanceAction: QuickAction;

    beforeEach(() => {
      maintenanceAction = component.quickActions.find(a => a.id === 'check-maintenance')!;
    });

    it('should have correct properties', () => {
      expect(maintenanceAction.label).toBe('Check Maintenance');
      expect(maintenanceAction.agentMode).toBe(AgentType.MECHANIC);
      expect(maintenanceAction.icon).toBe('fa-wrench');
      expect(maintenanceAction.color).toBe('#fd7e14');
    });

    it('should have maintenance-related prompt', () => {
      expect(maintenanceAction.prompt).toContain('maintenance');
      expect(maintenanceAction.prompt.length).toBeGreaterThan(20);
    });

    it('should emit correct event when clicked', (done) => {
      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event.action.id).toBe('check-maintenance');
        expect(event.agentMode).toBe(AgentType.MECHANIC);
        expect(event.message).toBe(maintenanceAction.prompt);
        done();
      });

      component.onActionClick(maintenanceAction);
    });
  });

  describe('List My Car Action', () => {
    let listCarAction: QuickAction;

    beforeEach(() => {
      listCarAction = component.quickActions.find(a => a.id === 'list-car')!;
    });

    it('should have correct properties', () => {
      expect(listCarAction.label).toBe('List My Car');
      expect(listCarAction.agentMode).toBe(AgentType.SELLER_ASSISTANT);
      expect(listCarAction.icon).toBe('fa-tag');
      expect(listCarAction.color).toBe('#198754');
    });

    it('should have selling-related prompt', () => {
      expect(listCarAction.prompt).toContain('sell');
      expect(listCarAction.prompt.length).toBeGreaterThan(20);
    });

    it('should emit correct event when clicked', (done) => {
      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event.action.id).toBe('list-car');
        expect(event.agentMode).toBe(AgentType.SELLER_ASSISTANT);
        expect(event.message).toBe(listCarAction.prompt);
        done();
      });

      component.onActionClick(listCarAction);
    });
  });

  describe('Join Groups Action', () => {
    let joinGroupsAction: QuickAction;

    beforeEach(() => {
      joinGroupsAction = component.quickActions.find(a => a.id === 'join-groups')!;
    });

    it('should have correct properties', () => {
      expect(joinGroupsAction.label).toBe('Join Groups');
      expect(joinGroupsAction.agentMode).toBe(AgentType.COMMUNITY_HELPER);
      expect(joinGroupsAction.icon).toBe('fa-users');
      expect(joinGroupsAction.color).toBe('#6f42c1');
    });

    it('should have community-related prompt', () => {
      expect(joinGroupsAction.prompt).toContain('groups');
      expect(joinGroupsAction.prompt.length).toBeGreaterThan(20);
    });

    it('should emit correct event when clicked', (done) => {
      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event.action.id).toBe('join-groups');
        expect(event.agentMode).toBe(AgentType.COMMUNITY_HELPER);
        expect(event.message).toBe(joinGroupsAction.prompt);
        done();
      });

      component.onActionClick(joinGroupsAction);
    });
  });

  describe('Find Events Action', () => {
    let findEventsAction: QuickAction;

    beforeEach(() => {
      findEventsAction = component.quickActions.find(a => a.id === 'find-events')!;
    });

    it('should have correct properties', () => {
      expect(findEventsAction.label).toBe('Find Events');
      expect(findEventsAction.agentMode).toBe(AgentType.COMMUNITY_HELPER);
      expect(findEventsAction.icon).toBe('fa-calendar');
      expect(findEventsAction.color).toBe('#d63384');
    });

    it('should have events-related prompt', () => {
      expect(findEventsAction.prompt).toContain('events');
      expect(findEventsAction.prompt.length).toBeGreaterThan(20);
    });

    it('should emit correct event when clicked', (done) => {
      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event.action.id).toBe('find-events');
        expect(event.agentMode).toBe(AgentType.COMMUNITY_HELPER);
        expect(event.message).toBe(findEventsAction.prompt);
        done();
      });

      component.onActionClick(findEventsAction);
    });
  });

  describe('Modify My Car Action', () => {
    let modificationsAction: QuickAction;

    beforeEach(() => {
      modificationsAction = component.quickActions.find(a => a.id === 'modifications')!;
    });

    it('should have correct properties', () => {
      expect(modificationsAction.label).toBe('Modify My Car');
      expect(modificationsAction.agentMode).toBe(AgentType.MODIFICATION_EXPERT);
      expect(modificationsAction.icon).toBe('fa-cog');
      expect(modificationsAction.color).toBe('#20c997');
    });

    it('should have modification-related prompt', () => {
      expect(modificationsAction.prompt).toContain('modify');
      expect(modificationsAction.prompt.length).toBeGreaterThan(20);
    });

    it('should emit correct event when clicked', (done) => {
      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event.action.id).toBe('modifications');
        expect(event.agentMode).toBe(AgentType.MODIFICATION_EXPERT);
        expect(event.message).toBe(modificationsAction.prompt);
        done();
      });

      component.onActionClick(modificationsAction);
    });
  });

  describe('Action Categories', () => {
    it('should categorize actions correctly', () => {
      const categories = component.getActionsByCategory();

      expect(categories.popular.length).toBe(3);
      expect(categories.community.length).toBe(2);
      expect(categories.services.length).toBe(1);
    });

    it('should have correct popular actions', () => {
      const categories = component.getActionsByCategory();
      const popularIds = categories.popular.map(a => a.id);

      expect(popularIds).toContain('find-car');
      expect(popularIds).toContain('check-maintenance');
      expect(popularIds).toContain('list-car');
    });

    it('should have correct community actions', () => {
      const categories = component.getActionsByCategory();
      const communityIds = categories.community.map(a => a.id);

      expect(communityIds).toContain('join-groups');
      expect(communityIds).toContain('find-events');
    });

    it('should have correct services actions', () => {
      const categories = component.getActionsByCategory();
      const servicesIds = categories.services.map(a => a.id);

      expect(servicesIds).toContain('modifications');
    });

    it('should not duplicate actions across categories', () => {
      const categories = component.getActionsByCategory();
      const allCategorized = [
        ...categories.popular,
        ...categories.community,
        ...categories.services
      ];

      expect(allCategorized.length).toBe(6);
    });
  });

  describe('Agent Mode Mapping', () => {
    it('should map to BUYER_GUIDE for find-car', () => {
      const action = component.quickActions.find(a => a.id === 'find-car')!;
      expect(action.agentMode).toBe(AgentType.BUYER_GUIDE);
    });

    it('should map to MECHANIC for check-maintenance', () => {
      const action = component.quickActions.find(a => a.id === 'check-maintenance')!;
      expect(action.agentMode).toBe(AgentType.MECHANIC);
    });

    it('should map to SELLER_ASSISTANT for list-car', () => {
      const action = component.quickActions.find(a => a.id === 'list-car')!;
      expect(action.agentMode).toBe(AgentType.SELLER_ASSISTANT);
    });

    it('should map to COMMUNITY_HELPER for join-groups', () => {
      const action = component.quickActions.find(a => a.id === 'join-groups')!;
      expect(action.agentMode).toBe(AgentType.COMMUNITY_HELPER);
    });

    it('should map to COMMUNITY_HELPER for find-events', () => {
      const action = component.quickActions.find(a => a.id === 'find-events')!;
      expect(action.agentMode).toBe(AgentType.COMMUNITY_HELPER);
    });

    it('should map to MODIFICATION_EXPERT for modifications', () => {
      const action = component.quickActions.find(a => a.id === 'modifications')!;
      expect(action.agentMode).toBe(AgentType.MODIFICATION_EXPERT);
    });

    it('should use all specialized agent types', () => {
      const agentTypes = component.quickActions.map(a => a.agentMode);
      const uniqueTypes = new Set(agentTypes);

      expect(uniqueTypes.has(AgentType.BUYER_GUIDE)).toBe(true);
      expect(uniqueTypes.has(AgentType.MECHANIC)).toBe(true);
      expect(uniqueTypes.has(AgentType.SELLER_ASSISTANT)).toBe(true);
      expect(uniqueTypes.has(AgentType.COMMUNITY_HELPER)).toBe(true);
      expect(uniqueTypes.has(AgentType.MODIFICATION_EXPERT)).toBe(true);
    });
  });

  describe('Event Emission', () => {
    it('should emit event with correct structure', (done) => {
      const action = component.quickActions[0];

      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event).toEqual({
          action: action,
          agentMode: action.agentMode,
          message: action.prompt
        });
        done();
      });

      component.onActionClick(action);
    });

    it('should emit events for all actions', () => {
      let emittedCount = 0;

      component.actionSelected.subscribe(() => {
        emittedCount++;
      });

      component.quickActions.forEach(action => {
        component.onActionClick(action);
      });

      expect(emittedCount).toBe(6);
    });

    it('should include action reference in event', (done) => {
      const action = component.quickActions[2];

      component.actionSelected.subscribe((event: QuickActionEvent) => {
        expect(event.action).toBe(action);
        expect(event.action.id).toBe(action.id);
        expect(event.action.label).toBe(action.label);
        done();
      });

      component.onActionClick(action);
    });
  });

  describe('Visual Properties', () => {
    it('should have unique colors for each action', () => {
      const colors = component.quickActions.map(a => a.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('should have valid hex colors', () => {
      component.quickActions.forEach(action => {
        expect(action.color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should have Font Awesome icons', () => {
      component.quickActions.forEach(action => {
        expect(action.icon).toMatch(/^fa-/);
      });
    });

    it('should have descriptive labels', () => {
      component.quickActions.forEach(action => {
        expect(action.label.length).toBeGreaterThan(5);
        expect(action.label.length).toBeLessThan(30);
      });
    });

    it('should have helpful descriptions', () => {
      component.quickActions.forEach(action => {
        expect(action.description.length).toBeGreaterThan(10);
        expect(action.description.length).toBeLessThan(100);
      });
    });
  });

  describe('Prompt Quality', () => {
    it('should have conversational prompts', () => {
      component.quickActions.forEach(action => {
        expect(action.prompt).toContain('?');
        expect(action.prompt.length).toBeGreaterThan(30);
      });
    });

    it('should have prompts that match action intent', () => {
      const findCar = component.quickActions.find(a => a.id === 'find-car')!;
      expect(findCar.prompt.toLowerCase()).toContain('buy');

      const maintenance = component.quickActions.find(a => a.id === 'check-maintenance')!;
      expect(maintenance.prompt.toLowerCase()).toContain('maintenance');

      const listCar = component.quickActions.find(a => a.id === 'list-car')!;
      expect(listCar.prompt.toLowerCase()).toContain('sell');
    });

    it('should have polite and helpful tone', () => {
      component.quickActions.forEach(action => {
        const prompt = action.prompt.toLowerCase();
        expect(prompt).toMatch(/can you|help|i'd like|i want|i need/);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle clicking same action multiple times', () => {
      let emitCount = 0;
      const action = component.quickActions[0];

      component.actionSelected.subscribe(() => {
        emitCount++;
      });

      component.onActionClick(action);
      component.onActionClick(action);
      component.onActionClick(action);

      expect(emitCount).toBe(3);
    });

    it('should handle rapid action clicks', () => {
      const emittedActions: string[] = [];

      component.actionSelected.subscribe((event) => {
        emittedActions.push(event.action.id);
      });

      component.quickActions.forEach(action => {
        component.onActionClick(action);
      });

      expect(emittedActions.length).toBe(6);
      expect(emittedActions).toEqual(component.quickActions.map(a => a.id));
    });
  });
});
