import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommunityFeedComponent } from './components/community-feed/community-feed.component';
import { GuidesListComponent } from './components/guides-list/guides-list.component';

const routes: Routes = [
  { path: '', component: CommunityFeedComponent },
  { path: 'guides', component: GuidesListComponent }
];

@NgModule({
  declarations: [
    GuidesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CommunityFeedComponent // Import standalone component
  ],
  exports: [RouterModule]
})
export class CommunityModule { }