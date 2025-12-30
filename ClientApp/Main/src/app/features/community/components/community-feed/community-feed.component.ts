import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryListComponent } from '../story-list/story-list.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
    selector: 'app-community-feed',
    standalone: true,
    imports: [CommonModule, StoryListComponent, CreatePostComponent, PostListComponent],
    template: `
    <div class="flex-1 min-w-0 py-6">
        <div class="max-w-[680px] mx-auto space-y-4">
            <app-story-list></app-story-list>
            <app-create-post></app-create-post>
            <app-post-list></app-post-list>
        </div>
    </div>
  `
})
export class CommunityFeedComponent { }
