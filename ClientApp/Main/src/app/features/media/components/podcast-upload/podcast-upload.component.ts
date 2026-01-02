import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { UploadPodcastRequest } from '../../models/media.model';

@Component({
  selector: 'app-podcast-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './podcast-upload.component.html',
  styleUrls: ['./podcast-upload.component.scss']
})
export class PodcastUploadComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  selectedThumbnail: File | null = null;
  uploading = false;
  uploadProgress = 0;
  previewUrl: string | null = null;
  thumbnailPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private mediaService: MediaService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      tags: [''],
      episodeNumber: [1, [Validators.required, Validators.min(1)]],
      seasonNumber: [1, [Validators.required, Validators.min(1)]],
      seriesId: [''],
      transcript: [''],
      isPublic: [true],
      allowComments: [true],
      allowDownload: [false]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Please select a valid audio file');
        return;
      }

      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert('File size must be less than 500MB');
        return;
      }

      this.selectedFile = file;
      
      // Create audio preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onThumbnailSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Thumbnail size must be less than 5MB');
        return;
      }

      this.selectedThumbnail = file;
      
      // Create thumbnail preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  removeThumbnail(): void {
    this.selectedThumbnail = null;
    this.thumbnailPreview = null;
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.uploadPodcast();
    } else {
      this.markFormGroupTouched();
    }
  }

  private uploadPodcast(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadProgress = 0;

    const formValue = this.uploadForm.value;
    const request: UploadPodcastRequest = {
      title: formValue.title,
      description: formValue.description,
      tags: formValue.tags,
      episodeNumber: formValue.episodeNumber,
      seasonNumber: formValue.seasonNumber,
      seriesId: formValue.seriesId || undefined,
      transcript: formValue.transcript || undefined,
      isPublic: formValue.isPublic,
      allowComments: formValue.allowComments,
      allowDownload: formValue.allowDownload
    };

    this.mediaService.uploadPodcast(this.selectedFile, request).subscribe({
      next: (response) => {
        console.log('Podcast uploaded successfully:', response);
        this.uploading = false;
        this.router.navigate(['/media/podcasts', response.id]);
      },
      error: (error) => {
        console.error('Error uploading podcast:', error);
        this.uploading = false;
        alert('Error uploading podcast. Please try again.');
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.uploadForm.controls).forEach(key => {
      const control = this.uploadForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.uploadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.uploadForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['min']) return `${fieldName} must be at least ${field.errors['min'].min}`;
    }
    return '';
  }

  cancel(): void {
    this.router.navigate(['/media/podcasts']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}