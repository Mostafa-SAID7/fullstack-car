import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-debug-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Debug Podcast Upload</h2>
      
      <div class="space-y-4">
        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold">Authentication Status</h3>
          <p>Authenticated: {{ authService.isAuthenticated }}</p>
          <p>User: {{ authService.currentUser?.email || 'Not logged in' }}</p>
          <p>Token: {{ authService.token ? 'Present' : 'Missing' }}</p>
        </div>

        <div class="p-4 bg-gray-100 rounded">
          <h3 class="font-bold">API Configuration</h3>
          <p>API URL: {{ apiUrl }}</p>
          <p>Upload Endpoint: {{ apiUrl }}/v7/media/upload/podcast</p>
        </div>

        <div class="space-y-2">
          <input type="file" (change)="onFileSelected($event)" accept="audio/*" class="block">
          <button 
            (click)="testUpload()" 
            [disabled]="!selectedFile || uploading"
            class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
            {{ uploading ? 'Testing...' : 'Test Upload' }}
          </button>
        </div>

        <div *ngIf="result" class="p-4 rounded" [class]="result.success ? 'bg-green-100' : 'bg-red-100'">
          <h3 class="font-bold">Result:</h3>
          <pre class="text-sm">{{ result | json }}</pre>
        </div>

        <div class="space-y-2">
          <button (click)="testAuth()" class="px-4 py-2 bg-green-500 text-white rounded">
            Test Authentication
          </button>
          <button (click)="testEndpoint()" class="px-4 py-2 bg-purple-500 text-white rounded">
            Test Endpoint Availability
          </button>
        </div>
      </div>
    </div>
  `
})
export class DebugUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  result: any = null;
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.result = null;
  }

  async testUpload(): Promise<void> {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.result = null;

    try {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('title', 'Test Podcast');
      formData.append('description', 'This is a test podcast upload');
      formData.append('isPublic', 'true');
      formData.append('allowComments', 'true');
      formData.append('allowDownload', 'false');
      formData.append('episodeNumber', '1');
      formData.append('seasonNumber', '1');

      const headers = new HttpHeaders();
      if (this.authService.token) {
        headers.set('Authorization', `Bearer ${this.authService.token}`);
      }

      const response = await this.http.post(
        `${this.apiUrl}/v7/media/upload/podcast`,
        formData,
        { headers }
      ).toPromise();

      this.result = { success: true, data: response };
    } catch (error: any) {
      console.error('Upload error:', error);
      this.result = { 
        success: false, 
        error: error.message,
        status: error.status,
        details: error.error
      };
    } finally {
      this.uploading = false;
    }
  }

  async testAuth(): Promise<void> {
    try {
      const headers = new HttpHeaders();
      if (this.authService.token) {
        headers.set('Authorization', `Bearer ${this.authService.token}`);
      }

      const response = await this.http.get(
        `${this.apiUrl}/v1/auth/me`,
        { headers }
      ).toPromise();

      this.result = { success: true, data: response };
    } catch (error: any) {
      this.result = { 
        success: false, 
        error: 'Auth test failed',
        status: error.status,
        details: error.error
      };
    }
  }

  async testEndpoint(): Promise<void> {
    try {
      const response = await this.http.options(
        `${this.apiUrl}/v7/media/upload/podcast`
      ).toPromise();

      this.result = { success: true, message: 'Endpoint is available', data: response };
    } catch (error: any) {
      this.result = { 
        success: false, 
        error: 'Endpoint test failed',
        status: error.status,
        details: error.error
      };
    }
  }
}