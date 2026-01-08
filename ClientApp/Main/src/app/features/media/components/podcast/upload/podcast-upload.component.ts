import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MediaService } from '../../../services/media.service';
import { PodcastService } from '../../../services/podcast.service';
import { PodcastSeries } from '../../../models';
import { ToastService } from '../../../../../core/services/toast.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-podcast-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './podcast-upload.component.html',
  styleUrls: ['./podcast-upload.component.scss']
})
export class PodcastUploadComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  error: string | null = null;
  series: PodcastSeries[] = [];

  constructor(
    private fb: FormBuilder,
    private mediaService: MediaService,
    private podcastService: PodcastService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      tags: [''],
      isPublic: [true],
      allowComments: [true],
      allowDownload: [false],
      episodeNumber: [1, [Validators.required, Validators.min(1)]],
      seasonNumber: [1, [Validators.required, Validators.min(1)]],
      seriesId: [''],
      transcript: ['']
    });
  }

  ngOnInit(): void {
    this.loadSeries();
  }

  loadSeries(): void {
    // Load podcast categories or series
    this.podcastService.getCategories().subscribe({
      next: (response: any) => {
        // Handle categories response
        console.log('Categories loaded:', response);
      },
      error: (err: any) => console.error('Error loading series:', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/m4a', 'audio/mpeg'];
      const isValidType = allowedTypes.includes(file.type) || file.name.toLowerCase().endsWith('.mp3');
      
      // Validate file size (200MB max)
      const maxSize = 200 * 1024 * 1024; // 200MB in bytes
      
      if (!isValidType) {
        this.selectedFile = null;
        this.error = 'Please select a valid audio file (MP3, WAV, AAC, OGG, or M4A).';
        this.toastService.error('Invalid file type. Please select an audio file.');
        return;
      }
      
      if (file.size > maxSize) {
        this.selectedFile = null;
        this.error = `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 200MB limit.`;
        this.toastService.error('File is too large. Maximum size is 200MB.');
        return;
      }
      
      // File is valid
      this.selectedFile = file;
      this.error = null;
      this.toastService.success(`Audio file "${file.name}" selected successfully!`);
    } else {
      this.selectedFile = null;
      this.error = null;
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.toastService.error('Please fill in all required fields and select an audio file.');
      return;
    }

    // Debug authentication
    console.log('=== PODCAST UPLOAD DEBUG ===');
    console.log('Auth Service - Is Authenticated:', this.authService.isAuthenticated);
    console.log('Auth Service - Token exists:', !!this.authService.token);
    console.log('Auth Service - Current User:', this.authService.currentUser);
    console.log('Token preview:', this.authService.token?.substring(0, 50) + '...');

    this.uploading = true;
    this.error = null;

    // Show upload started notification
    this.toastService.info('Starting podcast upload...');

    // Use podcast service for upload
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    // Add form data
    Object.keys(this.uploadForm.value).forEach(key => {
      formData.append(key, this.uploadForm.value[key]);
    });

    // Mock upload for now
    setTimeout(() => {
      this.uploading = false;
      this.toastService.success('Podcast uploaded successfully! 🎉');
      this.router.navigate(['/media/podcasts']);
    }, 2000);
  }
}