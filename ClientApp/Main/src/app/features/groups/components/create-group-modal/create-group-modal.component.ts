import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateGroupRequest } from '../../../../core/models/group.model';
import { GroupService } from '../../../../core/services/group.service';
import { firstValueFrom } from 'rxjs';

/**
 * Create Group Modal Component
 * 
 * Modal for creating new groups with form validation
 */
@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Group
          </h2>
          <button 
            (click)="onCancel()"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="createGroupForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          <!-- Cover Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>
            <div class="relative">
              @if (coverImagePreview()) {
                <div class="relative h-32 rounded-lg overflow-hidden">
                  <img [src]="coverImagePreview()" alt="Cover preview" class="w-full h-full object-cover">
                  <button 
                    type="button"
                    (click)="removeCoverImage()"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors">
                    <i class="fa-solid fa-times text-xs"></i>
                  </button>
                </div>
              } @else {
                <div class="h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                  <div class="text-center">
                    <i class="fa-solid fa-image text-2xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Click to upload cover image</p>
                  </div>
                </div>
              }
              <input 
                type="file" 
                accept="image/*"
                (change)="onCoverImageChange($event)"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            </div>
          </div>

          <!-- Avatar Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Avatar
            </label>
            <div class="flex items-center space-x-4">
              @if (avatarPreview()) {
                <img [src]="avatarPreview()" alt="Avatar preview" class="w-16 h-16 rounded-lg object-cover">
              } @else {
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-users text-gray-400 text-xl"></i>
                </div>
              }
              <div class="flex-1">
                <input 
                  type="file" 
                  accept="image/*"
                  (change)="onAvatarChange($event)"
                  class="hidden"
                  #avatarInput>
                <button 
                  type="button"
                  (click)="avatarInput.click()"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Choose Avatar
                </button>
                @if (avatarPreview()) {
                  <button 
                    type="button"
                    (click)="removeAvatar()"
                    class="ml-2 text-red-600 hover:text-red-800 text-sm">
                    Remove
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Group Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="Enter group name"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent">
              @if (createGroupForm.get('name')?.invalid && createGroupForm.get('name')?.touched) {
                <p class="text-red-600 text-sm mt-1">Group name is required</p>
              }
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                formControlName="category"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Select category</option>
                @for (category of categories(); track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>
              @if (createGroupForm.get('category')?.invalid && createGroupForm.get('category')?.touched) {
                <p class="text-red-600 text-sm mt-1">Category is required</p>
              }
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              formControlName="description"
              rows="4"
              placeholder="Describe your group..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"></textarea>
            @if (createGroupForm.get('description')?.invalid && createGroupForm.get('description')?.touched) {
              <p class="text-red-600 text-sm mt-1">Description is required</p>
            }
          </div>

          <!-- Group Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Type *
            </label>
            <div class="space-y-3">
              <label class="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="public"
                  formControlName="type"
                  class="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">Public</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Anyone can see the group and its content</div>
                </div>
              </label>
              
              <label class="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="private"
                  formControlName="type"
                  class="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">Private</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Only members can see the group content</div>
                </div>
              </label>
              
              <label class="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="secret"
                  formControlName="type"
                  class="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">Secret</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Only members can find and see the group</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              @for (tag of tags(); track tag) {
                <span class="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  #{{ tag }}
                  <button 
                    type="button"
                    (click)="removeTag(tag)"
                    class="ml-1 text-primary/60 hover:text-primary">
                    <i class="fa-solid fa-times text-xs"></i>
                  </button>
                </span>
              }
            </div>
            <div class="flex space-x-2">
              <input
                type="text"
                [value]="newTag()"
                (input)="updateNewTag($event)"
                (keydown.enter)="addTag($event)"
                placeholder="Add tags..."
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent">
              <button 
                type="button"
                (click)="addTag()"
                [disabled]="!newTag().trim()"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Add
              </button>
            </div>
          </div>

          <!-- Rules -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Rules
            </label>
            <div class="space-y-2 mb-2">
              @for (rule of rules(); track $index; let i = $index) {
                <div class="flex items-start space-x-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ i + 1 }}.</span>
                  <input
                    type="text"
                    [value]="rule"
                    (input)="updateRule(i, $event)"
                    placeholder="Enter rule..."
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent">
                  <button 
                    type="button"
                    (click)="removeRule(i)"
                    class="text-red-600 hover:text-red-800 p-2">
                    <i class="fa-solid fa-times"></i>
                  </button>
                </div>
              }
            </div>
            <button 
              type="button"
              (click)="addRule()"
              class="text-primary hover:text-primary/80 text-sm font-medium">
              + Add Rule
            </button>
          </div>

          <!-- Group Settings -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Group Settings</h3>
            <div class="space-y-3">
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Allow members to post</span>
                <input
                  type="checkbox"
                  formControlName="allowMemberPosts"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
              </label>
              
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Require post approval</span>
                <input
                  type="checkbox"
                  formControlName="requirePostApproval"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
              </label>
              
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Allow member invites</span>
                <input
                  type="checkbox"
                  formControlName="allowMemberInvites"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
              </label>
              
              <label class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Auto-approve members</span>
                <input
                  type="checkbox"
                  formControlName="autoApproveMembers"
                  class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="createGroupForm.invalid || isSubmitting()"
              class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
              @if (isSubmitting()) {
                <i class="fa-solid fa-spinner animate-spin"></i>
                <span>Creating...</span>
              } @else {
                <span>Create Group</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreateGroupModalComponent {
  private fb = inject(FormBuilder);
  private groupService = inject(GroupService);

  // Output events
  cancel = output<void>();
  create = output<CreateGroupRequest>();

  // Form state
  createGroupForm: FormGroup;
  protected isSubmitting = signal(false);
  protected coverImagePreview = signal<string>('');
  protected avatarPreview = signal<string>('');
  protected tags = signal<string[]>([]);
  protected rules = signal<string[]>([]);
  protected newTag = signal<string>('');

  // Categories (would typically come from a service)
  protected categories = signal<string[]>([
    'Technology',
    'Business',
    // ... rest of the categories
    'Education',
    'Entertainment',
    'Sports',
    'Health & Fitness',
    'Travel',
    'Food & Cooking',
    'Arts & Crafts',
    'Music',
    'Gaming',
    'Photography',
    'Books & Literature',
    'Science',
    'Politics',
    'Religion',
    'Parenting',
    'Pets',
    'Fashion',
    'Home & Garden'
  ]);

  private coverImageFile: File | null = null;
  private avatarFile: File | null = null;

  constructor() {
    this.createGroupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      type: ['public', Validators.required],
      category: ['', Validators.required],
      allowMemberPosts: [true],
      requirePostApproval: [false],
      allowMemberInvites: [true],
      autoApproveMembers: [true]
    });
  }

  onCoverImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.coverImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverImagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImagePreview.set('');
  }

  removeAvatar(): void {
    this.avatarFile = null;
    this.avatarPreview.set('');
  }

  updateNewTag(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newTag.set(input.value);
  }

  addTag(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const tag = this.newTag().trim().toLowerCase();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update(tags => [...tags, tag]);
      this.newTag.set('');
    }
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  addRule(): void {
    this.rules.update(rules => [...rules, '']);
  }

  updateRule(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rules.update(rules => {
      const newRules = [...rules];
      newRules[index] = input.value;
      return newRules;
    });
  }

  removeRule(index: number): void {
    this.rules.update(rules => rules.filter((_, i) => i !== index));
  }

  async onSubmit(): Promise<void> {
    if (this.createGroupForm.valid) {
      this.isSubmitting.set(true);

      try {
        let imageUrl: string | undefined;

        if (this.coverImageFile) {
          try {
            imageUrl = await firstValueFrom(this.groupService.uploadFile(this.coverImageFile));
          } catch (error) {
            console.error('Failed to upload image', error);
            // Continue without image or show error? For now, continue.
          }
        }

        const formValue = this.createGroupForm.value;
        const request: CreateGroupRequest = {
          name: formValue.name,
          description: formValue.description,
          type: formValue.type,
          category: formValue.category,
          tags: this.tags(),
          rules: this.rules().filter(rule => rule.trim()),
          imageUrl: imageUrl,
          settings: {
            allowMemberPosts: formValue.allowMemberPosts,
            requirePostApproval: formValue.requirePostApproval,
            allowMemberInvites: formValue.allowMemberInvites,
            autoApproveMembers: formValue.autoApproveMembers,
            allowDiscussions: true,
            allowEvents: true,
            allowPolls: true,
            showMemberList: true,
            allowExternalSharing: true
          }
        };

        this.create.emit(request);
      } catch (error) {
        console.error('Error creating group:', error);
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Expose signals as readonly
  readonly isSubmittingReadonly = this.isSubmitting.asReadonly();
  readonly coverImagePreviewReadonly = this.coverImagePreview.asReadonly();
  readonly avatarPreviewReadonly = this.avatarPreview.asReadonly();
  readonly tagsReadonly = this.tags.asReadonly();
  readonly rulesReadonly = this.rules.asReadonly();
  readonly newTagReadonly = this.newTag.asReadonly();
  readonly categoriesReadonly = this.categories.asReadonly();
}