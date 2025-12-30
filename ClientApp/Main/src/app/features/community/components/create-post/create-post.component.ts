import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Post } from '../../../../core/models/post.model';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
    templateUrl: './create-post.component.html',
    host: { 'class': 'block' }
})
export class CreatePostComponent implements OnInit {
    @Output() postCreated = new EventEmitter<Post>();

    postForm: FormGroup;
    isExpanded = false;
    isSubmitting = false;
    currentUser: any;

    constructor(
        private fb: FormBuilder,
        private postService: PostService,
        private authService: AuthService
    ) {
        this.postForm = this.fb.group({
            title: ['', [Validators.required]],
            content: ['', [Validators.required]],
            imageUrl: [''],
            type: [0] // Default to standard post
        });
    }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
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
