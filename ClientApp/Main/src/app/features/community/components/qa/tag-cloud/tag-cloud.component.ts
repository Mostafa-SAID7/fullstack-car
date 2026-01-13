import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// QA Types
import { Tag, PopularTag } from '../../../../../shared/types/qa-api.types';
import { QATagService } from '../../../services/qa-tag.service';

@Component({
  selector: 'app-tag-cloud',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.scss']
})
export class TagCloudComponent implements OnInit {
  @Input() selectedTags: string[] = [];
  @Output() tagsChange = new EventEmitter<string[]>();

  showAllTags = false;
  popularTags: PopularTag[] = [];
  allTags: Tag[] = [];

  constructor(private qaTagService: QATagService) { }

  ngOnInit(): void {
    this.loadTags();
  }

  private loadTags(): void {
    // Load popular tags
    this.qaTagService.getPopularTags().subscribe({
      next: (response) => {
        if (response.succeeded && response.data) {
          this.popularTags = response.data;
        }
      },
      error: (error) => console.error('Failed to load popular tags', error)
    });

    // Load all tags
    this.qaTagService.getAllTags().subscribe({
      next: (response) => {
        if (response.succeeded && response.data) {
          this.allTags = response.data.sort((a, b) => b.usageCount - a.usageCount);
        }
      },
      error: (error) => console.error('Failed to load all tags', error)
    });
  }

  toggleTag(tagName: string): void {
    const currentTags = [...this.selectedTags];
    const index = currentTags.indexOf(tagName);

    if (index > -1) {
      currentTags.splice(index, 1);
    } else {
      currentTags.push(tagName);
    }

    this.selectedTags = currentTags;
    this.tagsChange.emit(currentTags);
  }

  removeTag(tagName: string): void {
    const currentTags = this.selectedTags.filter(tag => tag !== tagName);
    this.selectedTags = currentTags;
    this.tagsChange.emit(currentTags);
  }

  clearAllTags(): void {
    this.selectedTags = [];
    this.tagsChange.emit([]);
  }

  isTagSelected(tagName: string): boolean {
    return this.selectedTags.includes(tagName);
  }

  toggleShowAllTags(): void {
    this.showAllTags = !this.showAllTags;
  }
}
