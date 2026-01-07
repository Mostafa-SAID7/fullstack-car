import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarLeftComponent } from '../../components/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from '../../components/sidebar-right/sidebar-right.component';
import { AIChatWidgetComponent } from '../../../features/ai-agent/components/ai-chat-widget/ai-chat-widget.component';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        HeaderComponent,
        SidebarLeftComponent,
        SidebarRightComponent
    ],
    template: `
<div class="min-h-screen bg-background text-foreground flex flex-col">
    <!-- Header with Mica effect -->
    <app-header class="fixed top-0 left-0 w-full z-50 h-14"></app-header>

    <!-- Main Layout Container: Exactly fills viewport minus header -->
    <div
        class="flex-1 grid grid-cols-1 md:grid-cols-[80px_1fr] lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_240px] gap-4 xl:gap-6 w-full h-[calc(100vh-3.5rem)] mt-14 overflow-hidden bg-background/50">

        <!-- Left Sidebar -->
        <aside
            class="hidden md:block h-[calc(100vh-3.5rem)] pb-4 md:pl-2 lg:pl-4 border-r border-border/10 transition-all duration-500">
            <app-sidebar-left class="block h-full animate-fade-in"></app-sidebar-left>
        </aside>

        <!-- Main Content Area -->
        <main
            class="w-full h-[calc(100vh-3.5rem)] pb-8 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-4 2xl:px-6 flex justify-center overflow-y-auto custom-scroll scroll-smooth">
            <div class="w-full pt-6 animate-slide-up max-w-[1400px]">
                <router-outlet></router-outlet>
                <!-- Localization Test -->
                <div style="display:none" id="localization-test">Welcome</div>
            </div>
        </main>

        <!-- Right Sidebar -->
        <aside
            class="hidden xl:block h-[calc(100vh-3.5rem)] pb-4 pr-4 border-l border-border/10">
            <app-sidebar-right class="block h-full animate-fade-in"></app-sidebar-right>
        </aside>
    </div>

    <!-- Mobile Menu Overlay -->
    <div *ngIf="layoutService.isMobileMenuOpen()" class="fixed inset-0 z-40 xl:hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            (click)="layoutService.closeMobileMenu()"></div>

        <!-- Menu Content -->
        <div
            class="absolute right-0 top-0 h-full w-[240px] bg-background shadow-2xl transform transition-transform duration-300 ease-in-out pt-16 px-4 flex flex-col">
            <div class="flex-1 min-h-0 mb-4">
                <app-sidebar-left class="h-full block"></app-sidebar-left>
            </div>
            <!-- Mobile Config/Profile Links could go here if separate from sidebar -->
        </div>
    </div>
</div>
  `
})
export class MainLayoutComponent {
    constructor(public layoutService: LayoutService) { }
}
