import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './layout/components/header/header.component';
import { SidebarLeftComponent } from './layout/components/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './layout/components/sidebar-right/sidebar-right.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SharedModule,
    HeaderComponent,
    SidebarLeftComponent,
    SidebarRightComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Community Car';
}