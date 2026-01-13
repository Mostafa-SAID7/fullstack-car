import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QAQuestionService } from '../../../services/qa-question.service';
import { QACategoryService } from '../../../services/qa-category.service';
import {
  CreateQuestionRequest,
  UpdateQuestionRequest,
  Category,
  CategoriesResponse,
  ApiResponse,
  QuestionDetail
} from '../../../../../shared/types/qa-api.types';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit {
  questionForm!: FormGroup;
  isSubmitting = false;
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
    this.loadCategories();

    if (this.isEditing) {
      this.loadQuestion();
    }
  }

  private initializeForm(): void {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required]
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

  private loadQuestion(): void {
    if (!this.questionId) return;

    this.qaQuestionService.getQuestionDetail(this.questionId).subscribe({
      next: (response: ApiResponse<QuestionDetail>) => {
        if (response.succeeded && response.data) {
          const q = response.data;
          this.questionForm.patchValue({
            title: q.title,
            content: q.content,
            category: q.category
          });
          this.selectedTags = q.tags || [];
        }
      },
      error: (error: any) => {
        console.error('Error loading question:', error);
        // Navigate back if question not found
        this.router.navigate(['/community/qa']);
      }
    });
  }

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
