import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VideoPlaylist } from '../../models/media.model';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlists: VideoPlaylist[] = [];
  loading = true;
  showCreateForm = false;
  newPlaylistName = '';
  newPlaylistDescription = '';
  isPublic = true;
  creating = false;

  constructor(
    private mediaService: MediaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPlaylists();
  }

  private loadPlaylists(): void {
    this.loading = true;
    this.mediaService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.newPlaylistName = '';
    this.newPlaylistDescription = '';
    this.isPublic = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  createPlaylist(): void {
    if (!this.newPlaylistName.trim()) return;

    this.creating = true;
    this.mediaService.createPlaylist(
      this.newPlaylistName.trim(),
      this.newPlaylistDescription.trim() || undefined,
      this.isPublic
    ).subscribe({
      next: (playlist) => {
        this.playlists.unshift(playlist);
        this.closeCreateForm();
        this.creating = false;
      },
      error: (error) => {
        console.error('Error creating playlist:', error);
        this.creating = false;
        alert('Error creating playlist. Please try again.');
      }
    });
  }

  viewPlaylist(playlist: VideoPlaylist): void {
    this.router.navigate(['/media/playlists', playlist.id]);
  }

  getTotalDuration(playlist: VideoPlaylist): string {
    if (!playlist.videos || playlist.videos.length === 0) {
      return '0:00';
    }

    let totalSeconds = 0;
    playlist.videos.forEach(video => {
      // Parse duration string (assuming format like "00:05:30")
      const parts = video.duration.split(':');
      if (parts.length >= 3) {
        totalSeconds += parseInt(parts[0]) * 3600; // hours
        totalSeconds += parseInt(parts[1]) * 60;   // minutes
        totalSeconds += parseInt(parts[2]);        // seconds
      } else if (parts.length === 2) {
        totalSeconds += parseInt(parts[0]) * 60;   // minutes
        totalSeconds += parseInt(parts[1]);        // seconds
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}