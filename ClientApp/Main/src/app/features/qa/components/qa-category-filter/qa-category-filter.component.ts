import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// QA Types and Services
import { QASearchService } from '../../../community/services/qa-search.service';
import { Category } from '../../../../shared/types/qa-api.types';

@Component({
  selector: 'app-qa-category-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './qa-category-filter.component.html',
  styleUrls: ['./qa-category-filter.component.scss']
})
export class QACategoryFilterComponent implements OnInit {
  @Input() selectedCategory = '';
  @Output() categoryChange = new EventEmitter<string>();

  categories: Category[] = [];
  popularCategories: Category[] = [];
  loading = false;
  error: string | null = null;

  constructor(private qaSearchService: QASearchService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.qaSearchService.getCategories().subscribe({
      next: (response) => {
        if (response?.succeeded && response.data) {
          this.categories = response.data;
          this.popularCategories = this.getPopularCategories();
        } else {
          // Fallback to mock data
          this.categories = this.getMockCategories();
          this.popularCategories = this.getPopularCategories();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
        this.error = 'Failed to load categories';
        // Use mock data as fallback
        this.categories = this.getMockCategories();
        this.popularCategories = this.getPopularCategories();
        this.loading = false;
      }
    });
  }

  private getMockCategories(): Category[] {
    return [
      {
        id: '1',
        name: 'Web Development',
        description: 'Frontend and backend web development questions',
        iconUrl: 'web',
        color: '#3B82F6',
        questionCount: 156,
        expertCount: 12,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Mobile Development',
        description: 'iOS, Android, and cross-platform mobile development',
        iconUrl: 'phone_android',
        color: '#10B981',
        questionCount: 89,
        expertCount: 8,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Database Design',
        description: 'SQL, NoSQL, database architecture and optimization',
        iconUrl: 'storage',
        color: '#8B5CF6',
        questionCount: 67,
        expertCount: 6,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'DevOps & Cloud',
        description: 'CI/CD, containerization, cloud platforms',
        iconUrl: 'cloud',
        color: '#F59E0B',
        questionCount: 45,
        expertCount: 4,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Data Science',
        description: 'Machine learning, analytics, data processing',
        iconUrl: 'analytics',
        color: '#EF4444',
        questionCount: 34,
        expertCount: 3,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Cybersecurity',
        description: 'Security best practices, vulnerability assessment',
        iconUrl: 'security',
        color: '#6B7280',
        questionCount: 28,
        expertCount: 2,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getPopularCategories(): Category[] {
    // Get top 4 categories by question count
    return this.categories
      .filter(cat => cat.isActive)
      .sort((a, b) => b.questionCount - a.questionCount)
      .slice(0, 4);
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  clearCategory(): void {
    this.selectedCategory = '';
    this.categoryChange.emit('');
  }

  getCategoryIcon(iconUrl?: string): string {
    // Map category icons to Material Icons
    const iconMap: { [key: string]: string } = {
      'web': 'web',
      'phone_android': 'phone_android',
      'storage': 'storage',
      'cloud': 'cloud',
      'analytics': 'analytics',
      'security': 'security'
    };

    return iconMap[iconUrl || ''] || 'folder';
  }

  getCategoryColor(color?: string): string {
    return color || '#6B7280';
  }

  trackByCategory(index: number, category: Category): string {
    return category.id;
  }
}