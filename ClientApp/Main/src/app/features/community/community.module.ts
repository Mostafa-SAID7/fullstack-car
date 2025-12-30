import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommunityFeedComponent } from './components/community-feed/community-feed.component';

const routes: Routes = [
  { path: '', component: CommunityFeedComponent }
];

@NgModule({
  declarations: [
    // Note: CommunityFeedComponent is standalone, so we don't declare it here
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommunityFeedComponent // Import standalone component
  ],
  exports: [RouterModule]
})
export class CommunityModule { }