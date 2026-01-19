import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuestionListComponent } from './pages/question-list/question-list.component';
import { QuestionDetailComponent } from './pages/question-detail/question-detail.component';
import { QuestionFormComponent } from './pages/question-form/question-form.component';
import { QuestionSearchComponent } from './components/question-search/question-search.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: QuestionListComponent },
      { path: 'ask', component: QuestionFormComponent },
      { path: 'search', component: QuestionSearchComponent },
      { path: ':id', component: QuestionDetailComponent },
      { path: ':id/edit', component: QuestionFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QaRoutingModule { }