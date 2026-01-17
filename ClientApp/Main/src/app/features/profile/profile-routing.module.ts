import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { ProfileTestComponent } from './components/profile-test/profile-test.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
    title: 'My Profile - Community Car'
  },
  {
    path: 'search',
    component: UserSearchComponent,
    canActivate: [AuthGuard],
    title: 'Find People - Community Car'
  },
  {
    path: 'test',
    component: ProfileTestComponent,
    title: 'Profile Test - Community Car'
  },
  {
    path: ':id',
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
    title: 'User Profile - Community Car'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }