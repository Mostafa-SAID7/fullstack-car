import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FriendListComponent } from './components/friend-list/friend-list.component';
import { FriendRequestsComponent } from './components/friend-requests/friend-requests.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: FriendListComponent },
      { path: 'requests', component: FriendRequestsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule { }