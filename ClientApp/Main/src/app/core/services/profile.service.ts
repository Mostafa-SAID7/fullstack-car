import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateProfileRequest, ProfileResponse } from '../models/auth.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiUrl}/v1/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Result<ProfileResponse>> {
    return this.http.get<Result<ProfileResponse>>(`${this.apiUrl}`);
  }

  updateProfile(request: UpdateProfileRequest): Observable<Result<ProfileResponse>> {
    return this.http.put<Result<ProfileResponse>>(`${this.apiUrl}`, request);
  }

  uploadAvatar(file: File): Observable<Result<{ profileImageUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.http.post<Result<{ profileImageUrl: string }>>(`${this.apiUrl}/avatar`, formData);
  }

  removeAvatar(): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.apiUrl}/avatar`);
  }

  deactivateAccount(reason?: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/deactivate`, { reason });
  }

  deleteAccount(password: string, reason?: string): Observable<Result<void>> {
    return this.http.post<Result<void>>(`${this.apiUrl}/delete`, { password, reason });
  }

  updatePrivacySettings(settings: {
    isEmailPublic: boolean;
    isPhonePublic: boolean;
    allowDirectMessages: boolean;
    showOnlineStatus: boolean;
  }): Observable<Result<void>> {
    return this.http.put<Result<void>>(`${this.apiUrl}/privacy`, settings);
  }
}