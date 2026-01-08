import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { PodcastSeries } from '../../models/media.model';

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
    private router: Router
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
    // podcast series retrieval is currently limited in MediaService, but let's try
    // if not we'll leave it empty for now
    this.mediaService.getPlaylists().subscribe({
      next: (playlists) => {
        // Placeholder as getPlaylists returns VideoPlaylist[], 
        // need to check if we have a getPodcastSeries
      },
      error: (err) => console.error('Error loading series:', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('audio/') || file.name.endsWith('.mp3'))) {
      this.selectedFile = file;
      this.error = null;
    } else {
      this.selectedFile = null;
      this.error = 'Please select a valid audio file (e.g. .mp3).';
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    this.uploading = true;
    this.error = null;

    this.mediaService.uploadPodcast(this.selectedFile, this.uploadForm.value).subscribe({
      next: (response) => {
        this.uploading = false;
        this.router.navigate(['/media/podcasts', response.data.podcastId]);
      },
      error: (err) => {
        console.error('Error uploading podcast:', err);
        this.error = 'Failed to upload podcast. Please try again.';
        this.uploading = false;
      }
    });
  }
}