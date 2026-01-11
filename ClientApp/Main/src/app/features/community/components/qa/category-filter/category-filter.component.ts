import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// QA Types
import { Category } from '../../../../../shared/types/qa-api.types';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {
  @Input() selectedCategory = '';
  @Output() categoryChange = new EventEmitter<string>();

  // Mock data - in real implementation, this would come from a service
  categories: Category[] = [
    {
      id: '1',
      name: 'Web Development',
      description: 'Frontend and backend web development',
      iconUrl: 'web',
      questionCount: 156,
      expertCount: 12,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Mobile Development',
      description: 'iOS, Android, and cross-platform development',
      iconUrl: 'phone_android',
      questionCount: 89,
      expertCount: 8,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Database Design',
      description: 'SQL, NoSQL, and database architecture',
      iconUrl: 'storage',
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
      questionCount: 34,
      expertCount: 3,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  popularCategories: Category[] = [];

  ngOnInit(): void {
    // Get top 3 categories by question count
    this.popularCategories = this.categories
      .sort((a, b) => b.questionCount - a.questionCount)
      .slice(0, 3);
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
}