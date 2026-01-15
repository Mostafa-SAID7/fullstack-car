import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MaintenanceScheduleComponent, MaintenanceItem, ServiceHistory, MaintenanceEvent } from './maintenance-schedule.component';

describe('MaintenanceScheduleComponent', () => {
  let component: MaintenanceScheduleComponent;
  let fixture: ComponentFixture<MaintenanceScheduleComponent>;

  const mockMaintenanceItems: MaintenanceItem[] = [
    {
      id: 'item-1',
      title: 'Oil Change',
      description: 'Regular oil and filter change',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (overdue)
      dueMileage: 50000,
      priority: 'high',
      estimatedCost: '$50-$80',
      status: 'overdue',
      category: 'routine',
      completed: false
    },
    {
      id: 'item-2',
      title: 'Tire Rotation',
      description: 'Rotate tires for even wear',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now (due soon)
      dueMileage: 52000,
      priority: 'medium',
      estimatedCost: '$30-$50',
      status: 'due-soon',
      category: 'routine',
      completed: false
    },
    {
      id: 'item-3',
      title: 'Brake Inspection',
      description: 'Check brake pads and rotors',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now (upcoming)
      dueMileage: 55000,
      priority: 'medium',
      estimatedCost: '$100-$150',
      status: 'upcoming',
      category: 'inspection',
      completed: false
    },
    {
      id: 'item-4',
      title: 'Air Filter Replacement',
      description: 'Replace engine air filter',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      dueMileage: 48000,
      priority: 'low',
      estimatedCost: '$20-$40',
      status: 'overdue',
      category: 'replacement',
      completed: true,
      completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];

  const mockServiceHistory: ServiceHistory[] = [
    {
      id: 'service-1',
      date: new Date('2024-12-01'),
      mileage: 45000,
      service: 'Oil Change',
      cost: '$65',
      provider: 'Quick Lube',
      notes: 'Used synthetic oil'
    },
    {
      id: 'service-2',
      date: new Date('2024-11-15'),
      mileage: 44000,
      service: 'Tire Rotation',
      cost: '$40',
      provider: 'Tire Shop',
      notes: 'All tires in good condition'
    },
    {
      id: 'service-3',
      date: new Date('2024-10-20'),
      mileage: 43000,
      service: 'Brake Inspection',
      cost: '$120',
      provider: 'Auto Center',
      notes: 'Replaced front brake pads'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceScheduleComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceScheduleComponent);
    component = fixture.componentInstance;
    component.carMake = 'Toyota';
    component.carModel = 'Camry';
    component.carYear = 2020;
    component.currentMileage = 50000;
    component.maintenanceItems = mockMaintenanceItems;
    component.serviceHistory = mockServiceHistory;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with car information', () => {
      expect(component.carMake).toBe('Toyota');
      expect(component.carModel).toBe('Camry');
      expect(component.carYear).toBe(2020);
      expect(component.currentMileage).toBe(50000);
    });

    it('should initialize with default view', () => {
      expect(component.selectedView).toBe('schedule');
    });

    it('should initialize with default filters', () => {
      expect(component.filterStatus).toBe('all');
      expect(component.filterPriority).toBe('all');
    });

    it('should initialize with maintenance items', () => {
      expect(component.maintenanceItems.length).toBe(4);
    });

    it('should initialize with service history', () => {
      expect(component.serviceHistory.length).toBe(3);
    });
  });

  describe('View Selection', () => {
    it('should switch to schedule view', () => {
      component.selectView('schedule');
      expect(component.selectedView).toBe('schedule');
    });

    it('should switch to timeline view', () => {
      component.selectView('timeline');
      expect(component.selectedView).toBe('timeline');
    });

    it('should switch to reminders view', () => {
      component.selectView('reminders');
      expect(component.selectedView).toBe('reminders');
    });
  });

  describe('Filtering', () => {
    it('should filter by status', () => {
      component.setFilterStatus('overdue');
      const filtered = component.filteredItems;
      expect(filtered.length).toBe(2);
      expect(filtered.every(item => item.status === 'overdue')).toBe(true);
    });

    it('should filter by priority', () => {
      component.setFilterPriority('high');
      const filtered = component.filteredItems;
      expect(filtered.length).toBe(1);
      expect(filtered[0].priority).toBe('high');
    });

    it('should filter by both status and priority', () => {
      component.setFilterStatus('overdue');
      component.setFilterPriority('high');
      const filtered = component.filteredItems;
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('overdue');
      expect(filtered[0].priority).toBe('high');
    });

    it('should show all items when filters are "all"', () => {
      component.setFilterStatus('all');
      component.setFilterPriority('all');
      const filtered = component.filteredItems;
      expect(filtered.length).toBe(4);
    });

    it('should return empty array when no items match filters', () => {
      component.setFilterStatus('due-soon');
      component.setFilterPriority('high');
      const filtered = component.filteredItems;
      expect(filtered.length).toBe(0);
    });
  });

  describe('Item Categorization', () => {
    it('should get overdue items', () => {
      const overdue = component.overdueItems;
      expect(overdue.length).toBe(2);
      expect(overdue.every(item => item.status === 'overdue')).toBe(true);
    });

    it('should get due soon items', () => {
      const dueSoon = component.dueSoonItems;
      expect(dueSoon.length).toBe(1);
      expect(dueSoon[0].status).toBe('due-soon');
    });

    it('should get upcoming items', () => {
      const upcoming = component.upcomingItems;
      expect(upcoming.length).toBe(1);
      expect(upcoming[0].status).toBe('upcoming');
    });

    it('should get completed items', () => {
      const completed = component.completedItems;
      expect(completed.length).toBe(1);
      expect(completed[0].completed).toBe(true);
    });
  });

  describe('Service History', () => {
    it('should sort history by date descending', () => {
      const sorted = component.sortedHistory;
      expect(sorted.length).toBe(3);
      expect(new Date(sorted[0].date).getTime()).toBeGreaterThan(
        new Date(sorted[1].date).getTime()
      );
      expect(new Date(sorted[1].date).getTime()).toBeGreaterThan(
        new Date(sorted[2].date).getTime()
      );
    });

    it('should not mutate original history array', () => {
      const originalFirst = component.serviceHistory[0];
      const sorted = component.sortedHistory;
      expect(component.serviceHistory[0]).toBe(originalFirst);
    });
  });

  describe('Mark as Complete', () => {
    it('should emit complete event', (done) => {
      const item = mockMaintenanceItems[0];
      
      component.maintenanceAction.subscribe((event: MaintenanceEvent) => {
        expect(event.type).toBe('complete');
        expect(event.item?.id).toBe(item.id);
        expect(event.item?.completed).toBe(true);
        expect(event.item?.completedDate).toBeDefined();
        done();
      });

      component.markAsComplete(item);
    });

    it('should set completed date to current date', (done) => {
      const item = mockMaintenanceItems[0];
      const beforeTime = Date.now();

      component.maintenanceAction.subscribe((event: MaintenanceEvent) => {
        const completedTime = event.item?.completedDate?.getTime() || 0;
        expect(completedTime).toBeGreaterThanOrEqual(beforeTime);
        expect(completedTime).toBeLessThanOrEqual(Date.now());
        done();
      });

      component.markAsComplete(item);
    });
  });

  describe('Reminder Modal', () => {
    it('should open reminder modal', () => {
      const item = mockMaintenanceItems[0];
      component.openReminderModal(item);

      expect(component.showReminderModal).toBe(true);
      expect(component.selectedItem).toBe(item);
    });

    it('should set reminder date to 7 days before due date', () => {
      const item = mockMaintenanceItems[1];
      component.openReminderModal(item);

      const expectedDate = new Date(item.dueDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      expect(component.reminderDate.toDateString()).toBe(expectedDate.toDateString());
    });

    it('should close reminder modal', () => {
      component.showReminderModal = true;
      component.selectedItem = mockMaintenanceItems[0];

      component.closeReminderModal();

      expect(component.showReminderModal).toBe(false);
      expect(component.selectedItem).toBeNull();
    });

    it('should save reminder and emit event', (done) => {
      const item = mockMaintenanceItems[0];
      component.openReminderModal(item);
      component.reminderType = 'email';

      component.maintenanceAction.subscribe((event: MaintenanceEvent) => {
        expect(event.type).toBe('remind');
        expect(event.item).toBe(item);
        expect(event.reminder).toBeDefined();
        expect(event.reminder?.itemId).toBe(item.id);
        expect(event.reminder?.reminderType).toBe('email');
        expect(event.reminder?.enabled).toBe(true);
        done();
      });

      component.saveReminder();
    });

    it('should close modal after saving reminder', (done) => {
      const item = mockMaintenanceItems[0];
      component.openReminderModal(item);

      component.maintenanceAction.subscribe(() => {
        expect(component.showReminderModal).toBe(false);
        expect(component.selectedItem).toBeNull();
        done();
      });

      component.saveReminder();
    });

    it('should not save reminder without selected item', () => {
      component.selectedItem = null;
      spyOn(component.maintenanceAction, 'emit');

      component.saveReminder();

      expect(component.maintenanceAction.emit).not.toHaveBeenCalled();
    });
  });

  describe('Action Events', () => {
    it('should emit view history event', (done) => {
      component.maintenanceAction.subscribe((event: MaintenanceEvent) => {
        expect(event.type).toBe('view-history');
        done();
      });

      component.viewHistory();
    });

    it('should emit add service event', (done) => {
      component.maintenanceAction.subscribe((event: MaintenanceEvent) => {
        expect(event.type).toBe('add-service');
        done();
      });

      component.addService();
    });
  });

  describe('CSS Class Helpers', () => {
    it('should return priority class', () => {
      expect(component.getPriorityClass('high')).toBe('priority-high');
      expect(component.getPriorityClass('medium')).toBe('priority-medium');
      expect(component.getPriorityClass('low')).toBe('priority-low');
    });

    it('should return status class', () => {
      expect(component.getStatusClass('overdue')).toBe('status-overdue');
      expect(component.getStatusClass('due-soon')).toBe('status-due-soon');
      expect(component.getStatusClass('upcoming')).toBe('status-upcoming');
    });

    it('should return category icon', () => {
      expect(component.getCategoryIcon('routine')).toBe('fa-calendar-check');
      expect(component.getCategoryIcon('inspection')).toBe('fa-search');
      expect(component.getCategoryIcon('repair')).toBe('fa-wrench');
      expect(component.getCategoryIcon('replacement')).toBe('fa-exchange-alt');
    });

    it('should return default icon for unknown category', () => {
      expect(component.getCategoryIcon('unknown')).toBe('fa-cog');
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15');
      const formatted = component.formatDate(date);
      expect(formatted).toContain('1/15/2025');
    });

    it('should handle different date formats', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      const formatted = component.formatDate(date);
      expect(formatted).toBeTruthy();
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe('Days Until Due Calculation', () => {
    it('should calculate positive days for future dates', () => {
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const days = component.getDaysUntilDue(futureDate);
      expect(days).toBeGreaterThan(9);
      expect(days).toBeLessThan(11);
    });

    it('should calculate negative days for past dates', () => {
      const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const days = component.getDaysUntilDue(pastDate);
      expect(days).toBeLessThan(0);
    });

    it('should return 0 for today', () => {
      const today = new Date();
      const days = component.getDaysUntilDue(today);
      expect(days).toBeLessThanOrEqual(1);
      expect(days).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Timeline Position Calculation', () => {
    it('should return position between 0 and 100', () => {
      const date = new Date();
      const position = component.getTimelinePosition(date);
      expect(position).toBeGreaterThanOrEqual(0);
      expect(position).toBeLessThanOrEqual(100);
    });

    it('should return ~50 for current date', () => {
      const now = new Date();
      const position = component.getTimelinePosition(now);
      expect(position).toBeGreaterThan(40);
      expect(position).toBeLessThan(60);
    });

    it('should return lower value for past dates', () => {
      const pastDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const position = component.getTimelinePosition(pastDate);
      expect(position).toBeLessThan(50);
    });

    it('should return higher value for future dates', () => {
      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const position = component.getTimelinePosition(futureDate);
      expect(position).toBeGreaterThan(50);
    });

    it('should clamp values to 0-100 range', () => {
      const veryPastDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const veryFutureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      
      expect(component.getTimelinePosition(veryPastDate)).toBeGreaterThanOrEqual(0);
      expect(component.getTimelinePosition(veryFutureDate)).toBeLessThanOrEqual(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty maintenance items', () => {
      component.maintenanceItems = [];
      expect(component.filteredItems.length).toBe(0);
      expect(component.overdueItems.length).toBe(0);
      expect(component.dueSoonItems.length).toBe(0);
      expect(component.upcomingItems.length).toBe(0);
    });

    it('should handle empty service history', () => {
      component.serviceHistory = [];
      expect(component.sortedHistory.length).toBe(0);
    });

    it('should handle items without estimated cost', () => {
      const itemWithoutCost: MaintenanceItem = {
        id: 'item-5',
        title: 'Test Item',
        description: 'Test',
        dueDate: new Date(),
        priority: 'low',
        status: 'upcoming',
        category: 'routine'
      };
      component.maintenanceItems = [itemWithoutCost];
      expect(component.filteredItems.length).toBe(1);
    });

    it('should handle items without due mileage', () => {
      const itemWithoutMileage: MaintenanceItem = {
        id: 'item-6',
        title: 'Test Item',
        description: 'Test',
        dueDate: new Date(),
        priority: 'medium',
        status: 'upcoming',
        category: 'inspection'
      };
      component.maintenanceItems = [itemWithoutMileage];
      expect(component.filteredItems.length).toBe(1);
    });
  });
});
