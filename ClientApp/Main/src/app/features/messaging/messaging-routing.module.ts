import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MessagingPageComponent } from './pages/messaging-page/messaging-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MessagingPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagingRoutingModule { }