import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// QA Types and Services
import { QASearchService } from '../../../community/services/qa-search.service';
import { Tag, PopularTag } from '../../../../shared/types/qa-api.types';

@Component({
  selector: 'app-qa-tag-cloud',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './qa-tag-cloud.component.html',
  styleUrls: ['./qa-tag-cloud.component.scss']
})
export class QATagCloudComponent implements OnInit {
  @Input() selectedTags: string[] = [];
  @Output() tagsChange = new EventEmitter<string[]>();

  popularTags: PopularTag[] = [];
  allTags: Tag[] = [];
  showAllTags = false;
  loading = false;
  error: string | null = null;

  // Tag size categories for visual hierarchy
  tagSizes = {
    xl: 'text-base px-4 py-2',
    lg: 'text-sm px-3 py-2',
    md: 'text-sm px-3 py-1',
    sm: 'text-xs px-2 py-1'
  };

  constructor(private qaSearchService: QASearchService) {}

  ngOnInit(): void {
    this.loadTags();
  }

  private loadTags(): void {
    this.loading = true;
    this.error = null;

    // Load both popular tags and all tags
    Promise.all([
      this.qaSearchService.getPopularTags().toPromise(),
      this.qaSearchService.getTags().toPromise()
    ]).then(([popularResponse, allResponse]) => {
      // Handle popular tags
      if (popularResponse?.succeeded && popularResponse.data) {
        this.popularTags = popularResponse.data;
      } else {
        this.popularTags = this.getMockPopularTags();
      }

      // Handle all tags
      if (allResponse?.succeeded && allResponse.data) {
        this.allTags = allResponse.data;
      } else {
        this.allTags = this.getMockAllTags();
      }

      this.sortTags();
      this.loading = false;
    }).catch(error => {
      console.error('Failed to load tags:', error);
      this.error = 'Failed to load tags';
      // Use mock data as fallback
      this.popularTags = this.getMockPopularTags();
      this.allTags = this.getMockAllTags();
      this.sortTags();
      this.loading = false;
    });
  }

  private getMockPopularTags(): PopularTag[] {
    return [
      { name: 'javascript', usageCount: 245, trendingScore: 95 },
      { name: 'react', usageCount: 189, trendingScore: 88 },
      { name: 'typescript', usageCount: 156, trendingScore: 92 },
      { name: 'nodejs', usageCount: 134, trendingScore: 85 },
      { name: 'angular', usageCount: 123, trendingScore: 78 },
      { name: 'python', usageCount: 198, trendingScore: 90 },
      { name: 'sql-server', usageCount: 167, trendingScore: 82 },
      { name: 'docker', usageCount: 145, trendingScore: 87 },
      { name: 'azure', usageCount: 134, trendingScore: 80 },
      { name: 'csharp', usageCount: 128, trendingScore: 75 }
    ];
  }

  private getMockAllTags(): Tag[] {
    return [
      { id: '1', name: 'html', usageCount: 89, createdAt: new Date().toISOString() },
      { id: '2', name: 'css', usageCount: 76, createdAt: new Date().toISOString() },
      { id: '3', name: 'vue', usageCount: 65, createdAt: new Date().toISOString() },
      { id: '4', name: 'php', usageCount: 54, createdAt: new Date().toISOString() },
      { id: '5', name: 'java', usageCount: 98, createdAt: new Date().toISOString() },
      { id: '6', name: 'mongodb', usageCount: 43, createdAt: new Date().toISOString() },
      { id: '7', name: 'redis', usageCount: 32, createdAt: new Date().toISOString() },
      { id: '8', name: 'kubernetes', usageCount: 28, createdAt: new Date().toISOString() },
      { id: '9', name: 'aws', usageCount: 67, createdAt: new Date().toISOString() },
      { id: '10', name: 'git', usageCount: 78, createdAt: new Date().toISOString() },
      { id: '11', name: 'webpack', usageCount: 45, createdAt: new Date().toISOString() },
      { id: '12', name: 'sass', usageCount: 38, createdAt: new Date().toISOString() },
      { id: '13', name: 'graphql', usageCount: 41, createdAt: new Date().toISOString() },
      { id: '14', name: 'nestjs', usageCount: 35, createdAt: new Date().toISOString() },
      { id: '15', name: 'tailwindcss', usageCount: 52, createdAt: new Date().toISOString() }
    ];
  }

  private sortTags(): void {
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

  getTagSize(usageCount: number): string {
    if (usageCount >= 200) return this.tagSizes.xl;
    if (usageCount >= 100) return this.tagSizes.lg;
    if (usageCount >= 50) return this.tagSizes.md;
    return this.tagSizes.sm;
  }

  getTagColor(tagName: string): string {
    // Generate consistent colors based on tag name
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    ];

    const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  getSelectedTagColor(): string {
    return 'bg-blue-600 text-white dark:bg-blue-500';
  }

  getTrendingIcon(trendingScore: number): string {
    if (trendingScore >= 90) return 'trending_up';
    if (trendingScore >= 80) return 'trending_flat';
    return 'trending_down';
  }

  getTrendingColor(trendingScore: number): string {
    if (trendingScore >= 90) return 'text-green-500';
    if (trendingScore >= 80) return 'text-yellow-500';
    return 'text-red-500';
  }

  trackByTag(index: number, tag: Tag | PopularTag): string {
    return tag.name;
  }

  // Get filtered tags that aren't already in popular tags
  get additionalTags(): Tag[] {
    const popularTagNames = this.popularTags.map(tag => tag.name);
    return this.allTags.filter(tag => !popularTagNames.includes(tag.name));
  }

  onTagSearch(searchTerm: string): void {
    // This method is called from the template but the filtering is handled by getFilteredAdditionalTags
  }

  getFilteredAdditionalTags(searchTerm: string): Tag[] {
    if (!searchTerm) return this.additionalTags;
    
    const term = searchTerm.toLowerCase();
    return this.additionalTags.filter(tag => 
      tag.name.toLowerCase().includes(term)
    );
  }

  getQuickSuggestions(): Array<{tag: string, icon: string, description: string}> {
    return [
      { tag: 'javascript', icon: 'code', description: 'Most popular language' },
      { tag: 'react', icon: 'web', description: 'Frontend framework' },
      { tag: 'nodejs', icon: 'developer_board', description: 'Backend runtime' },
      { tag: 'typescript', icon: 'integration_instructions', description: 'Type-safe JavaScript' }
    ];
  }
}