import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// QA Components
import { QASearchComponent } from './components/qa-search/qa-search.component';
import { QAPageComponent } from './components/qa-page/qa-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'browse',
    pathMatch: 'full'
  },
  {
    path: 'browse',
    component: QAPageComponent,
    data: {
      title: 'Browse Questions & Answers',
      description: 'Explore questions and answers from our community'
    }
  },
  {
    path: 'search',
    component: QASearchComponent,
    data: {
      title: 'Search Questions & Answers',
      description: 'Find answers to your questions or discover new knowledge from our community'
    }
  },
  {
    path: 'questions/:id',
    component: QAPageComponent,
    data: {
      title: 'Question Details',
      description: 'View question details and answers'
    }
  },
  // Additional QA routes can be added here
  // {
  //   path: 'ask',
  //   component: AskQuestionComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QARoutingModule { }