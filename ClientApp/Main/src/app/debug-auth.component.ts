import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-debug-auth',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Debug Authentication</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Auth Status -->
        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold mb-2">Authentication Status</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Is Authenticated:</strong> {{ authService.isAuthenticated }}</p>
            <p><strong>Has Token:</strong> {{ !!authService.token }}</p>
            <p><strong>Has User:</strong> {{ !!authService.currentUser }}</p>
            <p><strong>User Name:</strong> {{ authService.currentUser()?.firstName + ' ' + authService.currentUser()?.lastName || 'N/A' }}</p>
          </div>
        </div>

        <!-- Token Info -->
        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold mb-2">Token Information</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Token (first 20 chars):</strong> {{ getTokenPreview() }}</p>
            <p><strong>Token in localStorage:</strong> {{ hasTokenInStorage() }}</p>
            <p><strong>RefreshToken in localStorage:</strong> {{ hasRefreshTokenInStorage() }}</p>
            <p><strong>User in localStorage:</strong> {{ hasUserInStorage() }}</p>
          </div>
        </div>

        <!-- Test API Calls -->
        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold mb-2">Test API Calls</h3>
          <div class="space-y-2">
            <button (click)="testAuthenticatedCall()" class="px-4 py-2 bg-blue-500 text-white rounded mr-2">
              Test Auth Call
            </button>
            <button (click)="testPodcastUploadAuth()" class="px-4 py-2 bg-green-500 text-white rounded">
              Test Upload Auth
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold mb-2">Test Results</h3>
          <div *ngIf="testResult" class="text-sm">
            <pre class="whitespace-pre-wrap">{{ testResult | json }}</pre>
          </div>
        </div>
      </div>

      <!-- Raw Data -->
      <div class="mt-6 p-4 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">Raw Authentication Data</h3>
        <div class="text-xs">
          <p><strong>Current User Object:</strong></p>
          <pre class="whitespace-pre-wrap">{{ authService.currentUser | json }}</pre>
          <p class="mt-2"><strong>Token:</strong></p>
          <pre class="whitespace-pre-wrap break-all">{{ authService.token }}</pre>
        </div>
      </div>
    </div>
  `
})
export class DebugAuthComponent {
  testResult: any = null;

  constructor(
    public authService: AuthService,
    private http: HttpClient
  ) {}

  getTokenPreview(): string {
    const token = this.authService.token;
    return token ? token.substring(0, 20) + '...' : 'No token';
  }

  hasTokenInStorage(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRefreshTokenInStorage(): boolean {
    return !!localStorage.getItem('refreshToken');
  }

  hasUserInStorage(): boolean {
    return !!localStorage.getItem('user');
  }

  async testAuthenticatedCall(): Promise<void> {
    try {
      const response = await this.http.get(`${environment.apiUrl}/v7/media/videos`).toPromise();
      this.testResult = { success: true, data: response };
    } catch (error: any) {
      this.testResult = { 
        success: false, 
        error: error.message,
        status: error.status,
        details: error.error
      };
    }
  }

  async testPodcastUploadAuth(): Promise<void> {
    try {
      // Test with a simple OPTIONS request to the upload endpoint
      const response = await this.http.options(`${environment.apiUrl}/v7/media/upload/podcast`).toPromise();
      this.testResult = { success: true, message: 'Upload endpoint accessible', data: response };
    } catch (error: any) {
      this.testResult = { 
        success: false, 
        error: 'Upload endpoint test failed',
        status: error.status,
        details: error.error
      };
    }
  }
}