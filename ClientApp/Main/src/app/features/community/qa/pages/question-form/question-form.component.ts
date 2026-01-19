import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { QAQuestionService } from '../../services/qa-question.service';
import { QACategoryService } from '../../services/qa-category.service';
import {
  CreateQuestionRequest,
  UpdateQuestionRequest,
  Category,
  CategoriesResponse,
  ApiResponse,
  QuestionDetail
} from '../../models/qa-api.types';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './question-form.component.html'
})

export class QuestionFormComponent implements OnInit {
  questionForm!: FormGroup;
  isSubmitting = false;
  isLoading = false;
  isEditing = false;
  questionId?: string;
  selectedTags: string[] = [];

  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private qaQuestionService: QAQuestionService,
    private qaCategoryService: QACategoryService
  ) { }

  ngOnInit(): void {
    this.questionId = this.route.snapshot.params['id'];
    this.isEditing = !!this.questionId;
    this.initializeForm();

    if (this.isEditing && this.questionId) {
      this.loadDataForEdit();
    } else {
      this.loadCategories();
    }
  }

  private initializeForm(): void {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required]
    });
  }

  private loadDataForEdit(): void {
    this.isLoading = true;
    if (!this.questionId) return;

    forkJoin({
      categories: this.qaCategoryService.getCategories(),
      question: this.qaQuestionService.getQuestionDetail(this.questionId)
    }).subscribe({
      next: ({ categories, question }) => {
        // 1. Handle Categories
        if (categories.succeeded && categories.data) {
          this.categories = categories.data;
        }

        // 2. Handle Question Detail & Patch Form
        if (question.succeeded && question.data) {
          const q = question.data;

          // Verify category exists in list by name (since API likely returns name)
          const matchingCategory = this.categories.find(c => c.name === q.category);

          this.questionForm.patchValue({
            title: q.title,
            content: q.content,
            category: matchingCategory ? matchingCategory.id : '' // Patch ID, not Name
          });

          if (!matchingCategory && q.category) {
            console.warn(`Category '${q.category}' from question not found in available categories.`);
          }

          this.selectedTags = q.tags || [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading edit data:', error);
        this.isLoading = false;
        // Handle error (toast or redirect)
        this.router.navigate(['/community/qa']);
      }
    });
  }

  private loadCategories(): void {
    this.qaCategoryService.getCategories().subscribe({
      next: (response: CategoriesResponse) => {
        if (response.succeeded && response.data) {
          this.categories = response.data;
        }
      },
      error: (error: any) => console.error('Error loading categories:', error)
    });
  }

  // Removed loadQuestion() as it's replaced by loadDataForEdit()

  getFieldError(fieldName: string): string {
    const field = this.questionForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return `${fieldName} is required`;
      if (field.errors?.['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  onTagInputKeydown(event: KeyboardEvent, input: any): void {
    if (event.key === 'Enter') {
      this.addTag(event, input);
    }
  }

  addTag(event: KeyboardEvent, input: any): void {
    event.preventDefault();
    const value = input.value?.trim();

    if (value && this.selectedTags.length < 5 && !this.selectedTags.includes(value)) {
      this.selectedTags.push(value);
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.questionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.questionForm.value;

      if (this.isEditing && this.questionId) {
        // Update existing question
        const request: UpdateQuestionRequest = {
          title: formValue.title,
          content: formValue.content,
          category: formValue.category,
          tags: this.selectedTags
        };

        console.log('Updating question with payload:', request);

        this.qaQuestionService.updateQuestion(this.questionId, request).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['/community/qa', this.questionId]);
          },
          error: (error: any) => {
            console.error('Error updating question:', error);
            this.isSubmitting = false;
            // TODO: Show user-friendly error message
          }
        });
      } else {
        // Create new question
        const request: CreateQuestionRequest = {
          title: formValue.title,
          content: formValue.content,
          category: formValue.category,
          tags: this.selectedTags
        };

        this.qaQuestionService.createQuestion(request).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['/community/qa']);
          },
          error: (error: any) => {
            console.error('Error creating question:', error);
            this.isSubmitting = false;
            // TODO: Show user-friendly error message
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/community/qa']);
  }
}
