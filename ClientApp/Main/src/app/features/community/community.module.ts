import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommunityFeedComponent } from './components/feed/community-feed/community-feed.component';
import { GuidesListComponent } from './components/guides/guides-list/guides-list.component';
import { NewsListComponent } from './components/news/news-list/news-list.component';
import { QAListComponent } from './components/qa/qa-list/qa-list.component';
import { MapsExplorerComponent } from './components/maps/maps-explorer/maps-explorer.component';
import { UserProfileComponent } from './components/profile/user-profile/user-profile.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { ReviewListComponent } from './components/reviews/review-list/review-list.component';
import { FriendListComponent } from './components/friends/friend-list/friend-list.component';
import { PageListComponent } from './components/pages/page-list/page-list.component';

const routes: Routes = [
  { path: '', component: CommunityFeedComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'guides', component: GuidesListComponent },
  { path: 'news', component: NewsListComponent },
  { path: 'qa', component: QAListComponent },
  { path: 'maps', component: MapsExplorerComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'groups', component: GroupListComponent },
  { path: 'reviews', component: ReviewListComponent },
  { path: 'friends', component: FriendListComponent },
  { path: 'pages', component: PageListComponent }
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CommunityFeedComponent,
    NewsListComponent,
    QAListComponent,
    MapsExplorerComponent,
    GuidesListComponent,
    UserProfileComponent,
    PostListComponent,
    GroupListComponent,
    ReviewListComponent,
    FriendListComponent,
    PageListComponent
  ],
  exports: [RouterModule]
})
export class CommunityModule { }