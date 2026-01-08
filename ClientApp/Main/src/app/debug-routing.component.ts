import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-debug-routing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Debug Routing</h2>
      
      <div class="space-y-4">
        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold">Current Route</h3>
          <p>{{ router.url }}</p>
        </div>

        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold">Authentication Status</h3>
          <p>Authenticated: {{ authService.isAuthenticated }}</p>
          <p>User: {{ authService.currentUser?.email || 'Not logged in' }}</p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold">Test Navigation</h3>
          <button (click)="navigateTo('/auth/login')" class="px-4 py-2 bg-blue-500 text-white rounded mr-2">
            Go to Login
          </button>
          <button (click)="navigateTo('/community')" class="px-4 py-2 bg-green-500 text-white rounded mr-2">
            Go to Community
          </button>
          <button (click)="navigateTo('/media')" class="px-4 py-2 bg-purple-500 text-white rounded mr-2">
            Go to Media
          </button>
          <button (click)="navigateTo('/404')" class="px-4 py-2 bg-red-500 text-white rounded">
            Go to 404
          </button>
        </div>

        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold">Direct Links</h3>
          <div class="space-y-1">
            <a routerLink="/auth/login" class="block text-blue-600 hover:underline">Direct Link to Login</a>
            <a routerLink="/community" class="block text-blue-600 hover:underline">Direct Link to Community</a>
            <a routerLink="/media" class="block text-blue-600 hover:underline">Direct Link to Media</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DebugRoutingComponent {
  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  navigateTo(path: string): void {
    console.log('Navigating to:', path);
    this.router.navigate([path]).then(
      success => console.log('Navigation success:', success),
      error => console.error('Navigation error:', error)
    );
  }
}