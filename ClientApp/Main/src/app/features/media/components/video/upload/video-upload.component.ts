import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VideoService } from '../../../services/video.service';
import { VideoQuality } from '../../../models';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './video-upload.component.html'
})
export class VideoUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  progress = 0;
  uploadSpeed = '';
  timeRemaining = '';
  bytesUploaded = 0;
  totalBytes = 0;
  error: string | null = null;
  private uploadStartTime = 0;

  qualityOptions = [
    { value: VideoQuality.SD_480p, label: '480p (SD)' },
    { value: VideoQuality.HD_720p, label: '720p (HD)' },
    { value: VideoQuality.FullHD_1080p, label: '1080p (Full HD)' },
    { value: VideoQuality.UltraHD_4K, label: '4K (Ultra HD)' }
  ];

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
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
    this.progress = 0;
    this.error = null;
    this.uploadStartTime = Date.now();
    this.totalBytes = this.selectedFile.size;

    const onProgress = (progress: number) => {
      this.progress = progress;
      this.calculateUploadStats(progress);
    };

    this.videoService.uploadVideo(this.selectedFile, this.uploadForm.value, onProgress).subscribe({
      next: (response) => {
        this.uploading = false;
        this.progress = 100;
        this.router.navigate(['/media/videos', response.data.videoId]);
      },
      error: (err) => {
        console.error('Error uploading video:', err);
        this.error = 'Failed to upload video. Please try again.';
        this.uploading = false;
        this.progress = 0;
      }
    });
  }

  private calculateUploadStats(progress: number): void {
    const now = Date.now();
    const elapsed = (now - this.uploadStartTime) / 1000; // seconds
    this.bytesUploaded = (progress / 100) * this.totalBytes;

    if (elapsed > 0 && progress > 0) {
      const uploadSpeed = this.bytesUploaded / elapsed; // bytes per second
      const remainingBytes = this.totalBytes - this.bytesUploaded;
      const timeRemaining = remainingBytes / uploadSpeed; // seconds

      this.uploadSpeed = this.formatSpeed(uploadSpeed);
      this.timeRemaining = this.formatTime(timeRemaining);
    } else {
      this.uploadSpeed = '0 B/s';
      this.timeRemaining = 'Calculating...';
    }
  }

  private formatSpeed(bytesPerSecond: number): string {
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    let size = bytesPerSecond;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  private formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return 'Calculating...';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}