import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommunityFeedComponent } from './feed/pages/community-feed/community-feed.component';

const routes: Routes = [
  { path: '', component: CommunityFeedComponent },
  
  // Guides Routes - lazy loaded module
  {
    path: 'guides',
    loadChildren: () => import('./guides/guides.module').then(m => m.GuidesModule)
  },
  
  // News Routes - lazy loaded module
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then(m => m.NewsModule)
  },
  
  // Events Routes - lazy loaded module
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
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
  
  // Maps Routes - lazy loaded module
  {
    path: 'maps',
    loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  },
  
  // Posts Routes - lazy loaded module
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule)
  },
  
  // Reviews Routes - lazy loaded module
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule)
  },
  
  // Pages Routes - lazy loaded module
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CommunityFeedComponent
  ],
  exports: [RouterModule]
})
export class CommunityModule { }