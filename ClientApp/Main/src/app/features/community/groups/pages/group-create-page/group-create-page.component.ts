import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../../../../core/services/group.service';
import { CreateGroupRequest, GroupSettings } from '../../models/group.model';

@Component({
  selector: 'app-group-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <button 
            (click)="goBack()"
            class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Groups
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create New Group</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Build a community around your interests and connect with like-minded people.
          </p>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <form [formGroup]="createGroupForm" (ngSubmit)="onSubmit()" class="space-y-6 p-6">
            
            <!-- Basic Information -->
            <div class="space-y-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Basic Information
              </h2>

              <!-- Group Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Image
                </label>
                <div class="flex items-center space-x-4">
                  <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    @if (selectedImageUrl()) {
                      <img [src]="selectedImageUrl()" alt="Group image" class="w-full h-full object-cover">
                    } @else {
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    }
                  </div>
                  <div>
                    <input 
                      type="file" 
                      #fileInput 
                      (change)="onImageSelected($event)"
                      accept="image/*"
                      class="hidden">
                    <button 
                      type="button"
                      (click)="fileInput.click()"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Choose Image
                    </button>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <!-- Group Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name *
                </label>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  placeholder="Enter group name"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                @if (createGroupForm.get('name')?.invalid && createGroupForm.get('name')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Group name is required</p>
                }
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  formControlName="description"
                  rows="4"
                  placeholder="Describe what your group is about..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"></textarea>
                @if (createGroupForm.get('description')?.invalid && createGroupForm.get('description')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Description is required</p>
                }
              </div>

              <!-- Category -->
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  formControlName="category"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="">Select a category</option>
                  @for (category of categories; track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
                @if (createGroupForm.get('category')?.invalid && createGroupForm.get('category')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Please select a category</p>
                }
              </div>

              <!-- Privacy Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Privacy *
                </label>
                <div class="space-y-3">
                  @for (type of privacyTypes; track type.value) {
                    <label class="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        [value]="type.value"
                        formControlName="type"
                        class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                      <div class="flex-1">
                        <div class="flex items-center space-x-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ type.label }}</span>
                          <span [class]="type.iconClass">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path [attr.d]="type.iconPath"></path>
                            </svg>
                          </span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ type.description }}</p>
                      </div>
                    </label>
                  }
                </div>
              </div>

              <!-- Tags -->
              <div>
                <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div class="space-y-2">
                  <input
                    type="text"
                    #tagInput
                    (keydown.enter)="addTag($event, tagInput)"
                    placeholder="Add tags (press Enter)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  @if (tags().length > 0) {
                    <div class="flex flex-wrap gap-2">
                      @for (tag of tags(); track tag) {
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {{ tag }}
                          <button
                            type="button"
                            (click)="removeTag(tag)"
                            class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                          </button>
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Group Settings -->
            <div class="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Group Settings
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (setting of groupSettings; track setting.key) {
                  <label class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ setting.label }}</span>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ setting.description }}</p>
                    </div>
                    <input
                      type="checkbox"
                      [formControlName]="'settings.' + setting.key"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  </label>
                }
              </div>
            </div>

            <!-- Group Rules -->
            <div class="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Group Rules
              </h2>
              
              <div class="space-y-3">
                @for (rule of rules(); track $index; let i = $index) {
                  <div class="flex items-center space-x-3">
                    <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                      {{ i + 1 }}
                    </span>
                    <input
                      type="text"
                      [value]="rule"
                      (input)="updateRule(i, $event)"
                      placeholder="Enter group rule"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <button
                      type="button"
                      (click)="removeRule(i)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                }
                
                <button
                  type="button"
                  (click)="addRule()"
                  class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">Add Rule</span>
                </button>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                (click)="goBack()"
                class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              
              <button
                type="submit"
                [disabled]="createGroupForm.invalid || isSubmitting()"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
                @if (isSubmitting()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                <span>{{ isSubmitting() ? 'Creating...' : 'Create Group' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class GroupCreatePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private groupService = inject(GroupService);

  // Signals
  selectedImageUrl = signal<string | null>(null);
  tags = signal<string[]>([]);
  rules = signal<string[]>(['']);
  isSubmitting = signal(false);

  // Form
  createGroupForm: FormGroup;

  // Data
  categories = [
    'Automotive',
    'Technology',
    'Sports',
    'Gaming',
    'Music',
    'Art & Design',
    'Business',
    'Education',
    'Health & Fitness',
    'Travel',
    'Food & Cooking',
    'Photography',
    'Books & Literature',
    'Movies & TV',
    'Science',
    'Politics',
    'Environment',
    'Fashion',
    'DIY & Crafts',
    'Pets & Animals'
  ];

  privacyTypes = [
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can see the group, its members, and their posts.',
      iconClass: 'text-green-500',
      iconPath: 'M10 12a2 2 0 100-4 2 2 0 000 4z M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z'
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Anyone can find the group, but only members can see posts.',
      iconClass: 'text-yellow-500',
      iconPath: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
    },
    {
      value: 'secret',
      label: 'Secret',
      description: 'Only members can find the group and see posts.',
      iconClass: 'text-red-500',
      iconPath: 'M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
    }
  ];

  groupSettings = [
    {
      key: 'allowMemberPosts',
      label: 'Allow Member Posts',
      description: 'Members can create posts in the group'
    },
    {
      key: 'requirePostApproval',
      label: 'Require Post Approval',
      description: 'Posts need approval before being visible'
    },
    {
      key: 'allowMemberInvites',
      label: 'Allow Member Invites',
      description: 'Members can invite others to join'
    },
    {
      key: 'allowDiscussions',
      label: 'Allow Discussions',
      description: 'Enable discussion threads in the group'
    },
    {
      key: 'allowEvents',
      label: 'Allow Events',
      description: 'Members can create and manage events'
    },
    {
      key: 'allowPolls',
      label: 'Allow Polls',
      description: 'Members can create polls and surveys'
    },
    {
      key: 'autoApproveMembers',
      label: 'Auto-approve Members',
      description: 'Automatically approve join requests'
    },
    {
      key: 'showMemberList',
      label: 'Show Member List',
      description: 'Display list of group members'
    }
  ];

  constructor() {
    this.createGroupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['', Validators.required],
      type: ['public', Validators.required],
      imageUrl: [''],
      settings: this.fb.group({
        allowMemberPosts: [true],
        requirePostApproval: [false],
        allowMemberInvites: [true],
        allowDiscussions: [true],
        allowEvents: [true],
        allowPolls: [true],
        autoApproveMembers: [true],
        showMemberList: [true],
        allowExternalSharing: [true]
      })
    });
  }

  ngOnInit(): void {
    // Initialize with one empty rule
    this.rules.set(['']);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Upload file
      this.groupService.uploadFile(file).subscribe({
        next: (url) => {
          this.selectedImageUrl.set(url);
          this.createGroupForm.patchValue({ imageUrl: url });
        },
        error: (error) => {
          console.error('Failed to upload image:', error);
          alert('Failed to upload image. Please try again.');
        }
      });
    }
  }

  addTag(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    
    if (value && !this.tags().includes(value) && this.tags().length < 10) {
      this.tags.update(tags => [...tags, value]);
      input.value = '';
    }
  }

  removeTag(tagToRemove: string): void {
    this.tags.update(tags => tags.filter(tag => tag !== tagToRemove));
  }

  addRule(): void {
    this.rules.update(rules => [...rules, '']);
  }

  removeRule(index: number): void {
    this.rules.update(rules => rules.filter((_, i) => i !== index));
  }

  updateRule(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rules.update(rules => {
      const newRules = [...rules];
      newRules[index] = input.value;
      return newRules;
    });
  }

  onSubmit(): void {
    if (this.createGroupForm.valid) {
      this.isSubmitting.set(true);

      const formValue = this.createGroupForm.value;
      const validRules = this.rules().filter(rule => rule.trim() !== '');

      const request: CreateGroupRequest = {
        name: formValue.name,
        description: formValue.description,
        type: formValue.type,
        category: formValue.category,
        tags: this.tags(),
        rules: validRules,
        imageUrl: formValue.imageUrl || undefined,
        settings: formValue.settings
      };

      this.groupService.createGroup(request).subscribe({
        next: (group) => {
          this.isSubmitting.set(false);
          this.router.navigate(['/groups', group.id]);
        },
        error: (error) => {
          console.error('Failed to create group:', error);
          this.isSubmitting.set(false);
          alert('Failed to create group. Please try again.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/groups']);
  }
}