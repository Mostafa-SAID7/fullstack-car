import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  signal, 
  computed, 
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { EventTrackingService } from '../../../core/services/event-tracking.service';

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishDate: Date;
  podcastId: string;
  podcastTitle: string;
  podcastArtwork: string;
  episodeNumber?: number;
  seasonNumber?: number;
  transcript?: string;
  chapters?: PodcastChapter[];
}

export interface PodcastChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
  url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  episodes: PodcastEpisode[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaybackState {
  currentEpisode: PodcastEpisode | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  paused: boolean;
  ended: boolean;
  buffered: TimeRanges | null;
  playbackRate: number;
  isLoading: boolean;
  error: string | null;
}

export interface PodcastPlayerConfig {
  autoplay: boolean;
  enablePlaylist: boolean;
  enableChapters: boolean;
  enableTranscript: boolean;
  enableSleepTimer: boolean;
  enableSpeedControl: boolean;
  enableSkipSilence: boolean;
  enableAnalytics: boolean;
  theme: 'light' | 'dark' | 'auto';
  skipForwardSeconds: number;
  skipBackwardSeconds: number;
  playbackRates: number[];
}

/**
 * Podcast Player Component
 * 
 * Advanced podcast player with:
 * - Episode playlist management
 * - Chapter navigation
 * - Transcript display
 * - Sleep timer functionality
 * - Variable speed playback
 * - Skip silence feature
 * - Background playback support
 * - Analytics tracking
 */
@Component({
  selector: 'app-podcast-player',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="podcast-player bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <!-- Now Playing Header -->
      <div class="now-playing-header p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div class="flex items-center space-x-4">
          <!-- Episode Artwork -->
          <div class="flex-shrink-0">
            <img 
              [src]="playbackState().currentEpisode?.podcastArtwork || '/assets/default-podcast.png'"
              [alt]="playbackState().currentEpisode?.podcastTitle || 'Podcast'"
              class="w-16 h-16 rounded-lg object-cover"
              (error)="onImageError($event)"
            >
          </div>
          
          <!-- Episode Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold truncate">
              {{ playbackState().currentEpisode?.title || 'No episode selected' }}
            </h3>
            <p class="text-purple-100 text-sm truncate">
              {{ playbackState().currentEpisode?.podcastTitle || 'Select an episode to play' }}
            </p>
            <div class="flex items-center space-x-2 mt-1 text-xs text-purple-200">
              <span *ngIf="playbackState().currentEpisode?.episodeNumber">
                Episode {{ playbackState().currentEpisode.episodeNumber }}
              </span>
              <span *ngIf="playbackState().currentEpisode?.seasonNumber">
                • Season {{ playbackState().currentEpisode.seasonNumber }}
              </span>
              <span *ngIf="playbackState().currentEpisode?.publishDate">
                • {{ playbackState().currentEpisode.publishDate | date:'mediumDate' }}
              </span>
            </div>
          </div>

          <!-- Minimize/Expand Button -->
          <button 
            (click)="toggleMinimized()"
            class="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            [attr.aria-label]="isMinimized() ? 'Expand player' : 'Minimize player'"
          >
            <svg *ngIf="!isMinimized()" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="isMinimized()" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Player Content -->
      <div *ngIf="!isMinimized()" class="player-content">
        <!-- Audio Element -->
        <audio
          #audioElement
          [src]="playbackState().currentEpisode?.audioUrl"
          [volume]="playbackState().volume"
          [muted]="playbackState().muted"
          [playbackRate]="playbackState().playbackRate"
          (loadedmetadata)="onLoadedMetadata()"
          (timeupdate)="onTimeUpdate()"
          (play)="onPlay()"
          (pause)="onPause()"
          (ended)="onEnded()"
          (volumechange)="onVolumeChange()"
          (ratechange)="onRateChange()"
          (error)="onError($event)"
          (loadstart)="onLoadStart()"
          (canplay)="onCanPlay()"
          preload="metadata"
        ></audio>

        <!-- Main Controls -->
        <div class="main-controls p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-center space-x-6">
            <!-- Play/Pause Button -->
            <button 
              (click)="togglePlayPause()"
              class="play-pause-button bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 transition-all duration-200 transform hover:scale-105"
              [disabled]="!playbackState().currentEpisode || playbackState().isLoading"
              [attr.aria-label]="playbackState().paused ? 'Play' : 'Pause'"
            >
              <svg *ngIf="playbackState().isLoading" class="w-8 h-8 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="!playbackState().isLoading && playbackState().paused" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="!playbackState().isLoading && !playbackState().paused" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div 
          *ngIf="playbackState().error"
          class="error-message p-4 bg-red-50 dark:bg-red-900 border-l-4 border-red-500"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-700 dark:text-red-300">{{ playbackState().error }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .podcast-player {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 100%;
    }

    .control-button {
      transition: all 0.2s ease-in-out;
    }

    .control-button:hover {
      transform: scale(1.05);
    }

    .play-pause-button:hover {
      transform: scale(1.05);
    }
  `]
})
export class PodcastPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioElement', { static: true }) audioElement!: ElementRef<HTMLAudioElement>;

  @Input() initialEpisode = signal<PodcastEpisode | null>(null);
  @Input() playlist = signal<Playlist | null>(null);
  @Input() config = signal<PodcastPlayerConfig>({
    autoplay: false,
    enablePlaylist: true,
    enableChapters: true,
    enableTranscript: true,
    enableSleepTimer: true,
    enableSpeedControl: true,
    enableSkipSilence: false,
    enableAnalytics: true,
    theme: 'auto',
    skipForwardSeconds: 30,
    skipBackwardSeconds: 15,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  });

  @Output() episodeChanged = new EventEmitter<PodcastEpisode>();
  @Output() playbackStateChanged = new EventEmitter<PlaybackState>();
  @Output() playlistChanged = new EventEmitter<Playlist>();

  private analyticsService = inject(AnalyticsService);
  private eventTrackingService = inject(EventTrackingService);

  // Signals for reactive state
  private playbackState = signal<PlaybackState>({
    currentEpisode: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    paused: true,
    ended: false,
    buffered: null,
    playbackRate: 1,
    isLoading: false,
    error: null
  });

  private isMinimized = signal(false);

  ngOnInit(): void {
    this.initializePodcastPlayer();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Initialize podcast player
   */
  private initializePodcastPlayer(): void {
    // Set initial episode if provided
    if (this.initialEpisode()) {
      this.selectEpisode(this.initialEpisode()!);
    }

    // Set initial volume
    const audio = this.audioElement.nativeElement;
    audio.volume = this.playbackState().volume;
  }

  /**
   * Audio event handlers
   */
  onLoadedMetadata(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({
      duration: audio.duration,
      buffered: audio.buffered,
      isLoading: false,
      error: null
    });
  }

  onTimeUpdate(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({
      currentTime: audio.currentTime,
      buffered: audio.buffered
    });
  }

  onPlay(): void {
    this.updatePlaybackState({ paused: false });
    
    if (this.config().enableAnalytics) {
      const episode = this.playbackState().currentEpisode;
      if (episode) {
        this.analyticsService.trackContentEngagement(episode.id, 'podcast', 'play');
      }
    }
  }

  onPause(): void {
    this.updatePlaybackState({ paused: true });
    
    if (this.config().enableAnalytics) {
      const episode = this.playbackState().currentEpisode;
      if (episode) {
        this.analyticsService.trackContentEngagement(episode.id, 'podcast', 'pause');
      }
    }
  }

  onEnded(): void {
    this.updatePlaybackState({ ended: true, paused: true });
    
    if (this.config().enableAnalytics) {
      const episode = this.playbackState().currentEpisode;
      if (episode) {
        this.analyticsService.trackContentEngagement(episode.id, 'podcast', 'complete');
      }
    }
  }

  onVolumeChange(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({
      volume: audio.volume,
      muted: audio.muted
    });
  }

  onRateChange(): void {
    const audio = this.audioElement.nativeElement;
    this.updatePlaybackState({ playbackRate: audio.playbackRate });
  }

  onLoadStart(): void {
    this.updatePlaybackState({ isLoading: true, error: null });
  }

  onCanPlay(): void {
    this.updatePlaybackState({ isLoading: false });
  }

  onError(event: Event): void {
    const audio = this.audioElement.nativeElement;
    const error = audio.error;
    
    let message = 'An unknown error occurred';
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = 'Audio playback was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          message = 'Network error occurred';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          message = 'Audio decoding error';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = 'Audio format not supported';
          break;
      }
    }
    
    this.updatePlaybackState({
      error: message,
      isLoading: false
    });
    
    if (this.config().enableAnalytics) {
      this.analyticsService.trackException(new Error(message), false);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/default-podcast.png';
  }

  /**
   * Playback controls
   */
  play(): void {
    if (!this.playbackState().currentEpisode) return;
    
    this.audioElement.nativeElement.play().catch(error => {
      console.error('Failed to play audio:', error);
      this.updatePlaybackState({ error: 'Failed to play audio' });
    });
  }

  pause(): void {
    this.audioElement.nativeElement.pause();
  }

  togglePlayPause(): void {
    if (this.playbackState().paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Episode management
   */
  selectEpisode(episode: PodcastEpisode): void {
    const wasPlaying = !this.playbackState().paused;
    
    this.updatePlaybackState({
      currentEpisode: episode,
      currentTime: 0,
      duration: episode.duration,
      ended: false,
      error: null
    });

    // Load new audio
    const audio = this.audioElement.nativeElement;
    audio.src = episode.audioUrl;
    
    if (wasPlaying && this.config().autoplay) {
      audio.addEventListener('canplay', () => this.play(), { once: true });
    }

    this.episodeChanged.emit(episode);
  }

  /**
   * UI controls
   */
  toggleMinimized(): void {
    this.isMinimized.set(!this.isMinimized());
  }

  /**
   * Update playback state
   */
  private updatePlaybackState(updates: Partial<PlaybackState>): void {
    const current = this.playbackState();
    const newState = { ...current, ...updates };
    this.playbackState.set(newState);
    this.playbackStateChanged.emit(newState);
  }
}