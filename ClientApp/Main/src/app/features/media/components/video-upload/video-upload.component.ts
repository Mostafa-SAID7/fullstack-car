import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VideoQuality, UploadVideoRequest } from '../../models/media.model';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;
  
  videoQualities = [
    { value: VideoQuality.SD_480p, label: '480p (SD)' },
    { value: VideoQuality.HD_720p, label: '720p (HD)' },
    { value: VideoQuality.FullHD_1080p, label: '1080p (Full HD)' },
    { value: VideoQuality.UltraHD_4K, label: '4K (Ultra HD)' }
  ];

  constructor(
    private fb: FormBuilder,
    private mediaService: MediaService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      quality: [VideoQuality.HD_720p, Validators.required],
      tags: [''],
      isPublic: [true],
      allowComments: [true]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid video file (MP4, AVI, MOV, WMV, WebM)');
        return;
      }

      // Validate file size (500MB max)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        alert('File size must be less than 500MB');
        return;
      }

      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.uploading = true;
      this.uploadProgress = 0;

      const formValue = this.uploadForm.value;
      const uploadRequest: UploadVideoRequest = {
        title: formValue.title,
        description: formValue.description,
        quality: formValue.quality,
        tags: formValue.tags,
        isPublic: formValue.isPublic,
        allowComments: formValue.allowComments
      };

      this.mediaService.uploadVideo(this.selectedFile, uploadRequest).subscribe({
        next: (response) => {
          this.uploading = false;
          this.uploadProgress = 100;
          
          // Navigate to the uploaded video
          if (response.data && response.data.videoId) {
            this.router.navigate(['/app/media/videos', response.data.videoId]);
          } else {
            this.router.navigate(['/app/media/videos']);
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.uploading = false;
          this.uploadProgress = 0;
          
          let errorMessage = 'Failed to upload video. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.uploadForm.controls).forEach(key => {
      const control = this.uploadForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/app/media/videos']);
  }

  getFileSize(): string {
    if (!this.selectedFile) return '';
    
    const size = this.selectedFile.size;
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    const fileInput = document.getElementById('videoFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.uploadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.uploadForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too long`;
      }
    }
    return '';
  }
}