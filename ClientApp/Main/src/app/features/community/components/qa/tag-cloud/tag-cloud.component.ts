import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// QA Types
import { Tag, PopularTag } from '../../../../../shared/types/qa-api.types';

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

  // Mock data - in real implementation, this would come from a service
  popularTags: PopularTag[] = [
    { name: 'javascript', usageCount: 245, trendingScore: 95 },
    { name: 'react', usageCount: 189, trendingScore: 88 },
    { name: 'typescript', usageCount: 156, trendingScore: 92 },
    { name: 'nodejs', usageCount: 134, trendingScore: 85 },
    { name: 'angular', usageCount: 123, trendingScore: 78 },
    { name: 'python', usageCount: 198, trendingScore: 90 },
    { name: 'sql-server', usageCount: 167, trendingScore: 82 },
    { name: 'docker', usageCount: 145, trendingScore: 87 }
  ];

  allTags: Tag[] = [
    { id: '1', name: 'html', usageCount: 89, createdAt: new Date().toISOString() },
    { id: '2', name: 'css', usageCount: 76, createdAt: new Date().toISOString() },
    { id: '3', name: 'vue', usageCount: 65, createdAt: new Date().toISOString() },
    { id: '4', name: 'php', usageCount: 54, createdAt: new Date().toISOString() },
    { id: '5', name: 'java', usageCount: 98, createdAt: new Date().toISOString() },
    { id: '6', name: 'csharp', usageCount: 87, createdAt: new Date().toISOString() },
    { id: '7', name: 'mongodb', usageCount: 43, createdAt: new Date().toISOString() },
    { id: '8', name: 'redis', usageCount: 32, createdAt: new Date().toISOString() },
    { id: '9', name: 'kubernetes', usageCount: 28, createdAt: new Date().toISOString() },
    { id: '10', name: 'aws', usageCount: 67, createdAt: new Date().toISOString() },
    { id: '11', name: 'azure', usageCount: 45, createdAt: new Date().toISOString() },
    { id: '12', name: 'git', usageCount: 78, createdAt: new Date().toISOString() }
  ];

  ngOnInit(): void {
    // Sort popular tags by trending score
    this.popularTags.sort((a, b) => b.trendingScore - a.trendingScore);
    
    // Sort all tags by usage count
    this.allTags.sort((a, b) => b.usageCount - a.usageCount);
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