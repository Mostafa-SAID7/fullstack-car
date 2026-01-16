/**
 * Service Form Example
 * Example implementation showing how to use service validators in an Angular form
 * This file demonstrates the usage pattern but is not a complete component
 */

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  serviceNameValidator,
  serviceTitleValidator,
  serviceDescriptionValidator,
  shortDescriptionValidator,
  basePriceValidator,
  maxPriceValidator,
  estimatedDurationValidator,
  maxDurationValidator,
  serviceCategoryValidator,
  serviceSubCategoryValidator,
  requirementsValidator,
  inclusionsValidator,
  exclusionsValidator,
  serviceTagsValidator,
  serviceProviderIdValidator,
  serviceTypeValidator,
  serviceStatusValidator,
  serviceImageUrlValidator,
  sortOrderValidator,
  getServiceValidationErrorMessage
} from './service.validators';
import { ServiceType, ServiceStatus } from '../models/service.model';

/**
 * Example: Creating a service form with validators
 * 
 * Usage in a component:
 * 
 * ```typescript
 * export class ServiceFormComponent implements OnInit {
 *   serviceForm: FormGroup;
 * 
 *   constructor(private fb: FormBuilder) {}
 * 
 *   ngOnInit() {
 *     this.serviceForm = this.createServiceForm();
 *   }
 * 
 *   createServiceForm(): FormGroup {
 *     return this.fb.group({
 *       // Required fields
 *       serviceProviderId: ['', [Validators.required, serviceProviderIdValidator()]],
 *       name: ['', [Validators.required, serviceNameValidator()]],
 *       title: ['', [Validators.required, serviceTitleValidator()]],
 *       description: ['', [Validators.required, serviceDescriptionValidator()]],
 *       shortDescription: ['', [Validators.required, shortDescriptionValidator()]],
 *       basePrice: [null, [Validators.required, basePriceValidator()]],
 *       estimatedDuration: [null, [Validators.required, estimatedDurationValidator()]],
 *       serviceType: [ServiceType.Maintenance, [Validators.required, serviceTypeValidator()]],
 *       category: ['', [Validators.required, serviceCategoryValidator()]],
 *       
 *       // Optional fields
 *       maxPrice: [null, [maxPriceValidator('basePrice')]],
 *       maxDuration: [null, [maxDurationValidator('estimatedDuration')]],
 *       subCategory: ['', [serviceSubCategoryValidator()]],
 *       requirements: ['', [requirementsValidator()]],
 *       inclusions: ['', [inclusionsValidator()]],
 *       exclusions: ['', [exclusionsValidator()]],
 *       tags: ['', [serviceTagsValidator()]],
 *       imageUrl: ['', [serviceImageUrlValidator()]],
 *       sortOrder: [0, [sortOrderValidator()]],
 *       status: [ServiceStatus.Draft, [serviceStatusValidator()]]
 *     });
 *   }
 * 
 *   onSubmit() {
 *     if (this.serviceForm.valid) {
 *       const serviceData = this.serviceForm.value;
 *       // Submit to API
 *     } else {
 *       // Mark all fields as touched to show validation errors
 *       Object.keys(this.serviceForm.controls).forEach(key => {
 *         this.serviceForm.get(key)?.markAsTouched();
 *       });
 *     }
 *   }
 * 
 *   getErrorMessage(fieldName: string): string {
 *     const control = this.serviceForm.get(fieldName);
 *     if (control && control.touched && control.errors) {
 *       return getServiceValidationErrorMessage(control.errors);
 *     }
 *     return '';
 *   }
 * 
 *   isFieldInvalid(fieldName: string): boolean {
 *     const control = this.serviceForm.get(fieldName);
 *     return !!(control && control.touched && control.invalid);
 *   }
 * }
 * ```
 * 
 * Example HTML template:
 * 
 * ```html
 * <form [formGroup]="serviceForm" (ngSubmit)="onSubmit()">
 *   <!-- Service Provider ID -->
 *   <div class="form-group">
 *     <label for="serviceProviderId">Service Provider ID *</label>
 *     <input 
 *       type="text" 
 *       id="serviceProviderId" 
 *       formControlName="serviceProviderId"
 *       [class.is-invalid]="isFieldInvalid('serviceProviderId')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('serviceProviderId')">
 *       {{ getErrorMessage('serviceProviderId') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Service Name -->
 *   <div class="form-group">
 *     <label for="name">Service Name *</label>
 *     <input 
 *       type="text" 
 *       id="name" 
 *       formControlName="name"
 *       [class.is-invalid]="isFieldInvalid('name')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('name')">
 *       {{ getErrorMessage('name') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Service Title -->
 *   <div class="form-group">
 *     <label for="title">Service Title *</label>
 *     <input 
 *       type="text" 
 *       id="title" 
 *       formControlName="title"
 *       [class.is-invalid]="isFieldInvalid('title')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('title')">
 *       {{ getErrorMessage('title') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Description -->
 *   <div class="form-group">
 *     <label for="description">Description *</label>
 *     <textarea 
 *       id="description" 
 *       formControlName="description"
 *       rows="4"
 *       [class.is-invalid]="isFieldInvalid('description')"
 *     ></textarea>
 *     <div class="error-message" *ngIf="isFieldInvalid('description')">
 *       {{ getErrorMessage('description') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Short Description -->
 *   <div class="form-group">
 *     <label for="shortDescription">Short Description *</label>
 *     <textarea 
 *       id="shortDescription" 
 *       formControlName="shortDescription"
 *       rows="2"
 *       [class.is-invalid]="isFieldInvalid('shortDescription')"
 *     ></textarea>
 *     <div class="error-message" *ngIf="isFieldInvalid('shortDescription')">
 *       {{ getErrorMessage('shortDescription') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Base Price -->
 *   <div class="form-group">
 *     <label for="basePrice">Base Price *</label>
 *     <input 
 *       type="number" 
 *       id="basePrice" 
 *       formControlName="basePrice"
 *       step="0.01"
 *       [class.is-invalid]="isFieldInvalid('basePrice')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('basePrice')">
 *       {{ getErrorMessage('basePrice') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Max Price (Optional) -->
 *   <div class="form-group">
 *     <label for="maxPrice">Max Price</label>
 *     <input 
 *       type="number" 
 *       id="maxPrice" 
 *       formControlName="maxPrice"
 *       step="0.01"
 *       [class.is-invalid]="isFieldInvalid('maxPrice')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('maxPrice')">
 *       {{ getErrorMessage('maxPrice') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Estimated Duration -->
 *   <div class="form-group">
 *     <label for="estimatedDuration">Estimated Duration (minutes) *</label>
 *     <input 
 *       type="number" 
 *       id="estimatedDuration" 
 *       formControlName="estimatedDuration"
 *       [class.is-invalid]="isFieldInvalid('estimatedDuration')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('estimatedDuration')">
 *       {{ getErrorMessage('estimatedDuration') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Max Duration (Optional) -->
 *   <div class="form-group">
 *     <label for="maxDuration">Max Duration (minutes)</label>
 *     <input 
 *       type="number" 
 *       id="maxDuration" 
 *       formControlName="maxDuration"
 *       [class.is-invalid]="isFieldInvalid('maxDuration')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('maxDuration')">
 *       {{ getErrorMessage('maxDuration') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Service Type -->
 *   <div class="form-group">
 *     <label for="serviceType">Service Type *</label>
 *     <select 
 *       id="serviceType" 
 *       formControlName="serviceType"
 *       [class.is-invalid]="isFieldInvalid('serviceType')"
 *     >
 *       <option value="">Select a type</option>
 *       <option *ngFor="let type of serviceTypes" [value]="type">{{ type }}</option>
 *     </select>
 *     <div class="error-message" *ngIf="isFieldInvalid('serviceType')">
 *       {{ getErrorMessage('serviceType') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Category -->
 *   <div class="form-group">
 *     <label for="category">Category *</label>
 *     <input 
 *       type="text" 
 *       id="category" 
 *       formControlName="category"
 *       [class.is-invalid]="isFieldInvalid('category')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('category')">
 *       {{ getErrorMessage('category') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Sub-Category (Optional) -->
 *   <div class="form-group">
 *     <label for="subCategory">Sub-Category</label>
 *     <input 
 *       type="text" 
 *       id="subCategory" 
 *       formControlName="subCategory"
 *       [class.is-invalid]="isFieldInvalid('subCategory')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('subCategory')">
 *       {{ getErrorMessage('subCategory') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Requirements (Optional) -->
 *   <div class="form-group">
 *     <label for="requirements">Requirements</label>
 *     <textarea 
 *       id="requirements" 
 *       formControlName="requirements"
 *       rows="3"
 *       [class.is-invalid]="isFieldInvalid('requirements')"
 *     ></textarea>
 *     <div class="error-message" *ngIf="isFieldInvalid('requirements')">
 *       {{ getErrorMessage('requirements') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Inclusions (Optional) -->
 *   <div class="form-group">
 *     <label for="inclusions">What's Included</label>
 *     <textarea 
 *       id="inclusions" 
 *       formControlName="inclusions"
 *       rows="3"
 *       [class.is-invalid]="isFieldInvalid('inclusions')"
 *     ></textarea>
 *     <div class="error-message" *ngIf="isFieldInvalid('inclusions')">
 *       {{ getErrorMessage('inclusions') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Exclusions (Optional) -->
 *   <div class="form-group">
 *     <label for="exclusions">What's Excluded</label>
 *     <textarea 
 *       id="exclusions" 
 *       formControlName="exclusions"
 *       rows="3"
 *       [class.is-invalid]="isFieldInvalid('exclusions')"
 *     ></textarea>
 *     <div class="error-message" *ngIf="isFieldInvalid('exclusions')">
 *       {{ getErrorMessage('exclusions') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Tags (Optional) -->
 *   <div class="form-group">
 *     <label for="tags">Tags (comma-separated)</label>
 *     <input 
 *       type="text" 
 *       id="tags" 
 *       formControlName="tags"
 *       placeholder="e.g., oil-change, maintenance, quick-service"
 *       [class.is-invalid]="isFieldInvalid('tags')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('tags')">
 *       {{ getErrorMessage('tags') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Image URL (Optional) -->
 *   <div class="form-group">
 *     <label for="imageUrl">Image URL</label>
 *     <input 
 *       type="url" 
 *       id="imageUrl" 
 *       formControlName="imageUrl"
 *       [class.is-invalid]="isFieldInvalid('imageUrl')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('imageUrl')">
 *       {{ getErrorMessage('imageUrl') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Sort Order (Optional) -->
 *   <div class="form-group">
 *     <label for="sortOrder">Sort Order</label>
 *     <input 
 *       type="number" 
 *       id="sortOrder" 
 *       formControlName="sortOrder"
 *       [class.is-invalid]="isFieldInvalid('sortOrder')"
 *     />
 *     <div class="error-message" *ngIf="isFieldInvalid('sortOrder')">
 *       {{ getErrorMessage('sortOrder') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Status -->
 *   <div class="form-group">
 *     <label for="status">Status</label>
 *     <select 
 *       id="status" 
 *       formControlName="status"
 *       [class.is-invalid]="isFieldInvalid('status')"
 *     >
 *       <option *ngFor="let status of serviceStatuses" [value]="status">{{ status }}</option>
 *     </select>
 *     <div class="error-message" *ngIf="isFieldInvalid('status')">
 *       {{ getErrorMessage('status') }}
 *     </div>
 *   </div>
 * 
 *   <!-- Submit Button -->
 *   <button type="submit" [disabled]="serviceForm.invalid">
 *     Create Service
 *   </button>
 * </form>
 * ```
 */

// This is an example file and should not be imported directly
// Use the validators from './service.validators' in your actual components
