import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewsListComponent } from './pages/news-list/news-list.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';
import { NewsPreferencesComponent } from './pages/news-preferences/news-preferences.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: NewsListComponent },
      { path: 'preferences', component: NewsPreferencesComponent },
      { path: ':id', component: NewsDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }