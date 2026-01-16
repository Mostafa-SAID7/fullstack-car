/**
 * Product Form Component
 * Form for creating and editing products with comprehensive validation
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductDto, ProductCategory, ProductStatus } from '../../models/product.model';
import {
  productNameValidator,
  productDescriptionValidator,
  skuValidator,
  priceValidator,
  discountPriceValidator,
  stockQuantityValidator,
  minStockLevelValidator,
  weightValidator,
  imageUrlValidator,
  brandValidator,
  modelValidator,
  dimensionsValidator,
  launchDateValidator,
  tagsValidator,
  categoryValidator,
  getValidationErrorMessage
} from '../../validators/product.validators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product?: ProductDto;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  submitted = false;
  
  // Enum values for dropdowns
  categories = Object.values(ProductCategory);
  statuses = Object.values(ProductStatus);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    
    if (this.product && this.mode === 'edit') {
      this.populateForm(this.product);
    }
  }

  /**
   * Initialize the form with validators
   */
  private initializeForm(): void {
    this.productForm = this.fb.group({
      // Required fields
      name: ['', [Validators.required, productNameValidator()]],
      description: ['', [Validators.required, productDescriptionValidator()]],
      sku: ['', [Validators.required, skuValidator()]],
      price: [null, [Validators.required, priceValidator()]],
      stockQuantity: [0, [Validators.required, stockQuantityValidator()]],
      minStockLevel: [0, [Validators.required, minStockLevelValidator()]],
      category: ['', [Validators.required, categoryValidator()]],
      weight: [null, [Validators.required, weightValidator()]],
      
      // Optional fields
      discountPrice: [null, [discountPriceValidator('price')]],
      imageUrl: ['', [imageUrlValidator()]],
      brand: ['', [brandValidator()]],
      model: ['', [modelValidator()]],
      dimensions: ['', [dimensionsValidator()]],
      isFeatured: [false],
      isDigital: [false],
      launchDate: ['', [launchDateValidator()]],
      tags: ['', [tagsValidator()]],
      
      // Status (only for edit mode)
      status: [ProductStatus.Active, [statusValidator()]]
    });

    // Listen to price changes to revalidate discount price
    this.productForm.get('price')?.valueChanges.subscribe(() => {
      this.productForm.get('discountPrice')?.updateValueAndValidity();
    });
  }

  /**
   * Populate form with existing product data
   */
  private populateForm(product: ProductDto): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      discountPrice: product.discountPrice,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      category: product.category,
      weight: product.weight,
      imageUrl: product.imageUrl,
      brand: product.brand,
      model: product.model,
      dimensions: product.dimensions,
      isFeatured: product.isFeatured,
      isDigital: product.isDigital,
      launchDate: product.launchDate ? new Date(product.launchDate).toISOString().split('T')[0] : '',
      tags: product.tags,
      status: product.status
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.productForm.value;
    
    // Trim string values
    const productData = {
      ...formValue,
      name: formValue.name?.trim(),
      description: formValue.description?.trim(),
      sku: formValue.sku?.trim(),
      brand: formValue.brand?.trim() || null,
      model: formValue.model?.trim() || null,
      dimensions: formValue.dimensions?.trim() || null,
      tags: formValue.tags?.trim() || null,
      imageUrl: formValue.imageUrl?.trim() || null,
      launchDate: formValue.launchDate || null
    };

    this.submitForm.emit(productData);
  }

  /**
   * Handle cancel button
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Check if a field has an error and has been touched
   */
  hasError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  /**
   * Get error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }
    return getValidationErrorMessage(field.errors);
  }

  /**
   * Check if form is valid
   */
  get isFormValid(): boolean {
    return this.productForm.valid;
  }

  /**
   * Get form title based on mode
   */
  get formTitle(): string {
    return this.mode === 'create' ? 'Create New Product' : 'Edit Product';
  }

  /**
   * Get submit button text based on mode
   */
  get submitButtonText(): string {
    return this.mode === 'create' ? 'Create Product' : 'Update Product';
  }
}
