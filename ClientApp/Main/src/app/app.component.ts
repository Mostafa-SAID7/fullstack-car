import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './layout/components/header/header.component';
import { SidebarLeftComponent } from './layout/components/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './layout/components/sidebar-right/sidebar-right.component';
import { LayoutService } from './core/services/layout.service';
import { CommonModule } from '@angular/common';
import { AIAgentModule } from './features/ai-agent/ai-agent.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // HeaderComponent, // Removed
    // SidebarLeftComponent, // Removed 
    // SidebarRightComponent, // Removed
    CommonModule,
    AIAgentModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Community Car';
  layoutService = inject(LayoutService);
}