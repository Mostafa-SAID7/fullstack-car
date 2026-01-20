import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PostService } from '../../services/post.service';
import { Post } from '@shared/models/community/post.model';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
    templateUrl: './create-post.component.html',
    host: { 'class': 'block' }
})
export class CreatePostComponent implements OnInit, OnDestroy {
    @Output() postCreated = new EventEmitter<Post>();

    postForm: FormGroup;
    isExpanded = false;
    isSubmitting = false;
    currentUser: any;
    validationMessages: { [key: string]: string } = {};

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private postService: PostService,
        private translateService: TranslateService
    ) {
        this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
            content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
            imageUrl: ['', [Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)]],
            type: [0] // Default to standard post
        });
    }

    ngOnInit(): void {
        this.setupValidationMessages();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupValidationMessages(): void {
        this.validationMessages = {
            'title.required': 'Title is required',
            'title.minlength': 'Title must be at least 3 characters',
            'title.maxlength': 'Title cannot exceed 200 characters',
            'content.required': 'Content is required',
            'content.minlength': 'Content must be at least 10 characters',
            'content.maxlength': 'Content cannot exceed 5000 characters',
            'imageUrl.pattern': 'Please enter a valid image URL'
        };
    }

    getValidationMessage(fieldName: string, errorType: string): string {
        const key = `${fieldName}.${errorType}`;
        return this.validationMessages[key] || `${fieldName} ${errorType}`;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.postForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldErrors(fieldName: string): string[] {
        const field = this.postForm.get(fieldName);
        if (!field || !field.errors) return [];

        return Object.keys(field.errors).map(errorType =>
            this.getValidationMessage(fieldName, errorType)
        );
    }

    toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
    }

    onSubmit(): void {
        if (this.postForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            this.postService.createPost(this.postForm.value).subscribe({
                next: (result) => {
                    if (result.succeeded && result.data) {
                        const post = result.data as unknown as Post;
                        if (typeof post.createdAt === 'string') {
                            post.createdAt = new Date(post.createdAt);
                        }
                        this.postCreated.emit(post);
                        this.postForm.reset({ type: 0 });
                        this.isExpanded = false;
                    }
                    this.isSubmitting = false;
                },
                error: () => {
                    this.isSubmitting = false;
                }
            });
        }
    }
}
