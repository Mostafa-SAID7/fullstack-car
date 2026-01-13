import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// QA Types
import { Category } from '../../../../../shared/types/qa-api.types';
import { QACategoryService } from '../../../services/qa-category.service';

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

  categories: Category[] = [];
  popularCategories: Category[] = [];

  constructor(private qaCategoryService: QACategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.qaCategoryService.getCategories().subscribe({
      next: (response) => {
        if (response.succeeded && response.data) {
          this.categories = response.data;
          // Get top 3 categories by question count
          this.popularCategories = [...this.categories]
            .sort((a, b) => b.questionCount - a.questionCount)
            .slice(0, 3);
        }
      },
      error: (error) => {
        console.error('Failed to load categories', error);
      }
    });
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
