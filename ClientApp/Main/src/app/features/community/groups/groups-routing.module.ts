import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../core/guards/auth.guard';

import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { GroupDetailPageComponent } from './pages/group-detail-page/group-detail-page.component';
import { GroupCreatePageComponent } from './pages/group-create-page/group-create-page.component';
import { GroupEditPageComponent } from './pages/group-edit-page/group-edit-page.component';
import { GroupMembersPageComponent } from './pages/group-members-page/group-members-page.component';
import { GroupEventsPageComponent } from './pages/group-events-page/group-events-page.component';
import { GroupDiscussionsPageComponent } from './pages/group-discussions-page/group-discussions-page.component';

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
    data: { title: 'Group Details' },
    children: [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
      },
      {
        path: 'posts',
        component: GroupDetailPageComponent,
        data: { tab: 'posts' }
      },
      {
        path: 'members',
        component: GroupMembersPageComponent,
        data: { tab: 'members' }
      },
      {
        path: 'events',
        component: GroupEventsPageComponent,
        data: { tab: 'events' }
      },
      {
        path: 'discussions',
        component: GroupDiscussionsPageComponent,
        data: { tab: 'discussions' }
      }
    ]
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