import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VideoQuality } from '../../models/media.model';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  progress = 0;
  error: string | null = null;

  qualityOptions = [
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
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      quality: [VideoQuality.HD_720p, Validators.required],
      tags: [''],
      isPublic: [true],
      allowComments: [true]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;
      this.error = null;
    } else {
      this.selectedFile = null;
      this.error = 'Please select a valid video file.';
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    this.uploading = true;
    this.error = null;

    this.mediaService.uploadVideo(this.selectedFile, this.uploadForm.value).subscribe({
      next: (response) => {
        this.uploading = false;
        this.router.navigate(['/media/videos', response.data.videoId]);
      },
      error: (err) => {
        console.error('Error uploading video:', err);
        this.error = 'Failed to upload video. Please try again.';
        this.uploading = false;
      }
    });
  }
}