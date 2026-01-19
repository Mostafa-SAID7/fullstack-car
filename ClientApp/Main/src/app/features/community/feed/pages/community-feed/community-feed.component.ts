import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../../../posts/pages/post-list/post-list.component';
import { ReviewListComponent } from '../../../reviews/pages/review-list/review-list.component';

@Component({
    selector: 'app-community-feed',
    standalone: true,
    imports: [
        CommonModule,
        PostListComponent,
        ReviewListComponent
    ],
    templateUrl: './community-feed.component.html'
})
export class CommunityFeedComponent { }
