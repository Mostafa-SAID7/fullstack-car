import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from './core/services/layout.service';
import { ThemeService } from './core/services/theme.service';
import { RtlService } from './core/services/rtl.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Media Streaming Platform';
  layoutService = inject(LayoutService);
  private themeService = inject(ThemeService);
  private rtlService = inject(RtlService);

  ngOnInit(): void {
    // Initialize RTL service - this will set up document-level RTL support
    // The RTL service automatically subscribes to translation service changes
    console.log('RTL Service initialized');
  }
}