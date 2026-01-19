import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PrivacySettings, UpdatePrivacySettingsRequest } from '../../models/user-profile.model';

@Component({
  selector: 'app-privacy-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
         (click)="onBackdropClick($event)">
      <div class="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
           (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 class="text-2xl font-bold">Privacy Settings</h2>
            <p class="text-sm text-muted-foreground mt-1">Control who can see your information and interact with you</p>
          </div>
          <button 
            (click)="onCancel()"
            class="w-10 h-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
            <i class="fas fa-times text-muted-foreground"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form [formGroup]="privacyForm" class="p-6 space-y-8">
            
            <!-- Profile Visibility -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-eye text-primary"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">Profile Visibility</h3>
                  <p class="text-sm text-muted-foreground">Who can see your profile and basic information</p>
                </div>
              </div>
              
              <div class="space-y-3 ml-13">
                <label class="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    formControlName="profileVisibility"
                    value="public"
                    class="w-4 h-4 text-primary bg-background border-border focus:ring-primary">
                  <div>
                    <div class="font-medium">Public</div>
                    <div class="text-sm text-muted-foreground">Anyone can view your profile</div>
                  </div>
                </label>
                
                <label class="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    formControlName="profileVisibility"
                    value="friends"
                    class="w-4 h-4 text-primary bg-background border-border focus:ring-primary">
                  <div>
                    <div class="font-medium">Friends Only</div>
                    <div class="text-sm text-muted-foreground">Only your friends can view your profile</div>
                  </div>
                </label>
                
                <label class="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <input
                    type="radio"
                    formControlName="profileVisibility"
                    value="private"
                    class="w-4 h-4 text-primary bg-background border-border focus:ring-primary">
                  <div>
                    <div class="font-medium">Private</div>
                    <div class="text-sm text-muted-foreground">Only you can view your profile</div>
                  </div>
                </label>
              </div>
            </div>
            
            <!-- Contact Information Visibility -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-address-book text-blue-500"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">Contact Information</h3>
                  <p class="text-sm text-muted-foreground">Control who can see your contact details</p>
                </div>
              </div>
              
              <div class="space-y-4 ml-13">
                <!-- Email Visibility -->
                <div class="space-y-2">
                  <label class="text-sm font-medium">Email Address</label>
                  <div class="flex gap-2">
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="emailVisibility" value="public" class="w-3 h-3 text-primary">
                      <span class="text-sm">Public</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="emailVisibility" value="friends" class="w-3 h-3 text-primary">
                      <span class="text-sm">Friends</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="emailVisibility" value="private" class="w-3 h-3 text-primary">
                      <span class="text-sm">Private</span>
                    </label>
                  </div>
                </div>
                
                <!-- Phone Visibility -->
                <div class="space-y-2">
                  <label class="text-sm font-medium">Phone Number</label>
                  <div class="flex gap-2">
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="phoneVisibility" value="public" class="w-3 h-3 text-primary">
                      <span class="text-sm">Public</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="phoneVisibility" value="friends" class="w-3 h-3 text-primary">
                      <span class="text-sm">Friends</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="phoneVisibility" value="private" class="w-3 h-3 text-primary">
                      <span class="text-sm">Private</span>
                    </label>
                  </div>
                </div>
                
                <!-- Location Visibility -->
                <div class="space-y-2">
                  <label class="text-sm font-medium">Location</label>
                  <div class="flex gap-2">
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="locationVisibility" value="public" class="w-3 h-3 text-primary">
                      <span class="text-sm">Public</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="locationVisibility" value="friends" class="w-3 h-3 text-primary">
                      <span class="text-sm">Friends</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="locationVisibility" value="private" class="w-3 h-3 text-primary">
                      <span class="text-sm">Private</span>
                    </label>
                  </div>
                </div>
                
                <!-- Birthdate Visibility -->
                <div class="space-y-2">
                  <label class="text-sm font-medium">Date of Birth</label>
                  <div class="flex gap-2">
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="birthdateVisibility" value="public" class="w-3 h-3 text-primary">
                      <span class="text-sm">Public</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="birthdateVisibility" value="friends" class="w-3 h-3 text-primary">
                      <span class="text-sm">Friends</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="birthdateVisibility" value="private" class="w-3 h-3 text-primary">
                      <span class="text-sm">Private</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Social Interactions -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-users text-green-500"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">Social Interactions</h3>
                  <p class="text-sm text-muted-foreground">Control how others can interact with you</p>
                </div>
              </div>
              
              <div class="space-y-3 ml-13">
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
                    <div class="font-medium">Allow Following</div>
                    <div class="text-sm text-muted-foreground">Others can follow you to see your posts</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="allowFollowing"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
                
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Allow Direct Messages</div>
                    <div class="text-sm text-muted-foreground">Others can send you private messages</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="allowDirectMessages"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
                
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Allow Tagging</div>
                    <div class="text-sm text-muted-foreground">Others can tag you in posts and comments</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="allowTagging"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
              </div>
            </div>
            
            <!-- Activity and Status -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-activity text-purple-500"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">Activity & Status</h3>
                  <p class="text-sm text-muted-foreground">Control your online presence and activity visibility</p>
                </div>
              </div>
              
              <div class="space-y-4 ml-13">
                <!-- Online Status Visibility -->
                <div class="space-y-2">
                  <label class="text-sm font-medium">Online Status Visibility</label>
                  <div class="flex gap-2">
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="onlineStatusVisibility" value="public" class="w-3 h-3 text-primary">
                      <span class="text-sm">Public</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="onlineStatusVisibility" value="friends" class="w-3 h-3 text-primary">
                      <span class="text-sm">Friends</span>
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="radio" formControlName="onlineStatusVisibility" value="private" class="w-3 h-3 text-primary">
                      <span class="text-sm">Private</span>
                    </label>
                  </div>
                </div>
                
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Show Activity Status</div>
                    <div class="text-sm text-muted-foreground">Show when you're active on the platform</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="showActivityStatus"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
              </div>
            </div>
            
            <!-- Search and Discovery -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-search text-orange-500"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">Search & Discovery</h3>
                  <p class="text-sm text-muted-foreground">Control how others can find you</p>
                </div>
              </div>
              
              <div class="space-y-3 ml-13">
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Searchable by Email</div>
                    <div class="text-sm text-muted-foreground">Others can find you using your email address</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="searchableByEmail"
                    class="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary">
                </label>
                
                <label class="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div>
                    <div class="font-medium">Searchable by Phone</div>
                    <div class="text-sm text-muted-foreground">Others can find you using your phone number</div>
                  </div>
                  <input
                    type="checkbox"
                    formControlName="searchableByPhone"
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
            (click)="onSave()"
            [disabled]="isLoading()"
            class="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <span *ngIf="!isLoading()">Save Settings</span>
            <span *ngIf="isLoading()" class="flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Saving...
            </span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class PrivacySettingsComponent implements OnInit {
  @Input() privacySettings: PrivacySettings | null = null;
  @Output() save = new EventEmitter<UpdatePrivacySettingsRequest>();
  @Output() cancel = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  
  privacyForm!: FormGroup;
  isLoading = signal<boolean>(false);
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  private initializeForm(): void {
    this.privacyForm = this.fb.group({
      profileVisibility: [this.privacySettings?.profileVisibility || 'public'],
      emailVisibility: [this.privacySettings?.emailVisibility || 'friends'],
      phoneVisibility: [this.privacySettings?.phoneVisibility || 'private'],
      locationVisibility: [this.privacySettings?.locationVisibility || 'friends'],
      birthdateVisibility: [this.privacySettings?.birthdateVisibility || 'friends'],
      onlineStatusVisibility: [this.privacySettings?.onlineStatusVisibility || 'friends'],
      allowFriendRequests: [this.privacySettings?.allowFriendRequests ?? true],
      allowFollowing: [this.privacySettings?.allowFollowing ?? true],
      allowDirectMessages: [this.privacySettings?.allowDirectMessages ?? true],
      allowTagging: [this.privacySettings?.allowTagging ?? true],
      showActivityStatus: [this.privacySettings?.showActivityStatus ?? true],
      searchableByEmail: [this.privacySettings?.searchableByEmail ?? false],
      searchableByPhone: [this.privacySettings?.searchableByPhone ?? false]
    });
  }
  
  onSave(): void {
    if (this.privacyForm.valid) {
      this.isLoading.set(true);
      
      const formValue = this.privacyForm.value;
      const updateRequest: UpdatePrivacySettingsRequest = {
        privacySettings: {
          profileVisibility: formValue.profileVisibility,
          emailVisibility: formValue.emailVisibility,
          phoneVisibility: formValue.phoneVisibility,
          locationVisibility: formValue.locationVisibility,
          birthdateVisibility: formValue.birthdateVisibility,
          onlineStatusVisibility: formValue.onlineStatusVisibility,
          allowFriendRequests: formValue.allowFriendRequests,
          allowFollowing: formValue.allowFollowing,
          allowDirectMessages: formValue.allowDirectMessages,
          allowTagging: formValue.allowTagging,
          showActivityStatus: formValue.showActivityStatus,
          searchableByEmail: formValue.searchableByEmail,
          searchableByPhone: formValue.searchableByPhone
        }
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
  
  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }
}