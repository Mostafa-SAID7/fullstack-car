import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../../core/services/group.service';
import { Group, UpdateGroupRequest } from '../../models/group.model';

@Component({
  selector: 'app-group-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Group</h1>
          
          <form [formGroup]="editForm" (ngSubmit)="onSubmit()" *ngIf="editForm">
            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Name</label>
                <input type="text" id="name" formControlName="name" 
                       class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              </div>
              
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id="description" formControlName="description" rows="4"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button type="button" (click)="cancel()" 
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" [disabled]="editForm.invalid || loading()" 
                        class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {{ loading() ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class GroupEditPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupService = inject(GroupService);
  
  editForm!: FormGroup;
  loading = signal(false);
  groupId!: string;
  
  ngOnInit(): void {
    this.groupId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadGroup();
  }
  
  private initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  private loadGroup(): void {
    this.loading.set(true);
    this.groupService.getGroup(this.groupId).subscribe({
      next: (group: Group) => {
        this.editForm.patchValue({
          name: group.name,
          description: group.description
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.loading.set(false);
        this.router.navigate(['/community/groups']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.editForm.valid) {
      this.loading.set(true);
      const updateRequest: UpdateGroupRequest = this.editForm.value;
      
      this.groupService.updateGroup(this.groupId, updateRequest).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/community/groups', this.groupId]);
        },
        error: (error) => {
          console.error('Error updating group:', error);
          this.loading.set(false);
        }
      });
    }
  }
  
  cancel(): void {
    this.router.navigate(['/community/groups', this.groupId]);
  }
}