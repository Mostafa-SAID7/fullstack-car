import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile, UpdateProfileRequest } from '../../../../core/models/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
         (click)="onBackdropClick($event)">
      <div class="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
           (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-2xl font-bold">Edit Profile</h2>
          <button 
            (click)="onCancel()"
            class="w-10 h-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
            <i class="fas fa-times text-muted-foreground"></i>
          </button>
        </div>
        
        <!-- Form Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
            
            <!-- Profile Images Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Profile Images</h3>
              
              <!-- Profile Image -->
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div class="w-20 h-20 rounded-2xl bg-secondary overflow-hidden flex items-center justify-center">
                    <img 
                      *ngIf="profile?.profileImageUrl" 
                      [src]="profile.profileImageUrl"
                      class="w-full h-full object-cover">
                    <span 
                      *ngIf="!profile?.profileImageUrl" 
                      class="text-primary text-xl font-bold">
                      {{ profile?.firstName?.[0] }}{{ profile?.lastName?.[0] }}
                    </span>
                  </div>
                  <button
                    type="button"
                    (click)="onProfileImageUpload()"
                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs hover:bg-primary/90 transition-colors">
                    <i class="fas fa-camera"></i>
                  </button>
                </div>
                <div>
                  <p class="font-medium">Profile Picture</p>
                  <p class="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 5MB.</p>
                </div>
              </div>
              
              <!-- Cover Image -->
              <div class="space-y-2">
                <div class="relative w-full h-32 rounded-2xl bg-secondary overflow-hidden">
                  <div 
                    class="w-full h-full bg-cover bg-center"
                    [style.background-image]="profile?.coverImageUrl ? 'url(' + profile.coverImageUrl + ')' : 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1500)'">
                  </div>
                  <button
                    type="button"
                    (click)="onCoverImageUpload()"
                    class="absolute top-2 right-2 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-lg text-xs hover:bg-black/60 transition-colors">
                    <i class="fas fa-camera mr-1"></i>
                    Change Cover
                  </button>
                </div>
                <p class="text-sm text-muted-foreground">Recommended size: 1200x400px. Max size 10MB.</p>
              </div>
            </div>
            
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Basic Information</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    formControlName="firstName"
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your first name">
                  <div *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    First name is required
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    formControlName="lastName"
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your last name">
                  <div *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched" 
                       class="text-red-500 text-sm mt-1">
                    Last name is required
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  formControlName="bio"
                  rows="4"
                  class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about yourself..."></textarea>
                <div class="text-sm text-muted-foreground mt-1">
                  {{ (profileForm.get('bio')?.value || '').length }}/500 characters
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    formControlName="location"
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="City, Country">
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="url"
                    formControlName="website"
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://yourwebsite.com">
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    formControlName="dateOfBirth"
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2">Gender</label>
                  <select
                    formControlName="gender"
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Privacy Quick Settings -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Quick Privacy Settings</h3>
              <p class="text-sm text-muted-foreground">You can adjust detailed privacy settings later.</p>
              
              <div class="space-y-3">
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Public Profile</div>
                    <div class="text-sm text-muted-foreground">Anyone can view your profile</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="isPublicProfile"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
                
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Allow Friend Requests</div>
                    <div class="text-sm text-muted-foreground">Others can send you friend requests</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="allowFriendRequests"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
                
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Show Online Status</div>
                    <div class="text-sm text-muted-foreground">Let others see when you're online</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="showOnlineStatus"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            type="button"
            (click)="onCancel()"
            class="px-6 py-2.5 text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            type="button"
            (click)="onSubmit()"
            [disabled]="profileForm.invalid || isLoading()"
            class="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <span *ngIf="!isLoading()">Save Changes</span>
            <span *ngIf="isLoading()" class="flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Saving...
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Hidden file inputs -->
    <input
      #profileImageInput
      type="file"
      accept="image/*"
      (change)="onProfileImageSelected($event)"
      class="hidden">
    
    <input
      #coverImageInput
      type="file"
      accept="image/*"
      (change)="onCoverImageSelected($event)"
      class="hidden">
  `
})
export class ProfileEditComponent implements OnInit {
  @Input() profile: UserProfile | null = null;
  @Output() save = new EventEmitter<UpdateProfileRequest>();
  @Output() cancel = new EventEmitter<void>();
  @Output() profileImageUpload = new EventEmitter<File>();
  @Output() coverImageUpload = new EventEmitter<File>();
  
  private fb = inject(FormBuilder);
  private userProfileService = inject(UserProfileService);
  
  profileForm!: FormGroup;
  isLoading = signal<boolean>(false);
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  private initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.profile?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [this.profile?.lastName || '', [Validators.required, Validators.minLength(2)]],
      bio: [this.profile?.bio || '', [Validators.maxLength(500)]],
      location: [this.profile?.location || ''],
      website: [this.profile?.website || '', [Validators.pattern(/^https?:\/\/.+/)]],
      dateOfBirth: [this.profile?.dateOfBirth ? this.formatDateForInput(this.profile.dateOfBirth) : ''],
      gender: [this.profile?.gender || ''],
      isPublicProfile: [this.profile?.privacySettings?.profileVisibility === 'public'],
      allowFriendRequests: [this.profile?.privacySettings?.allowFriendRequests ?? true],
      showOnlineStatus: [this.profile?.privacySettings?.showOnlineStatus ?? true]
    });
  }
  
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading.set(true);
      
      const formValue = this.profileForm.value;
      const updateRequest: UpdateProfileRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        bio: formValue.bio || undefined,
        location: formValue.location || undefined,
        website: formValue.website || undefined,
        dateOfBirth: formValue.dateOfBirth || undefined,
        gender: formValue.gender || undefined
      };
      
      this.save.emit(updateRequest);
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
  
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
  
  onProfileImageUpload(): void {
    const input = document.querySelector('#profileImageInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }
  
  onCoverImageUpload(): void {
    const input = document.querySelector('#coverImageInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }
  
  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (this.validateImageFile(file, 5)) {
        this.profileImageUpload.emit(file);
      }
    }
  }
  
  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (this.validateImageFile(file, 10)) {
        this.coverImageUpload.emit(file);
      }
    }
  }
  
  private validateImageFile(file: File, maxSizeMB: number): boolean {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return false;
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSizeMB}MB.`);
      return false;
    }
    
    return true;
  }
  
  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }
}