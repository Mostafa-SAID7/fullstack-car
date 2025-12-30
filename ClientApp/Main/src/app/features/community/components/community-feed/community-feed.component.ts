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
    <main class="flex-1 min-w-0 md:px-8 py-6 lg:ml-72 lg:mr-72">
        <div class="max-w-[680px] mx-auto">
            <app-story-list></app-story-list>
            <app-create-post></app-create-post>
            <app-post-list></app-post-list>
        </div>
    </main>
  `
})
export class CommunityFeedComponent { }
