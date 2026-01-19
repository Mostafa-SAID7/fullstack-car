import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../core/guards/auth.guard';

import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { GroupDetailPageComponent } from './pages/group-detail-page/group-detail-page.component';
import { GroupCreatePageComponent } from './pages/group-create-page/group-create-page.component';
import { GroupEditPageComponent } from './pages/group-edit-page/group-edit-page.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsPageComponent,
    data: { title: 'Groups' }
  },
  {
    path: 'create',
    component: GroupCreatePageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Create Group' }
  },
  {
    path: ':id',
    component: GroupDetailPageComponent,
    data: { title: 'Group Details' }
  },
  {
    path: ':id/edit',
    component: GroupEditPageComponent,
    canActivate: [AuthGuard],
    data: { title: 'Edit Group' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }