import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuidesListComponent } from './pages/guides-list/guides-list.component';

const routes: Routes = [
  { path: '', component: GuidesListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuidesRoutingModule { }