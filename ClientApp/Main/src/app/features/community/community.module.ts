import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommunityFeedComponent } from './components/community-feed/community-feed.component';
import { GuidesListComponent } from './components/guides-list/guides-list.component';

import { NewsListComponent } from './components/news-list/news-list.component';
import { QAListComponent } from './components/qa-list/qa-list.component';
import { MapsExplorerComponent } from './components/maps-explorer/maps-explorer.component';

const routes: Routes = [
  { path: '', component: CommunityFeedComponent },
  { path: 'guides', component: GuidesListComponent },
  { path: 'news', component: NewsListComponent },
  { path: 'qa', component: QAListComponent },
  { path: 'maps', component: MapsExplorerComponent }
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
    GuidesListComponent
  ],
  exports: [RouterModule]
})
export class CommunityModule { }