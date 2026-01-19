import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// QA Types
import { Category } from '../../models/qa-api.types';
import { QACategoryService } from '../../services/qa-category.service';

import { FilterSelectComponent } from '../../../../../../shared/components/filter-select/filter-select.component';
import { FilterChipsComponent } from '../../../../../../shared/components/filter-chips/filter-chips.component';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterSelectComponent,
    FilterChipsComponent
  ],
  templateUrl: './category-filter.component.html'
})
export class CategoryFilterComponent implements OnInit {
  @Input() selectedCategory = '';
  @Output() categoryChange = new EventEmitter<string>();

  categories: Category[] = [];
  popularCategories: Category[] = [];

  constructor(private qaCategoryService: QACategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  get categoryOptions(): any[] {
    return this.categories.map(c => ({
      value: c.name,
      label: c.name,
      icon: 'fa-folder'
    }));
  }

  get popularCategoryOptions(): any[] {
    return this.popularCategories.map(c => ({
      value: c.name,
      label: c.name,
      icon: 'fa-star'
    }));
  }

  private loadCategories(): void {
    this.qaCategoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response.succeeded && response.data) {
          this.categories = response.data;
          // Get top 3 categories by question count
          this.popularCategories = [...this.categories]
            .sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0))
            .slice(0, 3);
        }
      },
      error: (error: any) => {
        console.error('Failed to load categories', error);
      }
    });
  }

  onFilterSelectChange(category: string): void {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  onChipSelect(category: string): void {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.onFilterSelectChange(category);
  }

  selectCategory(category: string): void {
    this.onFilterSelectChange(category);
  }
}
