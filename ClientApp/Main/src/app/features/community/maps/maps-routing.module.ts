import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapsExplorerComponent } from './pages/maps-explorer/maps-explorer.component';

const routes: Routes = [
  { path: '', component: MapsExplorerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }