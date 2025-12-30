import { Component } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './layout/components/header/header.component';
import { SidebarLeftComponent } from './layout/components/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './layout/components/sidebar-right/sidebar-right.component';
import { CommunityFeedComponent } from './features/community/components/community-feed/community-feed.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    CommunityFeedComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Community Car';
}