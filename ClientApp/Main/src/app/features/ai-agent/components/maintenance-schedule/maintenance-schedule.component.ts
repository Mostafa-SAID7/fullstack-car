import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueMileage?: number;
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: string;
  status: 'overdue' | 'due-soon' | 'upcoming' | 'completed';
  category: 'routine' | 'inspection' | 'repair' | 'replacement';
  completed?: boolean;
  completedDate?: Date;
}

export interface ServiceHistory {
  id: string;
  date: Date;
  mileage: number;
  service: string;
  cost: string;
  provider: string;
  notes?: string;
}

export interface MaintenanceReminder {
  id: string;
  itemId: string;
  reminderDate: Date;
  reminderType: 'email' | 'sms' | 'push';
  enabled: boolean;
}

export interface MaintenanceEvent {
  type: 'complete' | 'remind' | 'view-history' | 'add-service';
  item?: MaintenanceItem;
  reminder?: MaintenanceReminder;
}

@Component({
  selector: 'app-maintenance-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-schedule.component.html',
  styleUrls: ['./maintenance-schedule.component.scss']
})
export class MaintenanceScheduleComponent {
  @Input() carMake: string = '';
  @Input() carModel: string = '';
  @Input() carYear: number = 0;
  @Input() currentMileage: number = 0;
  @Input() maintenanceItems: MaintenanceItem[] = [];
  @Input() serviceHistory: ServiceHistory[] = [];
  @Output() maintenanceAction = new EventEmitter<MaintenanceEvent>();

  selectedView: 'schedule' | 'timeline' | 'reminders' = 'schedule';
  filterStatus: string = 'all';
  filterPriority: string = 'all';
  showReminderModal: boolean = false;
  selectedItem: MaintenanceItem | null = null;
  reminderDate: Date = new Date();
  reminderType: 'email' | 'sms' | 'push' = 'email';

  get filteredItems(): MaintenanceItem[] {
    return this.maintenanceItems.filter(item => {
      const statusMatch = this.filterStatus === 'all' || item.status === this.filterStatus;
      const priorityMatch = this.filterPriority === 'all' || item.priority === this.filterPriority;
      return statusMatch && priorityMatch;
    });
  }

  get overdueItems(): MaintenanceItem[] {
    return this.maintenanceItems.filter(item => item.status === 'overdue');
  }

  get dueSoonItems(): MaintenanceItem[] {
    return this.maintenanceItems.filter(item => item.status === 'due-soon');
  }

  get upcomingItems(): MaintenanceItem[] {
    return this.maintenanceItems.filter(item => item.status === 'upcoming');
  }

  get completedItems(): MaintenanceItem[] {
    return this.maintenanceItems.filter(item => item.completed);
  }

  get sortedHistory(): ServiceHistory[] {
    return [...this.serviceHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  selectView(view: 'schedule' | 'timeline' | 'reminders'): void {
    this.selectedView = view;
  }

  setFilterStatus(status: string): void {
    this.filterStatus = status;
  }

  setFilterPriority(priority: string): void {
    this.filterPriority = priority;
  }

  markAsComplete(item: MaintenanceItem): void {
    this.maintenanceAction.emit({
      type: 'complete',
      item: { ...item, completed: true, completedDate: new Date() }
    });
  }

  openReminderModal(item: MaintenanceItem): void {
    this.selectedItem = item;
    this.showReminderModal = true;
    // Set reminder date to 7 days before due date
    const dueDate = new Date(item.dueDate);
    this.reminderDate = new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  closeReminderModal(): void {
    this.showReminderModal = false;
    this.selectedItem = null;
  }

  saveReminder(): void {
    if (this.selectedItem) {
      const reminder: MaintenanceReminder = {
        id: `reminder-${Date.now()}`,
        itemId: this.selectedItem.id,
        reminderDate: this.reminderDate,
        reminderType: this.reminderType,
        enabled: true
      };
      this.maintenanceAction.emit({
        type: 'remind',
        item: this.selectedItem,
        reminder
      });
      this.closeReminderModal();
    }
  }

  viewHistory(): void {
    this.maintenanceAction.emit({
      type: 'view-history'
    });
  }

  addService(): void {
    this.maintenanceAction.emit({
      type: 'add-service'
    });
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      routine: 'fa-calendar-check',
      inspection: 'fa-search',
      repair: 'fa-wrench',
      replacement: 'fa-exchange-alt'
    };
    return icons[category] || 'fa-cog';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getDaysUntilDue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTimelinePosition(date: Date): number {
    // Calculate position for timeline visualization (0-100%)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    
    const serviceDate = new Date(date);
    const totalRange = sixMonthsFromNow.getTime() - sixMonthsAgo.getTime();
    const position = (serviceDate.getTime() - sixMonthsAgo.getTime()) / totalRange;
    
    return Math.max(0, Math.min(100, position * 100));
  }
}
