import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { PrivacySettingsComponent } from './components/privacy-settings/privacy-settings.component';
import { ConnectionsListComponent } from './components/connections-list/connections-list.component';
import { UserSearchComponent } from './components/user-search/user-search.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    // Standalone components are imported directly in the components that use them
    ProfilePageComponent,
    ProfileHeaderComponent,
    ProfileEditComponent,
    PrivacySettingsComponent,
    ConnectionsListComponent,
    UserSearchComponent
  ]
})
export class ProfileModule { }