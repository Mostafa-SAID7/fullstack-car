import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MediaTab {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
}

@Component({
  selector: 'app-media-tab-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="media-tab-nav">
      <!-- Mobile Tab Selector -->
      <div class="mobile-tab-selector md:hidden">
        <select 
          [value]="activeTab" 
          (change)="onMobileTabChange($event)"
          class="mobile-select"
        >
          <option *ngFor="let tab of tabs" [value]="tab.id" [disabled]="tab.disabled">
            {{ tab.label }}
            <span *ngIf="tab.badge" class="badge">({{ tab.badge }})</span>
          </option>
        </select>
        <i class="fas fa-chevron-down select-icon"></i>
      </div>

      <!-- Desktop Tab Navigation -->
      <div class="desktop-tab-nav hidden md:flex">
        <div class="tab-scroll">
          <button 
            *ngFor="let tab of tabs; trackBy: trackByTabId"
            [class]="getTabClass(tab)"
            [disabled]="tab.disabled"
            (click)="selectTab(tab.id)"
            [attr.aria-selected]="activeTab === tab.id"
            role="tab"
          >
            <i [class]="tab.icon" class="tab-icon"></i>
            <span class="tab-label">{{ tab.label }}</span>
            <span *ngIf="tab.badge" class="tab-badge">{{ tab.badge }}</span>
          </button>
        </div>
        
        <!-- Scroll Indicators -->
        <button 
          *ngIf="showScrollLeft" 
          class="scroll-btn scroll-left"
          (click)="scrollLeft()"
          aria-label="Scroll tabs left"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          *ngIf="showScrollRight" 
          class="scroll-btn scroll-right"
          (click)="scrollRight()"
          aria-label="Scroll tabs right"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Tab Actions Slot -->
      <div class="tab-actions" *ngIf="showActions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./media-tab-nav.component.scss']
})
export class MediaTabNavComponent {
  @Input() tabs: MediaTab[] = [];
  @Input() activeTab: string = '';
  @Input() showActions: boolean = true;
  @Output() tabChange = new EventEmitter<string>();

  showScrollLeft = false;
  showScrollRight = false;

  selectTab(tabId: string) {
    if (this.activeTab !== tabId) {
      this.tabChange.emit(tabId);
    }
  }

  onMobileTabChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectTab(target.value);
  }

  getTabClass(tab: MediaTab): string {
    const classes = ['tab-btn'];
    
    if (this.activeTab === tab.id) {
      classes.push('active');
    }
    
    if (tab.disabled) {
      classes.push('disabled');
    }
    
    if (tab.id.includes('podcast')) {
      classes.push('podcast-tab');
    }
    
    return classes.join(' ');
  }

  trackByTabId(index: number, tab: MediaTab): string {
    return tab.id;
  }

  scrollLeft() {
    const container = document.querySelector('.tab-scroll') as HTMLElement;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const container = document.querySelector('.tab-scroll') as HTMLElement;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
}