import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommunityFeedComponent } from './feed/community-feed/community-feed.component';
import { GuidesListComponent } from './guides/guides-list/guides-list.component';
import { MapsExplorerComponent } from './maps/maps-explorer/maps-explorer.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { ReviewListComponent } from './reviews/review-list/review-list.component';
import { PageListComponent } from './pages/page-list/page-list.component';

const routes: Routes = [
  { path: '', component: CommunityFeedComponent },
  { path: 'guides', component: GuidesListComponent },
  // News Routes - lazy loaded module
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then(m => m.NewsModule)
  },
  // QA Routes - lazy loaded module
  {
    path: 'qa',
    loadChildren: () => import('./qa/qa.module').then(m => m.QaModule)
  },
  // Groups Routes - lazy loaded module
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
  },
  // Friends Routes - lazy loaded module
  {
    path: 'friends',
    loadChildren: () => import('./friends/friends.module').then(m => m.FriendsModule)
  },
  { path: 'maps', component: MapsExplorerComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'reviews', component: ReviewListComponent },
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
    MapsExplorerComponent,
    GuidesListComponent,
    PostListComponent,
    ReviewListComponent,
    PageListComponent
  ],
  exports: [RouterModule]
})
export class CommunityModule { }