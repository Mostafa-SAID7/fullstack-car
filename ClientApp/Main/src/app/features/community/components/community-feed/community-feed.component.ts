import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryListComponent } from '../story-list/story-list.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
    selector: 'app-community-feed',
    standalone: true,
    imports: [CommonModule, StoryListComponent, CreatePostComponent, PostListComponent],
    templateUrl: './community-feed.component.html'
})
export class CommunityFeedComponent { }
