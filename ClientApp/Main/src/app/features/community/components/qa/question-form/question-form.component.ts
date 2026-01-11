import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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

  categories = [
    { name: 'Web Development', icon: 'web' },
    { name: 'Mobile Development', icon: 'phone_android' },
    { name: 'Database Design', icon: 'storage' },
    { name: 'DevOps & Cloud', icon: 'cloud' },
    { name: 'Data Science', icon: 'analytics' },
    { name: 'Cybersecurity', icon: 'security' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.questionId = this.route.snapshot.params['id'];
    this.isEditing = !!this.questionId;
    this.initializeForm();
    
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

  private loadQuestion(): void {
    // TODO: Load existing question data for editing
    console.log('Loading question for editing:', this.questionId);
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
      const questionData = {
        ...formValue,
        tags: this.selectedTags
      };
      
      console.log('Submitting question:', questionData);
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/community/qa']);
      }, 2000);
    }
  }

  onCancel(): void {
    this.router.navigate(['/community/qa']);
  }
}