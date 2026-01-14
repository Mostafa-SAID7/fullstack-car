import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { TranslationService } from '../../../../../core/services/translation.service';
import { Post } from '../../../../../core/models/post.model';

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
        private authService: AuthService,
        private translationService: TranslationService,
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
        this.initializeTranslations();
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                this.currentUser = user;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private async initializeTranslations(): Promise<void> {
        try {
            // Load posts feature translations for the current language
            const currentLanguage = this.translationService.getCurrentLanguage().code;
            await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'posts');
            
            // Set up validation messages
            this.setupValidationMessages();
        } catch (error) {
            console.error('Failed to load posts translations:', error);
        }
    }

    private setupValidationMessages(): void {
        this.validationMessages = {
            'title.required': this.translateService.instant('posts.validation.titleRequired'),
            'title.minlength': this.translateService.instant('posts.validation.titleMinLength'),
            'title.maxlength': this.translateService.instant('posts.validation.titleMaxLength'),
            'content.required': this.translateService.instant('posts.validation.contentRequired'),
            'content.minlength': this.translateService.instant('posts.validation.contentMinLength'),
            'content.maxlength': this.translateService.instant('posts.validation.contentMaxLength'),
            'imageUrl.pattern': this.translateService.instant('posts.validation.imageUrlInvalid')
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
                    if (result.succeeded) {
                        this.postCreated.emit(result.data);
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
